'use client'

import { useEffect, useRef, useState } from 'react'

type Mode = 'video' | 'audio'
type Phase = 'idle' | 'ready' | 'recording' | 'preview'

interface Props {
  mode: Mode
  onFile: (file: File, isAudio: boolean) => void
  onCancel: () => void
  labelRecord: string
  labelStop: string
  labelUse: string
  labelRetry: string
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export default function DesktopRecorder({ mode, onFile, onCancel, labelRecord, labelStop, labelUse, labelRetry }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const previewUrlRef = useRef<string>('')
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    startStream()
    return () => stopStream()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startStream() {
    try {
      const constraints = mode === 'video'
        ? { video: { facingMode: 'user' }, audio: true }
        : { audio: true }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current && mode === 'video') {
        videoRef.current.srcObject = stream
      }
      setPhase('ready')
    } catch {
      setError('カメラ／マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。')
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (timerRef.current) clearInterval(timerRef.current)
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }

  function startRecording() {
    if (!streamRef.current) return
    chunksRef.current = []

    const mimeType = mode === 'video'
      ? (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm')
      : (MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm')

    const recorder = new MediaRecorder(streamRef.current, { mimeType })
    recorderRef.current = recorder
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const url = URL.createObjectURL(blob)
      previewUrlRef.current = url
      setPreviewUrl(url)
      // stop live stream tracks now we have the recording
      streamRef.current?.getTracks().forEach(t => t.stop())
      setPhase('preview')
    }
    recorder.start(250)
    setPhase('recording')
    setElapsed(0)
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
  }

  function stopRecording() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    recorderRef.current?.stop()
  }

  function handleUse() {
    const blob = new Blob(chunksRef.current, { type: recorderRef.current?.mimeType ?? 'video/webm' })
    const ext = 'webm'
    const file = new File([blob], `recording.${ext}`, { type: blob.type })
    onFile(file, mode === 'audio')
  }

  function handleRetry() {
    setPreviewUrl('')
    previewUrlRef.current = ''
    chunksRef.current = []
    setElapsed(0)
    startStream()
  }

  if (error) {
    return (
      <div className="space-y-3 text-center py-4">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={onCancel} className="text-sm text-gray-500 underline">戻る / Back</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Live preview / recorded preview */}
      {mode === 'video' && phase !== 'preview' && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl bg-black max-h-64 object-contain"
        />
      )}
      {phase === 'preview' && previewUrl && (
        mode === 'video' ? (
          <video src={previewUrl} controls playsInline className="w-full rounded-xl bg-black max-h-64 object-contain" />
        ) : (
          <audio src={previewUrl} controls className="w-full mt-2" />
        )
      )}
      {mode === 'audio' && phase !== 'preview' && (
        <div className="w-full h-20 bg-gray-100 rounded-xl flex items-center justify-center">
          {phase === 'recording' ? (
            <span className="text-2xl font-mono text-orange-500">{fmtTime(elapsed)}</span>
          ) : (
            <span className="text-gray-400 text-sm">🎙 準備完了 / Ready</span>
          )}
        </div>
      )}
      {phase === 'recording' && mode === 'video' && (
        <div className="text-center text-sm font-mono text-orange-500">{fmtTime(elapsed)}</div>
      )}

      {/* Controls */}
      <div className="space-y-2">
        {(phase === 'idle' || phase === 'ready') && (
          <button
            onClick={startRecording}
            disabled={phase === 'idle'}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-40"
          >
            <span className="w-3 h-3 rounded-full bg-white inline-block" />
            {labelRecord}
          </button>
        )}
        {phase === 'recording' && (
          <button
            onClick={stopRecording}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-medium animate-pulse"
          >
            <span className="w-3 h-3 rounded-sm bg-white inline-block" />
            {labelStop}
          </button>
        )}
        {phase === 'preview' && (
          <>
            <button onClick={handleUse} className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium">
              {labelUse}
            </button>
            <button onClick={handleRetry} className="w-full py-2 rounded-xl border border-gray-200 text-gray-600 text-sm">
              {labelRetry}
            </button>
          </>
        )}
        <button onClick={onCancel} className="w-full text-xs text-gray-400 py-1">
          キャンセル / Cancel
        </button>
      </div>
    </div>
  )
}
