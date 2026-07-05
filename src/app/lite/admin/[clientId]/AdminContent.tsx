'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type LiteClient, type LiteCampaign } from '@/lib/supabase'

const FREE_LIMIT = 3

type CampaignWithCount = LiteCampaign & { sessionCount: number }

export default function AdminPage({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<LiteClient | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', questions: [''] })
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const { data: clientData } = await supabase
      .from('lite_clients').select('*').eq('id', clientId).single()
    setClient(clientData)

    const { data: campaignsData } = await supabase
      .from('lite_campaigns').select('*').eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (campaignsData) {
      const withCounts = await Promise.all(
        campaignsData.map(async (c) => {
          const { data: videos } = await supabase
            .from('lite_videos').select('session_id').eq('campaign_id', c.id)
          const sessionCount = new Set((videos || []).map(v => v.session_id)).size
          return { ...c, sessionCount }
        })
      )
      setCampaigns(withCounts)
    }
    setLoading(false)
  }, [clientId])

  useEffect(() => { loadData() }, [loadData])

  const copyLink = (campaignId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/lite/record/${campaignId}`)
    setCopiedId(campaignId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const addQuestion = () => {
    if (newCampaign.questions.length < 5)
      setNewCampaign(f => ({ ...f, questions: [...f.questions, ''] }))
  }

  const updateQuestion = (i: number, val: string) =>
    setNewCampaign(f => { const q = [...f.questions]; q[i] = val; return { ...f, questions: q } })

  const removeQuestion = (i: number) =>
    setNewCampaign(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }))

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    const questions = newCampaign.questions.filter(q => q.trim())
    const res = await fetch('/api/lite/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, name: newCampaign.name, questions }),
    })
    if (res.ok) {
      setNewCampaign({ name: '', questions: [''] })
      setShowNewForm(false)
      await loadData()
    }
    setCreating(false)
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('このキャンペーンを削除しますか？')) return
    await fetch(`/api/lite/campaigns/${id}`, { method: 'DELETE' })
    setSelectedId(null)
    await loadData()
  }

  const selected = campaigns.find(c => c.id === selectedId) ?? null

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-400">読み込み中...</p>
    </div>
  )

  if (!client) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-500">クライアントが見つかりません</p>
    </div>
  )

  return (
    <div className="flex-1 flex min-h-0">

      {/* ── Left sidebar 30% ── */}
      <div className="w-[30%] min-w-[220px] border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 mb-0.5">{client.org_name}</p>
          <button
            onClick={() => { setSelectedId(null); setShowNewForm(false) }}
            className="text-base font-bold text-gray-900 hover:text-orange-500 transition-colors text-left"
            title="管理画面トップへ戻る"
          >
            管理画面トップ
          </button>
        </div>

        {/* New campaign button */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button
            onClick={() => { setShowNewForm(true); setSelectedId(null) }}
            className="w-full py-2 rounded-lg text-sm font-bold text-white text-center"
            style={{ backgroundColor: '#e95228' }}
          >
            ＋ キャンペーンを作成
          </button>
        </div>

        {/* Campaign list */}
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">キャンペーン</p>
          {campaigns.length === 0 && !showNewForm ? (
            <p className="text-xs text-gray-400 text-center py-8 px-4">まだキャンペーンがありません</p>
          ) : (
            campaigns.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedId(c.id); setShowNewForm(false) }}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                  selectedId === c.id ? 'bg-orange-50 border-l-2 border-l-orange-400' : 'hover:bg-gray-50'
                }`}
              >
                <p className={`text-sm font-medium truncate ${selectedId === c.id ? 'text-orange-600' : 'text-gray-800'}`}>
                  {c.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{c.sessionCount}名回答</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{c.questions.length}問</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right panel 70% ── */}
      <div className="flex-1 overflow-y-auto bg-gray-50">

        {/* New campaign form */}
        {showNewForm && (
          <div className="max-w-xl mx-auto px-8 py-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">新しいキャンペーン</h2>
            <form onSubmit={createCampaign} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  キャンペーン名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" required value={newCampaign.name}
                  onChange={e => setNewCampaign(f => ({ ...f, name: e.target.value }))}
                  placeholder="例：2025年度 採用動画"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">質問（最大5問）</label>
                <div className="space-y-2">
                  {newCampaign.questions.map((q, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs text-gray-400 w-5 text-right shrink-0">Q{i + 1}</span>
                      <input
                        type="text" required value={q}
                        onChange={e => updateQuestion(i, e.target.value)}
                        placeholder={i === 0 ? '例：入社のきっかけを教えてください' : '質問を入力'}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      {newCampaign.questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(i)}
                          className="text-gray-400 hover:text-red-400 text-lg leading-none">×</button>
                      )}
                    </div>
                  ))}
                </div>
                {newCampaign.questions.length < 5 && (
                  <button type="button" onClick={addQuestion}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700">
                    ＋ 質問を追加
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creating}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60"
                  style={{ backgroundColor: '#e95228' }}>
                  {creating ? '作成中...' : '作成する'}
                </button>
                <button type="button" onClick={() => setShowNewForm(false)}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50">
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaign detail */}
        {selected && !showNewForm && (
          <div className="max-w-xl mx-auto px-8 py-8 space-y-5">

            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.questions.length}問 · {new Date(selected.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <button onClick={() => deleteCampaign(selected.id)}
                className="text-gray-300 hover:text-red-400 text-sm mt-1" title="削除">🗑</button>
            </div>

            {/* Questions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">質問内容</p>
              <div className="space-y-2">
                {selected.questions.map((q, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="font-bold text-orange-500 shrink-0">Q{i + 1}</span>
                    <span className="text-gray-700">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recording link */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">録画リンク</p>
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 truncate font-mono">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/lite/record/{selected.id}
                </div>
                <button
                  onClick={() => copyLink(selected.id)}
                  className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold border transition-colors"
                  style={copiedId === selected.id
                    ? { borderColor: '#e95228', color: '#e95228', backgroundColor: '#fff7f5' }
                    : { borderColor: '#d1d5db', color: '#6b7280' }}
                >
                  {copiedId === selected.id ? 'コピー済み ✓' : 'リンクをコピー'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">このリンクを体験者に送ってください</p>
            </div>

            {/* Response status */}
            {selected.sessionCount >= FREE_LIMIT ? (
              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50">
                <p className="text-sm font-bold text-orange-700 mb-1">無料枠（3名）に達しました 🎉</p>
                <p className="text-xs text-orange-600 mb-3">
                  プロのインタビュアーによる本格的な動画取材は、テステモ本サービスへ。
                </p>
                <a href="https://www.tesutemo.co" target="_blank" rel="noopener noreferrer"
                  className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: '#e95228' }}>
                  テステモについて詳しく →
                </a>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{selected.sessionCount}名が回答済み</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    あと{FREE_LIMIT - selected.sessionCount}名まで無料で録画できます
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(FREE_LIMIT)].map((_, i) => (
                    <span key={i} className={`w-3 h-3 rounded-full ${i < selected.sessionCount ? 'bg-orange-400' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* How-to flow — shown when nothing is selected */}
        {!selected && !showNewForm && (
          <div className="max-w-xl mx-auto px-8 py-8">
            <h2 className="text-lg font-bold text-gray-900 mb-1">TesuTemoライトの使い方</h2>
            <p className="text-sm text-gray-400 mb-8">4ステップで動画インタビューを収集できます</p>

            <div className="space-y-3">

              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: '#e95228' }}>1</div>
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">キャンペーンを作成する</p>
                  <p className="text-xs text-gray-500">左上の「＋ キャンペーンを作成」をクリック。キャンペーン名と、体験者に聞きたい質問（最大5問）を入力して作成します。</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex gap-4 items-center">
                <div className="shrink-0 w-9 flex justify-center">
                  <div className="w-0.5 h-5 bg-gray-200" />
                </div>
                <div />
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: '#e95228' }}>2</div>
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">録画リンクを体験者に送る</p>
                  <p className="text-xs text-gray-500">作成したキャンペーンを選び、「リンクをコピー」。メール・LINE・チャットなど、好きな方法で体験者に送ってください。</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex gap-4 items-center">
                <div className="shrink-0 w-9 flex justify-center">
                  <div className="w-0.5 h-5 bg-gray-200" />
                </div>
                <div />
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: '#e95228' }}>3</div>
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">体験者が動画を録画する</p>
                  <p className="text-xs text-gray-500">体験者はリンクにアクセスして、スマートフォンやPCのカメラで質問に動画で回答します。録画が完了すると、あなたにメールでお知らせします。</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex gap-4 items-center">
                <div className="shrink-0 w-9 flex justify-center">
                  <div className="w-0.5 h-5 bg-gray-200" />
                </div>
                <div />
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: '#e95228' }}>4</div>
                <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">テステモが編集・納品</p>
                  <p className="text-xs text-gray-500">録画された動画をテステモのスタッフが確認し、約1週間で編集済み動画をお届けします。</p>
                </div>
              </div>

            </div>

            <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
              <p className="text-xs text-orange-700 font-medium mb-0.5">💡 まずはキャンペーンを作成しましょう</p>
              <p className="text-xs text-orange-600">無料プランでは3名まで録画できます。左上のボタンから始めてください。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
