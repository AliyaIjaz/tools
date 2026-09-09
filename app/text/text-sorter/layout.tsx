import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text Sorter Online — Sort Lines Alphabetically or by Length',
  description:
    'Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Free online text sorter — no signup, no installation, runs in your browser.',
  alternates: { canonical: '/text/text-sorter' },
  openGraph: {
    title: 'Text Sorter Online — Sort Lines Alphabetically or by Length',
    description:
      'Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Free online text sorter — no signup, no installation, runs in your browser.',
    url: '/text/text-sorter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Text Sorter Online — Sort Lines Alphabetically or by Length',
    description:
      'Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Free online text sorter — no signup, no installation, runs in your browser.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
