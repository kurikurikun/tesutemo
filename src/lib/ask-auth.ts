import { createHash } from 'crypto'
import { cookies } from 'next/headers'

// Password gate for the private 聞いてみる demo (/ask/*). The cookie holds a hash of
// the password rather than a fixed "ok", so it can't be forged without knowing it,
// and changing ASK_DEMO_PASSWORD logs everyone out.
export const ASK_COOKIE = 'ask_auth'

export function askToken(): string | null {
  const pw = process.env.ASK_DEMO_PASSWORD
  return pw ? createHash('sha256').update(`tesutemo-ask:${pw}`).digest('hex') : null
}

export function isAskAuthed(): boolean {
  const token = askToken()
  return !!token && cookies().get(ASK_COOKIE)?.value === token
}
