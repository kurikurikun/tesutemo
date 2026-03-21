import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://tesutemo.vercel.app'),
  title: {
    default: 'TesuTemo - リアルな声で意思決定を支える',
    template: '%s | TesuTemo',
  },
  description:
    'リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。',
  keywords: [
    'インタビュー動画',
    '採用動画',
    '動画制作',
    'テステモ',
    'TesuTemo',
    '大学広報動画',
    '移住促進動画',
    '導入事例動画',
    '顧客の声',
    '社員インタビュー',
    'リアルな声',
    '採用プロモーション',
    '動画マーケティング',
  ],
  openGraph: {
    locale: 'ja_JP',
    type: 'website',
    siteName: 'TesuTemo',
    title: 'TesuTemo - リアルな声で意思決定を支える',
    description:
      'リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。',
    images: [
      {
        url: '/tesutemo-logo.png',
        width: 1200,
        height: 630,
        alt: 'TesuTemo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TesuTemo - リアルな声で意思決定を支える',
    description:
      'リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。',
    images: ['/tesutemo-logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TesuTemo',
  url: 'https://tesutemo.vercel.app',
  logo: 'https://tesutemo.vercel.app/tesutemo-logo.png',
  description:
    'リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
