import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Counter Online — Count LLM Tokens Free',
  description: 'Count tokens for GPT-4, Claude, and Gemini models instantly. Estimate API costs and context window usage. Free, browser-based, no signup.',
  alternates: { canonical: '/dev/token-counter' },
  openGraph: {
    title: 'Token Counter Online — Count LLM Tokens Free',
    description: 'Count tokens for GPT-4, Claude, and Gemini models instantly. Estimate API costs and context window usage. Free, browser-based, no signup.',
    url: '/dev/token-counter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Token Counter Online — Count LLM Tokens Free',
    description: 'Count tokens for GPT-4, Claude, and Gemini models instantly. Estimate API costs and context window usage. Free, browser-based, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
