import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to Base64 Converter Online',
  description: 'Convert images to Base64 data URLs or decode Base64 strings back to an image instantly. Free online image Base64 encoder and decoder — no upload to server, no signup required.',
  alternates: { canonical: '/image/base64' },
  openGraph: {
    title: 'Image to Base64 Converter Online',
    description: 'Convert images to Base64 data URLs or decode Base64 strings back to an image instantly. Free online image Base64 encoder and decoder — no upload to server, no signup required.',
    url: '/image/base64',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image to Base64 Converter Online',
    description: 'Convert images to Base64 data URLs or decode Base64 strings back to an image instantly. Free online image Base64 encoder and decoder — no upload to server, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
