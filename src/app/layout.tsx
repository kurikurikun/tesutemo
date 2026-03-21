import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TesuTemo - リアルな声で意思決定を支える",
  description: "リアルな声を動画で届け、人と組織をつなぐインタビューサービス。採用、集客、移住促進に。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
