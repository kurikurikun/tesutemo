# Video production workflow — reusable playbook

How client testimonial videos get finished and delivered from this repo. This is
the **generalizable procedure** (any client); for Comas-specific status and the
list of timelines see [COMAS_HANDOFF.md](COMAS_HANDOFF.md), and for the Remotion
overlay project see [remotion/CLAUDE.md](remotion/CLAUDE.md).

Written from the Tejima/Comas session (2026-07-18 → 2026-07-21). Every "gotcha"
below cost real time to discover — trust them.

## The toolchain

| Stage | Tool | Notes |
|---|---|---|
| Voice cleanup | **Descript MCP** (`mcp__…__prompt_project_agent`, `import_media`, `publish_project`) | Studio Sound. Import WAV → apply → export WAV. |
| Edit / assemble | **DaVinci Resolve MCP** (`mcp__davinci-resolve__*`) | Studio must be running; tools auto-launch it. |
| Overlays (name strips, cards, end cards) | **Remotion** (`~/Documents/claude/tesutemo/remotion`) | Alpha ProRes MOVs laid over picture in Resolve. |
| Export | Resolve render preset `social_mp4_-16LUFS_subs Render` | MP4 H.264, burns in subtitles. |
| Loudness | **ffmpeg two-pass `loudnorm`** (post-export, outside Resolve) | REQUIRED — the preset undershoots. See below. |
| Delivery | **Vimeo** — MCP for querying, `~/scripts/vimeo_upload.py` for uploads | `--replace` keeps the URL. |

Node is at `~/.local/node/bin` — `export PATH="$HOME/.local/node/bin:$PATH"`.
ffmpeg: use the bundled binary via `imageio_ffmpeg.get_ffmpeg_exe()` in Python.

---

## Delivery: Vimeo

**Two ways to touch Vimeo:**

- **Query / list** — Vimeo MCP tools (`get_my_folders`, `get_my_videos`,
  `get_video_metadata`, …) OR the REST API directly with a bearer token:
  ```python
  H = {'Authorization': f'bearer {TOKEN}',
       'Accept': 'application/vnd.vimeo.*+json;version=3.4'}
  requests.get('https://api.vimeo.com/me/projects', headers=H)                 # folders
  requests.get(f'https://api.vimeo.com/me/projects/{FOLDER_ID}/videos', headers=H)
  ```
  Folders are "projects" in the API. Each has a numeric id (e.g. Comas Tejima =
  `29951402`, Comas Ariel = `29951400`). The `/me/projects` list is flat — match
  by name.

- **Upload** — `python3 ~/scripts/vimeo_upload.py`:
  ```bash
  # New video into a folder:
  python3 ~/scripts/vimeo_upload.py FILE.mp4 --folder-id 29951402
  # Replace an existing video IN PLACE (URL + embeds preserved):
  python3 ~/scripts/vimeo_upload.py --replace /videos/1211187525 FILE.mp4
  ```
  Replace uses the versions endpoint — same share URL, same embeds. Prefer it
  when re-delivering a fixed cut. New uploads mint a new URL.

After upload the video shows `status: transcode_starting` / `transcoding` for a
few minutes before `available` — tell the user to wait before playing.

Uploading is an **outward-facing, hard-to-reverse** action. Verify the file
(below) before every upload; confirm with the user before a *new* public upload.

---

## Export from Resolve

1. `mcp__davinci-resolve__timeline set_current` to the target timeline, then
   `get_current` — **but treat `end_frame` from `get_current` as unreliable /
   stale.** Get the true content extent from `clip_where` on the video tracks
   (find where the last clip / end card ends).
2. `render load_preset {name: "social_mp4_-16LUFS_subs Render"}`
3. `render set_settings` — `TargetDir`, `ExportVideo: true`, `ExportAudio: true`,
   `MarkIn: 0`, `MarkOut: <last_frame_index>` (= content end − 1).
4. `render add_job`. **Queue ALL jobs first, then `render start` once** — loading
   the preset / setting settings between an `add_job` and `start` can reset
   `ExportVideo` to false and silently give you an audio-only export. Queue both
   yoko, then start.
