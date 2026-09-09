import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hash Generator Online — SHA-256 & SHA-512',
  description: 'Generate SHA-256 and SHA-512 cryptographic hashes from any text. Runs locally in your browser using the Web Crypto API — nothing is uploaded. Free, private, no signup required.',
  alternates: { canonical: '/dev/hash-generator' },
  openGraph: {
    title: 'Hash Generator Online — SHA-256 & SHA-512',
    description: 'Generate SHA-256 and SHA-512 cryptographic hashes from any text. Runs locally in your browser using the Web Crypto API — nothing is uploaded. Free, private, no signup required.',
    url: '/dev/hash-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Hash Generator Online — SHA-256 & SHA-512',
    description: 'Generate SHA-256 and SHA-512 cryptographic hashes from any text. Runs locally in your browser using the Web Crypto API — nothing is uploaded. Free, private, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
