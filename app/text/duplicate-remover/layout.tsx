import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove Duplicate Lines Online — Deduplicate Text Instantly',
  description:
    'Remove duplicate lines from any list instantly. Supports case-insensitive matching and whitespace trimming. Free online duplicate line remover — no signup needed.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
