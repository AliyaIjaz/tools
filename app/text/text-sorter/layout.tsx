import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text Sorter Online — Sort Lines Alphabetically or by Length',
  description:
    'Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Free online text sorter — no signup, no installation, runs in your browser.',
  alternates: { canonical: '/text/text-sorter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
