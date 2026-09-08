import '../globals.css'

// 1人1本のURLなので検索には出さない。
export const metadata = { robots: 'noindex, nofollow' }

export default function PrepLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: '#f7f7f6' }}>{children}</body>
    </html>
  )
}
