'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  PREP_COPY,
  PREP_CONTACT,
  PREP_STEPS,
  RIVERSIDE_ANDROID,
  RIVERSIDE_IOS,
  PREP_EXAMPLES,
  SHOWCASE_URL,
  exampleEmbedUrl,
  type PrepInterviewType,
  type PrepLang,
  type PrepPublicRow,
  type PrepStep,
} from '@/lib/prep'
import { PREP_PHOTOS } from '@/lib/prep-photos'

type Screen = 'loading' | 'notfound' | 'failed' | 'steps' | 'done'

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

/** DBの time は "14:00:00" で返る。秒は落とす。英語版はJSTを明示する。 */
function formatTime(value: string, lang: PrepLang) {
  const hhmm = value.slice(0, 5)
  return lang === 'ja' ? hhmm : `${hhmm} (JST)`
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

function Field({
  label,
  help,
  children,
}: {
  label: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600">{label}</span>
      {help && <span className="mt-1 block text-xs leading-relaxed text-gray-500">{help}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  )
}

/**
 * 当日の入り口。行に riverside_url が入っているときだけ出る。
 *
 * これがあると、当日は「このページを開いてボタンを押す」だけで済む。メールを
 * 探してリンクを長押しコピーして、アプリに貼る……という一番つまずくところが
 * まるごと無くなる。
 */
function JoinBox({
  url,
  title,
  note,
  button,
}: {
  url: string
  title?: string
  note: string
  button: string
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-primary/30">
      {title && <h2 className="text-[15px] font-bold text-gray-900">{title}</h2>}
      <p className={`text-sm leading-relaxed text-gray-600 ${title ? 'mt-1.5' : ''}`}>{note}</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block rounded-xl bg-primary py-4 text-center text-[16px] font-bold text-white"
      >
        {button} →
      </a>
    </div>
  )
}

/**
 * スタンド設置の作例。`src` が空のスロットは枠だけを出す。
 * 撮影前でも並びが確認できる一方、**本番でも枠が見える** ので、送る前に写真を入れる。
 */
function StandPhotos({ captions }: { captions: Record<string, string> }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {PREP_PHOTOS.map((p) => (
        <figure key={p.key} className="m-0">
          {p.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.src}
              alt={captions[p.key] ?? ''}
              className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100">
              <span className="text-[11px] text-gray-400">写真を準備中</span>
            </div>
          )}
          <figcaption className="mt-1.5 text-xs leading-snug text-gray-600">
            {captions[p.key]}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/**
 * 完成例の縦型を2本。読む前に「こういうものを撮ります」が伝わるのが狙い。
 *
 * 自動再生はしない。勝手に動くと通信量を食うし、音が出ると驚かせる。
 * lazy にしてあるので、スクロールして見えるまで読み込まれない。
 */
function ExampleVideos({ type }: { type: PrepInterviewType }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {PREP_EXAMPLES[type].map((v) => (
        <div
          key={v.id}
          className="aspect-[9/16] overflow-hidden rounded-xl bg-gray-900 ring-1 ring-gray-200"
        >
          <iframe
            src={exampleEmbedUrl(v)}
            className="h-full w-full"
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            title="TesuTemo の完成例"
          />
        </div>
      ))}
    </div>
  )
}

const inputClass =
  'block w-full rounded-xl border border-gray-200 px-4 py-3 text-[16px] text-gray-900 focus:border-primary focus:outline-none'

export default function PrepPage() {
  const { token } = useParams<{ token: string }>()

  const [screen, setScreen] = useState<Screen>('loading')
  const [row, setRow] = useState<PrepPublicRow | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  const [familyName, setFamilyName] = useState('')
  const [givenName, setGivenName] = useState('')
  const [familyKana, setFamilyKana] = useState('')
  const [givenKana, setGivenKana] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [phone, setPhone] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // 画面に着いた時点で記録する。つまり1つ前の画面の「次へ」を押したという記録。
  const markSeen = useCallback(
    (step: PrepStep) => {
      fetch(`/api/prep/${token}/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step }),
      }).catch(() => {})
    },
    [token]
  )

  useEffect(() => {
    let live = true
    fetch(`/api/prep/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: PrepPublicRow) => {
        if (!live) return
        setRow(data)
        setScreen('steps')
        markSeen(PREP_STEPS[0])
      })
      // リンクが無いのか、こちら側が落ちているのかは分けて出す。同じ文面にすると、
      // 設定ミスで落ちているときに本人が「リンクが違うのだろう」と思って連絡してこない。
      .catch((e: Error) => live && setScreen(e.message === '404' ? 'notfound' : 'failed'))
    return () => {
      live = false
    }
  }, [token, markSeen])

  const lang: PrepLang = row?.lang === 'en' ? 'en' : 'ja'
  const t = PREP_COPY[lang]
  const isJa = lang === 'ja'
  // 採用か導入事例か。冒頭の一文と、完成イメージのリンク先だけが変わる。
  const type: PrepInterviewType = row?.interview_type === 'case_study' ? 'case_study' : 'recruitment'

  function goNext() {
    const next = stepIndex + 1
    setStepIndex(next)
    markSeen(PREP_STEPS[next])
    window.scrollTo({ top: 0 })
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1))
    window.scrollTo({ top: 0 })
  }

  const nameFilled = familyName.trim() && givenName.trim()
  const kanaFilled = !isJa || (familyKana.trim() && givenKana.trim())
  const canSubmit = nameFilled && kanaFilled && jobTitle.trim() && phone.trim() && !saving

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/prep/${token}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        family_name: familyName.trim(),
        given_name: givenName.trim(),
        family_kana: familyKana.trim(),
        given_kana: givenKana.trim(),
        job_title: jobTitle.trim(),
        phone: phone.trim(),
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

  if (screen === 'notfound' || screen === 'failed' || !row) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-[15px] leading-relaxed text-gray-700">
          {screen === 'failed' ? (
            <>
              ただいまページを表示できません。お手数ですが、下記までご連絡ください。
              <br />
              We can’t load this page right now. Please get in touch below.
            </>
          ) : (
            <>
              このリンクは見つかりませんでした。お手数ですが、ご案内メールのリンクをもう一度お確かめください。
              <br />
              This link could not be found. Please check the link in your invitation email.
            </>
          )}
        </p>
        {/* この画面では行が引けていないので言語が分からない。両方の連絡先を出す。 */}
        <div className="mt-6 space-y-1 text-sm text-gray-500">
          {(['ja', 'en'] as const).map((l) => (
            <p key={l}>
              {PREP_CONTACT[l].who}　
              <a className="text-primary" href={`tel:${PREP_CONTACT[l].tel}`}>
                {PREP_CONTACT[l].tel}
              </a>
            </p>
          ))}
        </div>
      </div>
    )
  }

  const contactBlock = (
    <div className="mt-12 rounded-2xl bg-white p-6 ring-1 ring-gray-200">
      <h2 className="text-base font-bold text-gray-900">{t.helpTitle}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{t.helpBody}</p>
      <div className="mt-4 space-y-1 text-[15px] text-gray-800">
        <p>{PREP_CONTACT[lang].who}</p>
        <p>
          <a className="font-semibold text-primary" href={`tel:${PREP_CONTACT[lang].tel}`}>
            {PREP_CONTACT[lang].tel}
          </a>
        </p>
        <p>
          <a className="text-primary" href={`mailto:${PREP_CONTACT[lang].email}`}>
            {PREP_CONTACT[lang].email}
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
        {row.riverside_url && (
          <div className="mt-6">
            <JoinBox
              url={row.riverside_url}
              title={t.onDayTitle}
              note={t.joinNote}
              button={t.joinButton}
            />
          </div>
        )}
        {contactBlock}
      </main>
    )
  }

  const step = PREP_STEPS[stepIndex]
  const total = PREP_STEPS.length

  // テロップの見え方をその場で出す。書いた文字がそのまま世に出ると分かれば、
  // 姓だけ・名だけローマ字、といった書き方は起きにくい。
  // 並び順は言語で変わる。日本語は姓→名、英語は名→姓。
  const captionName = (isJa
    ? [familyName.trim(), givenName.trim()]
    : [givenName.trim(), familyName.trim()]
  )
    .filter(Boolean)
    .join(' ')
  const captionLines = [captionName, jobTitle.trim(), row.company ?? ''].filter(Boolean)

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-8">
      <div className="flex items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{t.kicker}</p>
        <span className="ml-auto text-xs font-semibold tabular-nums text-gray-400">
          {t.stepOf(stepIndex + 1, total)}
        </span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {PREP_STEPS.map((s, i) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-primary' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {step === 'before' && (
        <>
          <p className="mt-6 whitespace-pre-line text-[18px] font-bold leading-snug text-gray-900 sm:text-[20px]">
            {t.title}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">{t.lede[type]}</p>

          <section className="mt-6">
            <h2 className="text-[15px] font-bold text-gray-900">{t.examplesTitle}</h2>
            <ExampleVideos type={type} />
            <a
              href={SHOWCASE_URL[type]}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4"
            >
              {t.showcaseLabel} →
            </a>
          </section>

          <div className="mt-6 rounded-xl bg-white px-5 py-4 text-sm text-gray-700 ring-1 ring-gray-200">
            <p className="font-semibold text-gray-900">{t.forWhom(row.name)}</p>
            {row.company && <p className="mt-0.5 text-gray-500">{row.company}</p>}
            {row.interview_date && (
              <p className="mt-1.5">
                {t.onDate(
                  [
                    formatDate(row.interview_date, lang),
                    row.interview_time ? formatTime(row.interview_time, lang) : null,
                  ]
                    .filter(Boolean)
                    .join('　')
                )}
              </p>
            )}
          </div>

          {row.submitted_at && (
            <div className="mt-4 rounded-xl bg-emerald-50 px-5 py-4 ring-1 ring-emerald-200">
              <p className="text-sm font-semibold text-emerald-900">{t.alreadyDone}</p>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800">{t.alreadyDoneBody}</p>
            </div>
          )}

          {/* 当日このページを開いた人が、すぐ入れるように最初の画面にも出す。 */}
          {row.riverside_url && row.submitted_at && (
            <div className="mt-4">
              <JoinBox
                url={row.riverside_url}
                title={t.onDayTitle}
                note={t.joinNote}
                button={t.joinButton}
              />
            </div>
          )}


          <section className="mt-12">
            <h1 className="text-[22px] font-bold leading-snug text-gray-900 sm:text-[26px]">
              {t.beforeTitle}
            </h1>
            <div className="mt-4">
              <Bullets items={t.appBullets} />
            </div>
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
          </section>
        </>
      )}

      {step === 'onday' && (
        <>
          <h1 className="mt-6 text-[22px] font-bold leading-snug text-gray-900 sm:text-[26px]">
            {t.onDayTitle}
          </h1>

          {/* 当日やることの順番どおり。部屋を整えてから、時間になったら入る。 */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">{t.envTitle}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{t.envLede}</p>
            <div className="mt-4">
              <Bullets items={t.envBullets} />
            </div>
            <StandPhotos captions={t.photoCaptions} />
          </section>

          {/* スタジオURLが未設定の行では出さない（見出しだけ残さない）。 */}
          {row.riverside_url && (
            <div className="mt-10">
              <JoinBox url={row.riverside_url} note={t.joinNote} button={t.joinButton} />
            </div>
          )}
        </>
      )}

      {step === 'contact' && (
        <form onSubmit={handleSubmit} className="mt-6">
          <h1 className="text-[22px] font-bold leading-snug text-gray-900 sm:text-[26px]">
            {t.formTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{t.formLede}</p>

          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
            {t.captionNote}
          </p>

          <div className="mt-6 space-y-4">
            {/* 日本語は姓→名、英語は名→姓。並び順が言語の様式と違うと書き間違えやすい。 */}
            <div className="grid grid-cols-2 gap-3">
              {(isJa ? ['family', 'given'] : ['given', 'family']).map((which) =>
                which === 'family' ? (
                  <Field key="family" label={t.familyNameLabel}>
                    <input
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder={t.familyNamePlaceholder}
                      className={inputClass}
                      autoComplete="family-name"
                      required
                    />
                  </Field>
                ) : (
                  <Field key="given" label={t.givenNameLabel}>
                    <input
                      value={givenName}
                      onChange={(e) => setGivenName(e.target.value)}
                      placeholder={t.givenNamePlaceholder}
                      className={inputClass}
                      autoComplete="given-name"
                      required
                    />
                  </Field>
                )
              )}
            </div>

            {isJa && (
              <div className="grid grid-cols-2 gap-3">
                <Field label={t.kanaLabel}>
                  <input
                    value={familyKana}
                    onChange={(e) => setFamilyKana(e.target.value)}
                    placeholder={t.familyKanaPlaceholder}
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label="　">
                  <input
                    value={givenKana}
                    onChange={(e) => setGivenKana(e.target.value)}
                    placeholder={t.givenKanaPlaceholder}
                    className={inputClass}
                    required
                  />
                </Field>
              </div>
            )}

            <Field label={t.jobTitleLabel}>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder={t.jobTitlePlaceholder}
                className={inputClass}
                autoComplete="organization-title"
                required
              />
            </Field>

            {/* 入力したものがそのまま画面に出る、という確認。 */}
            {captionLines.length > 0 && (
              <div className="rounded-xl bg-gray-900 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {t.captionPreviewLabel}
                </p>
                <p className="mt-2 text-lg font-bold leading-tight text-white">
                  {captionLines[0]}
                </p>
                {captionLines.slice(1).map((line, i) => (
                  <p key={i} className="text-sm leading-snug text-gray-300">
                    {line}
                  </p>
                ))}
              </div>
            )}

            <Field label={t.phoneLabel} help={t.phoneHelp}>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                type="tel"
                inputMode="tel"
                className={inputClass}
                autoComplete="tel"
                required
              />
            </Field>
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
            <p className="mt-3 text-center text-xs text-gray-500">{t.requiredNote}</p>
          )}
        </form>
      )}

      {/* 読む画面は止めない。押すこと自体が「読みました」の記録になる。 */}
      {step !== 'contact' && (
        <button
          type="button"
          onClick={goNext}
          className="mt-10 w-full rounded-xl bg-primary py-4 text-[16px] font-bold text-white"
        >
          {t.next}
        </button>
      )}

      {stepIndex > 0 && (
        <button
          type="button"
          onClick={goBack}
          className="mt-3 w-full py-2 text-center text-sm text-gray-500"
        >
          {t.back}
        </button>
      )}

      {contactBlock}
    </main>
  )
}
