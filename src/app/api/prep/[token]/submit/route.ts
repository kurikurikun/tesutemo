import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/survey'
import { PREP_CHECK_KEYS, PREP_COPY, type PrepLang } from '@/lib/prep'

/** 確認が入ったときに知らせる先。増やすならここに足す。 */
const NOTIFY_TO = ['kinoshita@move-ment.co']

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const full_name = String(body.full_name ?? '').trim()
  const job_title = String(body.job_title ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const contact_note = String(body.contact_note ?? '').trim() || null
  const checks = (body.checks ?? {}) as Record<string, boolean>

  if (!full_name || !job_title || !phone) {
    return NextResponse.json({ error: 'name, title and phone required' }, { status: 400 })
  }
  // 記録として意味を持たせたいので、8項目すべてにチェックが入っていることを
  // サーバ側でも確かめる。「送信された = 8つ全部に同意した」と読めるようにする。
  if (!PREP_CHECK_KEYS.every((k) => checks[k] === true)) {
    return NextResponse.json({ error: 'all checks required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data: row, error } = await supabase
    .from('prep_acknowledgements')
    .update({
      full_name,
      job_title,
      phone,
      contact_note,
      checks,
      submitted_at: new Date().toISOString(),
      user_agent: req.headers.get('user-agent'),
    })
    .eq('id', params.token)
    .select('name, company, interview_date, lang')
    .maybeSingle()

  if (error) {
    console.error('prep submit error:', error)
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // 通知が落ちても本人の送信は成立させる。保存のほうが大事。
  try {
    const lang = (row.lang ?? 'ja') as PrepLang
    const checkLines = PREP_CHECK_KEYS.map(
      (k) => `  ${checks[k] ? '✓' : '×'} ${PREP_COPY[lang].checks[k]}`
    ).join('\n')

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'テステモ <noreply@tesutemo.co>',
      to: NOTIFY_TO,
      subject: `【事前確認】${full_name}さんが確認を完了しました${row.company ? `（${row.company}）` : ''}`,
      text: [
        `${row.company ?? ''} ${full_name} 様が、インタビュー前の確認ページを送信しました。`,
        '',
        `お名前　　：${full_name}`,
        `役職　　　：${job_title}`,
        `電話番号　：${phone}`,
        contact_note ? `連絡の補足：${contact_note}` : null,
        `インタビュー日：${row.interview_date ?? '未設定'}`,
        '',
        '【チェック項目】',
        checkLines,
        '',
        '一覧： https://www.tesutemo.co/ops/prep',
      ]
        .filter(Boolean)
        .join('\n'),
    })
  } catch (e) {
    console.error('prep notify failed:', e)
  }

  return NextResponse.json({ ok: true })
}
