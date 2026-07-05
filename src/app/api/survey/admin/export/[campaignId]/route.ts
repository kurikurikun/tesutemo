import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'
import { cookies } from 'next/headers'

export async function GET(_req: NextRequest, { params }: { params: { campaignId: string } }) {
  if (cookies().get('ops_auth')?.value !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  // Shortlisted responses → unique respondents
  const { data: responses } = await supabase
    .from('survey_responses')
    .select('respondent_id')
    .eq('status', 'shortlisted')

  if (!responses?.length) {
    return new NextResponse('name,email,cohort_role,submitted_at\n', {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="shortlisted.csv"`,
      },
    })
  }

  const respondentIds = Array.from(new Set(responses.map(r => r.respondent_id)))

  const { data: respondents } = await supabase
    .from('survey_respondents')
    .select('name, email, cohort_role, created_at')
    .in('id', respondentIds)
    .eq('campaign_id', params.campaignId)

  const rows = (respondents ?? []).map(r =>
    [r.name, r.email, r.cohort_role ?? '', r.created_at].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  )

  const csv = ['name,email,cohort_role,submitted_at', ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="shortlisted-${params.campaignId}.csv"`,
    },
  })
}
