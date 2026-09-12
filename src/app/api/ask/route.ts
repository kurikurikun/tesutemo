import { NextRequest, NextResponse } from 'next/server'
import { isAskAuthed } from '@/lib/ask-auth'
// Same query flow as the local test server (answer_engine/test/server.mjs).
import { createAsker } from '../../../../answer_engine/ask.mjs'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Private demo: password-gated, and typed questions (the only paid step) are capped
// per day so a leaked link can't run up the Voyage/Anthropic bill.
const asker = createAsker({ instance: 'techcrew', company: 'TECH CREW', dailyTypedCap: 300 })

// GET → suggested chips
export async function GET() {
  if (!isAskAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await asker.chips())
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// POST { q } → typed question   ·   POST { chipUnit, label } → log a chip tap
export async function POST(req: NextRequest) {
  if (!isAskAuthed()) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (body.chipUnit) {
      await asker.logChip(String(body.chipUnit), String(body.label ?? ''))
      return NextResponse.json({ ok: true })
    }
    const q = String(body.q ?? '').trim().slice(0, 300)
    if (!q) return NextResponse.json({ error: 'empty question' }, { status: 400 })
    return NextResponse.json(await asker.ask(q))
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
