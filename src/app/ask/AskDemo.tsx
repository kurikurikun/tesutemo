'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

// 聞いてみる — private demo UI. Mirrors answer_engine/test/index.html.
// BRAND RULE (real voices only): the answer is always untouched footage. display_label
// is a GENERATED caption describing the clip — never presented as a verbatim quote.

type Speaker = { name_ja: string; role_ja: string }
type Source = { video_id: string; video_hash: string | null; pipeline_meta?: { aspect?: string } }
type Clip = {
  id?: string
  seq?: string
  start_sec: number
  end_sec: number
  play_start?: number
  play_from?: number
  answer_text: string
  display_label_ja: string
  speaker: Speaker
  source: Source
}
type Judged = {
  id: string; verdict: string; reason: string; embed: number; label: string
  matched_kind: string; window_score: number | null; window_start: number | null
}
type AskResult = {
  verdict: 'answers' | 'partial' | 'no'
  capped?: boolean
  judge?: string
  clip: Clip | null
  judged: Judged[]
  ms: { embed?: number; search?: number; judge?: number; total?: number }
}

type VimeoPlayer = {
  on(event: string, cb: (data: { seconds: number }) => void): void
  ready(): Promise<void>
  setCurrentTime(t: number): Promise<number>
  play(): Promise<void>
  pause(): Promise<void>
  getPaused(): Promise<boolean>
}
declare global {
  interface Window { Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayer } }
}

const ORANGE = '#e95228'
const MUTE = '#6e6e73'
const LINE = '#e5e5ea'

