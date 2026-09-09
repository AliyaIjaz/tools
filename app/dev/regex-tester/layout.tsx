import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regex Tester Online',
  description: 'Test and debug regular expressions with live match highlighting. Supports JavaScript regex syntax with all flags. Free online regex tester — instant results, no signup needed.',
  alternates: { canonical: '/dev/regex-tester' },
  openGraph: {
    title: 'Regex Tester Online',
    description: 'Test and debug regular expressions with live match highlighting. Supports JavaScript regex syntax with all flags. Free online regex tester — instant results, no signup needed.',
    url: '/dev/regex-tester',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Regex Tester Online',
    description: 'Test and debug regular expressions with live match highlighting. Supports JavaScript regex syntax with all flags. Free online regex tester — instant results, no signup needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
