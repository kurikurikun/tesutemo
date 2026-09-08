import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import { PREP_STEPS } from '@/lib/prep'

/**
 * 「その画面まで進んだ」の記録。画面に着いた時点で呼ばれるので、2枚目以降の記録は
 * 1つ前の画面で「確認しました・次へ」を押したという意味になる。
 *
 * 一度入った時刻は上書きしない（最初に読んだ時刻を残したいので）。送信まで至らなくても
 * どこまで見たかが残るため、当日どこを口頭で補えばよいかが分かる。
 */
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { step } = await req.json().catch(() => ({ step: null }))
  if (!PREP_STEPS.includes(step)) {
    return NextResponse.json({ error: 'unknown step' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data: row } = await supabase
    .from('prep_acknowledgements')
    .select('first_opened_at, steps_seen')
    .eq('id', params.token)
    .maybeSingle()

  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const now = new Date().toISOString()
  const seen = (row.steps_seen ?? {}) as Record<string, string>
  const patch: Record<string, unknown> = {}

  if (!row.first_opened_at) patch.first_opened_at = now
  if (!seen[step]) patch.steps_seen = { ...seen, [step]: now }

  if (Object.keys(patch).length) {
    await supabase.from('prep_acknowledgements').update(patch).eq('id', params.token)
  }

  return NextResponse.json({ ok: true })
}
