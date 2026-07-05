'use client'

import { useState } from 'react'

const DEMO_NOTES = [
  'TesuTemoを選んだ一番の理由',
  '使い始めてから変わったこと',
  '同じ悩みを持つ人へのアドバイス',
]

export default function PrompterDemo() {
  const [recording, setRecording] = useState(false)

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <p className="text-white/40 text-xs mb-4 tracking-wide">プロンプターデモ（カメラなし）</p>

      {/* Camera area */}
      <div className="relative w-full max-w-sm aspect-[3/4] bg-gray-800 rounded-2xl overflow-hidden">

        {/* Fake camera bg */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
        </div>

        {/* ── PROMPTER OVERLAY (top) ── */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-5"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)' }}>
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">話すメモ</p>
          <ul className="space-y-1.5">
            {DEMO_NOTES.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-white/40 text-xs mt-0.5 shrink-0">・</span>
                <span className="text-white/80 text-sm leading-snug">{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recording indicator */}
        {recording && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 rounded-full px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-bold">REC</span>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-10"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}>
          <button
            onClick={() => setRecording(r => !r)}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${recording ? 'bg-red-500 text-white' : 'bg-white text-gray-900'}`}
          >
            {recording ? '● 録画停止' : '録画開始'}
          </button>
        </div>
      </div>

      <p className="text-white/30 text-xs mt-6 text-center max-w-xs leading-relaxed">
        上部のメモを見ながら話すことで、カメラ（画面中央）への目線が保たれます
      </p>
    </div>
  )
}
