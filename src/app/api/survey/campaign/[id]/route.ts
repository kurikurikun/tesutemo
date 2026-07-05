import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin()

  const { data: campaign, error } = await supabase
    .from('survey_campaigns')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const { data: prompts } = await supabase
    .from('survey_prompts')
    .select('*')
    .eq('campaign_id', params.id)
    .order('order')

  return NextResponse.json({ campaign, prompts: prompts ?? [] })
}
