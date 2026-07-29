# Comas testimonial videos — session handoff (updated 2026-07-21)

Client **Comas** (comasjapan.com — corporate language training). Produced by **TesuTemo / move-ment**.
Two interviewees: **Ariel Thorpe** (chiropractor, English) and **手島拓也 / Takuya Tejima**
(GAOGAO株式会社 共同創業者兼グループCEO, Japanese).

## 🚨 NAME: correct kanji is 手島拓也 (Tejima). TWO earlier wrong spellings.

The name has been wrong twice. Correct spelling confirmed by Chris 2026-07-21: **手島** (島, not 嶋).

- **寺島** — the original wrong kanji, used throughout early filenames and this doc.
- **手嶋** — the second wrong kanji (嶋 with 山). Corrected to this on 2026-07-20, but it was
  *still wrong* — and it got baked into the rendered videos (see below).
- **手島** — correct. Fixed in code/docs 2026-07-21.

### ⚠️ THE WRONG KANJI IS IN THE DELIVERED VIDEOS — re-render needed before Comas sees them

The lower-third name strip is a Remotion overlay: `TERAJIMA_STRIP_PROPS.name` in
`remotion/src/Root.tsx`. It was `"手嶋拓也"` (wrong), composited into the DaVinci timelines and
exported to Vimeo. **The live Vimeo videos and the case-study pages currently display 手嶋拓也.**

The wrong kanji is in TWO baked-in places. Both must be fixed before the videos go public:

**1. The name-strip lower-third (Remotion).** `TERAJIMA_STRIP_PROPS.name`, was `"手嶋拓也"`.
Source is now fixed to `"手島拓也"` AND the two alpha clips have been re-rendered
(`out/storycards/TerajimaAStoryNameStripAlpha.mov` + `TerajimaBTeamNameStripAlpha.mov`, 2026-07-21).
✅ **CLOSED 2026-07-29** — Chris confirmed the name kanji is fixed. Both long-forms were
re-composited and re-uploaded to Vimeo (`tejima_B_team` modified 2026-07-22,
`tejima_A_CEO_story` 2026-07-26); the live name strip reads 手島拓也. The two items below are
kept for the record only.
Reload the clips in Resolve's media pool so it picks up the new render. **Proxy copies in
`out/storycards/Proxy/` were NOT regenerated** — if a proxy workflow is in use they still show 手嶋.

**2. The self-intro SUBTITLE (DaVinci subtitle track — UI-only, CANNOT be scripted/fixed from code).**
Tejima says his name in the self-intro and it is subtitled on screen as **「手嶋と申します。」**:
- A_CEO_story: frames **269–770** (0:11–0:32)
- B_team: frames **244–746** (0:10–0:31) — identical text to A
Fix by hand in Resolve: 手嶋 → 手島 in that subtitle, both timelines. Then re-export + re-upload.
`TERAJIMA_YOKO_SCRIPTS.md` (the transcription of these tracks) is already corrected, but that file
does not feed the render — the burned-in subtitle in Resolve is the thing that must change.

**Also check the shorts** (`S1_seiyaku`/`S2_kachi`/`S3_B2C1`/`S4_tsuzukekata`): they were cut from
the long-forms. Unlikely to include the self-intro segment, but confirm none of them shows the name.
Also check for any hand-built Text+/Fusion lower-third with the name (not in the Remotion source).

### Romaji identifiers (`tejima` / `terajima`) — left as-is on purpose

Where the romaji still exists — do NOT blind-rename, links/media-pool refs will break:

| Location | Spelling | Status |
|---|---|---|
| Vimeo clip titles | `tejima` | ✅ correct romaji, renamed 2026-07-20 |
| Vimeo folder | `Comas Tejima` | ✅ correct romaji |
| DaVinci timelines in `26_6_comas2` | `terajima` | ⚠️ wrong romaji but unchanged (rename breaks refs) |
| Local WAVs in `~/Downloads/comas_audio_export/` | `terajima` | ⚠️ wrong romaji but unchanged (breaks Resolve media-pool links) |
| Remotion code identifiers (`TERAJIMA_STRIP_PROPS`, folder refs) | `terajima`/`Terajima` | ⚠️ wrong romaji but unchanged (only the display kanji was fixed) |

