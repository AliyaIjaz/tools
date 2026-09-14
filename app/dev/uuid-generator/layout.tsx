import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UUID Generator Online',
  description: 'Generate UUID v4 values instantly in your browser. Bulk generate unique IDs and copy to clipboard. Cryptographically random, free, no signup.',
  alternates: { canonical: '/dev/uuid-generator' },
  openGraph: {
    title: 'UUID Generator Online',
    description: 'Generate UUID v4 values instantly in your browser. Bulk generate unique IDs and copy to clipboard. Cryptographically random, free, no signup.',
    url: '/dev/uuid-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'UUID Generator Online',
    description: 'Generate UUID v4 values instantly in your browser. Bulk generate unique IDs and copy to clipboard. Cryptographically random, free, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
