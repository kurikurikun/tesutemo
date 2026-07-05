'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type LiteClient, type LiteCampaign, type LiteVideo } from '@/lib/supabase'

const FREE_LIMIT = 3

type CampaignWithVideos = LiteCampaign & {
  videos: LiteVideo[]
  sessionCount: number
}

export default function InternalContent({ clientId }: { clientId: string }) {
  const [client, setClient] = useState<LiteClient | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignWithVideos[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', questions: [''] })
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({})

  const loadData = useCallback(async () => {
    const { data: clientData } = await supabase
      .from('lite_clients')
      .select('*')
      .eq('id', clientId)
      .single()
    setClient(clientData)

    const { data: campaignsData } = await supabase
      .from('lite_campaigns')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (campaignsData) {
      const withVideos = await Promise.all(
        campaignsData.map(async (c) => {
          const { data: videos } = await supabase
            .from('lite_videos')
            .select('*')
            .eq('campaign_id', c.id)
            .order('created_at', { ascending: false })
          const vids = videos || []
          const sessions = new Set(vids.map(v => v.session_id))
          return { ...c, videos: vids, sessionCount: sessions.size }
        })
      )
      setCampaigns(withVideos)
    }
    setLoading(false)
  }, [clientId])

  useEffect(() => { loadData() }, [loadData])

  const copyLink = (campaignId: string) => {
    const url = `${window.location.origin}/lite/record/${campaignId}`
    navigator.clipboard.writeText(url)
    setCopiedId(campaignId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const loadVideoUrls = async (videos: LiteVideo[]) => {
    const urls: Record<string, string> = {}
    await Promise.all(
      videos.map(async (v) => {
        const { data } = await supabase.storage
          .from('tesutemo-lite-videos')
          .createSignedUrl(v.storage_path, 3600)
        if (data) urls[v.id] = data.signedUrl
      })
    )
    setVideoUrls(prev => ({ ...prev, ...urls }))
  }

  const toggleExpand = async (campaign: CampaignWithVideos) => {
    if (expandedId === campaign.id) {
      setExpandedId(null)
    } else {
      setExpandedId(campaign.id)
      await loadVideoUrls(campaign.videos)
    }
  }

  const addQuestion = () => {
    if (newCampaign.questions.length < 5) {
      setNewCampaign(f => ({ ...f, questions: [...f.questions, ''] }))
    }
  }

  const updateQuestion = (i: number, val: string) => {
    setNewCampaign(f => {
      const q = [...f.questions]
      q[i] = val
      return { ...f, questions: q }
    })
  }

  const removeQuestion = (i: number) => {
    setNewCampaign(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }))
  }

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
    if (!confirm('このキャンペーンを削除しますか？動画も全て削除されます。')) return
    await fetch(`/api/lite/campaigns/${id}`, { method: 'DELETE' })
    await loadData()
  }

  // Group videos by session
  const groupBySessions = (videos: LiteVideo[]) => {
    const map = new Map<string, LiteVideo[]>()
    for (const v of videos) {
      if (!map.has(v.session_id)) map.set(v.session_id, [])
      map.get(v.session_id)!.push(v)
    }
    return Array.from(map.entries()).map(([sessionId, vids]) => ({
      sessionId,
      name: vids[0]?.respondent_name || '名前未入力',
      date: vids[0]?.created_at,
      clips: vids.sort((a, b) => a.question_index - b.question_index),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">クライアントが見つかりません</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">{client.org_name}</p>
        <h1 className="text-2xl font-bold text-gray-900">管理画面 <span className="text-sm font-normal text-orange-400">[internal]</span></h1>
      </div>

      {/* New campaign button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#e95228' }}
        >
          {showNewForm ? 'キャンセル' : '＋ キャンペーンを作成'}
        </button>
      </div>

      {/* New campaign form */}
      {showNewForm && (
        <form onSubmit={createCampaign} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="font-bold text-gray-900">新しいキャンペーン</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              キャンペーン名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newCampaign.name}
              onChange={e => setNewCampaign(f => ({ ...f, name: e.target.value }))}
              placeholder="例：2025年度 採用動画"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              質問（最大5問）
            </label>
            <div className="space-y-2">
              {newCampaign.questions.map((q, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-gray-400 w-5 text-right shrink-0">Q{i + 1}</span>
                  <input
                    type="text"
                    required
                    value={q}
                    onChange={e => updateQuestion(i, e.target.value)}
                    placeholder={i === 0 ? '例：入社のきっかけを教えてください' : '質問を入力'}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {newCampaign.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(i)} className="text-gray-400 hover:text-red-400 text-lg leading-none">×</button>
                  )}
                </div>
              ))}
            </div>
            {newCampaign.questions.length < 5 && (
              <button
                type="button"
                onClick={addQuestion}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                ＋ 質問を追加
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60"
            style={{ backgroundColor: '#e95228' }}
          >
            {creating ? '作成中...' : '作成する'}
          </button>
        </form>
      )}

      {/* Campaign list */}
      {campaigns.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">キャンペーンがまだありません</p>
          <p className="text-sm">「＋ キャンペーンを作成」から始めてください</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map(campaign => {
            const isExpanded = expandedId === campaign.id
            const sessions = groupBySessions(campaign.videos)
            const overLimit = campaign.sessionCount >= FREE_LIMIT

            return (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {/* Campaign header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{campaign.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {campaign.questions.length}問 ·{' '}
                        {new Date(campaign.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {campaign.sessionCount}名
                      </span>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="text-gray-300 hover:text-red-400 text-sm"
                        title="削除"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Questions list */}
                  <div className="mt-3 space-y-1">
                    {campaign.questions.map((q, i) => (
                      <div key={i} className="flex gap-2 text-xs text-gray-500">
                        <span className="font-bold text-orange-400 shrink-0">Q{i + 1}</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recording link */}
                  <div className="mt-3 flex gap-2 items-center">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 truncate font-mono">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/lite/record/{campaign.id}
                    </div>
                    <button
                      onClick={() => copyLink(campaign.id)}
                      className="shrink-0 px-3 py-2 rounded-lg text-xs font-bold border transition-colors"
                      style={copiedId === campaign.id
                        ? { borderColor: '#e95228', color: '#e95228' }
                        : { borderColor: '#d1d5db', color: '#6b7280' }
                      }
                    >
                      {copiedId === campaign.id ? 'コピー済み ✓' : 'リンクをコピー'}
                    </button>
                  </div>

                  {/* Limit CTA */}
                  {overLimit && (
                    <div className="mt-3 p-3 rounded-xl border border-orange-200 bg-orange-50">
                      <p className="text-sm font-bold text-orange-700 mb-1">
                        無料枠（3名）に達しました 🎉
                      </p>
                      <p className="text-xs text-orange-600 mb-2">
                        プロのインタビュアーによる本格的な動画取材は、テステモ本サービスへ。
                      </p>
                      <a
                        href="https://www.tesutemo.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                        style={{ backgroundColor: '#e95228' }}
                      >
                        テステモについて詳しく →
                      </a>
                    </div>
                  )}

                  {/* Questions preview */}
                  <div className="mt-3">
                    <button
                      onClick={() => toggleExpand(campaign)}
                      className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <span>{isExpanded ? '▲ 閉じる' : `▼ 回答を見る（${campaign.sessionCount}名）`}</span>
                    </button>
                  </div>
                </div>

                {/* Videos */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    {sessions.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        まだ動画が届いていません
                      </p>
                    ) : (
                      <div className="space-y-5">
                        {sessions.map(session => (
                          <div key={session.sessionId}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-bold text-gray-700">{session.name}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(session.date).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {session.clips.map((clip) => (
                                <div key={clip.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                  <div className="px-3 py-1.5 border-b border-gray-100">
                                    <span className="text-xs text-gray-500 font-medium">
                                      Q{clip.question_index + 1} · {campaign.questions[clip.question_index]}
                                    </span>
                                  </div>
                                  {videoUrls[clip.id] ? (
                                    <video
                                      src={videoUrls[clip.id]}
                                      controls
                                      className="w-full aspect-video bg-black"
                                      style={{ maxHeight: 200 }}
                                    />
                                  ) : (
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                      <span className="text-xs text-gray-400">読み込み中...</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
