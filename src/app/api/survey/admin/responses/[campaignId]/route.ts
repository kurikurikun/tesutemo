import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import { cookies } from 'next/headers'

export async function GET(_req: NextRequest, { params }: { params: { campaignId: string } }) {
  if (cookies().get('ops_auth')?.value !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  // Get all respondents for this campaign
  const { data: respondents } = await supabase
    .from('survey_respondents')
    .select('*')
    .eq('campaign_id', params.campaignId)
    .order('created_at', { ascending: false })

  if (!respondents?.length) return NextResponse.json([])

  const respondentIds = respondents.map(r => r.id)

  // Get all responses (with prompt info)
  const { data: responses } = await supabase
    .from('survey_responses')
    .select('*, prompt:survey_prompts(*)')
    .in('respondent_id', respondentIds)
    .order('created_at', { ascending: false })

  // Group responses by respondent
  const responsesByRespondent: Record<string, typeof responses> = {}
  for (const r of responses ?? []) {
    if (!responsesByRespondent[r.respondent_id]) responsesByRespondent[r.respondent_id] = []
    responsesByRespondent[r.respondent_id]!.push(r)
  }

  const result = respondents.map(respondent => ({
    ...respondent,
    responses: responsesByRespondent[respondent.id] ?? [],
  }))

  return NextResponse.json(result)
}
