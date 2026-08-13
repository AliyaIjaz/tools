import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Counter Online — Count LLM Tokens Free',
  description: 'Count tokens for GPT, Claude, and other LLMs instantly. Estimate API costs and context usage with our free browser-based token counter.',
  alternates: { canonical: '/dev/token-counter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
