'use client'

export default function OpsLogoutButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/survey/admin/auth', { method: 'DELETE' })
        window.location.href = '/ops'
      }}
      style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      ログアウト
    </button>
  )
}
