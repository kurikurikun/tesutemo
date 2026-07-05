import { createClient } from '@supabase/supabase-js'
import { SignJWT } from 'jose'
import { createPrivateKey } from 'crypto'

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}

export type SurveyCampaign = {
  id: string
  name: string
  client_label: string | null
  intro_en: string | null
  intro_jp: string | null
  max_seconds: number
  deadline: string | null
  logo_url: string | null
  lang: 'en' | 'jp'
  created_at: string
}

export type SurveyPrompt = {
  id: string
  campaign_id: string
  order: number
  text_en: string
  text_jp: string
}

export type SurveyRespondent = {
  id: string
  campaign_id: string
  name: string
  email: string
  cohort_role: string | null
  created_at: string
}

export type SurveyResponse = {
  id: string
  respondent_id: string
  prompt_id: string
  media_type: string
  cf_uid: string | null
  cf_playback_id: string | null
  duration: number | null
  status: 'new' | 'shortlisted' | 'contacted'
  flagged: boolean
  notes: string | null
  created_at: string
  respondent?: SurveyRespondent
  prompt?: SurveyPrompt
}

// Cloudflare Stream

export async function createCFUploadUrl(maxDurationSeconds: number) {
  const accountId = process.env.CF_ACCOUNT_ID!
  const token = process.env.CF_STREAM_TOKEN!

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxDurationSeconds,
        requireSignedURLs: true,
      }),
    }
  )
  const json = await res.json() as { success: boolean; result: { uploadURL: string; uid: string }; errors: unknown[] }
  if (!json.success) throw new Error(JSON.stringify(json.errors))
  return { uploadUrl: json.result.uploadURL, uid: json.result.uid }
}

export async function getCFSignedToken(videoUid: string, expiresInSeconds = 3600, extra: Record<string, unknown> = {}) {
  const keyId = process.env.CF_STREAM_KEY_ID!
  const rawKey = process.env.CF_STREAM_PRIVATE_KEY!.replace(/\\n/g, '\n')
  const privateKey = createPrivateKey(rawKey)
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  return new SignJWT({ sub: videoUid, kid: keyId, exp, ...extra })
    .setProtectedHeader({ alg: 'RS256', kid: keyId })
    .sign(privateKey)
}

export async function getCFSignedUrl(videoUid: string, expiresInSeconds = 3600, audioOnly = false) {
  const token = await getCFSignedToken(videoUid, expiresInSeconds)
  if (audioOnly) return `https://videodelivery.net/${token}/manifest/video.m3u8`
  return `https://iframe.videodelivery.net/${token}`
}
