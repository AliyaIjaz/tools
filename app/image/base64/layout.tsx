import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to Base64 Converter Online',
  description: 'Convert images to Base64 data URLs or decode Base64 back to an image instantly. Free online image Base64 encoder — no upload to server, no signup.',
  alternates: { canonical: '/image/base64' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
