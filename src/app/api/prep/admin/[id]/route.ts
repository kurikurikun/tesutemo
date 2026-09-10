import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/survey'
import { cleanUrl } from '@/lib/prep'

function checkAuth() {
  return cookies().get('ops_auth')?.value === 'ok'
}

/** 発送状況の更新。ページ側から触るのはこの2つだけ。 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const patch: Record<string, string | null> = {}
  if ('kit_shipped_at' in body) patch.kit_shipped_at = body.kit_shipped_at || null
  if ('kit_tracking' in body) patch.kit_tracking = body.kit_tracking || null
  // 事前確認リンクを先に作って、スタジオのURLはあとから入れる運用になる。
  // 予定は動く。日時はあとから直せるようにしておく。
  if ('interview_date' in body) patch.interview_date = body.interview_date || null
  if ('interview_time' in body) patch.interview_time = body.interview_time || null
  if ('riverside_url' in body) patch.riverside_url = cleanUrl(body.riverside_url)
  if ('interview_type' in body)
    patch.interview_type = body.interview_type === 'case_study' ? 'case_study' : 'recruitment'
  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('prep_acknowledgements')
    .update(patch)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('prep admin patch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('prep_acknowledgements').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
