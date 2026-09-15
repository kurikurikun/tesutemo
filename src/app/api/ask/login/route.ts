import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ASK_COOKIE, askToken } from '@/lib/ask-auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const token = askToken()
  if (!token || password !== process.env.ASK_DEMO_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }
  cookies().set(ASK_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
  })
  return NextResponse.json({ ok: true })
}
