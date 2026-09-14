import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to Base64 Converter Online',
  description: 'Convert images to Base64 data URLs or decode Base64 back to an image instantly. Free image Base64 encoder and decoder — no upload, no signup.',
  alternates: { canonical: '/image/base64' },
  openGraph: {
    title: 'Image to Base64 Converter Online',
    description: 'Convert images to Base64 data URLs or decode Base64 back to an image instantly. Free image Base64 encoder and decoder — no upload, no signup.',
    url: '/image/base64',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Image to Base64 Converter Online',
    description: 'Convert images to Base64 data URLs or decode Base64 back to an image instantly. Free image Base64 encoder and decoder — no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