Timeline/file names below are written as they **actually exist on disk** (`terajima`), not as the
person's name is spelled.

## STATUS (2026-07-21): one production fix reopened — the Tejima name kanji

Audio/edit were complete as of 2026-07-20 (Studio Sound applied, stems imported, exported to
Vimeo, live on the website). **But the Tejima name strip shows the wrong kanji 手嶋 and must be
re-rendered — see the NAME section at the top.** That is the only open production item.

Also still open, commercial not technical: **get written permission from Comas to publish.**
Until that arrives the website pages are deliberately hidden — see "Website" below. Convenient
that both are outstanding at once: do the name re-render, then send for approval.

Historical notes, resolved:

1. ~~`26_7_17_Ariel_results_recommend` A2 music muted~~ — resolved 2026-07-18, A2 re-enabled
   and verified. Music = `Yarin Primak - I Want You to Stay.mp3`.
2. ~~Studio Sound incomplete~~ — all 12 done. The first 10 were verified by measurement
   2026-07-18 (table below); `terajima_A_CEO_story` and `terajima_B_team` were re-edited and
   then processed, confirmed by Chris 2026-07-20.
3. ~~Descript AI credits exhausted~~ — topped up 2026-07-18.

**If you re-cut any picture from here, the audio will not follow** — the stems are flat renders.
You would have to redo the Descript pass for that timeline. See the Resolve import section.

## Where things live

- **DaVinci project:** `26_6_comas2` (Resolve Studio 21)
- **Latest timelines are ONLY in bins** `編集中/寺島` and `編集中/Ariel`.
  Older near-identical versions sit in `Master`, `編集中` root, and `Archive` — this is what caused
  Dispatch to export stale versions to Vimeo. Don't pick timelines by name alone.
- **Remotion project:** `~/Documents/claude/tesutemo/remotion` (own package.json, port 3003 via `npm run dev`)
- **Audio exports:** `~/Downloads/comas_audio_export/` (12 source WAVs + `studiosound/` m4a returns)

## The 12 timelines

**Ariel (English):** `26_7_16_Ariel_A_story`, `26_7_16_Ariel_B_method` (long-form) ·
`26_7_17_Ariel_hook_apps_garbage`, `_method_lets_struggle`, `_results_recommend`, `_S4_mtfuji` (shorts)

**手島 (Japanese):** `26_7_10_terajima_A_CEO_story`, `_B_team` (long-form) ·
`_S1_seiyaku`, `_S2_kachi`, `_S3_B2C1`, `_S4_tsuzukekata` (shorts)

## Done

- Shorts re-cut from revised long-forms; vertical 1080x1920 @ 24fps
- Video reframe: **Tilt +199.111, CropTop 395.7** (Ariel shorts) · terajima shorts **CropTop/Bottom 175**
- **`comas_logo_overlay.png`** — 1080x1920 transparent overlay, logo pre-baked into the top bar.
  Drops in at **Zoom 1.0 / Pos 0**. Built because the raw logo is only 540x76 (see gotchas).
- **8 end cards built in Remotion** (`ComasEnd*` EN, `TerajimaEnd*` JP), rendered ProRes 422 HQ, opaque
- Grade + AI CineFocus (Resolve 21 depth-of-field) applied
- Music sourced (Artlist/Epidemic)

## Descript Studio Sound — done, but read the gotchas before repeating

Descript MCP **is connected** (tools: `import_media`, `prompt_project_agent` = Underlord,
`publish_project`, `get_project`, `list_projects`, `wait_for_job`).

- **Proven working** on a single test: project `1ce1843a-5dc0-4955-90eb-d386afb04f18`,
  targeted with an explicit `composition_id` → measured **+21.2 dB SNR, +37 dB at 16 kHz+**
  (it re-synthesises the voice — this is why it beats plain denoisers).
- **Batch attempt failed silently:** project `5cedc4af-0492-48b0-ac45-c823d98a48b6`, 11 compositions.
  Agent *reported* "Studio Sound 100% applied to all 11", but measured SNR change was **±0.0 dB** —
  the effect did not render. The batch call targeted the **project**, not each `composition_id`.
