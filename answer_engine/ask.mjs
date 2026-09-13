// The query flow, shared by the local test server and the site's /api/ask route:
// embed the question → shortlist clips → judge → pick the clip and where to start it.
//
// REAL VOICES ONLY: nothing here generates an answer. The judge classifies recorded
// clips; the viewer gets untouched footage or the "not recorded yet" message.
import { embed, supabase, vec, must, unitLabel, EMBED_MODEL } from './lib.mjs';
import { judge, JUDGE_MODEL } from './judge.mjs';

const TOP_K = 4;

// If the chosen clip's best transcript window matches about as well as anything else
// in the clip (within JUMP_MARGIN) and sits well into it — a passing mention, e.g. her
// name at 0:19 — start there. When the whole clip is the answer, its generated
// questions / full transcript score clearly higher than any single window, so it
// plays from the start and keeps its context.
const JUMP_MARGIN = 0.05;

// Every playback starts this much before the answer (Chris, 2026-09-13: 1–2s of
// leeway so the first word is never clipped). Applies to chips, typed answers,
// jumps and "watch from the start". Clamped at the start of the video.
export const PRE_ROLL_SEC = 1.5;
const preRolled = (t) => Math.max(0, Math.round((t - PRE_ROLL_SEC) * 10) / 10);

/**
 * @param {{ instance: string, company: string, judgeModel?: string, dailyTypedCap?: number | null }} opts
 *   dailyTypedCap — max typed (paid) questions per rolling 24h for this instance; null = no cap.
 */
export function createAsker({ instance, company, judgeModel = JUDGE_MODEL, dailyTypedCap = null }) {
  const db = supabase();

  async function units() {
    return must(
      await db
        .from('ae_units')
        .select(
          'id, seq, start_sec, end_sec, answer_text, display_label_ja, display_label_en, chip_order,' +
            'speaker:ae_speakers(name_ja, name_en, role_ja, role_en),' +
            'source:ae_sources(key, video_provider, video_id, video_hash, pipeline_meta)',
        )
        .eq('instance', instance)
        .eq('status', 'approved'),
      'units',
    );
  }

  async function chips() {
    return (await units())
      .filter((u) => u.chip_order != null)
      .sort((a, b) => a.chip_order - b.chip_order)
      .map((u) => ({ ...u, play_start: preRolled(u.start_sec), play_from: preRolled(u.start_sec) }));
  }

  async function logChip(unitId, label) {
    await db.from('ae_queries').insert({
      instance, query: String(label || '').slice(0, 300), via: 'chip', best_unit_id: unitId, is_miss: false,
    });
  }

  // Spend guard for public use: typed questions are the only thing that costs money.
  async function overDailyCap() {
    if (!dailyTypedCap) return false;
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    // Plain GET with limit(1) rather than a HEAD request (HEAD count failed on Vercel).
    const { count, error, status } = await db
      .from('ae_queries')
      .select('id', { count: 'exact' })
      .eq('instance', instance)
      .eq('via', 'typed')
      .gte('created_at', since)
      .limit(1);
    if (error) throw new Error(`cap check: ${error.message || error.code || `HTTP ${status}`}`);
    return count >= dailyTypedCap;
  }

  async function ask(q) {
    if (await overDailyCap()) return { verdict: 'no', capped: true, clip: null, judged: [], ms: {} };

    const t0 = Date.now();
    const [qv] = await embed([q], 'query');
    const tEmbed = Date.now() - t0;
    const [top, all, windows] = await Promise.all([
      db.rpc('ae_match_units', { p_instance: instance, p_model: EMBED_MODEL, p_query: vec(qv), p_limit: TOP_K }),
      units(),
      // Best timestamped transcript window per clip — used to jump to the moment.
      db.rpc('ae_match_units', { p_instance: instance, p_model: EMBED_MODEL, p_query: vec(qv), p_limit: 100, p_kinds: ['answer_window'] }),
    ]).then(([m, u, w]) => [must(m, 'match'), u, new Map(must(w, 'windows').map((x) => [x.unit_id, x]))]);
    const tSearch = Date.now() - t0 - tEmbed;

    const byId = new Map(all.map((u) => [u.id, u]));
    const cands = top
      .filter((t) => byId.has(t.unit_id))
      .map((t) => {
        const u = byId.get(t.unit_id);
        return {
          ...u, id: unitLabel(u), unit_id: u.id, embed_score: t.score, matched_kind: t.matched_kind,
          window: windows.get(u.id) ?? null, speaker: `${u.speaker.name_ja}（${u.speaker.role_ja}）`, text: u.answer_text,
          speakerInfo: u.speaker,
        };
      });

    const { judged, best, ms: judgeMs } = cands.length
      ? await judge({ company, question: q, cands, model: judgeModel })
      : { judged: [], best: null, ms: 0 };
    const verdict = best?.verdict ?? 'no';
    const isMiss = verdict === 'no';

    await db.from('ae_queries').insert({
      instance, query: q, via: 'typed', best_score: best?.embed_score ?? null,
      best_unit_id: isMiss ? null : best.unit_id, is_miss: isMiss, verdict, judge_model: judgeModel,
    });

    // Where to start: the exact moment for a passing mention inside a long answer, else
    // the answer's start. Also returns the transcript excerpt jumped to, for highlighting.
    const jumpOf = (c) => {
      const w = c.window;
      if (!w || w.matched_start_sec == null) return null;
      const strongEnough = w.score >= c.embed_score - JUMP_MARGIN;
      const wellIn = w.matched_start_sec - c.start_sec > 4;
      return strongEnough && wellIn ? w : null;
    };
    const playFrom = (c) => preRolled(jumpOf(c)?.matched_start_sec ?? c.start_sec);

    return {
      verdict,
      judge: judgeModel,
      clip: isMiss
        ? null
        : {
            seq: best.id, start_sec: best.start_sec, end_sec: best.end_sec,
            play_start: preRolled(best.start_sec), play_from: playFrom(best), jump_text: jumpOf(best)?.matched_content ?? null,
            answer_text: best.answer_text, display_label_ja: best.display_label_ja, speaker: best.speakerInfo, source: best.source,
          },
      judged: judged.map((j) => ({
        id: j.id, verdict: j.verdict, reason: j.reason, embed: j.embed_score, label: j.display_label_ja,
        matched_kind: j.matched_kind, window_score: j.window?.score ?? null, window_start: j.window?.matched_start_sec ?? null,
      })),
      ms: { embed: tEmbed, search: tSearch, judge: judgeMs, total: Date.now() - t0 },
    };
  }

  return { ask, chips, logChip };
}
