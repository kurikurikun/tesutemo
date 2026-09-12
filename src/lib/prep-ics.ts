import { PREP_COPY, PREP_CONTACT, calDate, calStamp, interviewWindow, type PrepLang } from './prep'

/** iCalendar は CRLF と75オクテット折り返しが決まりなので、そこだけ守る。 */
export function foldIcsLine(line: string) {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const out: string[] = []
  let cut = 0
  let limit = 75
  while (cut < bytes.length) {
    let end = Math.min(cut + limit, bytes.length)
    // マルチバイト文字の途中で切らない（切ると文字化けする）。
    while (end > cut && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--
    out.push(bytes.subarray(cut, end).toString('utf8'))
    cut = end
    limit = 74 // 継続行は先頭の空白1つを足して75オクテットになる
  }
  return out.join('\r\n ')
}

/** テキスト値のエスケープ。順番を変えないこと（先に \ を倍にする）。 */
const esc = (v: string) =>
  v
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

/**
 * パラメータ値（CN= など）はテキスト値と規則が違い、`, ; :` を含むなら
 * バックスラッシュではなく二重引用符でくるむ。木下さんの肩書きにも Chris の
 * 社名にもカンマが入るので、常にくるむ。
 */
const escParam = (v: string) => `"${v.replace(/["\r\n]/g, '')}"`

/**
 * 当日の予定1件。
 *
 * 時刻が未設定の行は終日予定にする。日付も無い行では予定が作れないので、
 * 呼ぶ側でボタンごと出さない。
 */
export function buildIcs({
  token,
  date,
  time,
  lang,
  joinUrl,
  pageUrl,
  now = new Date(),
}: {
  token: string
  date: string
  time: string | null
  lang: PrepLang
  joinUrl: string | null
  pageUrl: string
  now?: Date
}) {
  const t = PREP_COPY[lang]
  const w = interviewWindow(date, time)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TesuTemo//prep//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:prep-${token}@tesutemo.co`,
    `DTSTAMP:${calStamp(now)}`,
    w.allDay ? `DTSTART;VALUE=DATE:${calDate(date)}` : `DTSTART:${calStamp(w.start)}`,
    w.allDay ? `DTEND;VALUE=DATE:${calDate(date, 1)}` : `DTEND:${calStamp(w.end)}`,
    `SUMMARY:${esc(t.calEventTitle)}`,
    `DESCRIPTION:${esc(t.calEventBody(joinUrl, pageUrl))}`,
    `LOCATION:${esc(joinUrl ?? pageUrl)}`,
    `URL:${joinUrl ?? pageUrl}`,
    `ORGANIZER;CN=${escParam(PREP_CONTACT[lang].who)}:mailto:${PREP_CONTACT[lang].email}`,
    // 1時間前——部屋とスタンドを用意するため。10分前——リンクを開くため。
    ...(['-PT1H', '-PT10M'] as const).flatMap((trigger) => [
      'BEGIN:VALARM',
      `TRIGGER:${trigger}`,
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(t.calEventTitle)}`,
      'END:VALARM',
    ]),
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map(foldIcsLine).join('\r\n') + '\r\n'
}
