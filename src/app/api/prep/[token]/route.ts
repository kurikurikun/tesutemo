import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import type { PrepPublicRow } from '@/lib/prep'

/**
 * 本人向けの読み取り。トークンを知っている人だけが自分の行を引ける。
 * 電話番号や社内メモは返さない（本人に見せる必要がないので、そもそも出さない）。
 */
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('prep_acknowledgements')
    .select('name, company, interview_date, lang, kit_type, submitted_at')
    .eq('id', params.token)
    .maybeSingle()

  if (error) {
    console.error('prep fetch error:', error)
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }
  if (!data) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json(data as PrepPublicRow)
}
