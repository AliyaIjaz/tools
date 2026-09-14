import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Readability Scorer Online',
  description: 'Check Flesch-Kincaid, Gunning Fog, and other readability scores for your text. Understand reading level instantly. Free, no signup required.',
  alternates: { canonical: '/text/readability-scorer' },
  openGraph: {
    title: 'Readability Scorer Online',
    description: 'Check Flesch-Kincaid, Gunning Fog, and other readability scores for your text. Understand reading level instantly. Free, no signup required.',
    url: '/text/readability-scorer',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Readability Scorer Online',
    description: 'Check Flesch-Kincaid, Gunning Fog, and other readability scores for your text. Understand reading level instantly. Free, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
