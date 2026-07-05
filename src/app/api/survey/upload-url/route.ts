import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/survey'

export async function POST(req: NextRequest) {
  const { isAudio = false } = await req.json()
  const supabase = getSupabaseAdmin()
  const bucket = isAudio ? 'survey-audio' : 'survey-video'
  const ext = isAudio ? 'webm' : 'mp4'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path)
    if (error) throw new Error(error.message)
    return NextResponse.json({
      uploadUrl: data.signedUrl,
      uid: `supa:${bucket}:${path}`,
      uploadMethod: 'PUT',
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
