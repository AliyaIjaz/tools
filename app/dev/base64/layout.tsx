import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder Online',
  description: 'Encode text or files to Base64 or decode Base64 back to plain text instantly. Supports UTF-8 and binary data. Free, browser-based, no signup.',
  alternates: { canonical: '/dev/base64' },
  openGraph: {
    title: 'Base64 Encoder & Decoder Online',
    description: 'Encode text or files to Base64 or decode Base64 back to plain text instantly. Supports UTF-8 and binary data. Free, browser-based, no signup.',
    url: '/dev/base64',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Base64 Encoder & Decoder Online',
    description: 'Encode text or files to Base64 or decode Base64 back to plain text instantly. Supports UTF-8 and binary data. Free, browser-based, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