export default function AskDemo() {
  const [vimeoReady, setVimeoReady] = useState(false)
  const [chips, setChips] = useState<Clip[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ clip: Clip | null; partial: boolean; capped?: boolean; judged?: Judged[]; ms?: AskResult['ms']; chip?: boolean; key: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showJudge, setShowJudge] = useState(false)

  useEffect(() => {
    if (window.Vimeo) setVimeoReady(true)
    fetch('/api/ask').then((r) => r.json()).then((d) => Array.isArray(d) && setChips(d))
  }, [])

  function playChip(c: Clip) {
    const label = c.display_label_ja.replace(/^Q\.\s*/, '')
    setQ(label)
    setError(null)
    // A chip IS its clip: no search, no judge — instant and free.
    setResult({ clip: c, partial: false, chip: true, key: Date.now() })
    fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chipUnit: c.id, label }) })
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    const question = q.trim()
    if (!question || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: question }) })
      const d: AskResult & { error?: string } = await res.json()
      if (!res.ok || d.error) throw new Error(d.error || `HTTP ${res.status}`)
      setResult({ clip: d.clip, partial: d.verdict === 'partial', capped: d.capped, judged: d.judged, ms: d.ms, key: Date.now() })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '28px 18px 60px' }}>
      <Script src="https://player.vimeo.com/api/player.js" strategy="afterInteractive" onLoad={() => setVimeoReady(true)} />

      <span style={{ display: 'inline-block', fontSize: 11, letterSpacing: '.08em', color: '#fff', background: '#1d1d1f', padding: '3px 8px', borderRadius: 4 }}>
        TESUTEMO · DEMO
      </span>
      <h1 style={{ fontSize: 26, margin: '12px 0 4px' }}>先輩社員に聞いてみる</h1>
      <p style={{ color: MUTE, margin: '0 0 20px', fontSize: 14 }}>AIが探しますが、答えるのは本物の人間です。</p>

      <form onSubmit={ask} style={{ display: 'flex', gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="気になることを聞いてみてください"
          style={{ flex: 1, minWidth: 0, fontSize: 16, padding: '12px 14px', border: `1px solid ${LINE}`, borderRadius: 10, background: '#fff' }}
        />
        <button disabled={loading} style={{ fontSize: 16, padding: '0 18px', border: 0, borderRadius: 10, background: ORANGE, color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          聞く
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '14px 0 24px' }}>
        {chips.map((c) => (
          <button
            key={c.id}
            onClick={() => playChip(c)}
            style={{ fontSize: 14, padding: '8px 12px', border: `1px solid ${LINE}`, borderRadius: 999, background: '#fff', cursor: 'pointer', color: '#1d1d1f' }}
          >
            {c.display_label_ja.replace(/^Q\.\s*/, '')}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: MUTE, fontSize: 14 }}>インタビューの中から探しています…</p>}
      {error && <p style={{ color: ORANGE, fontSize: 14 }}>エラー: {error}</p>}

      {result && !result.clip && (
        <div style={{ background: '#fff', border: `1px dashed ${LINE}`, borderRadius: 14, padding: 18 }}>
          {result.capped
            ? '本日のデモ利用上限に達しました。上のボタンからはご覧いただけます。'
            : 'この質問への回答はまだ収録されていません。次のインタビューで聞いてみますね。'}
        </div>
      )}
      {result?.clip && vimeoReady && <ClipCard key={result.key} clip={result.clip} partial={result.partial} autoplay={!!result.chip} />}

      {result && !result.chip && !!result.judged?.length && (
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setShowJudge((s) => !s)} style={{ border: 0, background: 'none', color: MUTE, fontSize: 13, cursor: 'pointer', padding: 0 }}>
            {showJudge ? '▾' : '▸'} AIの判定を見る
          </button>
          {showJudge && (
            <div style={{ font: '12px ui-monospace, Menlo, monospace', color: MUTE, background: '#f2f2f4', borderRadius: 10, padding: '10px 12px', marginTop: 8, whiteSpace: 'pre-wrap' }}>
              {`${result.judged[0] && result.clip ? `${result.partial ? 'PARTIAL' : 'ANSWERS'}` : 'NO ANSWER'} · ${result.ms?.total}ms (search ${(result.ms?.embed ?? 0) + (result.ms?.search ?? 0)}ms, judge ${result.ms?.judge}ms)\n`}
              {result.judged.map((j) => `${j.id}  ${j.verdict.padEnd(7)} ${j.label}\n     ${j.reason}`).join('\n')}
            </div>
          )}
        </div>
      )}

      <footer style={{ marginTop: 36, fontSize: 12, color: MUTE }}>
        TesuTemo · 聞いてみる demo — TECH CREW 清水さん（フルインタビュー 約30分）
      </footer>
    </main>
  )
}

