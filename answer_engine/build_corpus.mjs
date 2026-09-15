// Turn a verified subtitle timeline into an answer-engine corpus file.
//
//   node answer_engine/build_corpus.mjs answer_engine/corpus/shimizu_full_v1.config.json
//
// Input: cues JSON exported from the Resolve timeline (start/end frames = rendered video).
// 1. Group cues into paragraphs (split at edit points and pauses ≥ 1s).
// 2. Claude groups paragraphs into whole-thought answer units and writes, per unit, a
//    caption label, 5–6 search questions and QA notes. Boundaries always fall on
//    paragraph edges, so a unit's text is exactly the verified subtitles — never rewritten.
// 3. Writes the corpus JSON (for load.mjs) and a WebVTT of the cues (for answer windows).
//
// REAL VOICES ONLY: labels and questions are generated to FIND and DESCRIBE clips;
// answer_text is the verbatim subtitle text.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { loadEnv } from './lib.mjs';

loadEnv();
const cfgPath = process.argv[2];
if (!cfgPath) throw new Error('usage: node answer_engine/build_corpus.mjs <config.json>');
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const dir = path.dirname(cfgPath);
const { fps, cues, edl } = JSON.parse(readFileSync(path.resolve(dir, cfg.cues_json), 'utf8'));

// Subtitle text → plain text: drop line breaks (\u2028 / \n) and spaces, except a
// single space between two Latin/digit runs ("TECH CREW").
const clean = (t) =>
  t.replace(/[\u2028\n]/g, '').replace(/[ 　]+/g, (m, off, str) =>
    /[A-Za-z0-9]/.test(str[off - 1] ?? '') && /[A-Za-z0-9]/.test(str[off + m.length] ?? '') ? ' ' : '');

// ── 1. paragraphs ──────────────────────────────────────────────────────────
const cutPoints = new Set((edl ?? []).map((e) => e.rec_start));
const paras = [];
for (const c of cues) {
  const last = paras.at(-1);
  const crossesCut = last && [...cutPoints].some((b) => last.end <= b && b <= c.start);
  if (!last || c.start - last.end >= fps || crossesCut) paras.push({ start: c.start, end: c.end, text: '' });
  const p = paras.at(-1);
  p.end = c.end;
  p.text += clean(c.text);
}
paras.forEach((p, i) => (p.id = i + 1));
const sec = (f) => Math.round((f / fps) * 10) / 10;
const mmss = (f) => `${Math.floor(f / fps / 60)}:${String(Math.floor((f / fps) % 60)).padStart(2, '0')}`;

// ── 2. Claude: units + labels + questions ─────────────────────────────────
const Unit = z.object({
  first_paragraph: z.number().int(),
  last_paragraph: z.number().int(),
  topic_note: z.string().describe('One short English line: what this answer is about, incl. context such as "about her PREVIOUS employer"'),
  display_label_ja: z.string().describe('Caption describing the clip, form 「Q. …？」, max ~20 chars. A description, not a quote.'),
  display_label_en: z.string(),
  synthetic_questions: z.array(z.object({
    lang: z.enum(['ja', 'en']),
    style: z.enum(['casual', 'formal', 'plain', 'anxious', 'side_topic']),
    text: z.string(),
  })),
  qa_notes: z.string().nullable().describe('Anything a human should check: likely mis-transcriptions, sensitive content, context traps. null if none.'),
  chip_candidate: z.boolean().describe('True if this is one of the strongest answers to show as a suggested question button'),
});
const Plan = z.object({ units: z.array(Unit) });

const system = `You prepare interview footage for a recruitment Q&A widget on ${cfg.company}'s careers page.

A job candidate types a question; the widget plays a clip of a real employee answering it. Nothing is ever generated for the viewer except short captions. You are given the verified subtitles of one interview with ${cfg.speaker_desc}, grouped into numbered paragraphs with timestamps. The interviewer's questions were edited out, so each new answer usually starts right after a paragraph break.

Your job:
1. Group consecutive paragraphs into answer units. Each unit is one whole thought a candidate could watch on its own — usually one answer to one interview question. Aim for 20–100 seconds; never split an answer mid-thought; a very short paragraph that belongs to the neighbouring answer joins it. Cover every paragraph exactly once, in order.
2. For each unit write:
   - display_label_ja / _en: a caption describing what the clip answers, phrased as a question (「Q. 残業はどのくらい？」). It must describe the clip, never quote the speaker.
   - synthetic_questions: 5–6 different questions this clip genuinely answers, the way real candidates would type them: casual Japanese, formal Japanese, plain English, an anxious candidate's version, and side topics the answer also covers (people answer three things when asked one). Only questions the clip actually answers.
   - topic_note, qa_notes, chip_candidate (mark about 8 of the clearest, most broadly useful answers).
3. Context traps matter: if the speaker describes a PREVIOUS employer, the label and questions must say so and must not read as describing ${cfg.company}.

The subtitles are hand-checked; names are written as the company wants them (e.g. ${cfg.name_notes}).`;

