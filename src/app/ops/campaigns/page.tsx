'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SurveyCampaign } from '@/lib/survey'

type CampaignWithCount = SurveyCampaign & { respondentCount: number }

type FormState = {
  name: string
  client_label: string
  intro: string
  max_seconds: number
  deadline: string
  logo_url: string
  lang: 'en' | 'jp'
  prompts: { text: string }[]
}

const BLANK_FORM: FormState = {
  name: '', client_label: '', intro: '', max_seconds: 90,
  deadline: '', logo_url: '', lang: 'en', prompts: [{ text: '' }],
}

function buildPayload(form: FormState) {
  const isJp = form.lang === 'jp'
  return {
    name: form.name,
    client_label: form.client_label,
    intro_jp: isJp ? form.intro : '',
    intro_en: isJp ? '' : form.intro,
    max_seconds: form.max_seconds,
    deadline: form.deadline,
    logo_url: form.logo_url,
    lang: form.lang,
    prompts: form.prompts.map(p => ({
      text_jp: isJp ? p.text : '',
      text_en: isJp ? '' : p.text,
    })),
  }
}

function CampaignForm({
  title, form, setForm, onSubmit, onCancel, saving, submitLabel,
}: {
  title: string
  form: FormState
  setForm: (fn: (f: FormState) => FormState) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  saving: boolean
  submitLabel: string
}) {
  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }
  function setPrompt(i: number, val: string) {
    setForm(f => { const p = [...f.prompts]; p[i] = { text: val }; return { ...f, prompts: p } })
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600">キャンペーン名 *</label>
          <input value={form.name} onChange={e => setField('name', e.target.value)} className="block w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">クライアント名</label>
          <input value={form.client_label} onChange={e => setField('client_label', e.target.value)} className="block w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">言語 / Language</label>
        <div className="flex gap-2 mt-1">
          {(['en', 'jp'] as const).map(l => (
            <button key={l} type="button" onClick={() => setField('lang', l)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${form.lang === l ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'}`}>
              {l === 'en' ? '🇳🇿 English' : '🇯🇵 日本語'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600">{form.lang === 'jp' ? '説明文' : 'Introduction'}</label>
        <textarea
          value={form.intro}
          onChange={e => setField('intro', e.target.value)}
          placeholder={form.lang === 'jp' ? 'スマホやパソコンから、短い音声または動画で返信してください。' : 'Leave a short voice or video reply, right from your phone or computer.'}
          className="block w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400 h-20 resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600">最大秒数</label>
          <input type="number" value={form.max_seconds} onChange={e => setField('max_seconds', +e.target.value)} className="block w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400" min={10} max={300} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">締切日</label>
          <input type="date" value={form.deadline} onChange={e => setField('deadline', e.target.value)} className="block w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600">ロゴURL</label>
          <input value={form.logo_url} onChange={e => setField('logo_url', e.target.value)} className="block w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">{form.lang === 'jp' ? '質問（最大3問）*' : 'Questions (max 3) *'}</label>
          {form.prompts.length < 3 && (
            <button type="button" onClick={() => setForm(f => ({ ...f, prompts: [...f.prompts, { text: '' }] }))} className="text-xs text-orange-600">
              + {form.lang === 'jp' ? '追加' : 'Add'}
            </button>
          )}
        </div>
        {form.prompts.map((p, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Q{i + 1}</span>
              {form.prompts.length > 1 && (
                <button type="button" onClick={() => setForm(f => ({ ...f, prompts: f.prompts.filter((_, j) => j !== i) }))} className="text-xs text-red-500">
                  {form.lang === 'jp' ? '削除' : 'Remove'}
                </button>
              )}
            </div>
            <input value={p.text} onChange={e => setPrompt(i, e.target.value)}
              placeholder={form.lang === 'jp' ? '質問テキスト' : 'Question text'}
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-400" required />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="bg-orange-500 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50">
          {saving ? '保存中...' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-gray-500 px-4 py-2">キャンセル</button>
      </div>
    </form>
  )
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(BLANK_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(BLANK_FORM)
  const [editSaving, setEditSaving] = useState(false)

  useEffect(() => {
    fetch('/api/survey/admin/campaigns')
      .then(r => r.json())
      .then(data => { setCampaigns(data); setLoading(false) })
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/survey/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(form)),
    })
    if (res.ok) {
      const campaign = await res.json()
      setCampaigns(prev => [{ ...campaign, respondentCount: 0 }, ...prev])
      setShowForm(false)
      setForm(BLANK_FORM)
    }
    setSaving(false)
  }

  async function startEdit(c: CampaignWithCount) {
    // Load prompts for this campaign
    const { prompts } = await fetch(`/api/survey/campaign/${c.id}`).then(r => r.json())
    const isJp = c.lang === 'jp'
    setEditForm({
      name: c.name,
      client_label: c.client_label ?? '',
      intro: isJp ? (c.intro_jp ?? '') : (c.intro_en ?? ''),
      max_seconds: c.max_seconds,
      deadline: c.deadline ?? '',
      logo_url: c.logo_url ?? '',
      lang: c.lang,
      prompts: prompts.map((p: { text_en: string; text_jp: string }) => ({
        text: isJp ? p.text_jp : p.text_en,
      })),
    })
    setEditingId(c.id)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    setEditSaving(true)
    const res = await fetch(`/api/survey/admin/campaigns/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(editForm)),
    })
    if (res.ok) {
      const updated = await res.json()
      setCampaigns(prev => prev.map(c => c.id === editingId ? { ...c, ...updated } : c))
      setEditingId(null)
    }
    setEditSaving(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    await fetch(`/api/survey/admin/campaigns/${id}`, { method: 'DELETE' })
    setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  const shareBase = typeof window !== 'undefined' ? window.location.origin : 'https://www.tesutemo.co'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">キャンペーン一覧</h1>
        <button onClick={() => setShowForm(f => !f)} className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
          + 新規作成
        </button>
      </div>

      {showForm && (
        <CampaignForm
          title="新しいキャンペーン"
          form={form}
          setForm={setForm}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          saving={saving}
          submitLabel="作成する"
        />
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500 text-sm">まだキャンペーンがありません</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id}>
              {editingId === c.id ? (
                <CampaignForm
                  title={`編集: ${c.name}`}
                  form={editForm}
                  setForm={setEditForm}
                  onSubmit={handleSave}
                  onCancel={() => setEditingId(null)}
                  saving={editSaving}
                  submitLabel="保存する"
                />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900">{c.name}</h2>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.lang === 'jp' ? '🇯🇵 JP' : '🇳🇿 EN'}</span>
                      </div>
                      {c.client_label && <p className="text-sm text-gray-500">{c.client_label}</p>}
                      <p className="text-xs text-gray-400 mt-1">{c.respondentCount} 件の回答</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/ops/${c.id}`} className="text-sm text-orange-600 font-medium">回答を見る →</Link>
                      <button onClick={() => startEdit(c)} className="text-xs text-gray-500 hover:text-gray-800">編集</button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="text-xs text-red-400 hover:text-red-600">削除</button>
                    </div>
                  </div>

                  <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate">{shareBase}/s/{c.id}</span>
                    <button onClick={() => navigator.clipboard.writeText(`${shareBase}/s/${c.id}`)} className="text-xs text-orange-600 ml-2 shrink-0">
                      コピー
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #e95228;
        }
      `}</style>
    </div>
  )
}
