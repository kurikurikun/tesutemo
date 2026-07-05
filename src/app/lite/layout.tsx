import type { Metadata } from 'next'
import '../globals.css'
import LiteTopBanner from '@/components/LiteTopBanner'

export const metadata: Metadata = {
  title: 'TesuTemoライト',
  description: '手軽に始める動画インタビュー収集ツール',
}

export default function LiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 antialiased h-screen flex flex-col">
        <LiteTopBanner />
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">{children}</main>
      </body>
    </html>
  )
}
