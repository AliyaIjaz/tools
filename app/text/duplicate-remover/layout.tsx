import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove Duplicate Lines Online — Deduplicate Text Instantly',
  description:
    'Remove duplicate lines from any list instantly. Supports case-insensitive matching and whitespace trimming. Free online duplicate line remover — no signup needed.',
  alternates: { canonical: '/text/duplicate-remover' },
  openGraph: {
    title: 'Remove Duplicate Lines Online — Deduplicate Text Instantly',
    description:
      'Remove duplicate lines from any list instantly. Supports case-insensitive matching and whitespace trimming. Free online duplicate line remover — no signup needed.',
    url: '/text/duplicate-remover',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Remove Duplicate Lines Online — Deduplicate Text Instantly',
    description:
      'Remove duplicate lines from any list instantly. Supports case-insensitive matching and whitespace trimming. Free online duplicate line remover — no signup needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
