import type { Metadata } from 'next'

// Private demo area: its own root layout (like /ops), kept out of search.
export const metadata: Metadata = {
  title: '先輩社員に聞いてみる — TesuTemo demo',
  robots: { index: false, follow: false },
}

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: '#fafafa', color: '#1d1d1f', fontFamily: '-apple-system, "Hiragino Sans", "Noto Sans JP", sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
