import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regex Tester Online',
  description: 'Test and debug regular expressions with live match highlighting. Supports JavaScript regex syntax with flags. Free online regex tester — no signup needed.',
  alternates: { canonical: '/dev/regex-tester' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
