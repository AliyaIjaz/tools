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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Character Limit Checker Online',
    description: 'Check character counts against Twitter, Instagram, LinkedIn, SMS, meta title, meta description, and other platform limits. Free browser-based tool — no signup, instant results.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
