import type { Metadata } from "next";
import Script from "next/script";
import "../../globals.css";
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
    canonical: 'https://www.tesutemo.co/en',
    languages: {
      'ja': 'https://www.tesutemo.co',
      'en': 'https://www.tesutemo.co/en',
      'x-default': 'https://www.tesutemo.co',
    },
  },
  title: {
    default: 'TesuTemo - Interview Videos That Drive Better Decisions',
    template: '%s | TesuTemo',
  },
  // Homepage-only: every subpage overrides title and description, so this pair is the
  // top page's own copy. The openGraph/twitter block below is NOT homepage-only — the
  // university and municipality pages inherit it — so it deliberately stays service-wide.
  description:
    'TesuTemo turns your employees and your customers into interview video. Recruitment videos that show candidates the real workplace, and case study videos that give buyers a trusted voice to judge by. Filmed and delivered entirely online.',
  keywords: [
    'interview videos',
    'recruitment videos',
    'video production',
    'TesuTemo',
    'university promotion videos',
    'migration promotion videos',
    'case study videos',
    'customer testimonials',
    'employee interviews',
    'real voices',
    'recruitment promotion',
    'video marketing',
  ],
  openGraph: {
    locale: 'en',
    type: 'website',
    siteName: 'TesuTemo',
    title: 'TesuTemo - Interview Videos That Drive Better Decisions',
    description:
      'TesuTemo delivers real voices through interview videos, connecting people with organizations. Ideal for recruitment, university admissions, and regional migration promotion.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TesuTemo - Interview Videos That Drive Better Decisions',
    description:
      'TesuTemo delivers real voices through interview videos, connecting people with organizations. Ideal for recruitment, university admissions, and regional migration promotion.',
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
      'Delivering real voices through video, connecting people with organizations. For recruitment, customer acquisition, and migration promotion.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TesuTemo',
    url: 'https://www.tesutemo.co/en',
    inLanguage: 'en',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'TesuTemo Interview Video Production',
    provider: { '@type': 'Organization', name: 'TesuTemo' },
    description: 'Fully online interview video production service. For recruitment, university admissions, migration promotion, and customer case studies.',
    areaServed: 'JP',
    serviceType: 'Video Production',
  },
];

export default function EnglishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSerifDisplay.variable}>
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
