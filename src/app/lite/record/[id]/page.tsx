'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, type LiteCampaign } from '@/lib/supabase'

type Stage =
  | 'loading'
  | 'name_input'
  | 'memo_input'
  | 'intro'
  | 'idle'
  | 'recording'
  | 'preview'
  | 'uploading'
  | 'error'

export default function RecordPage() {
  const { id: campaignId } = useParams<{ id: string }>()
  const router = useRouter()

  const [campaign, setCampaign] = useState<LiteCampaign | null>(null)
  const [orgName, setOrgName] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [respondentName, setRespondentName] = useState('')
  const [respondentAffiliation, setRespondentAffiliation] = useState('')
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([])
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const [selectedAudioId, setSelectedAudioId] = useState('')
  const [showCameraMenu, setShowCameraMenu] = useState(false)
  const [showMicMenu, setShowMicMenu] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes per question
  const TOTAL_TIME = 120
  const [errorMsg, setErrorMsg] = useState('')
  const [memoNotes, setMemoNotes] = useState(['', '', ''])
  const [sessionId] = useState(() => crypto.randomUUID())

  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobEvent['data'][]>([])
  const pendingUploadRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    supabase
      .from('lite_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()
      .then(async ({ data }) => {
        if (!data) { setStage('error'); setErrorMsg('キャンペーンが見つかりません'); return }
        setCampaign(data)
        // Fetch client org name separately
        const { data: client } = await supabase
          .from('lite_clients')
          .select('org_name')
          .eq('id', data.client_id)
          .single()
        if (client?.org_name) setOrgName(client.org_name)
        setStage('name_input')
      })
  }, [campaignId])


  const startCamera = useCallback(async (videoId?: string, audioId?: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoId
          ? { deviceId: { exact: videoId } }
          : { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: audioId ? { deviceId: { exact: audioId } } : true,
      })
      streamRef.current = stream

      // Enumerate devices (labels only available after permission granted)
      const all = await navigator.mediaDevices.enumerateDevices()
      setVideoDevices(all.filter(d => d.kind === 'videoinput'))
      setAudioDevices(all.filter(d => d.kind === 'audioinput'))
      setSelectedVideoId(stream.getVideoTracks()[0]?.getSettings().deviceId ?? '')
      setSelectedAudioId(stream.getAudioTracks()[0]?.getSettings().deviceId ?? '')

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
      }
    } catch {
      setStage('error')
      setErrorMsg('カメラまたはマイクへのアクセスが拒否されました。ブラウザの設定を確認してください。')
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const switchDevice = async (newVideoId: string, newAudioId: string) => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCameraMenu(false)
    setShowMicMenu(false)
    await startCamera(newVideoId, newAudioId)
  }

  useEffect(() => {
    if (stage === 'idle' || stage === 'recording') {
      // Only start camera if not already running — avoids killing an active MediaRecorder
      if (!streamRef.current?.active) startCamera()
      return () => {} // No cleanup here; camera must stay alive through idle→recording transition
    } else {
      stopCamera()
    }
  }, [stage, startCamera, stopCamera])

  // Stop camera on unmount regardless of stage
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  useEffect(() => {
    if (previewUrl && previewRef.current) {
      previewRef.current.src = previewUrl
    }
  }, [previewUrl])

  const startRecording = () => {
    if (!streamRef.current) return
    chunksRef.current = []
    // Prefer MP4 (H.264) for DaVinci Resolve / QuickTime compatibility
    // Chrome 130+ supports video/mp4; Safari/iOS always supports it
    // Fall back to WebM only when MP4 is truly unavailable (Firefox etc.)
    const mimeType = MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4'

    // Record directly from camera stream — produces standard MP4 compatible with QuickTime/DaVinci Resolve
    // Preview mirror is handled by CSS scaleX(-1) on the video element
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType,
      videoBitsPerSecond: 2_500_000, // 2.5 Mbps
      audioBitsPerSecond: 128_000,
    })
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      setCurrentBlob(blob)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setStage('preview')
    }
    recorder.start(100)
    recorderRef.current = recorder
    setTimeLeft(120)
    setStage('recording')
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
  }

  // Countdown timer — auto-stops at 0
  useEffect(() => {
    if (stage !== 'recording') return
    if (timeLeft <= 0) { stopRecording(); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [stage, timeLeft, stopRecording])

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setCurrentBlob(null)
    setStage('idle')
  }

  const uploadOne = async (blob: Blob, index: number): Promise<void> => {
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
    const path = `${campaignId}/${sessionId}/q${index}.${ext}`
    // Convert to ArrayBuffer first — fixes iOS Safari "Load failed" with large blobs
    const buffer = await blob.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('tesutemo-lite-videos')
      .upload(path, buffer, { contentType: blob.type, upsert: true })
    if (uploadError) throw uploadError
    await supabase.from('lite_videos').insert({
      campaign_id: campaignId,
      session_id: sessionId,
      respondent_name: respondentName || null,
      question_index: index,
      storage_path: path,
    })
  }

  const acceptClip = async () => {
    if (!currentBlob || !campaign) return

    const blobToUpload = currentBlob
    const indexToUpload = questionIndex

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setCurrentBlob(null)

    if (questionIndex < campaign.questions.length - 1) {
      // バックグラウンドでアップロード開始、すぐに次の質問へ
      pendingUploadRef.current = uploadOne(blobToUpload, indexToUpload)
      setQuestionIndex(i => i + 1)
      setMemoNotes(['', '', ''])
      setStage('memo_input')
    } else {
      // 最後の質問 — 前の保留アップロードとこの質問を待つ
      setStage('uploading')
      try {
        if (pendingUploadRef.current) {
          await pendingUploadRef.current
          pendingUploadRef.current = null
        }
        await uploadOne(blobToUpload, indexToUpload)
        fetch('/api/lite/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaign_id: campaignId, respondent_name: respondentName, session_id: sessionId }),
        }).catch(() => {})
        router.push('/lite/complete')
      } catch (err) {
        console.error(err)
        setStage('error')
        setErrorMsg('アップロードに失敗しました: ' + String(err))
      }
    }
  }

  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    )
  }

  if (stage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-gray-700 font-medium mb-2">エラーが発生しました</p>
          <p className="text-gray-500 text-sm">{errorMsg}</p>
        </div>
      </div>
    )
  }

  if (stage === 'name_input') {
    const steps = [
      { n: 1, label: 'お名前・所属を入力する' },
      { n: 2, label: `質問ごとに動画で答える（全${campaign?.questions.length ?? ''}問）。撮り直しは何回でも可能です。` },
      { n: 3, label: '全問答え終わったら自動で送信されます。素材はテステモが編集し、公開前にご確認いただいてから共有されます。' },
    ]
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* ── Left: Sample videos (sticky on desktop, below form on mobile) ── */}
            <div className="w-full lg:w-[38%] lg:sticky lg:top-12 shrink-0 order-2 lg:order-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">こんな仕上がりになります</p>
              <div className="space-y-3 max-w-[200px] mx-auto">
                <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden">
                  <iframe
                    src="https://player.vimeo.com/video/1190752323?h=4920292d40&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden">
                  <iframe
                    src="https://player.vimeo.com/video/1191763890?h=f2744b1093&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* ── Right: Info + form (first on mobile) ── */}
            <div className="flex-1 space-y-5 order-1 lg:order-2">

              {/* Header */}
              <div>
                {orgName && (
                  <p className="text-xs font-medium text-orange-500 mb-1">{orgName} より</p>
                )}
                <h1 className="text-xl font-bold text-gray-900">{campaign?.name}</h1>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  これから、カメラに向かって動画でコメントをお願いします。<br />
                  <span className="text-gray-400">あなたが実際に経験したこと、感じたことを、同じことを検討している人への情報として話してください。</span>
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    登録不要
                  </span>
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    アプリ不要
                  </span>
                </div>
              </div>

              {/* Questions */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">質問内容</p>
                <div className="space-y-2">
                  {campaign?.questions.map((q, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="font-bold text-orange-500 shrink-0">Q{i + 1}</span>
                      <span className="text-gray-700">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">録画の流れ</p>
                {steps.map(s => (
                  <div key={s.n} className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: '#e95228' }}
                    >
                      {s.n}
                    </span>
                    <p className="text-sm text-gray-700 pt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filming tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-amber-700 mb-3">撮影のポイント</p>
                <ul className="space-y-2 text-sm text-amber-800 list-disc list-inside">
                  <li>静かな場所で録画する</li>
                  <li>窓を背にしない（逆光NG）。窓を正面に置くと顔が明るく映ります</li>
                  <li>話すときはカメラを見る（画面ではなくレンズを）</li>
                  <li>画面に枠が表示されます。枠に合わせて少し離れ、顔と上半身が映るくらいの距離がベスト</li>
                </ul>
              </div>

              {/* Name + affiliation input */}
              <form
                onSubmit={e => { e.preventDefault(); setStage('memo_input') }}
                className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={respondentName}
                    onChange={e => setRespondentName(e.target.value)}
                    placeholder="山田 花子"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所属 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={respondentAffiliation}
                    onChange={e => setRespondentAffiliation(e.target.value)}
                    placeholder="例：営業部 / 3年生 / 〇〇市在住"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-bold text-white text-sm"
                  style={{ backgroundColor: '#e95228' }}
                >
                  カメラの準備へ進む
                </button>
                <p className="text-xs text-gray-400 text-center">
                  カメラとマイクの使用許可を求める場合があります
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'memo_input') {
    const q = campaign?.questions[questionIndex] ?? ''
    const total = campaign?.questions.length ?? 1
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">

          {/* Question */}
          <div className="text-center">
            <p className="text-xs font-bold text-orange-500 mb-2">Q{questionIndex + 1} / {total}</p>
            <p className="text-base font-bold text-gray-900 leading-snug">{q}</p>
          </div>

          {/* Memo inputs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">話すメモ</p>
              <p className="text-xs text-gray-400 mb-3">録画中にカメラの上に薄く表示されます。任意・3点まで。</p>
              <div className="space-y-2">
                {memoNotes.map((note, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm shrink-0">・</span>
                    <input
                      type="text"
                      value={note}
                      onChange={e => {
                        const next = [...memoNotes]
                        next[i] = e.target.value
                        setMemoNotes(next)
                      }}
                      placeholder={`ポイント ${i + 1}`}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={async () => {
                if (pendingUploadRef.current) {
                  setStage('uploading')
                  try {
                    await pendingUploadRef.current
                    pendingUploadRef.current = null
                  } catch (err) {
                    setStage('error')
                    setErrorMsg('アップロードに失敗しました: ' + String(err))
                    return
                  }
                }
                setStage('idle')
              }}
              className="w-full py-3 rounded-lg font-bold text-white text-sm"
              style={{ backgroundColor: '#e95228' }}
            >
              録画へ進む
            </button>
            <button
              onClick={async () => {
                setMemoNotes(['', '', ''])
                if (pendingUploadRef.current) {
                  setStage('uploading')
                  try {
                    await pendingUploadRef.current
                    pendingUploadRef.current = null
                  } catch (err) {
                    setStage('error')
                    setErrorMsg('アップロードに失敗しました: ' + String(err))
                    return
                  }
                }
                setStage('idle')
              }}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600"
            >
              メモなしで進む
            </button>
          </div>

        </div>
      </div>
    )
  }

  if (stage === 'uploading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <p className="font-bold text-gray-900 mb-2">アップロード中...</p>
          <p className="text-sm text-gray-400">しばらくお待ちください</p>
        </div>
      </div>
    )
  }

  // idle / recording / preview — all use camera UI
  return (
    <div className="flex-1 flex flex-col bg-black min-h-0 overflow-hidden">
      {/* Camera view — fills remaining space, controls overlaid inside */}
      <div className="flex-1 relative flex items-center justify-center">
        {stage !== 'preview' && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}
        {stage === 'preview' && (
          <video
            ref={previewRef}
            playsInline
            autoPlay
            className="w-full h-full object-cover cursor-pointer"
            onClick={e => {
              const v = e.currentTarget
              if (v.paused) { v.play() } else { v.pause() }
            }}
          />
        )}

        {/* 9:16 crop mask */}
        {(stage === 'idle' || stage === 'recording') && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <div
              className="relative h-full border border-white/40"
              style={{ aspectRatio: '9/16', maxWidth: '100%', boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)' }}
            >
              {stage === 'idle' && (
                <>
                  <svg
                    className="absolute inset-0 w-full h-full opacity-50"
                    viewBox="0 0 9 16"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.18"
                    strokeDasharray="0.5 0.3"
                  >
                    <ellipse cx="4.5" cy="4.8" rx="2.4" ry="3.0" />
                    <path d="M 0.3 12 C 0.3 9.5, 2.2 8.5, 4.5 8.5 C 6.8 8.5, 8.7 9.5, 8.7 12" />
                  </svg>
                </>
              )}
            </div>
          </div>
        )}

        {/* Question overlay — top of camera */}
        {stage !== 'preview' && (
          <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
            <div className="bg-black/50 px-4 pt-3 pb-4">
              <div className="max-w-lg mx-auto flex items-start gap-2">
                <span className="font-bold text-orange-400 shrink-0 text-sm">Q{questionIndex + 1}/{campaign?.questions.length}</span>
                <p className="text-sm text-white/90 font-medium leading-snug">{campaign?.questions[questionIndex]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prompter overlay — top of camera */}
        {(stage === 'idle' || stage === 'recording') && memoNotes.some(n => n.trim()) && (
          <div className="absolute top-0 left-0 right-0 px-5 pt-16 pb-10 pointer-events-none z-20"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)' }}>
            <ul className="space-y-1.5 text-center">
              {memoNotes.filter(n => n.trim()).map((note, i) => (
                <li key={i} className="text-white/75 text-sm leading-snug">{note}</li>
              ))}
            </ul>
          </div>
        )}


        {/* Controls — overlaid at bottom of camera view */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 pt-16 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-lg mx-auto px-6">
            {stage === 'idle' && (
              <div className="flex flex-col items-center gap-3">

                {/* Camera dropdown */}
                {showCameraMenu && videoDevices.length > 1 && (
                  <div className="w-full bg-black/80 rounded-2xl p-4">
                    <p className="text-white/50 text-xs mb-2">カメラを選択</p>
                    <select
                      value={selectedVideoId}
                      onChange={e => switchDevice(e.target.value, selectedAudioId)}
                      className="w-full bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/20 focus:outline-none"
                    >
                      {videoDevices.map((d, i) => (
                        <option key={d.deviceId} value={d.deviceId} className="text-black">
                          {d.label || `カメラ ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Mic dropdown */}
                {showMicMenu && audioDevices.length > 1 && (
                  <div className="w-full bg-black/80 rounded-2xl p-4">
                    <p className="text-white/50 text-xs mb-2">マイクを選択</p>
                    <select
                      value={selectedAudioId}
                      onChange={e => switchDevice(selectedVideoId, e.target.value)}
                      className="w-full bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/20 focus:outline-none"
                    >
                      {audioDevices.map((d, i) => (
                        <option key={d.deviceId} value={d.deviceId} className="text-black">
                          {d.label || `マイク ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <p className="text-white/70 text-sm">準備ができたら録画を開始してください</p>

                <div className="flex items-center gap-6">

                  {/* Camera icon button */}
                  <button
                    onClick={() => { setShowCameraMenu(v => !v); setShowMicMenu(false) }}
                    className={`flex flex-col items-center gap-1 group ${videoDevices.length > 1 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
                    title="カメラを切替"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showCameraMenu ? 'bg-white/30' : 'bg-white/15 group-hover:bg-white/25'}`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs">カメラ</span>
                  </button>

                  {/* Record button */}
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <span className="w-10 h-10 rounded-full bg-red-500" />
                  </button>

                  {/* Mic icon button */}
                  <button
                    onClick={() => { setShowMicMenu(v => !v); setShowCameraMenu(false) }}
                    className={`flex flex-col items-center gap-1 group ${audioDevices.length > 1 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
                    title="マイクを切替"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showMicMenu ? 'bg-white/30' : 'bg-white/15 group-hover:bg-white/25'}`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs">マイク</span>
                  </button>

                </div>
              </div>
            )}

            {stage === 'recording' && (() => {
              const radius = 36
              const circ = 2 * Math.PI * radius
              const progress = (TOTAL_TIME - timeLeft) / TOTAL_TIME
              const dashOffset = circ * (1 - progress)
              const isWarning = timeLeft <= 30
              return (
                <div className="flex flex-col items-center gap-2">
                  {/* Timer */}
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isWarning ? 'bg-red-400 animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-lg font-mono font-bold tabular-nums ${isWarning ? 'text-red-400' : 'text-white'}`}>
                      {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                  {/* Circular progress stop button */}
                  <button onClick={stopRecording} className="relative w-20 h-20 flex items-center justify-center hover:scale-105 transition-transform">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                      {/* Track */}
                      <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                      {/* Progress ring */}
                      <circle
                        cx="40" cy="40" r={radius}
                        fill="none"
                        stroke={isWarning ? '#f87171' : '#ef4444'}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={dashOffset}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    {/* Stop square */}
                    <span className="w-8 h-8 rounded-lg bg-red-500 z-10" />
                  </button>
                  <p className="text-white/60 text-xs">Finish</p>
                </div>
              )
            })()}

            {stage === 'preview' && (
              <p className="text-white/70 text-sm text-center">タップで再生・一時停止</p>
            )}
          </div>
        </div>
      </div>
      {/* Preview buttons — fixed at bottom */}
      {stage === 'preview' && (
        <div className="fixed bottom-0 left-0 right-0 bg-black px-6 pb-10 pt-4 space-y-3 z-50">
          <button
            onClick={acceptClip}
            className="w-full py-3 rounded-full font-bold text-white text-sm"
            style={{ backgroundColor: '#e95228' }}
          >
            {questionIndex < (campaign?.questions.length ?? 1) - 1
              ? `この動画でOK　次の質問へ（Q${questionIndex + 2}）`
              : 'この動画で送信する'}
          </button>
          <button
            onClick={retake}
            className="w-full py-3 rounded-full font-bold text-white/70 text-sm border border-white/30"
          >
            撮り直す
          </button>
        </div>
      )}
    </div>
  )
}
