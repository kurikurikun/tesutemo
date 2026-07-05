import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import { cookies } from 'next/headers'

function checkAuth() {
  return cookies().get('ops_auth')?.value === 'ok'
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  const { data: campaigns } = await supabase
    .from('survey_campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  // Attach respondent counts
  const { data: counts } = await supabase
    .from('survey_respondents')
    .select('campaign_id')

  const countMap: Record<string, number> = {}
  for (const r of counts ?? []) {
    countMap[r.campaign_id] = (countMap[r.campaign_id] ?? 0) + 1
  }

  return NextResponse.json((campaigns ?? []).map(c => ({ ...c, respondentCount: countMap[c.id] ?? 0 })))
}

export async function POST(req: NextRequest) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, client_label, intro_en, intro_jp, max_seconds = 90, deadline, logo_url, lang = 'en', prompts } = body

  if (!name || !prompts?.length) {
    return NextResponse.json({ error: 'name and prompts required' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data: campaign, error } = await supabase
    .from('survey_campaigns')
    .insert({ name, client_label, intro_en, intro_jp, max_seconds, deadline: deadline || null, logo_url, lang })
    .select()
    .single()

  if (error || !campaign) {
    console.error('survey_campaigns insert error:', error)
    return NextResponse.json({ error: error?.message ?? 'insert failed' }, { status: 500 })
  }

  const promptRows = (prompts as Array<{ text_en: string; text_jp: string }>).map((p, i) => ({
    campaign_id: campaign.id,
    order: i,
    text_en: p.text_en,
    text_jp: p.text_jp,
  }))

  await supabase.from('survey_prompts').insert(promptRows)

  return NextResponse.json(campaign)
}
