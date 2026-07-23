import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'String Escaper Online — Escape HTML, JSON & Regex',
  description:
    'Escape and unescape strings for HTML, JSON, and regular expressions instantly. Free online string escaper for developers — runs locally, no upload needed.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
