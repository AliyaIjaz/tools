import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Readability Scorer Online',
  description: 'Check Flesch-Kincaid, Gunning Fog, and other readability scores for your text. Understand reading level and complexity instantly. Free browser-based tool — no signup required.',
  alternates: { canonical: '/text/readability-scorer' },
  openGraph: {
    title: 'Readability Scorer Online',
    description: 'Check Flesch-Kincaid, Gunning Fog, and other readability scores for your text. Understand reading level and complexity instantly. Free browser-based tool — no signup required.',
    url: '/text/readability-scorer',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Readability Scorer Online',
    description: 'Check Flesch-Kincaid, Gunning Fog, and other readability scores for your text. Understand reading level and complexity instantly. Free browser-based tool — no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
