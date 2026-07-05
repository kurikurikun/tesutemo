import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, getCFSignedToken } from '@/lib/survey'
import { cookies } from 'next/headers'

export async function GET(_req: NextRequest, { params }: { params: { responseId: string } }) {
  if (cookies().get('ops_auth')?.value !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  const { data: response } = await supabase
    .from('survey_responses')
    .select('cf_uid, media_type')
    .eq('id', params.responseId)
    .single()

  if (!response?.cf_uid) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Supabase Storage (audio or video)
  if (response.cf_uid.startsWith('supa:')) {
    const withoutPrefix = response.cf_uid.slice('supa:'.length)
    const knownBuckets = ['survey-audio', 'survey-video']
    const bucket = knownBuckets.find(b => withoutPrefix.startsWith(b + ':'))
    const path = bucket ? withoutPrefix.slice(bucket.length + 1) : withoutPrefix
    const bucketName = bucket ?? 'survey-audio'

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 3600, { download: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.redirect(data.signedUrl)
  }

  // Legacy CF Stream video
  const uid = response.cf_uid
  const accountId = process.env.CF_ACCOUNT_ID!
  const cfToken = process.env.CF_STREAM_TOKEN!

  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}/downloads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfToken}` },
  })

  let downloadUrl: string | null = null
  for (let i = 0; i < 15; i++) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}/downloads`,
      { headers: { Authorization: `Bearer ${cfToken}` } }
    )
    const json = await res.json()
    const dl = json.result?.default
    if (dl?.status === 'ready') { downloadUrl = dl.url; break }
    await new Promise(r => setTimeout(r, 1000))
  }

  if (!downloadUrl) {
    return NextResponse.json({ error: 'Still processing — try again in a moment' }, { status: 202 })
  }

  const signedToken = await getCFSignedToken(uid, 3600, { downloadable: true })
  const fileRes = await fetch(`https://videodelivery.net/${signedToken}/downloads/default.mp4`)
  if (!fileRes.ok) {
    return NextResponse.json({ error: `CF returned ${fileRes.status}` }, { status: 500 })
  }

  return new NextResponse(fileRes.body, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="response-${uid.slice(0, 8)}.mp4"`,
      'Content-Length': fileRes.headers.get('Content-Length') ?? '',
    },
  })
}
