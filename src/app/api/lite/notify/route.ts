import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const FREE_LIMIT = 3

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
    const { campaign_id, respondent_name, session_id } = await req.json()
    if (!campaign_id) return NextResponse.json({ error: 'campaign_id required' }, { status: 400 })

    const { data: campaign } = await supabase
      .from('lite_campaigns')
      .select('name, client_id, questions')
      .eq('id', campaign_id)
      .single()

    if (!campaign) return NextResponse.json({ error: 'campaign not found' }, { status: 404 })

    const { data: client } = await supabase
      .from('lite_clients')
      .select('name, email, org_name')
      .eq('id', campaign.client_id)
      .single()

    if (!client) return NextResponse.json({ ok: true })

    // Count distinct sessions to calculate remaining slots
    const { data: videos } = await supabase
      .from('lite_videos')
      .select('session_id')
      .eq('campaign_id', campaign_id)

    const sessionCount = new Set((videos || []).map(v => v.session_id)).size
    const remaining = Math.max(0, FREE_LIMIT - sessionCount)

    const recordingLink = `https://www.tesutemo.co/lite/record/${campaign_id}`
    const adminUrl = `https://www.tesutemo.co/lite/internal/${campaign.client_id}`
    const respName = respondent_name || '名前未入力'
    const questions: string[] = campaign.questions || []

    const questionLines = questions.map((q, i) => `Q${i + 1}. ${q}`).join('\n')

    const remainingText = remaining > 0
      ? `あと${remaining}名まで無料で録画できます。他の方にもこのリンクをお送りください：\n${recordingLink}`
      : `無料枠（3名）をすべてお使いいただきました。`

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Notify the client
    await resend.emails.send({
      from: 'TesuTemoライト <noreply@tesutemo.co>',
      to: client.email,
      subject: `【TesuTemoライト】${respName}さんから動画が届きました`,
      text: `${client.name} 様\n\n「${campaign.name}」に${respName}さんから動画回答が届きました。\n\n【回答いただいた質問】\n${questionLines}\n\n━━━━━━━━━━━━━━━━━━━━━\nテステモチームが動画を確認・編集し、1週間以内に完成版をお送りします。\n━━━━━━━━━━━━━━━━━━━━━\n\n${remainingText}\n\n━━━━━━━━━━━━━━━━━━━━━\nより本格的な動画インタビューをご希望の方は、プロが取材・編集まで対応するテステモ本サービスもご検討ください。\nhttps://www.tesutemo.co\n━━━━━━━━━━━━━━━━━━━━━\n\nテステモ`,
    })

    // Notify Chris
    await resend.emails.send({
      from: 'TesuTemoライト <noreply@tesutemo.co>',
      to: 'chris@move-ment.co',
      subject: `【TesuTemoライト】新着: ${campaign.name} — ${respName}`,
      text: `クライアント: ${client.org_name} (${client.email})\nキャンペーン: ${campaign.name}\n体験者: ${respName}\nSession: ${session_id}\n\n管理画面: ${adminUrl}`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('notify error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
