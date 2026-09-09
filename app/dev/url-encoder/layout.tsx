import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Encoder & Decoder Online',
  description: 'Encode and decode URL components online. Convert special characters to percent-encoding or decode percent-encoded URLs back to readable text instantly. Free, browser-based, no signup.',
  alternates: { canonical: '/dev/url-encoder' },
  openGraph: {
    title: 'URL Encoder & Decoder Online',
    description: 'Encode and decode URL components online. Convert special characters to percent-encoding or decode percent-encoded URLs back to readable text instantly. Free, browser-based, no signup.',
    url: '/dev/url-encoder',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'URL Encoder & Decoder Online',
    description: 'Encode and decode URL components online. Convert special characters to percent-encoding or decode percent-encoded URLs back to readable text instantly. Free, browser-based, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
