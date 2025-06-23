import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '익명 뉴스',
  description: '익명으로 뉴스를 작성하고 공유하는 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXXX" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-serif bg-gray-50">{children}</body>
    </html>
  )
}