import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'

/**
 * 「読んだ」の弱いシグナル。ページを開いた時点と、最後までスクロールした時点。
 *
 * どちらも一度立ったら上書きしない（最初に開いた時刻を残したいので）。
 * メールのリンクプレビュー用ボットはHTMLは取りに来るが、このAPIはページ内の
 * JSからしか呼ばれないので、開封が誤検知で立つことは基本的にない。
 */
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { event } = await req.json().catch(() => ({ event: null }))
  if (event !== 'open' && event !== 'scroll') {
    return NextResponse.json({ error: 'unknown event' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const column = event === 'open' ? 'first_opened_at' : 'scrolled_to_end_at'

  const { data: row } = await supabase
    .from('prep_acknowledgements')
    .select(column)
    .eq('id', params.token)
    .maybeSingle()

  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // 最初の一回だけ記録する。
  if ((row as Record<string, string | null>)[column]) return NextResponse.json({ ok: true })

  await supabase
    .from('prep_acknowledgements')
    .update({ [column]: new Date().toISOString() })
    .eq('id', params.token)

  return NextResponse.json({ ok: true })
}
