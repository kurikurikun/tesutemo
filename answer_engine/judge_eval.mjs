// Does an LLM judge fix hit/miss detection — and which model is worth it?
// Embedding search (all kinds) shortlists TOP_K clips; each model labels every
// clip answers / partial / no. Same shortlist for every model, so only the judge differs.
//   strict  — hit only on "answers"
//   lenient — hit on "answers" or "partial"
//
//   node answer_engine/judge_eval.mjs techcrew answer_engine/corpus/techcrew_eval_queries.json [model,model,...]
import { loadEnv, embed, supabase, vec, readJson, must, pad, unitLabel, EMBED_MODEL } from './lib.mjs';
import { judge, PRICES } from './judge.mjs';

loadEnv();
if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing from .env.local');
const [instance, file, modelArg] = process.argv.slice(2);
const MODELS = (modelArg || 'claude-opus-5,claude-sonnet-5,claude-haiku-4-5').split(',');
const { queries } = readJson(file);
const db = supabase();
const TOP_K = 4;
const YEN = 150;

const inst = must(await db.from('ae_instances').select('name').eq('slug', instance).single(), 'instance');
const company = inst.name.replace(/\s*採用$/, ''); // 'TECH CREW 採用' → 'TECH CREW'
const units = must(
  await db
    .from('ae_units')
    .select('id, seq, answer_text, source:ae_sources(key), speaker:ae_speakers(name_ja, role_ja)')
    .eq('instance', instance),
  'units',
);
const byId = new Map(units.map((u) => [u.id, u]));
const qvecs = await embed(queries.map((q) => q.q), 'query');

// One shortlist per question, shared by all models.
const shortlists = [];
for (let i = 0; i < queries.length; i++) {
  const top = must(
    await db.rpc('ae_match_units', { p_instance: instance, p_model: EMBED_MODEL, p_query: vec(qvecs[i]), p_limit: TOP_K }),
    'match',
  );
  shortlists.push(
    top.map((t) => {
      const u = byId.get(t.unit_id);
      return { id: unitLabel(u), speaker: `${u.speaker.name_ja}（${u.speaker.role_ja}）`, text: u.answer_text };
    }),
  );
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const verdictOk = (r, hitVerdicts) => {
  const isHit = hitVerdicts.includes(r.best.verdict);
  if (!r.expect.length) return !isHit;
  return isHit && r.expect.includes(r.best.id);
};

const summary = [];
for (const model of MODELS) {
  const rows = [];
  let inTok = 0, outTok = 0, errors = 0;
  for (let i = 0; i < queries.length; i++) {
    try {
      const r = await judge({ company, question: queries[i].q, cands: shortlists[i], model });
      inTok += r.usage.input_tokens; outTok += r.usage.output_tokens;
      rows.push({ ...queries[i], ...r });
    } catch (e) {
      errors++;
      console.log(`  [${model}] error on "${queries[i].q}": ${e.message}`);
    }
  }
  const [pi, po] = PRICES[model];
  const costPerQ = ((inTok * pi + outTok * po) / 1e6) / rows.length;
  const strict = rows.filter((r) => verdictOk(r, ['answers'])).length;
  const lenient = rows.filter((r) => verdictOk(r, ['answers', 'partial'])).length;
  const answerable = rows.filter((r) => r.expect.length);
  const rightClip = answerable.filter((r) => r.expect.includes(r.best.id)).length;
  summary.push({ model, strict, lenient, rightClip, answerable: answerable.length, n: rows.length, errors,
    ms: median(rows.map((r) => r.ms)), maxMs: Math.max(...rows.map((r) => r.ms)),
    inPerQ: Math.round(inTok / rows.length), outPerQ: Math.round(outTok / rows.length), costPerQ });

  console.log(`\n══ ${model} ══`);
  for (const r of rows) {
    const s = verdictOk(r, ['answers']) ? '✓' : '✗';
    const l = verdictOk(r, ['answers', 'partial']) ? '✓' : '✗';
    console.log(`  ${pad(r.q, 46)} want ${pad(r.expect.join('/') || 'miss', 12)} got ${pad(r.best.id, 3)} ${pad(r.best.verdict, 8)} strict ${s} lenient ${l}  ${r.ms}ms`);
    for (const j of r.judged) console.log(`      ${pad(j.id, 3)} ${pad(j.verdict, 8)} ${j.reason}`);
  }
}

console.log('\n══ SUMMARY (same 26 questions, same shortlists) ══');
console.log(`${pad('model', 18)} ${pad('strict', 7)} ${pad('lenient', 8)} ${pad('right clip', 11)} ${pad('median', 8)} ${pad('max', 7)} ${pad('tok in/out', 11)} per question`);
for (const s of summary) {
  console.log(
    `${pad(s.model, 18)} ${pad(`${s.strict}/${s.n}`, 7)} ${pad(`${s.lenient}/${s.n}`, 8)} ${pad(`${s.rightClip}/${s.answerable}`, 11)} ` +
      `${pad(`${s.ms}ms`, 8)} ${pad(`${s.maxMs}ms`, 7)} ${pad(`${s.inPerQ}/${s.outPerQ}`, 11)} $${s.costPerQ.toFixed(4)} (¥${(s.costPerQ * YEN).toFixed(2)})` +
      (s.errors ? `  errors ${s.errors}` : ''),
  );
}
