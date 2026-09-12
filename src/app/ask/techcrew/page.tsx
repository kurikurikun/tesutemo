import { isAskAuthed } from '@/lib/ask-auth'
import AskLogin from '../AskLogin'
import AskDemo from '../AskDemo'

export const dynamic = 'force-dynamic'

export default function TechCrewAskPage() {
  return isAskAuthed() ? <AskDemo /> : <AskLogin />
}
