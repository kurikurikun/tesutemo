// Load one corpus file into Supabase: instance, speaker, source, units, embeddings.
// Idempotent per source — re-running replaces that source's units and embeddings.
//
//   node answer_engine/load.mjs answer_engine/corpus/techcrew_shimizu_a.json [--approve]
//
// --approve marks units approved (only for sources whose whole video is already
// public, e.g. edited deliverables). Raw masters must go through QA first.
// Optional corpus "cues": path (relative to the corpus file) to a WebVTT caption
// file — used to timestamp answer windows so playback can jump to a passing mention.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { loadEnv, embed, supabase, vec, readJson, must, EMBED_MODEL } from './lib.mjs';

loadEnv();
const [file] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const approve = process.argv.includes('--approve');
if (!file) throw new Error('usage: node answer_engine/load.mjs <corpus.json> [--approve]');

const corpus = readJson(file);
const db = supabase();
const inst = corpus.instance.slug;

must(await db.from('ae_instances').upsert(corpus.instance, { onConflict: 'slug', ignoreDuplicates: false }), 'instance');

const { _note, ...speakerRow } = corpus.speaker;
const speaker = must(
  await db.from('ae_speakers').upsert({ ...speakerRow, instance: inst }, { onConflict: 'instance,key' }).select().single(),
  'speaker',
);

const source = must(
  await db
    .from('ae_sources')
    .upsert({ ...corpus.source, instance: inst, speaker_id: speaker.id }, { onConflict: 'instance,key' })
    .select()
    .single(),
  'source',
);

// Replace this source's units (embeddings cascade).
must(await db.from('ae_units').delete().eq('source_id', source.id), 'clear units');

const units = must(
  await db
    .from('ae_units')
    .insert(
      corpus.units.map((u) => ({
        instance: inst,
        source_id: source.id,
        speaker_id: speaker.id,
        seq: u.seq,
        start_sec: u.start_sec,
        end_sec: u.end_sec,
        answer_text_asr: u.answer_text_asr,
        answer_text: u.answer_text,
        display_label_ja: u.display_label_ja,
        display_label_en: u.display_label_en,
        synthetic_questions: u.synthetic_questions,
        lang: corpus.source.lang,
        chip_order: u.chip_order ?? null,
        qa_notes: u.qa_notes ?? null,
        status: approve ? 'approved' : 'draft',
      })),
    )
    .select('id, seq'),
  'units',
);
const idBySeq = new Map(units.map((u) => [u.seq, u.id]));

// Overlapping 2–3 sentence windows of the verbatim answer. A long answer embedded
// whole is dominated by its main topic; windows let a passing mention (a name,
// 産休) match on its own without anyone having to predict the question.
const sentencesOf = (text) => text.match(/[^。！？!?]+[。！？!?」]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [];

function windows(text) {
  const sentences = sentencesOf(text);
  if (sentences.length <= 2) return [];
  const out = [];
  for (let i = 0; i < sentences.length; i++) {
    let w = sentences.slice(i, i + 2).join('');
    if (w.length < 60 && sentences[i + 2]) w += sentences[i + 2];
    out.push({ text: w, sentence: i });
    if (i + 2 >= sentences.length) break;
  }
  return out;
}

// Caption timeline (WebVTT) → a function mapping "sentence i of this unit" to a
// video time. Sentences are located in the UNCORRECTED transcript (answer_text_asr),
// which is character-for-character what the captions contain; corrections never add
// or remove sentence breaks, so sentence i lines up in both. Accuracy ≈ ±1s.
const squash = (s) => s.replace(/\s+/g, '');
function captionTimeline(vttPath) {
  const cues = [];
  for (const block of readFileSync(vttPath, 'utf8').split(/\n\s*\n/)) {
    const m = block.match(/(\d+):(\d+):(\d+)\.(\d+)\s*-->\s*(\d+):(\d+):(\d+)\.(\d+)\s*\n([\s\S]*)/);
    if (!m) continue;
    const t = (h, mi, s, ms) => +h * 3600 + +mi * 60 + +s + +ms / 1000;
    cues.push({ start: t(m[1], m[2], m[3], m[4]), end: t(m[5], m[6], m[7], m[8]), text: squash(m[9]) });
  }
  let all = '';
  const spans = cues.map((c) => { const from = all.length; all += c.text; return { ...c, from, to: all.length }; });
  const timeAt = (pos) => {
    const c = spans.find((s) => pos >= s.from && pos < s.to) ?? spans.at(-1);
    return c.start + ((pos - c.from) / Math.max(1, c.to - c.from)) * (c.end - c.start);
  };
  return (unit, sentenceIndex) => {
    const asr = sentencesOf(unit.answer_text_asr).map(squash);
    const head = squash(unit.answer_text_asr).slice(0, 12);
    // Search from just before the unit's start so a repeated phrase elsewhere can't match.
    const near = spans.find((s) => s.end > unit.start_sec - 2)?.from ?? 0;
    const unitPos = all.indexOf(head, Math.max(0, near - 20));
    if (unitPos < 0 || !asr[sentenceIndex]) return null;
    const offset = asr.slice(0, sentenceIndex).join('').length;
    return Math.round(timeAt(unitPos + offset) * 10) / 10;
  };
}
const timeline = corpus.cues ? captionTimeline(path.resolve(path.dirname(file), corpus.cues)) : null;

// Everything that can be matched against, one row each, all pointing at a unit.
const rows = corpus.units.flatMap((u) => [
  { seq: u.seq, kind: 'answer_text', lang: corpus.source.lang, content: u.answer_text },
  ...windows(u.answer_text).map((w) => ({
    seq: u.seq, kind: 'answer_window', lang: corpus.source.lang, content: w.text,
    start_sec: timeline ? timeline(u, w.sentence) : null,
  })),
  { seq: u.seq, kind: 'display_label', lang: 'ja', content: u.display_label_ja },
  { seq: u.seq, kind: 'display_label', lang: 'en', content: u.display_label_en },
  ...u.synthetic_questions.map((q) => ({ seq: u.seq, kind: 'synthetic_question', lang: q.lang, content: q.text })),
]);

const vectors = await embed(rows.map((r) => r.content), 'document');
must(
  await db.from('ae_embeddings').insert(
    rows.map((r, i) => ({
      unit_id: idBySeq.get(r.seq),
      instance: inst,
      kind: r.kind,
      lang: r.lang,
      content: r.content,
      start_sec: r.start_sec ?? null,
      model: EMBED_MODEL,
      embedding: vec(vectors[i]),
    })),
  ),
  'embeddings',
);

console.log(
  `loaded ${inst}/${corpus.source.key}: ${units.length} units, ${rows.length} embeddings (${EMBED_MODEL}), status=${approve ? 'approved' : 'draft'}`,
);
