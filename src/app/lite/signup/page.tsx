'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const USE_CASES = [
  { value: 'recruitment', label: '採用（社員の声）' },
  { value: 'admission', label: '入学（在校生の声）' },
  { value: 'migration', label: '移住（住民の声）' },
  { value: 'case_study', label: '顧客事例・導入事例' },
  { value: 'other', label: 'その他' },
]

const QUESTION_PLACEHOLDERS: Record<string, string[]> = {
  recruitment: [
    '例：入社してよかったと思う瞬間はどんな時ですか？',
    '例：どんな人にこの会社を勧めたいですか？',
    '例：入社前に不安だったことと、実際はどうでしたか？',
  ],
  admission: [
    '例：この学校を選んでよかったと思う瞬間は？',
    '例：入学前と後で、どんなことが変わりましたか？',
    '例：どんな人にこの学校を勧めたいですか？',
  ],
  migration: [
    '例：この地域に移住してよかったと思うことは？',
    '例：移住前に不安だったことと、実際はどうでしたか？',
    '例：どんな人にこの地域への移住を勧めたいですか？',
  ],
  case_study: [
    '例：導入前の課題はどんなことでしたか？',
    '例：導入後、どんな変化がありましたか？',
    '例：どんな方にお勧めしたいですか？',
  ],
  other: [
    '例：どんな体験をしましたか？',
    '例：その体験を通じて、どんな変化がありましたか？',
    '例：同じことを考えている人へのアドバイスは？',
  ],
}

