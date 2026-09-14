import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Decoder Online',
  description: 'Decode and inspect JWT tokens instantly — view the header, payload, and signature in a readable format. Free, browser-based, nothing sent to a server.',
  alternates: { canonical: '/dev/jwt-decoder' },
  openGraph: {
    title: 'JWT Decoder Online',
    description: 'Decode and inspect JWT tokens instantly — view the header, payload, and signature in a readable format. Free, browser-based, nothing sent to a server.',
    url: '/dev/jwt-decoder',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'JWT Decoder Online',
    description: 'Decode and inspect JWT tokens instantly — view the header, payload, and signature in a readable format. Free, browser-based, nothing sent to a server.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
