import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import { buildIcs } from '@/lib/prep-ics'
import type { PrepLang } from '@/lib/prep'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * 当日の予定を .ics で返す。
 *
 * 当日いちばんつまずくのは「リンクをどこで見つけるか」で、これはページに何を書いても
 * 解けない（そのとき本人はページを見ていない）。予定に入っていれば、時間になると
 * 電話のほうから参加リンクが出てくる。
 */
export async function GET(req: Request, { params }: { params: { token: string } }) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('prep_acknowledgements')
    .select('interview_date, interview_time, lang, riverside_url')
    .eq('id', params.token)
    .maybeSingle()

  if (error) {
    console.error('prep calendar error:', error)
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 })
  // 日付が無い行では予定が作れない。ページ側でもボタンを出していない。
  if (!data.interview_date) return NextResponse.json({ error: 'no date set' }, { status: 404 })

  const body = buildIcs({
    token: params.token,
    date: data.interview_date,
    time: data.interview_time,
    lang: (data.lang === 'en' ? 'en' : 'ja') as PrepLang,
    joinUrl: data.riverside_url ?? null,
    pageUrl: new URL(`/prep/${params.token}`, req.url).toString(),
  })

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="tesutemo-interview.ics"',
      'Cache-Control': 'no-store',
    },
  })
}
