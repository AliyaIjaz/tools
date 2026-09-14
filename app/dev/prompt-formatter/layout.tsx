import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Formatter Online',
  description: 'Format AI prompts into OpenAI, Anthropic Claude, and Gemini message structures. Preview JSON output instantly. Free, browser-based, no signup.',
  alternates: { canonical: '/dev/prompt-formatter' },
  openGraph: {
    title: 'Prompt Formatter Online',
    description: 'Format AI prompts into OpenAI, Anthropic Claude, and Gemini message structures. Preview JSON output instantly. Free, browser-based, no signup.',
    url: '/dev/prompt-formatter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Prompt Formatter Online',
    description: 'Format AI prompts into OpenAI, Anthropic Claude, and Gemini message structures. Preview JSON output instantly. Free, browser-based, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
