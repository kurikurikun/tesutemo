'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import type { SurveyCampaign, SurveyPrompt } from '@/lib/survey'
import DesktopRecorder from '../DesktopRecorder'

type Lang = 'jp' | 'en'
type Step = 'loading' | 'landing' | 'identity' | 'consent' | 'record' | 'uploading' | 'done' | 'error'

const T = {
  jp: {
    loading: '読み込み中...',
    minutes: '約3〜5分',
    privacyNote: 'ご回答内容はクライアント企業の内部目的のみに使用されます。',
    startBtn: 'はじめる',
    noSignup: '登録不要',
    aboutYou: 'あなたについて',
    aboutYouSub: 'フィードバックの送り主を把握するために使用します。',
    nameLabel: 'お名前',
    namePlaceholder: '山田 太郎',
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'taro@example.com',
    cohortLabel: '所属・役職',
    cohortOptional: '（任意）',
    cohortPlaceholder: '営業部 / 2年生 など',
    nextBtn: '次へ',
    consentTitle: 'ご同意のお願い',
    consentSub: 'ご確認のうえ、チェックを入れてください。',
    consent1: '自分で録音・録画し、フィードバックを共有することに同意します',
    consent2: 'フォローアップのご連絡を受け取ることに同意します',
    consentOptional: '（任意）',
    agreeBtn: '同意して録音・録画へ進む',
    questionLabel: '質問',
    of: '/',
    videoTab: '動画',
    audioTab: '音声のみ',
    rerecordBtn: '撮り直す',
    useBtn: 'この内容を使う',
    nextQuestionBtn: '次の質問へ',
    submitBtn: '回答を送信する',
    doneTitle: 'ご回答ありがとうございました！',
    doneMsg: 'ご回答を受け付けました。',
    errorMsg: 'エラーが発生しました。もう一度お試しください。',
    uploadProgress: (pct: number) => `アップロード中… ${pct}%`,
    timeLabel: (secs: number) => `各回答は${secs}秒以内でお願いします`,
    privacyLabel: 'このプロジェクト内のみで使用 — 一般公開はしません',
  },
  en: {
    loading: 'Loading...',
    minutes: '~3–5 minutes',
    privacyNote: 'Your responses will be used by the client for internal purposes only.',
    startBtn: 'Get started',
    noSignup: 'No sign-up required',
    aboutYou: 'Tell us about yourself',
    aboutYouSub: 'So we know who is behind the feedback.',
    nameLabel: 'Full name',
    namePlaceholder: 'Jane Smith',
    emailLabel: 'Email address',
    emailPlaceholder: 'jane@example.com',
    cohortLabel: 'Affiliation / role',
    cohortOptional: '(optional)',
    cohortPlaceholder: 'Design lead · Studio Two',
    nextBtn: 'Continue',
    consentTitle: 'A few permissions',
    consentSub: "Tick the ones you're comfortable with. You can stop anytime.",
    consent1: 'I am happy to record and share my feedback',
    consent2: "I'm open to a short follow-up interview",
    consentOptional: '(optional)',
    agreeBtn: 'Agree & start recording',
    questionLabel: 'Question',
    of: 'of',
    videoTab: 'Video',
    audioTab: 'Audio only',
    rerecordBtn: 'Record again',
    useBtn: 'Use this recording',
    nextQuestionBtn: 'Next question',
    submitBtn: 'Submit responses',
    doneTitle: 'Thank you!',
    doneMsg: 'We have received your responses.',
    errorMsg: 'An error occurred. Please try again.',
    uploadProgress: (pct: number) => `Uploading… ${pct}%`,
    timeLabel: (secs: number) => `Please keep each answer under ${secs} seconds`,
    privacyLabel: 'Used for this feedback only — not shared publicly',
  },
}

type Recording = { promptId: string; file: File; previewUrl: string; cfUid?: string; isAudio?: boolean }

