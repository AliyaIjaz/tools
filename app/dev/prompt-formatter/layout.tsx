import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Formatter Online',
  description: 'Format and clean AI prompts for GPT, Claude, and other LLMs. Free browser-based tool — no signup, no server upload.',
  alternates: { canonical: '/dev/prompt-formatter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
