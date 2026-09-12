// Relevance judge: does a recorded clip actually answer the viewer's question?
//
// REAL VOICES ONLY: the judge never writes an answer. It classifies clips the
// embedding search already shortlisted; the viewer only ever sees untouched
// footage (or the "not recorded yet" message).
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

// Sonnet 5 chosen by judge_eval.mjs on 2026-09-13: most accurate of Opus 5 / Sonnet 5 /
// Haiku 4.5 on the TECH CREW set, ~¥1 per question. Haiku mis-judged a previous-employer clip.
export const JUDGE_MODEL = process.env.AE_JUDGE_MODEL || 'claude-sonnet-5';

let client;
const anthropic = () =>
  (client ??= new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    // Pin the public API: the Claude Code shell exports its own ANTHROPIC_BASE_URL.
    baseURL: 'https://api.anthropic.com',
  }));

const Verdicts = z.object({
  judgments: z.array(
    z.object({
      id: z.string(),
      verdict: z.enum(['answers', 'partial', 'no']),
      reason: z.string(),
    }),
  ),
});

const system = (company) => `You judge search results for a recruitment Q&A widget on ${company}'s careers page.

A job candidate types a question. The widget can only reply by playing a clip of a real ${company} employee speaking in a recorded interview — nothing is ever generated. Your job is to decide, for each candidate clip, whether playing it would genuinely answer the question. Playing a clip that doesn't answer the question misleads the candidate and puts words in a real person's mouth, so be strict.

Verdicts:
- "answers": the speaker directly addresses what was asked. A passing mention counts if it answers (e.g. the speaker says their name and the question asks for it).
- "partial": the speaker addresses a closely related aspect that a candidate would find directly useful, but not the specific thing asked (e.g. asked how much overtime there is; the speaker describes flexible working hours but never says how much overtime).
- "no": topical overlap only, or the clip doesn't address the question.

Rules:
- Unless the question is about the speaker's past, the candidate is asking about ${company}. What the speaker says about a PREVIOUS employer does not answer a question about ${company} — it can only answer questions about their background or why they changed jobs.
- Judge only what the transcript actually says. Do not infer facts the speaker didn't state.
- Transcripts are auto-captions of spoken Japanese and may contain small recognition errors.
- The question may be in Japanese or English; the clips are in Japanese. Write each reason as one short English sentence.

Return one judgment per clip, using the clip ids given.`;

// $ per million tokens (input, output) — for cost reporting only.
export const PRICES = {
  'claude-opus-5': [5, 25],
  'claude-sonnet-5': [2, 10],
  'claude-haiku-4-5': [1, 5],
};

// Per-model request options. Haiku 4.5 has no effort control (and thinking stays
// off by default there); the server-side refusal fallback is opted into for Opus 5.
function modelOptions(model) {
  const format = betaZodOutputFormat(Verdicts);
  if (model.startsWith('claude-haiku')) return { output_config: { format } };
  const opts = { output_config: { effort: 'low', format } };
  if (model === 'claude-opus-5') Object.assign(opts, { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
  return opts;
}

// cands: [{ id, speaker: 'name, role', text }] in embedding-rank order.
export async function judge({ company, question, cands, model = JUDGE_MODEL }) {
  const clips = cands
    .map((c) => `<clip id="${c.id}" speaker="${c.speaker}">\n${c.text}\n</clip>`)
    .join('\n\n');

  const t0 = Date.now();
  const res = await anthropic().beta.messages.parse({
    model,
    max_tokens: 4000,
    ...modelOptions(model),
    system: system(company),
    messages: [{ role: 'user', content: `<question>${question}</question>\n\n${clips}` }],
  });
  const ms = Date.now() - t0;

  if (res.stop_reason === 'refusal') throw new Error(`judge refused: ${JSON.stringify(res.stop_details)}`);
  if (!res.parsed_output) throw new Error(`judge returned no parseable output (stop_reason ${res.stop_reason})`);

  const byId = new Map(res.parsed_output.judgments.map((j) => [j.id, j]));
  const judged = cands.map((c) => ({ ...c, ...(byId.get(c.id) ?? { verdict: 'no', reason: '(no judgment returned)' }) }));
  // Best clip: strongest verdict, ties broken by embedding rank (input order).
  const rank = { answers: 0, partial: 1, no: 2 };
  const ordered = [...judged].sort((a, b) => rank[a.verdict] - rank[b.verdict]);
  return { judged, best: ordered[0], ms, usage: res.usage };
}
