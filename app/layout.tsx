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
      <body className="font-serif bg-gray-50">{children}</body>
    </html>
  )
}