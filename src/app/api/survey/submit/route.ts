import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'

type RecordingEntry = {
  promptId: string
  cfUid: string
  mediaType?: string
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const { campaignId, name, email, cohortRole, consents, recordings } = await req.json() as {
    campaignId: string
    name: string
    email: string
    cohortRole?: string
    consents: { record: boolean; recontact: boolean; usage: boolean }
    recordings: RecordingEntry[]
  }

  if (!campaignId || !name || !email || !recordings?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // 1. Create respondent
  const { data: respondent, error: rErr } = await supabase
    .from('survey_respondents')
    .insert({ campaign_id: campaignId, name, email, cohort_role: cohortRole || null })
    .select()
    .single()

  if (rErr || !respondent) {
    return NextResponse.json({ error: rErr?.message ?? 'Failed to save respondent' }, { status: 500 })
  }

  // 2. Store consent
  await supabase.from('survey_consents').insert({
    respondent_id: respondent.id,
    version: '1.0',
    scope_record: consents.record,
    scope_recontact: consents.recontact,
    scope_usage: consents.usage,
  })

  // 3. Create response records
  const responseRows = recordings.map(r => ({
    respondent_id: respondent.id,
    prompt_id: r.promptId,
    cf_uid: r.cfUid,
    media_type: r.mediaType ?? 'video',
    status: 'new',
  }))

  await supabase.from('survey_responses').insert(responseRows)

  return NextResponse.json({ ok: true })
}
