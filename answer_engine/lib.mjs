// Shared helpers for the answer-engine scripts: env, Voyage embeddings, Supabase.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env.local reader — the Next.js app owns that file; we only read it.
export function loadEnv() {
  const text = readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  for (const k of ['VOYAGE_API_KEY', 'SUPABASE_SERVICE_KEY']) {
    if (!process.env[k]) throw new Error(`${k} missing from .env.local`);
  }
}

// POST to Voyage, waiting and retrying on 429. Without a payment method on the
// account the limit is 3 requests/minute, so a wait of ~20s clears it.
async function voyagePost(endpoint, body) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://api.voyageai.com/v1/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return res;
    if (res.status === 429 && attempt < 20) {
      await new Promise((r) => setTimeout(r, 21000));
      continue;
    }
    throw new Error(`Voyage ${endpoint} ${res.status}: ${await res.text()}`);
  }
}

export const EMBED_MODEL = process.env.VOYAGE_MODEL || 'voyage-4';
export const EMBED_DIM = 1024; // must match vector(1024) in sql/001_schema.sql

// inputType: 'document' for stored text, 'query' for what a viewer types.
export async function embed(texts, inputType) {
  const out = [];
  for (let i = 0; i < texts.length; i += 64) {
    const res = await voyagePost('embeddings', {
      input: texts.slice(i, i + 64),
      model: EMBED_MODEL,
      input_type: inputType,
      output_dimension: EMBED_DIM,
    });
    const json = await res.json();
    const rows = json.data ?? json.embeddings;
    rows.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    out.push(...rows.map((r) => r.embedding ?? r));
  }
  return out;
}

export const RERANK_MODEL = process.env.VOYAGE_RERANK_MODEL || 'rerank-2.5';

// Scores each document against the query (0–1). Returns scores in input order.
// Used to judge "does this clip actually answer the question?" — it only chooses
// among recorded answers, it never produces one.
export async function rerank(query, documents) {
  const res = await voyagePost('rerank', { query, documents, model: RERANK_MODEL });
  const json = await res.json();
  const scores = new Array(documents.length);
  for (const r of json.data ?? json.results) scores[r.index] = r.relevance_score;
  return scores;
}

// The URL isn't secret (see src/lib/supabase.ts); fall back so Preview deploys without
// NEXT_PUBLIC_SUPABASE_URL still work. The service key must come from the environment.
const SUPABASE_URL = 'https://zmbvcsowniyrtaleluoc.supabase.co';

// cache: 'no-store' — on Vercel, Next.js patches fetch with a Data Cache that survives
// deploys; supabase-js uses fetch internally, so without this, queries return stale rows
// (and the daily-cap count request failed outright). Same fix as src/lib/survey.ts.
export const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });

// pgvector accepts the '[1,2,3]' text form over PostgREST.
export const vec = (arr) => JSON.stringify(arr);

// Eval helpers. Best threshold = the cutoff that gets the most hit/miss decisions
// right, counting a hit as right only if the top result is an expected unit.
export function assess(rows) {
  const cands = [...new Set(rows.map((r) => r.ranked[0].score))].sort((a, b) => a - b);
  let best = { t: 0, correct: -1 };
  for (const t of [0, ...cands.map((c) => c + 1e-6)]) {
    const correct = rows.filter((r) => {
      const top = r.ranked[0];
      const isHit = top.score >= t;
      return r.expect.length ? isHit && r.expect.includes(top.seq) : !isHit;
    }).length;
    if (correct > best.correct) best = { t, correct };
  }
  return best;
}

// A3 / B1: source key suffix + seq (expects the unit row to include source:ae_sources(key)).
export const unitLabel = (u) => `${u.source.key.split('_').pop().toUpperCase()}${u.seq}`;

// Pads mixed Japanese/ASCII text to a column width (CJK counts as 2).
export const pad = (s, n) => {
  const w = [...String(s)].reduce((a, c) => a + (c.charCodeAt(0) > 0x2e80 ? 2 : 1), 0);
  return String(s) + ' '.repeat(Math.max(0, n - w));
};

export const readJson = (p) => JSON.parse(readFileSync(path.resolve(p), 'utf8'));

export function must({ data, error, status }, what) {
  if (error) throw new Error(`${what}: ${error.message || error.code || error.hint || `HTTP ${status}`}`);
  return data;
}
