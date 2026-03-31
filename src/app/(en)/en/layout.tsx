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
    },
  },
  title: {
    default: 'TesuTemo - Interview Videos That Drive Better Decisions',
    template: '%s | TesuTemo',
  },
  description:
    'TesuTemo delivers real voices through interview videos, connecting people with organizations. Ideal for recruitment, university admissions, and regional migration promotion.',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TesuTemo',
  url: 'https://www.tesutemo.co',
  logo: 'https://www.tesutemo.co/tesutemo-logo.png',
  description:
    'Delivering real voices through video, connecting people with organizations. For recruitment, customer acquisition, and migration promotion.',
};

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
