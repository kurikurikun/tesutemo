import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import { cookies } from 'next/headers'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (cookies().get('ops_auth')?.value !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, client_label, intro_en, intro_jp, max_seconds, deadline, logo_url, lang, prompts } = body
  const supabase = getSupabaseAdmin()

  const { data: campaign, error } = await supabase
    .from('survey_campaigns')
    .update({ name, client_label, intro_en, intro_jp, max_seconds, deadline: deadline || null, logo_url, lang })
    .eq('id', params.id)
    .select()
    .single()

  if (error || !campaign) {
    return NextResponse.json({ error: error?.message ?? 'update failed' }, { status: 500 })
  }

  // Replace prompts
  await supabase.from('survey_prompts').delete().eq('campaign_id', params.id)
  await supabase.from('survey_prompts').insert(
    (prompts as Array<{ text_en: string; text_jp: string }>).map((p, i) => ({
      campaign_id: params.id,
      order: i,
      text_en: p.text_en,
      text_jp: p.text_jp,
    }))
  )

  return NextResponse.json(campaign)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (cookies().get('ops_auth')?.value !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  // Delete cascade: responses → respondents → prompts → campaign
  const { data: respondents } = await supabase
    .from('survey_respondents')
    .select('id')
    .eq('campaign_id', params.id)

  if (respondents?.length) {
    const ids = respondents.map(r => r.id)
    await supabase.from('survey_responses').delete().in('respondent_id', ids)
    await supabase.from('survey_consents').delete().in('respondent_id', ids)
    await supabase.from('survey_respondents').delete().in('id', ids)
  }

  await supabase.from('survey_prompts').delete().eq('campaign_id', params.id)
  await supabase.from('survey_campaigns').delete().eq('id', params.id)

  return NextResponse.json({ ok: true })
}
