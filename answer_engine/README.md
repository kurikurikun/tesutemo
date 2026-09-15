# 聞いてみる — answer engine

A visitor asks a question and gets a clip of a real employee answering it. AI only
**finds and judges** recorded clips — it never writes an answer. Captions (labels) and
search questions are generated; answer text is always the person's verbatim words.

Live demo: `/ask/techcrew` (password `ASK_DEMO_PASSWORD`, noindex).

## Workflow for a new interview

1. **Resolve: build the Q&A master.** Duplicate the raw interview timeline (never edit
   the original). Cut chit-chat, false starts, thank-yous and the long pauses while the
   interviewer asks the next question. Grade + client/TesuTemo logos. For vertical phone
   footage: 1080×1920.
2. **Subtitles.** Hand-check the subtitles on that timeline against the video. Keep the
   usual on-screen style — no need to add 。 (step 5 does that for the transcript).
3. **Export cues** from the timeline to `corpus/<name>_cues.json` (start/end frames per
   cue + the timeline's source EDL). Done via the Resolve scripting API.
4. **Build the corpus** — Claude groups subtitles into whole answers and writes captions,
   5–6 search questions per answer and QA notes (flags previous-employer traps,
   likely mis-transcriptions):
   ```bash
   node answer_engine/build_corpus.mjs answer_engine/corpus/<name>.config.json
   ```
   Read the printed unit list and QA notes. Fix obvious mis-transcriptions in
   `answer_text` only (`answer_text_asr` keeps the original).
5. **Punctuate the transcript** for 「文字で読む」 — punctuation only, verified
   character-for-character against the original:
   ```bash
   node answer_engine/punctuate.mjs answer_engine/corpus/<name>.json
   ```
6. **Render + deliver the video.** Resolve preset `social_mp4_-16LUFS_subs` (burned-in
   subs), two-pass loudnorm to −16 LUFS, upload to Vimeo (unlisted, embed limited to
   tesutemo.co). Put the Vimeo id + hash into the corpus `source`.
7. **Load** into Supabase (embeds everything with Voyage):
   ```bash
   node answer_engine/load.mjs answer_engine/corpus/<name>.json --approve
   ```
   `--approve` only for footage the client has approved in full.
8. **Check** with an eval set (questions a candidate would ask, incl. ones she never
   answers) and the Sonnet judge:
   ```bash
   node answer_engine/judge_eval.mjs <instance> answer_engine/corpus/<eval>.json claude-sonnet-5
   ```
   Then try it live: `node answer_engine/test/server.mjs` → http://localhost:4321.

## How a question is answered (`ask.mjs`)

- Chips play their clip directly (no AI, free).
- Typed: Voyage embeddings shortlist 4 clips (matching generated questions, captions,
  full answers and ~10–15s transcript excerpts) → Claude Sonnet 5 judges each clip
  answers / partial / no → best clip plays; "partial" plays with 「関連する内容を話しています」;
  "no" shows 「まだ収録されていません」 and is logged (`ae_miss_log`) for the next shoot.
- Playback starts **1.5s before** the answer (`PRE_ROLL_SEC`), or before the exact moment
  when the question matches a passing mention inside a long answer.

## Decisions so far

- Judge model: Sonnet 5 (most accurate of Opus 5 / Sonnet 5 / Haiku 4.5 on the eval, ~¥1 per typed question).
- Video: Vimeo for the demo; Cloudflare Stream (real per-answer clips) for the product.
- Interview transcripts (`corpus/`) stay out of git — the repo is public.
