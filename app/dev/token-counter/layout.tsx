import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Counter Online — Count LLM Tokens Free',
  description: 'Count tokens for GPT-4, Claude, and Gemini models instantly. Estimate API costs and context window usage with our free browser-based token counter — no signup, no data sent.',
  alternates: { canonical: '/dev/token-counter' },
  openGraph: {
    title: 'Token Counter Online — Count LLM Tokens Free',
    description: 'Count tokens for GPT-4, Claude, and Gemini models instantly. Estimate API costs and context window usage with our free browser-based token counter — no signup, no data sent.',
    url: '/dev/token-counter',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Token Counter Online — Count LLM Tokens Free',
    description: 'Count tokens for GPT-4, Claude, and Gemini models instantly. Estimate API costs and context window usage with our free browser-based token counter — no signup, no data sent.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
