'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type LiteClient, type LiteCampaign, type LiteVideo } from '@/lib/supabase'

type CampaignMeta = LiteCampaign & { sessionCount: number; clientName: string }
type ClientWithCampaigns = LiteClient & { campaigns: CampaignMeta[] }
type SessionGroup = { sessionId: string; name: string; date: string; clips: LiteVideo[] }

export default function InternalMasterContent() {
  const [clients, setClients] = useState<ClientWithCampaigns[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignMeta | null>(null)
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set())
  const [sessions, setSessions] = useState<SessionGroup[]>([])
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({})
  const [downloadNames, setDownloadNames] = useState<Record<string, string>>({})
  const [downloading, setDownloading] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loadingVideos, setLoadingVideos] = useState(false)

  const loadAll = useCallback(async () => {
    const { data: clientsData } = await supabase
      .from('lite_clients').select('*').order('created_at', { ascending: false })

    const { data: campaignsData } = await supabase
      .from('lite_campaigns').select('*').order('created_at', { ascending: false })

    const { data: videosData } = await supabase
      .from('lite_videos').select('session_id, campaign_id')

    if (!clientsData || !campaignsData) { setLoading(false); return }

    const sessionsByCampaign = new Map<string, Set<string>>()
    for (const v of videosData || []) {
      if (!sessionsByCampaign.has(v.campaign_id)) sessionsByCampaign.set(v.campaign_id, new Set())
      sessionsByCampaign.get(v.campaign_id)!.add(v.session_id)
    }

    const withCampaigns: ClientWithCampaigns[] = clientsData.map(client => ({
      ...client,
      campaigns: campaignsData
        .filter(c => c.client_id === client.id)
        .map(c => ({
          ...c,
          sessionCount: sessionsByCampaign.get(c.id)?.size ?? 0,
          clientName: client.org_name,
        })),
    }))

    setClients(withCampaigns)
    // Auto-expand all clients
    setExpandedClients(new Set(clientsData.map(c => c.id)))
    setLoading(false)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  const selectCampaign = async (campaign: CampaignMeta) => {
    setSelectedCampaign(campaign)
    setSessions([])
    setVideoUrls({})
    setDownloadNames({})
    setLoadingVideos(true)

    const { data: videos } = await supabase
      .from('lite_videos').select('*')
      .eq('campaign_id', campaign.id)
      .order('created_at', { ascending: false })

    const vids = videos || []

    // Group by session
    const map = new Map<string, LiteVideo[]>()
    for (const v of vids) {
      if (!map.has(v.session_id)) map.set(v.session_id, [])
      map.get(v.session_id)!.push(v)
    }
    const grouped: SessionGroup[] = Array.from(map.entries()).map(([sid, clips]) => ({
      sessionId: sid,
      name: clips[0]?.respondent_name || '名前未入力',
      date: clips[0]?.created_at,
      clips: clips.sort((a, b) => a.question_index - b.question_index),
    }))
    setSessions(grouped)

    // Load signed view URLs + build download filenames
    const viewUrls: Record<string, string> = {}
    const names: Record<string, string> = {}
    await Promise.all(vids.map(async (v) => {
      const { data } = await supabase.storage
        .from('tesutemo-lite-videos').createSignedUrl(v.storage_path, 3600)
      if (data) viewUrls[v.id] = data.signedUrl
      const respondentName = v.respondent_name || '名前未入力'
      names[v.id] = `${campaign.name}_${respondentName}_Q${v.question_index + 1}.mp4`
    }))
    setVideoUrls(viewUrls)
    setDownloadNames(names)
    setLoadingVideos(false)
  }

  const downloadVideo = async (videoId: string) => {
    const url = videoUrls[videoId]
    const filename = downloadNames[videoId] || 'video.mp4'
    if (!url) return
    setDownloading(videoId)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = filename
      a.click()
      URL.revokeObjectURL(objectUrl)
    } finally {
      setDownloading(null)
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('このキャンペーンを削除しますか？動画も全て削除されます。')) return
    await fetch(`/api/lite/campaigns/${id}`, { method: 'DELETE' })
    if (selectedCampaign?.id === id) setSelectedCampaign(null)
    await loadAll()
  }

  const deleteClient = async (client: ClientWithCampaigns) => {
    if (!confirm(`「${client.org_name}」を削除しますか？\nこの依頼者の全キャンペーン・動画も削除されます。`)) return
    const res = await fetch(`/api/lite/clients/${client.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      alert(`削除に失敗しました\n${body.error || res.status}`)
      return
    }
    if (selectedCampaign && client.campaigns.some(c => c.id === selectedCampaign.id)) {
      setSelectedCampaign(null)
    }
    await loadAll()
  }

  const toggleClient = (clientId: string) => {
    setExpandedClients(prev => {
      const next = new Set(prev)
      if (next.has(clientId)) { next.delete(clientId) } else { next.add(clientId) }
      return next
    })
  }

  const totalCampaigns = clients.reduce((n, c) => n + c.campaigns.length, 0)
  const totalResponses = clients.reduce((n, c) => n + c.campaigns.reduce((m, p) => m + p.sessionCount, 0), 0)

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-400">読み込み中...</p>
    </div>
  )

  return (
    <div className="flex-1 flex min-h-0">

      {/* ── Left sidebar ── */}
      <div className="w-[30%] min-w-[240px] border-r border-gray-200 bg-white flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 mb-0.5">TesuTemoライト</p>
          <h1 className="text-base font-bold text-gray-900">内部管理画面</h1>
          <div className="flex gap-3 mt-2">
            <span className="text-xs text-gray-400">{clients.length}社</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{totalCampaigns}キャンペーン</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{totalResponses}名回答</span>
          </div>
        </div>

        {/* Client + campaign list */}
        <div className="flex-1 overflow-y-auto">
          {clients.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">まだ登録がありません</p>
          ) : clients.map(client => (
            <div key={client.id}>
              {/* Client row */}
              <div className="flex items-center bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors group">
                <button
                  onClick={() => toggleClient(client.id)}
                  className="flex-1 flex items-center justify-between px-4 py-2.5 text-left min-w-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-700 truncate">{client.org_name}</p>
                    <p className="text-xs text-gray-400">{client.name} · {client.campaigns.length}件</p>
                  </div>
                  <span className="text-gray-300 text-xs shrink-0 ml-2">
                    {expandedClients.has(client.id) ? '▲' : '▼'}
                  </span>
                </button>
                <button
                  onClick={() => deleteClient(client)}
                  className="px-3 py-2.5 text-gray-300 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100 shrink-0"
                  title="この依頼者を削除"
                >
                  削除
                </button>
              </div>

              {/* Campaign rows */}
              {expandedClients.has(client.id) && client.campaigns.map(campaign => (
                <button
                  key={campaign.id}
                  onClick={() => selectCampaign(campaign)}
                  className={`w-full text-left px-4 py-2.5 border-b border-gray-50 transition-colors pl-6 ${
                    selectedCampaign?.id === campaign.id
                      ? 'bg-orange-50 border-l-2 border-l-orange-400'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-sm font-medium truncate ${
                    selectedCampaign?.id === campaign.id ? 'text-orange-600' : 'text-gray-700'
                  }`}>
                    {campaign.name}
                  </p>
                  <div className="flex gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-400">{campaign.sessionCount}名回答</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{campaign.questions.length}問</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{new Date(campaign.created_at).toLocaleDateString('ja-JP')}</span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 overflow-y-auto bg-gray-50">

        {!selectedCampaign ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">左からキャンペーンを選んでください</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-8 py-8 space-y-5">

            {/* Title */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{selectedCampaign.clientName}</p>
                <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedCampaign.questions.length}問 · 作成日 {new Date(selectedCampaign.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <button
                onClick={() => deleteCampaign(selectedCampaign.id)}
                className="text-gray-300 hover:text-red-400 transition-colors text-sm mt-1"
                title="キャンペーンを削除"
              >
                削除
              </button>
            </div>

            {/* Questions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">質問内容</p>
              <div className="space-y-2">
                {selectedCampaign.questions.map((q, i) => (
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
                  https://www.tesutemo.co/lite/record/{selectedCampaign.id}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://www.tesutemo.co/lite/record/${selectedCampaign.id}`)
                    setCopiedId(selectedCampaign.id)
                    setTimeout(() => setCopiedId(null), 2000)
                  }}
                  className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold border transition-colors"
                  style={copiedId === selectedCampaign.id
                    ? { borderColor: '#e95228', color: '#e95228', backgroundColor: '#fff7f5' }
                    : { borderColor: '#d1d5db', color: '#6b7280' }}
                >
                  {copiedId === selectedCampaign.id ? 'コピー済み ✓' : 'リンクをコピー'}
                </button>
              </div>
            </div>

            {/* Responses */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                回答一覧 ({selectedCampaign.sessionCount}名)
              </p>

              {loadingVideos ? (
                <p className="text-sm text-gray-400 text-center py-6">動画を読み込み中...</p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">まだ回答がありません</p>
              ) : (
                <div className="space-y-8">
                  {sessions.map(session => (
                    <div key={session.sessionId}>
                      {/* Session header */}
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-800">{session.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(session.date).toLocaleDateString('ja-JP')}
                        </span>
                      </div>

                      {/* Video clips */}
                      <div className="space-y-4">
                        {session.clips.map(clip => (
                          <div key={clip.id} className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* Clip header */}
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                              <span className="text-xs text-gray-600 font-medium">
                                <span className="text-orange-500 font-bold">Q{clip.question_index + 1}</span>
                                {' · '}
                                {selectedCampaign.questions[clip.question_index]}
                              </span>
                              {videoUrls[clip.id] && (
                                <button
                                  onClick={() => downloadVideo(clip.id)}
                                  disabled={downloading === clip.id}
                                  className="text-xs font-bold px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-colors shrink-0 ml-3 disabled:opacity-50"
                                >
                                  {downloading === clip.id ? '取得中...' : '⬇ ダウンロード'}
                                </button>
                              )}
                            </div>

                            {/* Video player */}
                            {videoUrls[clip.id] ? (
                              <video
                                src={videoUrls[clip.id]}
                                controls
                                playsInline
                                className="w-full bg-black"
                                style={{ maxHeight: 320 }}
                              />
                            ) : (
                              <div className="h-40 bg-gray-100 flex items-center justify-center">
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

          </div>
        )}
      </div>
    </div>
  )
}