5. Poll `render get_job_status {job_id}`. ~30 min per 3.5-min 1080p clip here.

Exports commonly come out **2 frames longer** than the MarkOut range (rounding) —
e.g. MarkOut 4982 → 4985 frames. That's normal, not a fault.

You **cannot switch the current timeline while a render is running** — Resolve
blocks `set_current`. Do inspection either before starting or after it finishes.

---

## Loudness normalization — REQUIRED after every export

The `-16LUFS` preset **does not actually hit −16**. It hits the −1 dBTP true-peak
ceiling first and stops, landing around **−18 LUFS** every single time (5-for-5
across this session). So every Resolve export must be normalized afterward with a
two-pass ffmpeg `loudnorm`, copying the video stream untouched:

```python
import subprocess, imageio_ffmpeg, json, re
FF = imageio_ffmpeg.get_ffmpeg_exe()
src = 'export.mp4'
# Pass 1 — measure
r = subprocess.run([FF,'-i',src,'-af',
    'loudnorm=I=-16:TP=-1:LRA=11:print_format=json','-f','null','-'],
    capture_output=True, text=True)
d = json.loads(re.search(r'\{[^{}]*input_i[^}]*\}', r.stderr, re.S).group(0))
# Pass 2 — apply with measured values, video copied, audio re-encoded
f = ('loudnorm=I=-16:TP=-1:LRA=11:measured_I={input_i}:measured_TP={input_tp}:'
     'measured_LRA={input_lra}:measured_thresh={input_thresh}:'
     'offset={target_offset}:linear=true:print_format=summary').format(**d)
subprocess.run([FF,'-y','-i',src,'-map','0:v:0','-map','0:a:0','-c:v','copy',
    '-af',f,'-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',
    'upload.mp4'])
```

Target: **I = −16 LUFS, TP = −1 dBTP, LRA 11**. Confirm the output lands at
−16.0/−16.2 with TP ≤ −1 before uploading.

---

## Verify every export before upload (this catches real bugs)

Measurement — not eyeballing — is what caught a silent-audio defect this session.
Run all three on the exported file:

1. **Frame count** — `ffprobe` duration × 24 ≈ expected (±2 frames).
2. **Streams** — video H.264 1920×1080 (or 1080×1920 vertical) + AAC 48k stereo.
3. **Silent-stretch scan** — decode audio, RMS per 5 s block, flag any block
   below −30 dBFS. A clean video has none (except an end card / intentional
   silence). This is the important one:

```python
import subprocess, numpy as np, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
r = subprocess.run([FF,'-v','quiet','-i','file.mp4','-f','f32le','-ac','1',
    '-ar','8000','-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)
n = 8000*5
low = [(i*5, round(20*np.log10(np.sqrt((x[i*n:(i+1)*n]**2).mean())+1e-12),1))
       for i in range(len(x)//n)
       if 20*np.log10(np.sqrt((x[i*n:(i+1)*n]**2).mean())+1e-12) < -30]
print('silent blocks:', low or 'NONE')
```

When **re-exporting** a fix, also diff the new audio block-by-block against the
last known-good export — a max deviation near 0.00 dB confirms nothing else
changed; a −18 dB spike in a block means a section lost its audio.

### The muted-track lesson

A silent-audio bug this session came from the **wrong audio track being muted** in
Resolve. It was invisible to every timeline inspection — the Studio Sound clip
read as one unbroken clip, all tracks reported enabled, no gaps — yet two
sections rendered near-silent. It only showed in the exported file's level
profile.

So **before queueing any export, verify audio track enable states explicitly**
with `get_track_enabled` per track. The standard layout on these edits:

- **A1 — original camera voice: DISABLED** (kept, not deleted, for reversibility)
- **A2 — Studio Sound WAV: enabled**
- **A3 — music bed: enabled**

Don't trust "looks fine" — check the enable flags and scan the output audio.

---

## Descript Studio Sound — gotchas

- **The agent sometimes reports success while doing nothing** (~1 in 10). Never
  trust the agent's "done" — verify by measurement: publish the composition,
  download, and cross-correlate against the source WAV. Correlation **≈ 0.45–0.72
  = genuinely processed**; **≈ 1.00 = it changed nothing** (retry).