const body = paras.map((p) => `[P${p.id} ${mmss(p.start)}–${mmss(p.end)}] ${p.text}`).join('\n');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, baseURL: 'https://api.anthropic.com' });
console.log(`${paras.length} paragraphs → asking ${cfg.model} to plan units…`);
const stream = client.beta.messages.stream({
  model: cfg.model,
  max_tokens: 64000,
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default',
  output_config: { effort: 'high', format: betaZodOutputFormat(Plan) },
  system,
  messages: [{ role: 'user', content: body }],
});
const msg = await stream.finalMessage();
if (msg.stop_reason === 'refusal') throw new Error(`refused: ${JSON.stringify(msg.stop_details)}`);
const plan = msg.parsed_output;
if (!plan) throw new Error(`no parseable plan (stop_reason ${msg.stop_reason})`);

// ── validate coverage ─────────────────────────────────────────────────────
let expect = 1;
for (const u of plan.units) {
  if (u.first_paragraph !== expect || u.last_paragraph < u.first_paragraph) {
    throw new Error(`units do not cover paragraphs in order at P${expect}: got P${u.first_paragraph}–P${u.last_paragraph}`);
  }
  expect = u.last_paragraph + 1;
}
if (expect !== paras.length + 1) throw new Error(`units stop at P${expect - 1} of ${paras.length}`);

// ── 3. write corpus + VTT ─────────────────────────────────────────────────
let chip = 0;
const units = plan.units.map((u, i) => {
  const ps = paras.slice(u.first_paragraph - 1, u.last_paragraph);
  const text = ps.map((p) => p.text).join('');
  return {
    seq: i + 1,
    start_sec: sec(ps[0].start),
    end_sec: sec(ps.at(-1).end),
    answer_text_asr: text,
    answer_text: text,
    topic_note: u.topic_note,
    qa_notes: u.qa_notes,
    display_label_ja: u.display_label_ja,
    display_label_en: u.display_label_en,
    synthetic_questions: u.synthetic_questions,
    chip_order: u.chip_candidate ? ++chip : null,
  };
});

const vtt = (f) => {
  const ms = Math.round((f * 1000) / fps);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};
writeFileSync(path.resolve(dir, cfg.out_vtt),
  'WEBVTT\n\n' + cues.map((c, i) => `${i + 1}\n${vtt(c.start)} --> ${vtt(c.end)}\n${clean(c.text)}\n`).join('\n'));

const corpus = {
  _about: `Built by build_corpus.mjs from ${cfg.cues_json} (verified Resolve subtitles). Units/labels/questions by ${cfg.model}; answer_text is verbatim subtitle text.`,
  cues: cfg.out_vtt,
  cue_windows: true,
  instance: cfg.instance,
  speaker: cfg.speaker,
  source: cfg.source,
  units,
};
writeFileSync(path.resolve(dir, cfg.out_corpus), JSON.stringify(corpus, null, 2) + '\n');

console.log(`wrote ${units.length} units (${chip} chips) → ${cfg.out_corpus}`);
console.log(`tokens in ${msg.usage.input_tokens} / out ${msg.usage.output_tokens}`);
for (const u of units) {
  console.log(`  ${String(u.seq).padStart(2)} ${mmss(u.start_sec * fps)}–${mmss(u.end_sec * fps)} ${String(Math.round(u.end_sec - u.start_sec)).padStart(3)}s ${u.chip_order ? '★' : ' '} ${u.display_label_ja}  — ${u.topic_note}${u.qa_notes ? `  [QA: ${u.qa_notes}]` : ''}`);
}