- **ROOT CAUSE CONFIRMED (user verified in UI + measured):** the agent **silently no-ops** when
  targeting the whole project. It **must** be called with an explicit `composition_id`.
  Retry on `Ariel_S4_mtfuji` per-composition measured **+13.4 dB SNR, +33.3 dB air** ✅
- **Verify by measurement, NEVER by the agent's success message** — it reported "applied to all 11"
  when nothing had been applied.

### Studio Sound results — all 12 done

Project `5cedc4af-0492-48b0-ac45-c823d98a48b6`.

**✅ COMPLETE.** The 10 in-scope compositions were applied & verified by measurement 2026-07-18;
the final two followed after their re-edit (Chris confirmed 2026-07-20).
Credits were exhausted mid-run and topped up; cost ~4.5–12 AI credits per composition.

| composition | id | air (16k+) | corr | status |
|---|---|---|---|---|
| Ariel_hook_apps_garbage | `23042920-23ff-4fe0-be85-c53da97082ca` † | +37.0 dB | 0.722 | ✅ |
| Ariel_results_recommend | `55263101-72cc-4df5-a72a-8bbb2b38a1bb` | +37.7 dB | 0.680 | ✅ |
| Ariel_B_method | `13f1eb37-8432-46db-bbcd-9d741b673bae` | +36.5 dB | 0.687 | ✅ |
| Ariel_method_lets_struggle | `baab27b0-033f-4e71-a263-dc4f5ffa7d45` | +36.4 dB | 0.678 | ✅ |
| Ariel_S4_mtfuji | `9fc662b8-aa3b-4de6-83b6-72d294658a27` | +36.0 dB | 0.715 | ✅ |
| Ariel_A_story | `8f3e1f50-52bc-4bfd-931f-7d31d2f21ab7` | +35.5 dB | 0.703 | ✅ |
| terajima_S3_B2C1 | `92dbf515-2888-477c-9ba1-b038850f2df0` | +33.2 dB | 0.657 | ✅ |
| terajima_S4_tsuzukekata | `09ae98a3-b884-40e1-ba9c-862a8cec250b` | +32.5 dB | 0.628 | ✅ |
| terajima_S1_seiyaku | `a7468275-40c0-43ed-b77f-b71e8a002370` | +31.6 dB | 0.653 | ✅ |
| terajima_S2_kachi | `b0243e2f-1cdb-4957-9be9-95ff5bb34989` | +28.2 dB | 0.651 | ✅ |
| terajima_A_CEO_story | `426bd3a5-9783-4387-8c16-da684cb64c1d` | — | — | ✅ done 2026-07-20 (re-edited, then processed; not re-measured) |
| terajima_B_team | `ac541584-851f-40b2-adf6-b9a1bc4ade0d` | — | — | ✅ done 2026-07-20 (re-edited, then processed; not re-measured) |

The `+1.4 / +2.0 dB, corr 1.000` figures previously shown for these two were measurements of the
**pre-re-edit, unprocessed** versions — they are stale and have been cleared rather than left to
look like failures.

† `hook_apps_garbage` lives in a **separate project**, `1ce1843a-5dc0-4955-90eb-d386afb04f18`
(`Comas_AudioTest_hook_apps_garbage`) — not in the batch project. Easy to miss when exporting.

### ⚠️ Descript UI WAV export settings — get these right

Export → Audio → Format "Lossless WAV" → **Advanced**:

| setting | use | why |
|---|---|---|
| Sample rate | **48000** | Sources are 48k. Default 44100 forces a needless 48→44.1→48 round trip. |
| Normalize volume | **OFF** | Default **−24 LUFS silently re-gains the file.** |
| Channels | **Mono** | Sources are dual-mono (L/R corr 1.00000, 0.00 dB diff) — mono loses nothing. |

**The normalize default bit us:** Ariel's sources were already ~−24 LUFS so it was a no-op, but
手島 was recorded ~5 dB hotter and all four terajima shorts came out **4.5–5.7 dB quieter than
source** — enough to sink his voice under the music beds in an edit balanced at original level.
Ariel's escape was luck, not correctness. Always verify exported loudness against source
(`ffmpeg -filter_complex ebur128`), not just sample rate/bit depth.