- Apply Studio Sound **per composition, one at a time** — batch requests silently
  skip some.
- **Publish output is `.m4a` (lossy AAC).** For a master voice track that will be
  re-encoded again at final export, don't use the m4a — export **WAV** from the
  Descript UI instead (avoids stacking two lossy generations on dialogue).
- Descript returns **mono 16-bit** even from a stereo 24-bit source. Fine for a
  single-speaker VO; know it's happening.
- Verify imported/exported WAVs by **exact frame count** (samples ÷ 48000 × 24)
  against the timeline, so overlays and cards stay frame-aligned.

---

## Remotion overlays — gotchas

- **Alpha overlays render as ProRes 4444**, `--pixel-format=yuva444p10le`. Verify
  the output actually has alpha (`ffprobe` shows `yuva…`) and the right frame
  count before importing.
- **CJK needs Noto Sans JP** — pass a `fontFamily` prop. Inter (the default) has
  no Japanese glyphs and renders 日本語 as blank boxes. Components take
  `fontFamily`/`fontSize`/`nameColor` overrides for exactly this.
- Key components: `ComasNameStrip` (right-panel name + role/title),
  `ComasStoryCard` (right-panel two-line summary cards, one teal phrase each),
  `ComasBrandEndCard` (logo + tagline end card).
- **Long renders (~5000 frames) can exceed a 10-minute foreground limit** — run
  in the background.
- **`npx remotion still <Comp> out.png --frame=N`** renders a single frame — use
  it to sanity-check text/glyphs instead of fighting the Studio UI (its timeline
  clicks are unreliable through the browser tools due to coordinate scaling).
- Frame counts for name strips / cards must match the Resolve timeline **exactly**
  so they tile the picture with no drift. Card `start` values = the section cut
  points on the timeline.

---

## DaVinci Resolve scripting API — gotchas

- **`append_to_timeline` of a Remotion MOV fails ("missing timeline item id") if
  there is no free audio track** — the MOVs carry a silent audio stream that
  needs somewhere to land. Add a temp stereo audio track first, append, then
  delete the temp track. The silent clip sometimes lands on the **wrong** track
  (e.g. A2, the voice track) — delete that stray clip explicitly before removing
  the temp track.
- **`append` cannot overwrite an existing clip.** To replace a clip in a slot
  (e.g. swap an English end card for a Japanese one), `delete_clips` the old one
  first, then append the new at the same `record_frame`.
- Put each overlay on **its own empty video track**; append with
  `media_type: "video"` at the right `record_frame`.
- **`delete_track` / other destructive ops require a two-call confirm-token
  flow.** Tokens are instance-specific and expire (~300 s) — request a fresh one
  on the same server instance; don't reuse across instances.
- **`get_current`'s `end_frame` can be stale.** For the true content extent, read
  the clips (`clip_where`) rather than trusting the timeline header.
- `delete_all_jobs` occasionally leaves stragglers — re-list and delete by id.
- Use `detect_gaps_overlaps` after tiling cards to confirm no gaps/overlaps.

---

## End-to-end checklist (one deliverable)

1. Studio Sound the voice in Descript → export WAV → verify frame count + that it
   was actually processed (correlation).
2. Import WAV to Resolve on A2; **A1 (camera voice) disabled**, music on A3.
3. Render overlays in Remotion (alpha ProRes) → verify frame count + alpha →
   import → place each on its own video track, frame-aligned.
4. **Verify audio track enable states** (A1 off, A2 on, A3 on).
5. Queue all export jobs (preset `social_mp4_-16LUFS_subs Render`, MarkOut =
   content end − 1), then `render start` once.
6. Verify each export: frame count, streams, **silent-stretch scan**.
7. **Two-pass `loudnorm` to −16 LUFS / −1 dBTP** (video copied).
8. Re-verify the normalized file lands at −16.
9. Upload to Vimeo — `--replace /videos/ID` to keep the URL, or `--folder-id` for
   a new one. Confirm it landed in the right folder.
