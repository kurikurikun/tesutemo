import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
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
  alternates: {
    canonical: 'https://www.tesutemo.co',
    languages: {
      'ja': 'https://www.tesutemo.co',
      'en': 'https://www.tesutemo.co/en',
      'x-default': 'https://www.tesutemo.co',
    },
  },
  title: {
    default: 'TesuTemo - 社員と顧客のリアルな声を届けるインタビュー動画サービス',
    template: '%s｜TesuTemo',
  },
  // Homepage-only: every subpage overrides title and description, so this pair is the
  // top page's own copy. The openGraph/twitter block below is NOT homepage-only — the
  // university and municipality pages inherit it — so it deliberately stays service-wide.
  description:
    'TesuTemoは、社員と顧客のリアルな声をインタビュー動画で届けるサービスです。採用プロモーションと導入事例動画で、求職者と見込み客の意思決定を後押しします。オンライン完結だから、担当者の負担を抑えて制作できます。',
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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TesuTemo',
    url: 'https://www.tesutemo.co',
    logo: 'https://www.tesutemo.co/tesutemo-logo.png',
    description:
      'リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TesuTemo',
    url: 'https://www.tesutemo.co',
    inLanguage: 'ja',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'TesuTemo インタビュー動画制作',
    provider: { '@type': 'Organization', name: 'TesuTemo' },
    description: 'オンライン完結のインタビュー動画制作サービス。採用プロモーション、大学広報、移住促進、導入事例に。',
    areaServed: 'JP',
    serviceType: 'Video Production',
  },
];

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
