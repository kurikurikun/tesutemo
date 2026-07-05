import { cookies } from 'next/headers'
import OpsLoginGate from './OpsLoginGate'
import OpsLogoutButton from './OpsLogoutButton'
import '../globals.css'

export const metadata = { robots: 'noindex' }

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const authed = cookies().get('ops_auth')?.value === 'ok'

  if (!authed) {
    return (
      <html lang="ja">
        <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
          <OpsLoginGate />
        </body>
      </html>
    )
  }

  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/ops/campaigns" style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', textDecoration: 'none' }}>
            TesuTemo Lite Ops
          </a>
          <OpsLogoutButton />
        </nav>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '1.5rem' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
