import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
    const { data: campaign, error } = await supabase
      .from('lite_campaigns')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !campaign) {
      return NextResponse.json({ error: 'キャンペーンが見つかりません' }, { status: 404 })
    }

    const { data: videos } = await supabase
      .from('lite_videos')
      .select('*')
      .eq('campaign_id', params.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ campaign, videos: videos || [] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
    const { error } = await supabase
      .from('lite_campaigns')
      .delete()
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
