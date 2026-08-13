import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Character Limit Checker Online',
  description: 'Check character counts for Twitter, Instagram, SMS, and more. Free browser-based tool — no signup required.',
  alternates: { canonical: '/text/character-limit' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