const COMPARE_ROWS: { label: string; lite: boolean | string; full: boolean | string }[] = [
  { label: '意思決定を支える動画の収集', lite: true, full: true },
  { label: '無料で始められる', lite: true, full: false },
  { label: '質問数', lite: '最大3問', full: '対話なので制限なし' },
  { label: 'SNS・採用サイト向け最適化', lite: true, full: true },
  { label: 'プロによるインタビュー対応', lite: false, full: true },
  { label: '撮影サポート', lite: false, full: true },
  { label: '記事制作（オプション）', lite: false, full: true },
]

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', org_name: '', email: '', phone: '', use_case: '' })
  const [questions, setQuestions] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recordingUrl, setRecordingUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/lite/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, questions }),
      })
      const text = await res.text()
      const data = text ? JSON.parse(text) : {}
      if (!res.ok) throw new Error(data.error || `エラー (${res.status})`)

      setRecordingUrl(data.recordingUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (recordingUrl) {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [recordingUrl])

  const copyLink = () => {
    navigator.clipboard.writeText(recordingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Success state ──
  if (recordingUrl) {
    return (
      <div>
        <div className="px-6 py-16 max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">登録完了</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">体験者に送るリンクが発行されました</h1>
          <p className="text-sm text-gray-500 mb-10">
            このTesuTemoライトの体験者用リンクをメール・LINEで送ってください。<br />
            リンクはメールにも送りました。3名まで無料で収録できます。
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">体験者に送るリンク</p>
            <p className="text-sm text-gray-800 break-all font-mono mb-4">{recordingUrl}</p>
            <button
              onClick={copyLink}
              className="w-full py-3 rounded-lg font-bold text-white text-sm transition-opacity"
              style={{ backgroundColor: '#e95228' }}
            >
              {copied ? 'コピーしました ✓' : 'リンクをコピーする'}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            管理画面はメールに記載のURLからアクセスできます。
          </p>
        </div>

        {/* Comparison section */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-14">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TesuTemoライト vs TesuTemo</p>
            <p className="text-sm text-gray-500 mb-8">まずはライトで体験を。本格的な動画制作はTesuTemoで。</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <p className="text-xs font-bold text-gray-400 tracking-wide mb-3">TesuTemoライト</p>
                <p className="text-sm text-gray-700 leading-relaxed">体験者にリンクを送ると、届いた質問ごとに自分でカメラに向かって答えてもらいます。</p>
              </div>
              <div className="bg-white border border-orange-200 rounded-2xl p-5">
                <p className="text-xs font-bold tracking-wide mb-3" style={{ color: '#e95228' }}>TesuTemo</p>
                <p className="text-sm text-gray-700 leading-relaxed">プロがインタビュアーとして対話しながら取材することで、よりリアルで深みのある声を引き出し、動画にして届けます。</p>
              </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-6 text-gray-400 font-medium w-1/2"></th>
                    <th className="text-center py-3 px-6 w-1/4">
                      <span className="block text-xs font-bold tracking-wide text-gray-500">TesuTemoライト</span>
                      <span className="block text-xs font-normal text-gray-400 mt-0.5">無料</span>
                    </th>
                    <th className="text-center py-3 px-6 w-1/4">
                      <span className="block text-xs font-bold tracking-wide" style={{ color: '#e95228' }}>TesuTemo</span>
                      <span className="block text-xs font-normal text-gray-400 mt-0.5">有料</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 px-6 text-gray-700">{row.label}</td>
                      <td className="py-3 px-6 text-center">
                        {typeof row.lite === 'string' ? <span className="text-xs text-gray-500">{row.lite}</span> : row.lite ? <span className="text-lg font-bold text-gray-400">○</span> : <span className="text-lg font-bold text-gray-200">×</span>}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {typeof row.full === 'string' ? <span className="text-xs font-medium" style={{ color: '#e95228' }}>{row.full}</span> : row.full ? <span className="text-lg font-bold" style={{ color: '#e95228' }}>○</span> : <span className="text-lg font-bold text-gray-200">×</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500 mb-4">ユーザーの声の力を体験したら、次はプロにお任せください。</p>
              <Link href="/#contact" className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white transition-colors" style={{ backgroundColor: '#e95228' }}>
                TesuTemoについて問い合わせる →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Form state ──
  return (
    <div>

      {/* 1. INTRO */}
      <div className="px-6 pt-12 pb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-gray-300 text-gray-500 tracking-wide">TesuTemoライト</span>
          <span className="text-xs text-gray-400">無料・コミットなし</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
          選んでもらうための、<br className="sm:hidden" />本音の声を動画で集める。
        </h1>
        <p className="text-sm text-gray-500 max-w-xl leading-relaxed mb-2">
          在籍者・利用者のリアルな体験談が、検討者の意思決定を後押しします。
        </p>
        <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
          まずは無料のTesuTemoライトで体験して、ユーザーの声の力を試してください。より本格的にユーザーの声を活かしたい場合は、プロが対話しながら取材するTesuTemoをご利用ください。
        </p>
      </div>

      {/* 2. HOW IT WORKS */}
      <div className="border-t border-gray-100 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">どうやって使うの？</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-16">4ステップで体験者の声を動画に</h2>

          <div className="space-y-24">

            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: '#e95228' }}>1</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Setup</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">質問を設定して<br />リンクを発行（2分）</h3>
                <p className="text-sm text-gray-500 leading-relaxed">用途と質問（最大3問）を入力するだけ。フォームを送信するとすぐに、体験者専用の収録リンクが発行されます。</p>
              </div>
              {/* Step 1 UI mockup */}
              <div className="w-full lg:w-[58%]">
                <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)', border: '1px solid #fdd0c0' }}>
                  <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">声を集めたい体験者への質問</p>
                    <div className="space-y-2">
                      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Q1. 入社してよかったと思う瞬間は？</div>
                      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">Q2. どんな人にこの会社を勧めたいですか？</div>
                      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-300">Q3. 質問を入力（任意）</div>
                    </div>
                    <button className="w-full py-2.5 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: '#e95228' }}>
                      体験者用の収録リンクを発行する
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: '#e95228' }}>2</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Share</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">体験者にリンクを送る</h3>
                <p className="text-sm text-gray-500 leading-relaxed">発行されたリンクをメール・LINEなど好きな方法で体験者に送ります。3名まで無料。</p>
              </div>
              {/* Step 2 UI mockup */}
              <div className="w-full lg:w-[58%]">
                <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)', border: '1px solid #fdd0c0' }}>
                  <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">体験者に送るリンク</p>
                    <div className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 font-mono truncate">
                      tesutemo.co/lite/record/abc123...
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: '#e95228' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        リンクをコピー
                      </button>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400">メール・LINEで送る</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="flex gap-3 justify-center">
                      {/* Email icon */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      {/* LINE icon */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#06C755' }}>
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.02 2 11c0 3.19 1.74 6.01 4.38 7.72-.07.58-.44 2.12-.51 2.45-.08.4.15.4.31.29.13-.08 2.05-1.36 2.88-1.9.62.09 1.26.14 1.94.14 5.52 0 10-4.02 10-9S17.52 2 12 2z"/></svg>
                      </div>
                      {/* Chat/message icon */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: '#e95228' }}>3</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Record</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">体験者はリンクを<br />開くだけ</h3>
                <p className="text-sm text-gray-500 leading-relaxed">アプリも登録も不要。ブラウザで開いて、カメラに向かって話すだけ。録画は自動でTesuTemoに届きます。</p>
                <div className="flex gap-2 pt-1">
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
              {/* Phone-proportioned placeholder for recording screen */}
              <div className="w-full lg:w-[58%] flex justify-center">
                <div className="w-[220px] aspect-[9/16] bg-gray-100 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                  <p className="text-xs text-gray-400 text-center px-4">収録画面<br />スクリーンショット（準備中）</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: '#e95228' }}>4</span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deliver</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">スタッフが編集して<br />約1週間でお届け</h3>
                <p className="text-sm text-gray-500 leading-relaxed">AIではなく、TesuTemoのスタッフが動画を確認・編集します。公開前にご確認いただいてから共有します。</p>
              </div>
              {/* Step 4 UI mockup — notification email */}
              <div className="w-full lg:w-[58%]">
                <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)', border: '1px solid #fdd0c0' }}>
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Email header */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: '#e95228' }}>T</div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">TesuTemo</p>
                          <p className="text-[10px] text-gray-400">noreply@tesutemo.co</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-3">編集済み動画をお届けします</p>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-xs text-gray-500 leading-relaxed">山田 様、3名分の動画の編集が完了しました。ご確認の上、ご利用ください。</p>
                      {/* Video thumbnails */}
                      <div className="flex gap-2">
                        {[1,2,3].map(n => (
                          <div key={n} className="flex-1 aspect-[9/16] bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ✦ AIではなくスタッフが編集
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. VIDEOS + FORM */}
      <div className="px-6 py-12 max-w-5xl mx-auto">
        <div className="flex gap-10 items-start flex-col lg:flex-row">

          {/* Sample videos */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">TesuTemoライトの仕上がりイメージ</p>
            <div className="flex gap-4">
              {/* Vimeo sample video */}
              <div className="flex-1 aspect-[9/16] rounded-2xl overflow-hidden">
                <iframe
                  src="https://player.vimeo.com/video/1190752323?h=4920292d40&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {/* Vimeo sample video 2 */}
              <div className="flex-1 aspect-[9/16] rounded-2xl overflow-hidden">
                <iframe
                  src="https://player.vimeo.com/video/1191763890?h=f2744b1093&autoplay=0&loop=1&title=0&byline=0&portrait=0"
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              体験者はアカウント登録・アプリのインストール不要。リンクを送るだけで録画できます。
            </p>
          </div>

          {/* Signup form */}
          <div className="w-full lg:w-[420px] shrink-0 order-1 lg:order-2">
            <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              {/* Section 1: ご自身の情報 */}
              <div className="px-6 pt-6 pb-5 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">ご自身の情報</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="山田 太郎"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">会社名・組織名 <span className="text-red-500">*</span></label>
                  <input type="text" required value={form.org_name}
                    onChange={e => setForm(f => ({ ...f, org_name: e.target.value }))}
                    placeholder="株式会社〇〇"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-gray-400 font-normal">（任意）</span></label>
                  <input type="text" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="090-0000-0000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用途 <span className="text-red-500">*</span></label>
                  <select required value={form.use_case}
                    onChange={e => setForm(f => ({ ...f, use_case: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    <option value="">選択してください</option>
                    {USE_CASES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Section 2: 体験者への質問 */}
              <div className="bg-gray-50 border-t border-gray-100 px-6 pt-5 pb-6 space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">声を集めたい体験者への質問</p>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  聞きたいこと <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">（最大3問）</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">体験者に動画で答えてもらう質問を入力してください。</p>
                <div className="space-y-2">
                  {questions.map((q, i) => {
                    const placeholders = QUESTION_PLACEHOLDERS[form.use_case] || QUESTION_PLACEHOLDERS.other
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-4 shrink-0">Q{i + 1}</span>
                        <input
                          type="text"
                          value={q}
                          onChange={e => {
                            const next = [...questions]
                            next[i] = e.target.value
                            setQuestions(next)
                          }}
                          placeholder={placeholders[i]}
                          required={i === 0}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg font-bold text-white text-sm transition-opacity disabled:opacity-60"
                  style={{ backgroundColor: '#e95228' }}
                >
                  {loading ? '登録中...' : '体験者用の収録リンクを発行する'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  リンクはメールにも送られます。
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* 4. COMPARISON */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">TesuTemoライト vs TesuTemo</p>
          <p className="text-sm text-gray-500 mb-8">まずはライトで体験を。本格的な動画制作はTesuTemoで。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-400 tracking-wide mb-3">TesuTemoライト</p>
              <p className="text-sm text-gray-700 leading-relaxed">体験者にリンクを送ると、届いた質問ごとに自分でカメラに向かって答えてもらいます。</p>
            </div>
            <div className="bg-white border border-orange-200 rounded-2xl p-5">
              <p className="text-xs font-bold tracking-wide mb-3" style={{ color: '#e95228' }}>TesuTemo</p>
              <p className="text-sm text-gray-700 leading-relaxed">プロがインタビュアーとして対話しながら取材することで、よりリアルで深みのある声を引き出し、動画にして届けます。</p>
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-6 text-gray-400 font-medium w-1/2"></th>
                  <th className="text-center py-3 px-6 w-1/4">
                    <span className="block text-xs font-bold tracking-wide text-gray-500">TesuTemoライト</span>
                    <span className="block text-xs font-normal text-gray-400 mt-0.5">無料</span>
                  </th>
                  <th className="text-center py-3 px-6 w-1/4">
                    <span className="block text-xs font-bold tracking-wide" style={{ color: '#e95228' }}>TesuTemo</span>
                    <span className="block text-xs font-normal text-gray-400 mt-0.5">有料</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 px-6 text-gray-700">{row.label}</td>
                    <td className="py-3 px-6 text-center">
                      {typeof row.lite === 'string' ? <span className="text-xs text-gray-500">{row.lite}</span> : row.lite ? <span className="text-lg font-bold text-gray-400">○</span> : <span className="text-lg font-bold text-gray-200">×</span>}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {typeof row.full === 'string' ? <span className="text-xs font-medium" style={{ color: '#e95228' }}>{row.full}</span> : row.full ? <span className="text-lg font-bold" style={{ color: '#e95228' }}>○</span> : <span className="text-lg font-bold text-gray-200">×</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 mb-4">ユーザーの声の力を体験したら、次はプロにお任せください。</p>
            <Link href="/#contact" className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white transition-colors" style={{ backgroundColor: '#e95228' }}>
              TesuTemoについて問い合わせる →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
