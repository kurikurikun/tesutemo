// Does a reranker fix hit/miss detection? Same eval set as eval.mjs.
//   C  = embedding search (transcript + windows + synthetic questions + labels), score = cosine
//   R  = C's top-K clips re-scored by the reranker against each clip's verbatim answer
//   RI = R with an instruction prepended to the query
//
//   node answer_engine/rerank_eval.mjs techcrew answer_engine/corpus/techcrew_eval_queries.json
import {
  loadEnv, embed, rerank, supabase, vec, readJson, must, assess, pad, unitLabel, EMBED_MODEL, RERANK_MODEL,
} from './lib.mjs';

loadEnv();
const [instance, file] = process.argv.slice(2);
const { queries } = readJson(file);
const db = supabase();
const TOP_K = 3;

const INSTRUCTION =
  'Instruction: 次のインタビュー発言が、この質問に実際に答えているかを判定してください。' +
  '話題が近いだけで質問に答えていない発言は関連なしとします。\nQuery: ';

const units = must(await db.from('ae_units').select('id, seq, answer_text, source:ae_sources(key)').eq('instance', instance), 'units');
const byId = new Map(units.map((u) => [u.id, u]));

const qvecs = await embed(queries.map((q) => q.q), 'query');
const results = { C: [], R: [], RI: [] };
const latency = { R: [], RI: [] };

for (let i = 0; i < queries.length; i++) {
  const q = queries[i];
  const top = must(
    await db.rpc('ae_match_units', { p_instance: instance, p_model: EMBED_MODEL, p_query: vec(qvecs[i]), p_limit: TOP_K }),
    'match',
  );
  const cands = top.map((t) => ({ seq: unitLabel(byId.get(t.unit_id)), text: byId.get(t.unit_id).answer_text, score: t.score }));
  results.C.push({ ...q, ranked: cands });

  for (const [mode, query] of [['R', q.q], ['RI', INSTRUCTION + q.q]]) {
    const t0 = Date.now();
    const scores = await rerank(query, cands.map((c) => c.text));
    latency[mode].push(Date.now() - t0);
    const ranked = cands.map((c, j) => ({ ...c, score: scores[j] })).sort((a, b) => b.score - a.score);
    results[mode].push({ ...q, ranked });
  }
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const mode of ['C', 'R', 'RI']) {
  const rows = results[mode];
  const { t, correct } = assess(rows);
  const answerable = rows.filter((r) => r.expect.length);
  const rightTop = answerable.filter((r) => r.expect.includes(r.ranked[0].seq));
  const hitS = rightTop.map((r) => r.ranked[0].score);
  const missS = rows.filter((r) => !r.expect.length).map((r) => r.ranked[0].score);
  const gap = Math.min(...hitS) - Math.max(...missS);

  console.log(`\n══ ${mode} ${mode === 'C' ? '(embeddings only)' : `(${RERANK_MODEL}${mode === 'RI' ? ' + instruction' : ''}, median ${median(latency[mode])}ms)`} ══`);
  console.log(`right clip ranked #1: ${rightTop.length}/${answerable.length}`);
  console.log(
    `correct #1 scores ${Math.min(...hitS).toFixed(3)}–${Math.max(...hitS).toFixed(3)}  ·  ` +
      `should-miss ${Math.min(...missS).toFixed(3)}–${Math.max(...missS).toFixed(3)}  ·  ` +
      `${gap > 0 ? `clean gap ${gap.toFixed(3)}` : `overlap ${(-gap).toFixed(3)}`}`,
  );
  console.log(`best threshold ${t.toFixed(3)} → ${correct}/${rows.length} hit/miss decisions right`);
  for (const r of rows) {
    const top = r.ranked[0];
    const ok = r.expect.length ? r.expect.includes(top.seq) : null;
    const mark = ok === null ? (top.score < t ? '✓ miss' : '✗ false hit') : ok ? (top.score >= t ? '✓' : '✗ below t') : '✗ wrong clip';
    console.log(
      `  ${pad(r.q, 46)} want ${pad(r.expect.join('/') || 'miss', 8)} got #${top.seq} ${top.score.toFixed(3)}` +
        `  (2nd #${r.ranked[1]?.seq} ${r.ranked[1]?.score.toFixed(3)})  ${mark}`,
    );
  }
}
