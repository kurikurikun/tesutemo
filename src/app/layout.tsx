import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { DM_Serif_Display } from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tesutemo.co'),
  title: {
    default: 'TesuTemo - リアルな声で意思決定を支えるインタビュー動画サービス',
    template: '%s | TesuTemo',
  },
  description:
    'TesuTemoは、リアルな声をインタビュー動画で届け、人と組織をつなぐサービスです。採用プロモーション、大学広報、自治体の移住促進に最適。社員・学生・移住者のリアルな体験談が、次の意思決定者の共感を生みます。',
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
    title: 'TesuTemo - リアルな声で意思決定を支えるインタビュー動画サービス',
    description:
      'TesuTemoは、リアルな声をインタビュー動画で届け、人と組織をつなぐサービスです。採用プロモーション、大学広報、自治体の移住促進に最適。社員・学生・移住者のリアルな体験談が、次の意思決定者の共感を生みます。',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TesuTemo - リアルな声で意思決定を支えるインタビュー動画サービス',
    description:
      'TesuTemoは、リアルな声をインタビュー動画で届け、人と組織をつなぐサービスです。採用プロモーション、大学広報、自治体の移住促進に最適。社員・学生・移住者のリアルな体験談が、次の意思決定者の共感を生みます。',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TesuTemo',
  url: 'https://www.tesutemo.co',
  logo: 'https://www.tesutemo.co/tesutemo-logo.png',
  description:
    'リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={dmSerifDisplay.variable}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QLB1WVNCKP" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QLB1WVNCKP');
        `}</Script>
      </head>
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
