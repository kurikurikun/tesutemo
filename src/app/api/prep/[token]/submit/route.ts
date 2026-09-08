import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/survey'
import { PREP_STEPS, type PrepStep } from '@/lib/prep'

const STEP_LABEL: Record<PrepStep, string> = {
  intro: '1. これは撮影です／お届けするもの',
  critical: '2. 気をつけていただきたい3つ／撮影する場所',
  app: '3. アプリと当日の入り方',
  contact: '4. お名前とご連絡先',
}


/** 確認が入ったときに知らせる先。増やすならここに足す。 */
const NOTIFY_TO = ['kinoshita@move-ment.co']

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const family_name = String(body.family_name ?? '').trim()
  const given_name = String(body.given_name ?? '').trim()
  const family_kana = String(body.family_kana ?? '').trim() || null
  const given_kana = String(body.given_kana ?? '').trim() || null
  const job_title = String(body.job_title ?? '').trim()
  const phone = String(body.phone ?? '').trim()

  // 姓と名は別々に必須。1欄だと姓だけで送られてテロップが作れない。
  if (!family_name || !given_name || !job_title || !phone) {
    return NextResponse.json({ error: 'name, title and phone required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data: row, error } = await supabase
    .from('prep_acknowledgements')
    .update({
      family_name,
      given_name,
      family_kana,
      given_kana,
      job_title,
      phone,
      submitted_at: new Date().toISOString(),
      user_agent: req.headers.get('user-agent'),
    })
    .eq('id', params.token)
    .select('name, company, interview_date, steps_seen')
    .maybeSingle()

  if (error) {
    console.error('prep submit error:', error)
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // 通知が落ちても本人の送信は成立させる。保存のほうが大事。
  try {
    const seen = (row.steps_seen ?? {}) as Record<string, string>
    const stepLines = PREP_STEPS.map(
      (s) => `  ${seen[s] ? '✓' : '×'} ${STEP_LABEL[s]}`
    ).join('\n')

    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'テステモ <noreply@tesutemo.co>',
      to: NOTIFY_TO,
      subject: `【事前確認】${family_name} ${given_name}さんが確認を完了しました${row.company ? `（${row.company}）` : ''}`,
      text: [
        `${row.company ?? ''} ${family_name} ${given_name} 様が、インタビュー前の確認ページを送信しました。`,
        '',
        '【テロップに使う表記】',
        `お名前　　：${family_name} ${given_name}`,
        family_kana || given_kana ? `フリガナ　：${family_kana ?? ''} ${given_kana ?? ''}` : null,
        `役職　　　：${job_title}`,
        `電話番号　：${phone}`,
          `インタビュー日：${row.interview_date ?? '未設定'}`,
        '',
        '【どの画面まで読んだか】',
        stepLines,
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
