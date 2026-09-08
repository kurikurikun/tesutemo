'use client'

import { useEffect, useState } from 'react'
import { prepStatus, type PrepRow, type PrepStatus } from '@/lib/prep'

const STATUS_STYLE: Record<PrepStatus, { label: string; className: string }> = {
  unopened: { label: '未開封', className: 'bg-red-100 text-red-700' },
  opened: { label: '閲覧のみ', className: 'bg-amber-100 text-amber-800' },
  acknowledged: { label: '同意済み', className: 'bg-emerald-100 text-emerald-700' },
}

const BLANK = { name: '', company: '', interview_date: '', lang: 'ja' as 'ja' | 'en' }

function shortDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
}

function stamp(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Row({
  row,
  origin,
  onPatch,
  onDelete,
}: {
  row: PrepRow
  origin: string
  onPatch: (id: string, patch: Partial<PrepRow>) => void
  onDelete: (row: PrepRow) => void
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const status = prepStatus(row)
  const link = `${origin}/prep/${row.id}`

  async function copy() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[status].className}`}>
          {STATUS_STYLE[status].label}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {row.name}
            {row.lang === 'en' && <span className="ml-2 text-xs font-normal text-gray-400">EN</span>}
          </p>
          <p className="truncate text-xs text-gray-500">
            {row.company || '会社名なし'}　撮影 {shortDate(row.interview_date)}
          </p>
        </div>
        <button onClick={copy} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700">
          {copied ? 'コピーしました' : 'リンクをコピー'}
        </button>
        <button onClick={() => setOpen((o) => !o)} className="text-xs text-gray-500">
          {open ? '閉じる' : '詳細'}
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-gray-100 p-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-500">送るリンク</p>
            <a href={link} target="_blank" rel="noreferrer" className="break-all text-xs text-orange-600">
              {link}
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="font-semibold text-gray-500">開封</p>
              <p className="text-gray-800">{stamp(row.first_opened_at)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500">最後まで表示</p>
              <p className="text-gray-800">{stamp(row.scrolled_to_end_at)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500">送信</p>
              <p className="text-gray-800">{stamp(row.submitted_at)}</p>
            </div>
          </div>

          {row.submitted_at && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-500">ご本人の入力</p>
              <p className="mt-1 text-gray-900">
                {row.full_name}（{row.job_title}）
              </p>
              <p className="text-gray-900">{row.phone}</p>
              {row.contact_note && <p className="mt-1 text-gray-600">{row.contact_note}</p>}
            </div>
          )}

          {/* キットの発送。前日までに届いていないと当日詰むので、ここで見えるようにしておく。 */}
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500">キット発送日</label>
              <input
                type="date"
                defaultValue={row.kit_shipped_at ? row.kit_shipped_at.slice(0, 10) : ''}
                onBlur={(e) => onPatch(row.id, { kit_shipped_at: e.target.value || null })}
                className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500">追跡番号</label>
              <input
                defaultValue={row.kit_tracking ?? ''}
                onBlur={(e) => onPatch(row.id, { kit_tracking: e.target.value || null })}
                className="mt-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-900"
              />
            </div>
            <button onClick={() => onDelete(row)} className="ml-auto text-xs text-red-500">
              削除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OpsPrepPage() {
  const [rows, setRows] = useState<PrepRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [justCreated, setJustCreated] = useState<string | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.tesutemo.co'

  useEffect(() => {
    fetch('/api/prep/admin')
      .then((r) => r.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/prep/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const created: PrepRow = await res.json()
      setRows((prev) => [created, ...prev])
      setJustCreated(`${origin}/prep/${created.id}`)
      setForm(BLANK)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handlePatch(id: string, patch: Partial<PrepRow>) {
    const res = await fetch(`/api/prep/admin/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      const updated = await res.json()
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)))
    }
  }

  async function handleDelete(row: PrepRow) {
    if (!confirm(`${row.name}さんのリンクを削除しますか？`)) return
    await fetch(`/api/prep/admin/${row.id}`, { method: 'DELETE' })
    setRows((prev) => prev.filter((r) => r.id !== row.id))
  }

  const waiting = rows.filter((r) => !r.submitted_at).length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">事前確認</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            撮影日が近い順。{waiting > 0 ? `未送信 ${waiting}件` : 'すべて確認済み'}
          </p>
        </div>
        <button
          onClick={() => setShowForm((f) => !f)}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white"
        >
          + リンクを作る
        </button>
      </div>

      {justCreated && (
        <div className="mb-4 rounded-xl bg-orange-50 p-4">
          <p className="text-xs font-semibold text-orange-800">このリンクを送ってください</p>
          <p className="mt-1 break-all text-sm text-orange-900">{justCreated}</p>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">お名前 *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="田中 太郎"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">会社名</label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="TECH CREW"
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">インタビュー日</label>
              <input
                type="date"
                value={form.interview_date}
                onChange={(e) => setForm((f) => ({ ...f, interview_date: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600">言語</label>
              <div className="mt-1 flex gap-2">
                {(['ja', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, lang: l }))}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      form.lang === l
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-orange-400'
                    }`}
                  >
                    {l === 'ja' ? '🇯🇵 日本語' : '🇳🇿 English'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? '作成中...' : '作成'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">
              キャンセル
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">読み込み中...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500">まだリンクがありません。</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <Row key={row.id} row={row} origin={origin} onPatch={handlePatch} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
