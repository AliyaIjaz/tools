import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find & Replace Online — Bulk Text Editor with Regex',
  description: 'Find and replace text in bulk with optional regex support. Replace all occurrences instantly, use capture groups, and edit any plain text online. Free, browser-based, no signup.',
  alternates: { canonical: '/text/find-replace' },
  openGraph: {
    title: 'Find & Replace Online — Bulk Text Editor with Regex',
    description: 'Find and replace text in bulk with optional regex support. Replace all occurrences instantly, use capture groups, and edit any plain text online. Free, browser-based, no signup.',
    url: '/text/find-replace',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Find & Replace Online — Bulk Text Editor with Regex',
    description: 'Find and replace text in bulk with optional regex support. Replace all occurrences instantly, use capture groups, and edit any plain text online. Free, browser-based, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