function ClipCard({ clip, partial, autoplay }: { clip: Clip; partial: boolean; autoplay: boolean }) {
  const holder = useRef<HTMLDivElement>(null)
  const [needsTap, setNeedsTap] = useState(false)
  const [jumped, setJumped] = useState(false)
  const player = useRef<VimeoPlayer | null>(null)
  const [showText, setShowText] = useState(false)

  // play_start / play_from already include the pre-roll (answer_engine/ask.mjs PRE_ROLL_SEC).
  const start = clip.play_start ?? clip.start_sec
  const from = clip.play_from ?? start
  const vertical = clip.source.pipeline_meta?.aspect === '9:16'

  useEffect(() => {
    if (!holder.current || !window.Vimeo) return
    setJumped(from - start > 1)
    const iframe = document.createElement('iframe')
    const h = clip.source.video_hash ? `h=${clip.source.video_hash}&` : ''
    iframe.src = `https://player.vimeo.com/video/${clip.source.video_id}?${h}badge=0&title=0&byline=0&portrait=0&playsinline=1#t=${Math.floor(from)}s`
    iframe.allow = 'autoplay; fullscreen; picture-in-picture'
    Object.assign(iframe.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', border: '0' })
    holder.current.appendChild(iframe)

    const p = new window.Vimeo.Player(iframe)
    player.current = p
    p.on('play', () => setNeedsTap(false))
    p.on('timeupdate', ({ seconds }) => {
      if (seconds >= clip.end_sec) { p.pause(); p.setCurrentTime(start) }
    })
    // setCurrentTime() never resolves if the player is already at that time, so cap the wait.
    const seek = (t: number) => Promise.race([p.setCurrentTime(t), new Promise((r) => setTimeout(r, 1500))])
    let cancelled = false
    p.ready()
      .then(() => (from > 0.5 ? seek(from) : null))
      .then(async () => {
        // Browsers only allow sound-on playback that starts inside a tap. A chip starts the
        // clip within its tap, so it autoplays. A typed answer arrives ~5s after 聞く, too
        // late — so it waits, cued at the right moment, behind a ▶ that plays it with sound
        // in one tap. If a chip's autoplay is blocked anyway, show the same ▶.
        if (!autoplay) { if (!cancelled) setNeedsTap(true); return }
        p.play().catch(() => {})
        await new Promise((r) => setTimeout(r, 800))
        if (!cancelled && (await p.getPaused())) setNeedsTap(true)
      })
    return () => {
      cancelled = true
      iframe.remove()
    }
  }, [clip, from, start, autoplay])

  return (
    <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0e6e2', display: 'grid', placeItems: 'center', fontWeight: 700, color: ORANGE }}>
          {clip.speaker.name_ja[0]}
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>{clip.speaker.name_ja}</div>
          <div style={{ fontSize: 12, color: MUTE }}>{clip.speaker.role_ja}</div>
        </div>
      </div>
      {partial && (
        <div style={{ margin: '0 14px 8px', display: 'inline-block', fontSize: 12, color: '#7e91cf', background: '#eef1fa', padding: '3px 8px', borderRadius: 4 }}>
          関連する内容を話しています
        </div>
      )}
      {/* Generated caption describing the clip — not a quote. */}
      <div style={{ padding: '0 14px 12px', fontSize: 15, color: MUTE }}>{clip.display_label_ja}</div>
      {jumped && (
        <button
          onClick={() => { player.current?.setCurrentTime(start); player.current?.play(); setJumped(false) }}
          style={{ display: 'block', margin: '-4px 14px 10px', padding: 0, border: 0, background: 'none', color: ORANGE, fontSize: 13, cursor: 'pointer' }}
        >
          ▶ 最初から見る（{Math.round(from - start)}秒戻る）
        </button>
      )}
      <div
        ref={holder}
        style={
          vertical
            ? { position: 'relative', width: 'min(100%, calc(72vh * 9 / 16))', aspectRatio: '9 / 16', margin: '0 auto', background: '#000' }
            : { position: 'relative', paddingTop: '56.25%', background: '#000' }
        }
      >
        {needsTap && (
          // play() must be called synchronously inside the tap, or the browser blocks sound.
          <button
            aria-label="再生"
            onClick={() => { player.current?.play(); setNeedsTap(false) }}
            style={{ position: 'absolute', inset: 0, zIndex: 2, border: 0, cursor: 'pointer', background: 'rgba(0,0,0,0.25)', display: 'grid', placeItems: 'center' }}
          >
            <span style={{ width: 76, height: 76, borderRadius: '50%', background: ORANGE, display: 'grid', placeItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}>
              <span style={{ width: 0, height: 0, marginLeft: 6, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '24px solid #fff' }} />
            </span>
          </button>
        )}
      </div>
      <button onClick={() => setShowText((s) => !s)} style={{ display: 'block', padding: '12px 14px', border: 0, background: 'none', color: ORANGE, fontSize: 14, cursor: 'pointer' }}>
        {showText ? '▾' : '▸'} 文字で読む
      </button>
      {/* Verbatim transcript (only mis-hearings corrected). */}
      {showText && <p style={{ margin: 0, padding: '0 14px 16px', fontSize: 15, lineHeight: 1.9 }}>{clip.answer_text}</p>}
    </div>
  )
}
