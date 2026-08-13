import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hash Generator Online — SHA-256 & SHA-512',
  description: 'Generate SHA-256 and SHA-512 cryptographic hashes from any text. Runs locally in your browser using the Web Crypto API. Free and private — nothing is uploaded.',
  alternates: { canonical: '/dev/hash-generator' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
