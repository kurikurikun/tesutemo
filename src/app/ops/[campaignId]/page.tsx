'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { SurveyResponse, SurveyRespondent } from '@/lib/survey'

function DownloadButton({ responseId }: { responseId: string }) {
  return (
    <div className="mt-1">
      <a href={`/api/survey/download/${responseId}`} download
        className="text-xs text-gray-500 hover:text-orange-600 transition">
        ↓ ダウンロード
      </a>
    </div>
  )
}

function AudioPlayer({ src }: { src: string }) {
  // Direct file URL (Supabase) — plain audio element works fine
  if (!src.includes('.m3u8')) {
    return <audio src={src} controls className="w-full mt-1" />
  }

  // HLS manifest (legacy CF Stream audio) — needs HLS.js on Chrome
  return <HLSAudio src={src} />
}

function HLSAudio({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = src
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(src)
          hls.attachMedia(audio)
        }
      })
    }
  }, [src])

  return <audio ref={audioRef} controls className="w-full mt-1" />
}

type ResponseWithPrompt = SurveyResponse & { prompt?: { text_jp: string; text_en: string } }
type RespondentWithResponses = SurveyRespondent & { responses: ResponseWithPrompt[] }

const STATUS_LABELS: Record<string, string> = {
  new: '未確認',
  shortlisted: '★ショートリスト',
  contacted: '連絡済み',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-gray-100 text-gray-700',
  shortlisted: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-green-100 text-green-800',
}

export default function ResponsesPage() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const [respondents, setRespondents] = useState<RespondentWithResponses[]>([])
  const [loading, setLoading] = useState(true)
  const [playUrls, setPlayUrls] = useState<Record<string, { url: string; media_type: string }>>({})
  const [loadingPlay, setLoadingPlay] = useState<Record<string, boolean>>({})
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/survey/admin/responses/${campaignId}`)
      .then(r => r.json())
      .then(data => { setRespondents(data); setLoading(false) })
  }, [campaignId])

  const getPlayUrl = useCallback(async (responseId: string) => {
    if (playUrls[responseId] || loadingPlay[responseId]) return
    setLoadingPlay(p => ({ ...p, [responseId]: true }))
    const res = await fetch(`/api/survey/play/${responseId}`)
    const { url, media_type } = await res.json()
    setPlayUrls(p => ({ ...p, [responseId]: { url, media_type } }))
    setLoadingPlay(p => ({ ...p, [responseId]: false }))
  }, [playUrls, loadingPlay])

  async function updateResponse(responseId: string, patch: Partial<{ flagged: boolean; status: string; notes: string }>) {
    await fetch(`/api/survey/admin/response/${responseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setRespondents(prev =>
      prev.map(r => ({
        ...r,
        responses: r.responses.map(res =>
          res.id === responseId ? { ...res, ...patch } as ResponseWithPrompt : res
        ),
      })) as RespondentWithResponses[]
    )
  }

  const shortlistedCount = respondents.filter(r =>
    r.responses.some(res => res.status === 'shortlisted')
  ).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/ops/campaigns" className="text-sm text-gray-500 hover:text-gray-900">← キャンペーン一覧</Link>
          <h1 className="text-xl font-bold text-gray-900">回答一覧</h1>
        </div>
        <a
          href={`/api/survey/admin/export/${campaignId}`}
          className="flex items-center gap-1.5 text-sm text-white bg-orange-500 px-4 py-2 rounded-lg font-medium"
        >
          ↓ CSV ({shortlistedCount}名)
        </a>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : respondents.length === 0 ? (
        <p className="text-gray-500 text-sm">まだ回答がありません</p>
      ) : (
        <div className="space-y-4">
          {respondents.map(respondent => (
            <div key={respondent.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Respondent header */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{respondent.name}</span>
                  <span className="text-sm text-gray-500 ml-2">{respondent.email}</span>
                  {respondent.cohort_role && (
                    <span className="text-xs text-gray-400 ml-2">・{respondent.cohort_role}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(respondent.created_at).toLocaleDateString('ja-JP')} {new Date(respondent.created_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Responses */}
              <div className="divide-y divide-gray-50">
                {respondent.responses.map(response => (
                  <div key={response.id} className="p-4 space-y-3">
                    {/* Question */}
                    {response.prompt && (
                      <p className="text-sm font-medium text-gray-700">{response.prompt.text_jp}</p>
                    )}

                    {/* Video / audio player */}
                    {response.cf_uid && (
                      <div>
                        {playUrls[response.id] ? (
                          <>
                            {playUrls[response.id].media_type === 'audio' ? (
                              <AudioPlayer src={playUrls[response.id].url} />
                            ) : playUrls[response.id].url.includes('videodelivery.net') ? (
                              <iframe
                                src={playUrls[response.id].url}
                                className="w-full rounded-lg"
                                style={{ height: 240 }}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={playUrls[response.id].url}
                                controls
                                className="w-full rounded-lg"
                                style={{ maxHeight: 400 }}
                              />
                            )}
                            <DownloadButton responseId={response.id} />
                          </>
                        ) : (
                          <button
                            onClick={() => getPlayUrl(response.id)}
                            disabled={loadingPlay[response.id]}
                            className="w-full h-32 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition"
                          >
                            {loadingPlay[response.id] ? '読み込み中...' : response.media_type === 'audio' ? '🎙 音声を再生' : '▶ 動画を再生'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Flag */}
                      <button
                        onClick={() => updateResponse(response.id, { flagged: !response.flagged })}
                        className={`text-sm px-2 py-1 rounded transition ${response.flagged ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
                        title="フラグ"
                      >
                        {response.flagged ? '⭐' : '☆'} フラグ
                      </button>

                      {/* Status */}
                      <select
                        value={response.status}
                        onChange={e => updateResponse(response.id, { status: e.target.value })}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${STATUS_COLORS[response.status] ?? STATUS_COLORS.new}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <textarea
                        value={editingNotes[response.id] ?? response.notes ?? ''}
                        onChange={e => setEditingNotes(n => ({ ...n, [response.id]: e.target.value }))}
                        onBlur={() => {
                          const notes = editingNotes[response.id] ?? response.notes ?? ''
                          updateResponse(response.id, { notes })
                        }}
                        placeholder="メモを追加..."
                        className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 resize-none h-14 focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