### ✅ Resolve import COMPLETE — all 12 (2026-07-19 / 2026-07-20)

All 12 stems are imported into `26_6_comas2`. The first 10 were verified by direct track readback
on 2026-07-19; `terajima_A_CEO_story` and `terajima_B_team` followed after their re-edit and
Chris confirmed them done on 2026-07-20.

- Stems live in media pool bin **`Master/StudioSound`**, sourced from
  `~/Downloads/comas_audio_export/studiosound/wav48_float/`.
- Per timeline: stem placed at frame 0 on a track named **"VO StudioSound"**; original
  voice track **A1 disabled, NOT deleted** — one click to revert / A-B.
- `results_recommend` uses **A3** (A2 is its music track). All others use **A2**.
- `results_recommend` A2 music **re-enabled**.

**The stems are flat, uncuttable renders of the finished timelines.** Re-cut picture and the
audio will NOT follow — you'd have to redo the Descript pass. All timelines were confirmed locked
before their stem was imported. **This now applies to all 12** — the edit is finished; treat any
further picture change as a full redo of the Descript pass for that timeline.

**terajima −5 dB trim: DONE.** The 4 terajima stems were over (+0.1 to +1.3 dBTP). Trimmed
copies live in `wav48_final/` + bin `Master/StudioSound/final_-5dB`, and are swapped in on the
4 timelines. Now **−3.7 to −4.9 dBTP, −24.0 to −24.9 LUFS** — matching Ariel's −22.8 to −24.6,
so the whole campaign plays at one level (手島's sources were ~5 dB hotter than Ariel's).

⚠️ **Clip volume is NOT scriptable** in Resolve 21 — `timeline_item.set_audio(Volume=…)` returns
top-level `success: true` while the property write silently fails (`"Volume": false`) and readback
stays `null`. Gain must be baked into the file (or set by hand in the UI). Same family as the
Fairlight UI-only limitation.

⚠️ **`delete_clips` auto-archives the timeline**, adding `_archived_vNN` copies (this run added
14, now indices 53–66). Indices of existing timelines are NOT affected — archives append at the
end — but the duplicate pile grows. Always pick timelines from the `編集中` bins, never by name.

### Still TODO
- Nothing open. ~~Get written permission from Comas to publish.~~ — **approval received 2026-07-29**
  (Chris). Pages unhidden the same day; see "Website" below.

## Website (tesutemo.co)

The finished videos are live on `/case-study` and `/en/case-study` as of 2026-07-20
(commit `d9b7b9c`, pushed to main → auto-deployed via Vercel).

- Hero is language-matched: 手島 on the JA page, Ariel on the EN page. The other three long-forms
  run in each page's carousel.
- Verticals are 2 手島 + 1 Ariel on JA, the inverse on EN.
- Unused shorts if you want to swap: Ariel `method_lets_struggle`, `S4_mtfuji`;
  手島 `S3_B2C1`, `S4_tsuzukekata`.

**Comas approved publication on 2026-07-29 — both pages are now public.** What was undone:

1. `robots: { index: false, follow: false }` removed from both `case-study/page.tsx` files
2. `href: ''` → `/case-study` / `/en/case-study` on the two homepage use-case cards
3. 導入事例 / Case Studies added to the footer — note the removal had been recorded in
   `SubpageFooter.tsx`, but **that component is dead code** (nothing imports it). The footer that
   actually renders is `src/components/Footer.tsx`, and it never had a case-study link; the link
   was added there ("Testimonial videos for" column, locale-aware).
4. Both `/case-study` entries restored in `src/app/sitemap.ts`
5. The 顧客を増やす / Case Studies use-case card on both homepages now embeds a Comas long-form
   instead of the `/usecase-customer.png` placeholder — 手島 `A_CEO_story` on JA, Ariel
   `A_story` on EN. All four cards are videos now, so the card's image fallback branch was
   dropped.

The EN subpage hero button still scrolls to `#videos` — deliberately not pointed at
`/en/case-study` (see below). The header nav still has no case-study item, per Chris's standing
preference.

