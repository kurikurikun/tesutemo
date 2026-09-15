'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AskLogin() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(false)
    const res = await fetch('/api/ask/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    })
    setBusy(false)
    if (res.ok) router.refresh()
    else setError(true)
  }

  return (
    <main style={{ maxWidth: 360, margin: '18vh auto', padding: '0 20px' }}>
      <p style={{ fontSize: 12, letterSpacing: '.08em', color: '#6e6e73', margin: 0 }}>TESUTEMO · PRIVATE DEMO</p>
      <h1 style={{ fontSize: 22, margin: '8px 0 20px' }}>先輩社員に聞いてみる</h1>
      <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="パスワード"
          autoFocus
          style={{ flex: 1, fontSize: 16, padding: '12px 14px', border: '1px solid #e5e5ea', borderRadius: 10 }}
        />
        <button
          disabled={busy}
          style={{ fontSize: 16, padding: '0 18px', border: 0, borderRadius: 10, background: '#e95228', color: '#fff', fontWeight: 600 }}
        >
          入る
        </button>
      </form>
      {error && <p style={{ color: '#e95228', fontSize: 14 }}>パスワードが違います</p>}
    </main>
  )
}
