import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import type { PrepPublicRow } from '@/lib/prep'

/**
 * このルートはキャッシュさせない。
 *
 * Next 14 の GET ルートハンドラは、リクエストを触らないと既定で静的に
 * キャッシュされる。ここは `_req` を使っていないためそれに該当し、送信前に
 * 一度読まれた `submitted_at: null` がそのまま返り続けていた。結果、送信済みの
 * 人が開き直しても案内の1枚目に戻ってしまう。
 *
 * デプロイのたびにキャッシュが消えるので、直後のテストでは正しく見えてしまい、
 * 時間が経ってから壊れる——というたちの悪い出方をする。
 *
 * 名前・日時・スタジオURLを /ops で直したときに反映されない問題も同じ原因。
 */
export const dynamic = 'force-dynamic'

/**
 * 本人向けの読み取り。トークンを知っている人だけが自分の行を引ける。
 * 電話番号や社内メモは返さない（本人に見せる必要がないので、そもそも出さない）。
 */
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('prep_acknowledgements')
    .select('name, company, interview_date, interview_time, lang, interview_type, riverside_url, submitted_at')
    .eq('id', params.token)
    .maybeSingle()

  if (error) {
    console.error('prep fetch error:', error)
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json(data as PrepPublicRow)
}
