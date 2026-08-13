import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find and Replace Online — Bulk Text Editor with Regex Support',
  description:
    'Find and replace text in bulk with optional regex support. Replace all occurrences instantly, use capture groups, and edit any plain text online. Free, browser-based.',
  alternates: { canonical: '/text/find-replace' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
