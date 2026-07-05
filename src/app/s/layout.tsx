import '../globals.css'

export const metadata = { robots: 'noindex' }

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Hanken Grotesk', system-ui, sans-serif", background: '#faf7f3' }}>{children}</body>
    </html>
  )
}