Do **not** restore the EN subpage hero button to `/en/case-study` — it now scrolls to `#videos`
on the current page, matching JA, and Chris confirmed that should stay.

**Better verification metric than SNR:** correlate the return against the source WAV.
Studio Sound re-synthesises the voice, so a real application drops correlation to **~0.65–0.72**.
An unprocessed AAC transcode sits at **corr 1.000** — this is unambiguous, whereas the HF-only
delta is not (unprocessed transcodes still showed +1 to +10 dB of codec noise at 16 kHz+).
Scripts: `~/Documents/claude/tesutemo/audio_verify/` — `cmp.py` (all files in
`~/Downloads/comas_audio_export/studiosound/`) and `one.py <basename>` (single file).

**Gotcha:** an agent job can return `status: error / "Insufficient AI credits"` **and still have
applied the effect** (`project_changed: true`). `terajima_S1_seiyaku` did exactly this. Measure
before re-spending credits on a retry.

Loop per composition: `prompt_project_agent`(with composition_id) → `wait_for_job` →
`publish_project`(same composition_id, media_type Audio) → `wait_for_job` → download `download_url`
→ **measure SNR/air vs the source WAV to confirm it actually applied.**
Note: `Ariel_hook_apps_garbage` was processed separately in project
`1ce1843a-5dc0-4955-90eb-d386afb04f18` and is already good.

Then import the m4a files into Resolve: add to media pool, place on a **new audio track** at 00:00
in each timeline, and **mute the original A1** (reversible, nothing deleted).

## Gotchas (hard-won — don't rediscover)

### DaVinci Resolve scripting API
- **Always `SetCurrentTimeline()` before reading a timeline.** `GetIsTrackEnabled`, `GetEndFrame`
  etc. return stale/garbage for non-current timelines. This produced two false alarms
  (phantom "muted voice tracks", a 161s duration that was really 36s).
- **UI-only, not scriptable:** subtitle styling (Word Highlight), Solid Color / Text+ generators,
  Fairlight EQ/compressor/FX, the track AI panel (Voice Isolation / Dialogue Leveler / Separator),
  loudness normalize. `GetVoiceIsolationState` returns None — it doesn't see the new AI panel.
- **Transform Position & Anchor are hard-capped at ±7680.** With a small source image Resolve
  auto-upscales it, inflating the coordinate space so the cap can't reach the top of frame.
  Fix = bake the graphic into a full-size (1080x1920) transparent PNG, place at Zoom 1.0 / Pos 0.
- **Render queue holds ~14 of the user's own jobs.** NEVER call `StartRendering()` with no args —
  always pass explicit `job_ids`, or you'll re-render their Google Drive deliverables.
- WAV audio export: load the **`Audio Only`** preset, then `SetRenderSettings`. Ignore
  `GetCurrentRenderFormatAndCodec` reporting 'unknown' — the job is still correct (Wave/lpcm).

### Descript
- `publish_project` returns **m4a, AAC 160 kbps, 44.1 kHz** — lossy, and resampled from 48k.
  User accepted this for social delivery. For lossless you must export WAV from the Descript UI.
- `import_media` fails with >~6 media+compositions per call ("Query count exceeded limit of 100").
  Batch in **3s**. Only **one job runs per project at a time** — `wait_for_job` between calls.
- Direct upload flow: `import_media` returns `upload_urls` → `curl -X PUT` with
  `Content-Type: application/octet-stream`.

### Audio findings
- Source is **already clean (~37-40 dB SNR)** — Riverside.fm recordings, not noisy phone mics.
  Plain denoisers therefore add almost nothing. **DeepFilterNet3 measured +9.9 dB SNR but Descript
  is far better** because it does full-band re-synthesis (body + air), not just noise removal.
- Local ML route was tried and **abandoned** (SpeechBrain 16k destroyed the top end; all installs
  since removed). Don't re-litigate — use Descript.

## Tooling notes
- `imageio-ffmpeg` is installed (gives a working ffmpeg binary); `uv`, numpy, soundfile also present.
- Python 3.13 is the system Python — most ML packages need a 3.11 venv via `uv venv --python 3.11`.
