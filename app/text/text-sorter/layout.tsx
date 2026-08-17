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
  },
  twitter: {
    card: 'summary',
    title: 'Text Sorter Online — Sort Lines Alphabetically or by Length',
    description:
      'Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Free online text sorter — no signup, no installation, runs in your browser.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
