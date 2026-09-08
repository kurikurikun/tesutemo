'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  PREP_CHECK_KEYS,
  PREP_COPY,
  PREP_CONTACT,
  PREP_CRITICAL_CHECKS,
  RIVERSIDE_ANDROID,
  RIVERSIDE_IOS,
  type PrepCheckKey,
  type PrepLang,
  type PrepPublicRow,
} from '@/lib/prep'
import { readyPrepPhotos } from '@/lib/prep-photos'

type Screen = 'loading' | 'error' | 'page' | 'done'

const BLANK_CHECKS = Object.fromEntries(PREP_CHECK_KEYS.map((k) => [k, false])) as Record<
  PrepCheckKey,
  boolean
>

function formatDate(iso: string, lang: PrepLang) {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  // dateStyle と weekday は同時に指定できない（実行時に TypeError になる）ので、
  // 曜日まで出したい日本語側は個別指定で組む。
  return lang === 'ja'
    ? new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(d)
    : new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(d)
}

function Section({
  title,
  lede,
  children,
}: {
  title: string
  lede?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {lede && <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{lede}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-gray-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrepPage() {
  const { token } = useParams<{ token: string }>()

  const [screen, setScreen] = useState<Screen>('loading')
  const [row, setRow] = useState<PrepPublicRow | null>(null)
  const [checks, setChecks] = useState<Record<PrepCheckKey, boolean>>(BLANK_CHECKS)
  const [fullName, setFullName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [phone, setPhone] = useState('')
  const [contactNote, setContactNote] = useState('')
  const [readToEnd, setReadToEnd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const sentinel = useRef<HTMLDivElement | null>(null)

  const ping = useCallback(
    (event: 'open' | 'scroll') => {
      fetch(`/api/prep/${token}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      }).catch(() => {})
    },
    [token]
  )

  useEffect(() => {
    let live = true
    fetch(`/api/prep/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then((data: PrepPublicRow) => {
        if (!live) return
        setRow(data)
        setScreen('page')
        ping('open')
      })
      .catch(() => live && setScreen('error'))
    return () => {
      live = false
    }
  }, [token, ping])

  // フォームの手前に置いたセンチネルが画面に入ったら「最後まで読んだ」とみなす。
  useEffect(() => {
    const el = sentinel.current
    if (screen !== 'page' || !el || readToEnd) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReadToEnd(true)
          ping('scroll')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [screen, readToEnd, ping])

  const lang: PrepLang = row?.lang === 'en' ? 'en' : 'ja'
  const t = PREP_COPY[lang]
  const photos = readyPrepPhotos()

  const allChecked = PREP_CHECK_KEYS.every((k) => checks[k])
  const filled = fullName.trim() && jobTitle.trim() && phone.trim()
  const canSubmit = readToEnd && allChecked && filled && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/prep/${token}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName.trim(),
        job_title: jobTitle.trim(),
        phone: phone.trim(),
        contact_note: contactNote.trim(),
        checks,
      }),
    }).catch(() => null)

    if (res?.ok) {
      setScreen('done')
      window.scrollTo({ top: 0 })
    } else {
      setError(t.submitError)
      setSaving(false)
    }
  }

  if (screen === 'loading') {
    return <div className="p-10 text-center text-sm text-gray-400">…</div>
  }

  if (screen === 'error' || !row) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-[15px] leading-relaxed text-gray-700">
          このリンクは見つかりませんでした。お手数ですが、ご案内メールのリンクをもう一度お確かめください。
          <br />
          This link could not be found. Please check the link in your invitation email.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          {PREP_CONTACT.person}　
          <a className="text-primary" href={`tel:${PREP_CONTACT.tel}`}>
            {PREP_CONTACT.tel}
          </a>
        </p>
      </div>
    )
  }

  const contactBlock = (
    <div className="mt-12 rounded-2xl bg-white p-6 ring-1 ring-gray-200">
      <h2 className="text-base font-bold text-gray-900">{t.helpTitle}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{t.helpBody}</p>
      <div className="mt-4 space-y-1 text-[15px] text-gray-800">
        <p>
          {PREP_CONTACT.company}　{lang === 'ja' ? PREP_CONTACT.person : PREP_CONTACT.personEn}
        </p>
        <p>
          <a className="font-semibold text-primary" href={`tel:${PREP_CONTACT.tel}`}>
            {PREP_CONTACT.tel}
          </a>
        </p>
        <p>
          <a className="text-primary" href={`mailto:${PREP_CONTACT.email}`}>
            {PREP_CONTACT.email}
          </a>
        </p>
      </div>
    </div>
  )

  if (screen === 'done') {
    return (
      <main className="mx-auto max-w-xl px-5 py-20">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{t.doneTitle}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{t.doneBody}</p>
        </div>
        {contactBlock}
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-10">
      {/* 冒頭で枠組みを変える。ここが本題より先に来ることに意味がある。 */}
      <p className="text-xs font-bold uppercase tracking-widest text-primary">{t.kicker}</p>
      <h1 className="mt-3 text-[26px] font-bold leading-snug text-gray-900">{t.title}</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-gray-700">{t.lede}</p>

      <div className="mt-6 rounded-xl bg-white px-5 py-4 text-sm text-gray-700 ring-1 ring-gray-200">
        <p className="font-semibold text-gray-900">{t.forWhom(row.name)}</p>
        {row.company && <p className="mt-0.5 text-gray-500">{row.company}</p>}
        {row.interview_date && (
          <p className="mt-1.5">{t.onDate(formatDate(row.interview_date, lang))}</p>
        )}
      </div>

      {row.submitted_at && (
        <div className="mt-4 rounded-xl bg-emerald-50 px-5 py-4 ring-1 ring-emerald-200">
          <p className="text-sm font-semibold text-emerald-900">{t.alreadyDone}</p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-800">{t.alreadyDoneBody}</p>
        </div>
      )}

      <Section title={t.kitTitle} lede={t.kitLede}>
        <Bullets items={t.kitItems} />
        <p className="mt-4 text-sm leading-relaxed text-gray-500">{t.kitNote}</p>
      </Section>

      {/* 事故になりやすい3点。他の項目と同じ見た目にしないこと。 */}
      <Section title={t.ngTitle} lede={t.ngLede}>
        <div className="space-y-3">
          {t.ng.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white p-5 ring-1 ring-red-200">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.heightTitle} lede={t.heightBody}>
        <Bullets items={t.heightBullets} />
      </Section>

      {/* 写真は入っているものだけ出す。1枚もなくてもページは成立する。 */}
      {photos.length > 0 && (
        <div className="mt-8 space-y-4">
          {photos.map((p) => (
            <figure key={p.key}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={t.photoCaptions[p.key]}
                className={`w-full rounded-2xl ring-1 ${
                  p.tone === 'good'
                    ? 'ring-emerald-300'
                    : p.tone === 'bad'
                      ? 'ring-red-300'
                      : 'ring-gray-200'
                }`}
              />
              <figcaption className="mt-2 flex gap-2 text-sm leading-relaxed text-gray-600">
                {p.tone !== 'neutral' && (
                  <span
                    className={`font-bold ${p.tone === 'good' ? 'text-emerald-600' : 'text-red-500'}`}
                  >
                    {p.tone === 'good' ? '○' : '×'}
                  </span>
                )}
                <span>{t.photoCaptions[p.key]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Section title={t.roomTitle}>
        <Bullets items={t.roomBullets} />
      </Section>

      <Section title={t.appTitle}>
        <Bullets items={t.appBullets} />
        <div className="mt-4 space-y-2">
          <a
            href={RIVERSIDE_IOS}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-primary ring-1 ring-gray-200"
          >
            {t.appIos} →
          </a>
          <a
            href={RIVERSIDE_ANDROID}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-primary ring-1 ring-gray-200"
          >
            {t.appAndroid} →
          </a>
        </div>
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
          {t.appWarning}
        </p>
      </Section>

      <Section title={t.dayTitle}>
        <Bullets items={t.dayBullets} />
      </Section>

      {/* ここまで来たら「最後まで読んだ」。フォームの手前に置くのがポイント。 */}
      <div ref={sentinel} aria-hidden className="h-px" />

      <form onSubmit={handleSubmit} className="mt-12 rounded-2xl bg-white p-6 ring-1 ring-gray-200">
        <h2 className="text-lg font-bold text-gray-900">{t.formTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.formLede}</p>

        <div className="mt-5 space-y-2">
          {PREP_CHECK_KEYS.map((key) => {
            const critical = PREP_CRITICAL_CHECKS.includes(key)
            return (
              <label
                key={key}
                className={`flex cursor-pointer gap-3 rounded-xl px-4 py-3 ring-1 transition ${
                  checks[key]
                    ? 'bg-emerald-50 ring-emerald-300'
                    : critical
                      ? 'bg-red-50/60 ring-red-200'
                      : 'bg-gray-50 ring-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={(e) => setChecks((c) => ({ ...c, [key]: e.target.checked }))}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-600"
                />
                <span className="text-sm leading-relaxed text-gray-800">{t.checks[key]}</span>
              </label>
            )
          })}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">{t.fullNameLabel}</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-3 text-[16px] text-gray-900 focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">{t.jobTitleLabel}</label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t.jobTitlePlaceholder}
              className="mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-3 text-[16px] text-gray-900 focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">{t.phoneLabel}</label>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{t.phoneHelp}</p>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              type="tel"
              inputMode="tel"
              className="mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-3 text-[16px] text-gray-900 focus:border-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">
              {t.contactNoteLabel}
            </label>
            <input
              value={contactNote}
              onChange={(e) => setContactNote(e.target.value)}
              placeholder={t.contactNotePlaceholder}
              className="mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-3 text-[16px] text-gray-900 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-xl bg-primary py-4 text-[16px] font-bold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {saving ? t.submitting : t.submit}
        </button>
        {!canSubmit && !saving && (
          <p className="mt-3 text-center text-xs text-gray-500">
            {readToEnd ? t.requiredNote : t.formGate}
          </p>
        )}
      </form>

      {contactBlock}
    </main>
  )
}
