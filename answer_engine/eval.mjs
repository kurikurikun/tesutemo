// A/B the search on an eval set:
//   A = viewer question vs answer transcripts only (pure semantic search)
//   B = viewer question vs transcripts + synthetic questions + labels
//
//   node answer_engine/eval.mjs techcrew answer_engine/corpus/techcrew_eval_queries.json
import { loadEnv, embed, supabase, vec, readJson, must, assess, pad, unitLabel, EMBED_MODEL } from './lib.mjs';

loadEnv();
const [instance, file] = process.argv.slice(2);
const { queries } = readJson(file);
const db = supabase();

const units = must(await db.from('ae_units').select('id, seq, source:ae_sources(key)').eq('instance', instance), 'units');
// Labels like A3 / B1 (source key suffix + seq) — seq alone repeats across sources.
const seqById = new Map(units.map((u) => [u.id, unitLabel(u)]));

const MODES = {
  A: ['answer_text'],
  B: ['answer_text', 'synthetic_question', 'display_label'],
  C: ['answer_text', 'answer_window', 'synthetic_question', 'display_label'],
};

const qvecs = await embed(queries.map((q) => q.q), 'query');
const results = Object.fromEntries(Object.keys(MODES).map((m) => [m, []]));

for (const [mode, kinds] of Object.entries(MODES)) {
  for (let i = 0; i < queries.length; i++) {
    const top = must(
      await db.rpc('ae_match_units', {
        p_instance: instance,
        p_model: EMBED_MODEL,
        p_query: vec(qvecs[i]),
        p_limit: units.length,
        p_kinds: kinds,
      }),
      'match',
    );
    const ranked = top.map((t) => ({ seq: seqById.get(t.unit_id), score: t.score, via: t.matched_content }));
    results[mode].push({ ...queries[i], ranked });
  }
}


for (const mode of Object.keys(MODES)) {
  const rows = results[mode];
  const { t, correct } = assess(rows);
  const answerable = rows.filter((r) => r.expect.length);
  const rightTop = answerable.filter((r) => r.expect.includes(r.ranked[0].seq)).length;
  const hitScores = answerable.filter((r) => r.expect.includes(r.ranked[0].seq)).map((r) => r.ranked[0].score);
  const missScores = rows.filter((r) => !r.expect.length).map((r) => r.ranked[0].score);

  console.log(`\n══ ${mode}: ${MODES[mode].join(' + ')} ══`);
  console.log(`right clip ranked #1: ${rightTop}/${answerable.length}`);
  console.log(
    `score of correct #1s: ${Math.min(...hitScores).toFixed(3)}–${Math.max(...hitScores).toFixed(3)}   ` +
      `score of should-miss: ${Math.min(...missScores).toFixed(3)}–${Math.max(...missScores).toFixed(3)}`,
  );
  console.log(`best threshold ${t.toFixed(3)} → ${correct}/${rows.length} hit/miss decisions right`);
  for (const r of rows) {
    const top = r.ranked[0];
    const ok = r.expect.length ? r.expect.includes(top.seq) : '—';
    const mark = ok === '—' ? (top.score < t ? '✓ miss' : '✗ false hit') : ok ? (top.score >= t ? '✓' : '✗ below t') : '✗ wrong clip';
    console.log(
      `  ${pad(r.q, 52)} want ${pad(r.expect.join('/') || 'miss', 8)} got #${top.seq} ${top.score.toFixed(3)}` +
        `  (2nd #${r.ranked[1]?.seq} ${r.ranked[1]?.score.toFixed(3)})  ${mark}` +
        (mode !== 'A' ? `   ← ${top.via.slice(0, 28)}` : ''),
    );
  }
}
