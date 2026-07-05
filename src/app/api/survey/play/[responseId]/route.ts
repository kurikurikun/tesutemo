import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, getCFSignedUrl } from '@/lib/survey'
import { cookies } from 'next/headers'

async function getSupabaseSignedUrl(uid: string) {
  const supabase = getSupabaseAdmin()
  // New format: supa:{bucket}:{path}
  // Legacy format: supa:{path} (audio-only, survey-audio bucket)
  const withoutPrefix = uid.slice('supa:'.length)
  const knownBuckets = ['survey-audio', 'survey-video']
  const bucket = knownBuckets.find(b => withoutPrefix.startsWith(b + ':'))
  const path = bucket ? withoutPrefix.slice(bucket.length + 1) : withoutPrefix
  const bucketName = bucket ?? 'survey-audio'

  const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, 3600)
  if (error) throw new Error(error.message)
  return data.signedUrl
}

export async function GET(_req: NextRequest, { params }: { params: { responseId: string } }) {
  const cookieStore = cookies()
  if (cookieStore.get('ops_auth')?.value !== 'ok') {
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

  try {
    let url: string
    if (response.cf_uid.startsWith('supa:')) {
      url = await getSupabaseSignedUrl(response.cf_uid)
    } else {
      url = await getCFSignedUrl(response.cf_uid, 3600, response.media_type === 'audio')
    }
    return NextResponse.json({ url, media_type: response.media_type })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
