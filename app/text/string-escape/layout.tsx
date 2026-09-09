import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'String Escaper Online — Escape HTML, JSON & Regex',
  description:
    'Escape and unescape strings for HTML, JSON, and regular expressions instantly. Free online string escaper for developers — runs locally, no upload needed.',
  alternates: { canonical: '/text/string-escape' },
  openGraph: {
    title: 'String Escaper Online — Escape HTML, JSON & Regex',
    description:
      'Escape and unescape strings for HTML, JSON, and regular expressions instantly. Free online string escaper for developers — runs locally, no upload needed.',
    url: '/text/string-escape',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'String Escaper Online — Escape HTML, JSON & Regex',
    description:
      'Escape and unescape strings for HTML, JSON, and regular expressions instantly. Free online string escaper for developers — runs locally, no upload needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
