// Add 、。？！ to each unit's answer_text so 「文字で読む」 is readable.
//
//   node answer_engine/punctuate.mjs answer_engine/corpus/techcrew_shimizu_full.json
//
// Subtitles are usually written without punctuation, which leaves the on-page
// transcript as one run-on block. Claude inserts punctuation only; every result is
// then checked mechanically — with punctuation stripped, it must be character-for-
// character identical to the original. Anything else is rejected and the unit keeps
// its original text. REAL VOICES ONLY: her words are never changed.
import { readFileSync, writeFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { loadEnv } from './lib.mjs';

loadEnv();
const file = process.argv[2];
if (!file) throw new Error('usage: node answer_engine/punctuate.mjs <corpus.json>');
const corpus = JSON.parse(readFileSync(file, 'utf8'));
const MODEL = process.env.AE_PUNCT_MODEL || 'claude-opus-5';

const PUNCT = /[、。？！?!,.\s]/g;
const bare = (t) => t.replace(PUNCT, '');


// Move ONLY the punctuation from Claude's version onto the original characters.
// The result is built from the original text, so her words cannot change even if the
// model slipped in or dropped a character (e.g. 「として、もうちょっと」→「としても、…」).
// Characters are aligned with a longest-common-subsequence match; each mark is placed
// after the original character aligned with the one it followed. If the two texts differ
// by more than MAX_SLIPS characters, return null and keep the original.
const MAX_SLIPS = 3;
const MARK = /[、。？！]/;
function transplant(original, punctuated) {
  const src = [...original.replace(PUNCT, '')];
  const gen = [];          // model's non-punctuation chars
  const marksAfter = [];   // marks that followed gen[k] (index -1 = before any char)
  for (const ch of punctuated) {
    if (MARK.test(ch)) (marksAfter[gen.length - 1] ??= []).push(ch);
    else if (!/[?!,.\s]/.test(ch)) gen.push(ch);
  }
  // LCS table
  const n = src.length, m = gen.length;
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i][j] = src[i] === gen[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  if (Math.max(n, m) - L[0][0] > MAX_SLIPS) return null;
  // walk: map each gen index to the src index it lands after
  const srcAfterGen = new Array(m).fill(-1);
  let i = 0, j = 0, lastSrc = -1;
  while (i < n && j < m) {
    // Tie-break: if the model's char can be dropped without losing any match, it is the
    // one the model inserted — skip it, so the mark stays where the original reads.
    if (src[i] === gen[j] && L[i][j + 1] < L[i][j]) { lastSrc = i; srcAfterGen[j] = i; i++; j++; }
    else if (src[i] === gen[j]) { srcAfterGen[j] = lastSrc; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++;
    else { srcAfterGen[j] = lastSrc; j++; }
  }
  for (; j < m; j++) srcAfterGen[j] = n - 1;
  const after = new Map();
  marksAfter.forEach((marks, k) => {
    const at = srcAfterGen[k];
    if (at >= 0) after.set(at, marks[marks.length - 1]);
  });
  let out = '';
  src.forEach((ch, idx) => { out += ch; if (after.has(idx)) out += after.get(idx); });
  return out.replace(PUNCT, '') === original.replace(PUNCT, '') ? out : null;
}

const Out = z.object({ units: z.array(z.object({ seq: z.number().int(), text: z.string() })) });

const system = `You add punctuation to verbatim Japanese interview transcripts so they are easy to read on a web page.

Rules — these are absolute:
- Insert only 、 。 ？ ！ . Do not add, delete, reorder, or change ANY other character: no word fixes, no removing fillers (えー, あの, なんか), no kanji/kana changes, no spaces, no quotation marks.
- Put 。 at the end of each sentence and 、 where a reader would naturally pause. Use ？ only for an actual question.
- The text is a real person's spoken words and is published as a verbatim transcript, so even obvious slips stay exactly as they are.

Return each unit's seq with its punctuated text.`;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, baseURL: 'https://api.anthropic.com' });

async function punctuate(units) {
  const input = units.map((u) => `<unit seq="${u.seq}">\n${u.answer_text}\n</unit>`).join('\n\n');
  const msg = await client.beta.messages
    .stream({
      model: MODEL,
      max_tokens: 64000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: betaZodOutputFormat(Out) },
      system,
      messages: [{ role: 'user', content: input }],
    })
    .finalMessage();
  if (msg.stop_reason === 'refusal') throw new Error(`refused: ${JSON.stringify(msg.stop_details)}`);
  if (!msg.parsed_output) throw new Error(`no parseable output (stop_reason ${msg.stop_reason})`);
  tokens.in += msg.usage.input_tokens; tokens.out += msg.usage.output_tokens;
  return new Map(msg.parsed_output.units.map((u) => [u.seq, u.text]));
}

// Only units not yet punctuated (safe to re-run). All at once first, then any
// rejected unit gets up to two solo retries.
const tokens = { in: 0, out: 0 };
// "Already punctuated" = at least 2 marks per 100 characters (subtitles often carry a stray 。).
const density = (t) => ((t.match(/[、。？！]/g) ?? []).length * 100) / Math.max(1, t.length);
let todo = corpus.units.filter((u) => density(u.answer_text) < 2);
console.log(`punctuating ${todo.length} of ${corpus.units.length} units with ${MODEL}…`);
let ok = 0;
for (let attempt = 0; attempt < 3 && todo.length; attempt++) {
  const results = attempt === 0 ? await punctuate(todo) : new Map([...(await Promise.all(todo.map((u) => punctuate([u])))).flatMap((m) => [...m])]);
  const failed = [];
  for (const u of todo) {
    const punct = results.get(u.seq);
    const merged = punct && transplant(u.answer_text, punct);
    if (merged) { u.answer_text = merged; ok++; }
    else failed.push(u);
  }
  if (failed.length) console.log(`  attempt ${attempt + 1}: ${failed.length} could not be aligned (seq ${failed.map((u) => u.seq).join(', ')})`);
  todo = failed;
}
for (const u of todo) console.log(`  ✗ seq ${u.seq}: kept original (unpunctuated)`);
writeFileSync(file, JSON.stringify(corpus, null, 2) + '\n');
console.log(`punctuated ${ok}, left unpunctuated ${todo.length} · tokens in ${tokens.in} / out ${tokens.out}`);