// ── Design tokens ──────────────────────────────────────────────
const C = {
  bg: '#faf7f3',
  card: '#ffffff',
  border: '#e3ddd4',
  borderActive: '#e95228',
  primary: '#e95228',
  dark: '#1c1a18',
  body: '#6f675f',
  muted: '#8a827a',
  subtle: '#e7e2db',
  pillBg: '#efe9e1',
  consentChecked: '#fef4f0',
  consentCheckedBorder: '#f6cdbc',
}

const BTN = `display:block;width:100%;background:${C.primary};color:#fff;font-weight:700;font-size:16.5px;text-align:center;padding:18px;border-radius:17px;box-shadow:0 14px 26px -10px rgba(233,82,40,0.65);border:none;cursor:pointer;font-family:inherit;`

export default function SurveyPage() {
  const { id: campaignId } = useParams<{ id: string }>()
  const [lang, setLang] = useState<Lang>('en')
  const [step, setStep] = useState<Step>('loading')
  const [campaign, setCampaign] = useState<SurveyCampaign | null>(null)
  const [prompts, setPrompts] = useState<SurveyPrompt[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cohortRole, setCohortRole] = useState('')
  const [consented, setConsented] = useState(false)
  const [consentRecontact, setConsentRecontact] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [uploadPct, setUploadPct] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [isMobile, setIsMobile] = useState(true)
  const [desktopMode, setDesktopMode] = useState<'video' | 'audio' | null>(null)
  const [mediaMode, setMediaMode] = useState<'video' | 'audio'>('video')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])
  const t = T[lang]

  useEffect(() => {
    fetch(`/api/survey/campaign/${campaignId}`)
      .then(r => r.json())
      .then(({ campaign, prompts }) => {
        if (!campaign) { setStep('error'); return }
        setCampaign(campaign)
        setLang(campaign.lang ?? 'en')
        setPrompts(prompts)
        setStep('landing')
      })
      .catch(() => setStep('error'))
  }, [campaignId])

  const currentPrompt = prompts[promptIndex]
  const currentRecording = recordings.find(r => r.promptId === currentPrompt?.id)

  function handleDesktopFile(file: File, isAudio: boolean) {
    const previewUrl = URL.createObjectURL(file)
    setRecordings(prev => {
      const next = prev.filter(r => r.promptId !== currentPrompt.id)
      return [...next, { promptId: currentPrompt.id, file, previewUrl, isAudio }]
    })
    setDesktopMode(null)
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>, isAudio = false) {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setRecordings(prev => {
      const next = prev.filter(r => r.promptId !== currentPrompt.id)
      return [...next, { promptId: currentPrompt.id, file, previewUrl, isAudio }]
    })
    e.target.value = ''
  }

  async function uploadCurrent(): Promise<string | null> {
    const rec = recordings.find(r => r.promptId === currentPrompt.id)
    if (!rec || !rec.file) return null
    if (rec.cfUid) return rec.cfUid

    setStep('uploading')
    setUploadPct(0)

    try {
      const res = await fetch('/api/survey/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxDurationSeconds: campaign?.max_seconds ?? 90, isAudio: rec.isAudio }),
      })
      const { uploadUrl, uid, uploadMethod } = await res.json()

      setUploadPct(10)
      let uploadBody: FormData | File
      let uploadHeaders: Record<string, string> | undefined
      if (uploadMethod === 'PUT') {
        uploadBody = rec.file
        uploadHeaders = { 'Content-Type': rec.file.type || (rec.isAudio ? 'audio/webm' : 'video/mp4') }
      } else {
        const form = new FormData()
        form.append('file', rec.file, rec.file.name || 'video.mp4')
        uploadBody = form
      }
      const postRes = await fetch(uploadUrl, { method: uploadMethod ?? 'POST', body: uploadBody, headers: uploadHeaders })
      if (!postRes.ok) throw new Error(`Upload failed: ${postRes.status} ${await postRes.text()}`)
      setUploadPct(100)

      setRecordings(prev =>
        prev.map(r => r.promptId === currentPrompt.id ? { ...r, cfUid: uid } : r)
      )
      return uid
    } catch (err) {
      setErrorMsg(String(err))
      setStep('error')
      return null
    }
  }

  async function handleNextOrSubmit() {
    const uid = await uploadCurrent()
    if (!uid) return

    if (promptIndex < prompts.length - 1) {
      setPromptIndex(i => i + 1)
      setStep('record')
    } else {
      await submitAll(uid)
    }
  }

  async function submitAll(lastUid: string) {
    setStep('uploading')
    setUploadPct(100)

    const recordingEntries = recordings.map(r => ({
      promptId: r.promptId,
      cfUid: r.promptId === currentPrompt.id ? lastUid : r.cfUid!,
      mediaType: r.isAudio ? 'audio' : 'video',
    }))

    const res = await fetch('/api/survey/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, name, email, cohortRole, consents: { record: consented, recontact: consentRecontact, usage: false }, recordings: recordingEntries }),
    })

    if (res.ok) {
      setStep('done')
    } else {
      setErrorMsg(t.errorMsg)
      setStep('error')
    }
  }

  function triggerRecord() {
    if (isMobile && mediaMode === 'video') {
      fileInputRef.current?.click()
    } else {
      setDesktopMode(mediaMode)
    }
  }

  // ── Loading / Error / Done / Uploading ───────────────────────
  if (step === 'loading') {
    return (
      <Shell>
        <p style={{ color: C.muted, textAlign: 'center', paddingTop: 80 }}>{t.loading}</p>
      </Shell>
    )
  }

  if (step === 'error') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <p style={{ color: '#c0392b', marginBottom: 20 }}>{errorMsg || t.errorMsg}</p>
          <button style={{ ...btnStyle }} onClick={() => { setStep('record'); setErrorMsg('') }}>
            {lang === 'jp' ? '戻る' : 'Back'}
          </button>
        </div>
      </Shell>
    )
  }

  if (step === 'uploading') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            width: 56, height: 56, border: `4px solid ${C.subtle}`,
            borderTopColor: C.primary, borderRadius: '50%',
            margin: '0 auto 24px', animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: C.dark, fontWeight: 600, marginBottom: 16 }}>
            {t.uploadProgress(uploadPct)}
          </p>
          <div style={{ height: 6, background: C.subtle, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: C.primary, borderRadius: 999, width: `${uploadPct}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
      </Shell>
    )
  }

  if (step === 'done') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#f0fdf4',
            border: `2px solid #86efac`, margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.dark, marginBottom: 12 }}>{t.doneTitle}</h2>
          <p style={{ color: C.body, lineHeight: 1.6 }}>{t.doneMsg}</p>
        </div>
      </Shell>
    )
  }

  // ── LANDING ───────────────────────────────────────────────────
  if (step === 'landing' && campaign) {
    return (
      <Shell>
        {(campaign.logo_url || campaign.client_label) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, paddingTop: 28 }}>
            {campaign.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={campaign.logo_url} alt="logo" style={{ height: 66, width: 66, borderRadius: 20, objectFit: 'contain', background: '#fdeee8', border: `1px solid #f6dccf`, padding: 8 }} />
            )}
            {campaign.client_label && (
              <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, letterSpacing: '0.13em', textTransform: 'uppercase' }}>
                {campaign.client_label}
              </div>
            )}
          </div>
        )}

        <h1 style={{ fontSize: 29, lineHeight: 1.18, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', textAlign: 'center', marginTop: campaign.logo_url || campaign.client_label ? 18 : 40, marginBottom: 10 }}>
          {campaign.name}
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.55, color: C.body, textAlign: 'center', marginBottom: (campaign.intro_en || campaign.intro_jp) ? 12 : 24, whiteSpace: 'pre-line' }}>
          {lang === 'jp' ? 'スマホやパソコンから、短い音声または動画で返信してください。' : 'Leave a short voice or video reply, right from your phone or computer.'}
        </p>

        {(campaign.intro_en || campaign.intro_jp) && (
          <p style={{ fontSize: 14, lineHeight: 1.55, color: C.muted, textAlign: 'center', marginBottom: 24, whiteSpace: 'pre-line' }}>
            {lang === 'jp' ? campaign.intro_jp : campaign.intro_en}
          </p>
        )}

        {/* Info card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '6px 18px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderBottom: `1px solid #f1ebe3` }}>
            <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 11, background: '#f6f1ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b9a78f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: '#2a2622' }}>{t.timeLabel(campaign.max_seconds ?? 90)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0' }}>
            <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 11, background: '#f6f1ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="#b9a78f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: '#2a2622' }}>{t.privacyLabel}</div>
            </div>
          </div>
        </div>

        <button style={btnStyle} onClick={() => setStep('identity')}>{t.startBtn}</button>
        <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 14 }}>{t.noSignup}</p>
      </Shell>
    )
  }

  // ── IDENTITY ──────────────────────────────────────────────────
  if (step === 'identity') {
    return (
      <Shell>
        <ProgressBar step={1} total={3} onBack={() => setStep('landing')} />

        <h2 style={{ fontSize: 25, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', marginTop: 24, marginBottom: 8 }}>
          {t.aboutYou}
        </h2>
        <p style={{ fontSize: 14.5, color: C.body, lineHeight: 1.5, marginBottom: 26 }}>{t.aboutYouSub}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Field label={t.nameLabel} required>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              style={inputStyle(!!name)}
              autoComplete="name"
            />
          </Field>
          <Field label={t.emailLabel} required>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              style={inputStyle(!!email)}
              autoComplete="email"
            />
          </Field>
          <Field label={t.cohortLabel} optional={t.cohortOptional}>
            <input
              type="text"
              value={cohortRole}
              onChange={e => setCohortRole(e.target.value)}
              placeholder={t.cohortPlaceholder}
              style={inputStyle(false)}
            />
          </Field>
        </div>

        <div style={{ marginTop: 32 }}>
          <button
            style={{ ...btnStyle, opacity: (!name.trim() || !email.trim()) ? 0.4 : 1, cursor: (!name.trim() || !email.trim()) ? 'default' : 'pointer' }}
            onClick={() => { if (name.trim() && email.trim()) setStep('consent') }}
          >
            {t.nextBtn}
          </button>
        </div>
      </Shell>
    )
  }

  // ── CONSENT ───────────────────────────────────────────────────
  if (step === 'consent') {
    return (
      <Shell>
        <ProgressBar step={2} total={3} onBack={() => setStep('identity')} />

        <h2 style={{ fontSize: 25, fontWeight: 800, color: C.dark, letterSpacing: '-0.02em', marginTop: 24, marginBottom: 8 }}>
          {t.consentTitle}
        </h2>
        <p style={{ fontSize: 14.5, color: C.body, lineHeight: 1.5, marginBottom: 22 }}>{t.consentSub}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ConsentItem
            checked={consented}
            onChange={setConsented}
            label={t.consent1}
          />
          <ConsentItem
            checked={consentRecontact}
            onChange={setConsentRecontact}
            label={t.consent2}
            optional={t.consentOptional}
          />
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 32 }}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5, color: C.muted, marginBottom: 13 }}>
            {lang === 'jp' ? '必須項目にチェックが入っています' : 'Required boxes are ticked — you\'re all set'}
          </p>
          <button
            style={{ ...btnStyle, opacity: !consented ? 0.4 : 1, cursor: !consented ? 'default' : 'pointer' }}
            onClick={() => { if (consented) setStep('record') }}
          >
            {t.agreeBtn}
          </button>
        </div>
      </Shell>
    )
  }

  // ── RECORD ────────────────────────────────────────────────────
  if (step === 'record' && currentPrompt) {
    return (
      <Shell noPadBottom>
        {/* Question counter + dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.body }}>
            {t.questionLabel} {promptIndex + 1} {t.of} {prompts.length}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {prompts.map((_, i) => (
              <div key={i} style={{ width: i === promptIndex ? 26 : 14, height: 5, borderRadius: 999, background: i <= promptIndex ? C.primary : '#e0d8cf', transition: 'all 0.2s' }} />
            ))}
          </div>
        </div>

        {/* Prompt card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '18px 18px 19px', marginTop: 16 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: C.primary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 9 }}>
            {lang === 'jp' ? 'プロンプト' : 'Prompt'}
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.4, fontWeight: 700, color: C.dark, letterSpacing: '-0.01em' }}>
            {lang === 'jp' ? currentPrompt.text_jp : currentPrompt.text_en}
          </div>
        </div>

        {/* Time hint */}
        <div style={{ textAlign: 'center', fontSize: 12.5, color: C.muted, marginTop: 10 }}>
          {t.timeLabel(campaign?.max_seconds ?? 90)}
        </div>

        {/* Inline recorder — desktop always, mobile for audio only */}
        {desktopMode && (!isMobile || desktopMode === 'audio') && (
          <div style={{ marginTop: 16 }}>
            <DesktopRecorder
              mode={desktopMode}
              onFile={handleDesktopFile}
              onCancel={() => setDesktopMode(null)}
              labelRecord={desktopMode === 'video' ? (lang === 'jp' ? '録画開始' : 'Start recording') : (lang === 'jp' ? '録音開始' : 'Start recording')}
              labelStop={lang === 'jp' ? '停止' : 'Stop'}
              labelUse={t.useBtn}
              labelRetry={t.rerecordBtn}
            />
          </div>
        )}

        {!desktopMode && (
          <>
            {/* Preview */}
            {currentRecording?.previewUrl && (
              <div style={{ marginTop: 16 }}>
                {currentRecording.isAudio ? (
                  <audio src={currentRecording.previewUrl} controls style={{ width: '100%' }} />
                ) : (
                  <video
                    src={currentRecording.previewUrl}
                    controls
                    playsInline
                    style={{ width: '100%', borderRadius: 16, background: '#000', maxHeight: 240, objectFit: 'contain', display: 'block' }}
                  />
                )}
              </div>
            )}

            {/* Camera area (when no preview) */}
            {!currentRecording && (
              <div
                onClick={triggerRecord}
                style={{
                  marginTop: 14, borderRadius: 24, background: C.dark, position: 'relative',
                  overflow: 'hidden', height: 200, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 10px, transparent 10px 20px)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {mediaMode === 'audio'
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                }
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>
                    {lang === 'jp' ? 'タップして開始' : 'Tap to record'}
                  </span>
                </div>
              </div>
            )}

            {/* Video / Audio tab toggle */}
            {!currentRecording && (
              <div style={{ display: 'flex', background: C.pillBg, borderRadius: 14, padding: 4, gap: 4, marginTop: 14 }}>
                {(['video', 'audio'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMediaMode(m)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      padding: '10px', borderRadius: 11, border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: mediaMode === m ? 700 : 600, fontSize: 14,
                      color: mediaMode === m ? C.dark : C.muted,
                      background: mediaMode === m ? C.card : 'transparent',
                      boxShadow: mediaMode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m === 'video'
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                      : <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    }
                    {m === 'video' ? t.videoTab : t.audioTab}
                  </button>
                ))}
              </div>
            )}

            {/* Hidden mobile file inputs */}
            <input ref={fileInputRef} type="file" accept="video/*" capture="user" onChange={e => handleFileSelected(e, false)} style={{ display: 'none' }} />
            <input ref={audioInputRef} type="file" accept="audio/*" onChange={e => handleFileSelected(e, true)} style={{ display: 'none' }} />

            {/* Record button or next/submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 4px 24px' }}>
              {currentRecording ? (
                <>
                  <button
                    onClick={() => {
                      if (isMobile && !currentRecording.isAudio) {
                        fileInputRef.current?.click()
                      } else {
                        setDesktopMode(currentRecording.isAudio ? 'audio' : 'video')
                      }
                    }}
                    style={{ fontSize: 13, fontWeight: 600, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {t.rerecordBtn}
                  </button>
                  <button
                    onClick={handleNextOrSubmit}
                    style={{ ...btnStyle, width: 'auto', padding: '14px 28px', fontSize: 15 }}
                  >
                    {promptIndex < prompts.length - 1 ? t.nextQuestionBtn : t.submitBtn}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ width: 50 }} />
                  {/* Big circular record button */}
                  <button
                    onClick={triggerRecord}
                    style={{
                      width: 76, height: 76, borderRadius: '50%', border: `4px solid #fff`,
                      boxShadow: `0 0 0 2.5px ${C.primary}, 0 10px 22px -8px rgba(233,82,40,0.6)`,
                      background: C.primary, cursor: 'pointer', flexShrink: 0,
                    }}
                  />
                  <div style={{ width: 50 }} />
                </>
              )}
            </div>
          </>
        )}
      </Shell>
    )
  }

  return null
}

