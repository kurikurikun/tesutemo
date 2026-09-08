import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/survey'

function checkAuth() {
  return cookies().get('ops_auth')?.value === 'ok'
}

/** 一覧。インタビュー日が近い順に並べる（当日が近くて未読の人を先に見たいので）。 */
export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('prep_acknowledgements')
    .select('*')
    .order('interview_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('prep admin list error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data ?? [])
}

/** リンクを1本作る。返ってきた id がそのまま /prep/<id>。 */
export async function POST(req: NextRequest) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, company, interview_date, lang = 'ja', setup_mode = 'floor' } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('prep_acknowledgements')
    .insert({
      name,
      company: company || null,
      interview_date: interview_date || null,
      lang: lang === 'en' ? 'en' : 'ja',
      setup_mode: setup_mode === 'desk' ? 'desk' : 'floor',
    })
    .select()
    .single()

  if (error || !data) {
    console.error('prep admin insert error:', error)
    return NextResponse.json({ error: error?.message ?? 'insert failed' }, { status: 500 })
  }
  return NextResponse.json(data)
}
