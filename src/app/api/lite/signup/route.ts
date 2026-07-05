import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const SUPABASE_URL = 'https://zmbvcsowniyrtaleluoc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYnZjc293bml5cnRhbGVsdW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDUyNzUsImV4cCI6MjA4OTQ4MTI3NX0.82NhpISN0nt9tL9NKsEC0Bnra0IWqI9QXuOk1UtL3BE'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const body = await req.json()
    const { name, org_name, email, phone, use_case, questions } = body

    if (!name || !org_name || !email || !use_case) {
      return NextResponse.json({ error: '必須項目が未入力です' }, { status: 400 })
    }

    const filteredQuestions: string[] = (questions || []).filter((q: string) => q.trim())
    if (filteredQuestions.length === 0) {
      return NextResponse.json({ error: '質問を1つ以上入力してください' }, { status: 400 })
    }

    // 1. Create client
    let clientId: string
    const { data, error } = await supabase
      .from('lite_clients')
      .insert({ name, org_name, email, phone: phone || null, use_case })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('lite_clients')
          .select('id')
          .eq('email', email)
          .single()
        if (!existing) return NextResponse.json({ error: error.message }, { status: 500 })
        clientId = existing.id
      } else {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      clientId = data.id
    }

    // 2. Auto-create campaign with the questions
    const campaignName = `${org_name} — ユーザーの声`
    const { data: campaign, error: campaignError } = await supabase
      .from('lite_campaigns')
      .insert({ client_id: clientId, name: campaignName, questions: filteredQuestions })
      .select('id')
      .single()

    if (campaignError) {
      return NextResponse.json({ error: campaignError.message }, { status: 500 })
    }

    const adminUrl = `https://www.tesutemo.co/lite/admin/${clientId}`
    const recordingUrl = `https://www.tesutemo.co/lite/record/${campaign.id}`
    const internalUrl = `https://www.tesutemo.co/lite/internal`
    const questionLines = filteredQuestions.map((q, i) => `Q${i + 1}. ${q}`).join('\n')

    // 3. Send emails
    const resend = new Resend(process.env.RESEND_API_KEY)

    await Promise.all([
      resend.emails.send({
        from: 'TesuTemo <noreply@tesutemo.co>',
        to: email,
        subject: '【TesuTemoライト】録画リンクをお送りします',
        text: `${name} 様\n\nTesuTemoライトへのご登録ありがとうございます。\n\n━━━━━━━━━━━━━━━━━━━━━\n▼ 体験者に送る録画リンク（ブックマーク推奨）\n${recordingUrl}\n━━━━━━━━━━━━━━━━━━━━━\n\nこのリンクをメール・LINEなどで体験者に送ってください。\n3名まで無料で録画できます。\n\n【設定した質問】\n${questionLines}\n\n━━━━━━━━━━━━━━━━━━━━━\nTesuTemoライトの使い方\n\n1　体験者にリンクを送る\n上記の体験者用収録リンクを、メール・LINE・チャットなど好きな方法で体験者に送ってください。3名まで無料で収録できます。\n\n2　体験者が動画を撮影する\n体験者がリンクにアクセスして、スマートフォンやPCのカメラで質問に動画で回答します。回答が届いたらメールでお知らせします。\n\n3　TesuTemoが編集・納品\n録画された動画をTesuTemoのスタッフが確認し、約1週間で編集済み動画をお届けします。\n━━━━━━━━━━━━━━━━━━━━━\n\n管理ページはこちら（ブックマーク推奨）：\n${adminUrl}\n\nご不明点は chris@move-ment.co までご連絡ください。\nTesuTemo`,
      }),
      resend.emails.send({
        from: 'TesuTemoライト <noreply@tesutemo.co>',
        to: 'chris@move-ment.co',
        subject: `【TesuTemoライト】新規登録: ${org_name}`,
        text: `新規登録がありました。\n\nお名前: ${name}\n組織名: ${org_name}\nメール: ${email}\n電話: ${phone || '未入力'}\n用途: ${use_case}\n\n質問:\n${questionLines}\n\n録画リンク: ${recordingUrl}\n内部管理画面: ${internalUrl}`,
      }),
    ])

    return NextResponse.json({ id: clientId, adminUrl, recordingUrl, name, org_name, email })
  } catch (err) {
    console.error('signup error:', err)
    return NextResponse.json({ error: '登録に失敗しました: ' + String(err) }, { status: 500 })
  }
}
