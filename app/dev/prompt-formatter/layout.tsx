import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Formatter Online',
  description: 'Format AI prompts into OpenAI, Anthropic Claude, and Gemini message structures. Preview JSON output instantly. Free browser-based tool — no signup, no server upload required.',
  alternates: { canonical: '/dev/prompt-formatter' },
  openGraph: {
    title: 'Prompt Formatter Online',
    description: 'Format AI prompts into OpenAI, Anthropic Claude, and Gemini message structures. Preview JSON output instantly. Free browser-based tool — no signup, no server upload required.',
    url: '/dev/prompt-formatter',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Prompt Formatter Online',
    description: 'Format AI prompts into OpenAI, Anthropic Claude, and Gemini message structures. Preview JSON output instantly. Free browser-based tool — no signup, no server upload required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