// ── Sub-components ─────────────────────────────────────────────

function Shell({ children, noPadBottom }: { children: React.ReactNode; noPadBottom?: boolean }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: noPadBottom ? '20px 20px 0' : '20px 20px 40px' }}>
        {children}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function ProgressBar({ step, total, onBack }: { step: number; total: number; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <button
        onClick={onBack}
        style={{
          width: 38, height: 38, borderRadius: 12, border: `1px solid ${C.border}`,
          background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#5a534c', fontSize: 19, cursor: 'pointer', flexShrink: 0,
          fontFamily: 'inherit', lineHeight: 1,
        }}
      >
        ‹
      </button>
      <div style={{ flex: 1, height: 6, background: C.subtle, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${(step / total) * 100}%`, height: '100%', background: C.primary, borderRadius: 999, transition: 'width 0.3s' }} />
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.muted, flexShrink: 0 }}>{step} / {total}</div>
    </div>
  )
}

function Field({ label, required, optional, children }: { label: string; required?: boolean; optional?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#46413c', marginBottom: 8 }}>
        {label}
        {required && <span style={{ color: C.primary }}> *</span>}
        {optional && <span style={{ color: C.muted, fontWeight: 500 }}> {optional}</span>}
      </div>
      {children}
    </div>
  )
}

function ConsentItem({ checked, onChange, label, optional }: { checked: boolean; onChange: (v: boolean) => void; label: string; optional?: string }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', gap: 13, alignItems: 'flex-start', cursor: 'pointer',
        border: `1.5px solid ${checked ? C.consentCheckedBorder : C.border}`,
        background: checked ? C.consentChecked : C.card,
        borderRadius: 16, padding: 16, transition: 'all 0.15s',
      }}
    >
      <div style={{
        width: 25, height: 25, flexShrink: 0, borderRadius: 8,
        background: checked ? C.primary : C.card,
        border: checked ? `2px solid ${C.primary}` : `2px solid #d2cabf`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 14, fontWeight: 800,
        transition: 'all 0.15s',
      }}>
        {checked && '✓'}
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.45, fontWeight: checked ? 600 : 500, color: checked ? '#2a2622' : '#5a534c', paddingTop: 2 }}>
        {label}
        {optional && <span style={{ color: C.muted, fontWeight: 400 }}> {optional}</span>}
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: C.primary,
  color: '#fff',
  fontWeight: 700,
  fontSize: 16.5,
  textAlign: 'center',
  padding: '18px',
  borderRadius: 17,
  boxShadow: '0 14px 26px -10px rgba(233,82,40,0.65)',
  border: 'none',
  cursor: 'pointer',
  fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
}

function inputStyle(hasValue: boolean): React.CSSProperties {
  return {
    width: '100%',
    border: `1.5px solid ${hasValue ? C.borderActive : C.border}`,
    borderRadius: 14,
    padding: '15px 16px',
    fontSize: 15.5,
    color: C.dark,
    fontWeight: 500,
    fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
    outline: 'none',
    background: C.card,
    boxSizing: 'border-box',
    boxShadow: hasValue ? `0 0 0 4px rgba(233,82,40,0.12)` : 'none',
    transition: 'all 0.15s',
  }
}

// Suppress BTN unused warning
void BTN
