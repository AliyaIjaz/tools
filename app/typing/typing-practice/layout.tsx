import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Typing Practice Online — Test & Improve Typing Speed',
  description:
    'Practice typing and measure your WPM and accuracy with real-time feedback. Free online typing test — no signup required, works in all modern browsers.',
  alternates: { canonical: '/typing/typing-practice' },
  openGraph: {
    title: 'Typing Practice Online — Test & Improve Typing Speed',
    description:
      'Practice typing and measure your WPM and accuracy with real-time feedback. Free online typing test — no signup required, works in all modern browsers.',
    url: '/typing/typing-practice',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Typing Practice Online — Test & Improve Typing Speed',
    description:
      'Practice typing and measure your WPM and accuracy with real-time feedback. Free online typing test — no signup required, works in all modern browsers.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
