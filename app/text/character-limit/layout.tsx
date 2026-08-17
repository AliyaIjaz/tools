import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Character Limit Checker Online',
  description: 'Check character counts against Twitter, Instagram, LinkedIn, SMS, meta title, meta description, and other platform limits. Free browser-based tool — no signup, instant results.',
  alternates: { canonical: '/text/character-limit' },
  openGraph: {
    title: 'Character Limit Checker Online',
    description: 'Check character counts against Twitter, Instagram, LinkedIn, SMS, meta title, meta description, and other platform limits. Free browser-based tool — no signup, instant results.',
    url: '/text/character-limit',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Character Limit Checker Online',
    description: 'Check character counts against Twitter, Instagram, LinkedIn, SMS, meta title, meta description, and other platform limits. Free browser-based tool — no signup, instant results.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
