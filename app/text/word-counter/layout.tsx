import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word Counter Online — Count Words, Characters & Reading Time',
  description:
    'Count words, characters, sentences, paragraphs, and estimate reading time instantly. Free online word counter — no signup, no upload. Works on any text.',
  alternates: { canonical: '/text/word-counter' },
  openGraph: {
    title: 'Word Counter Online — Count Words, Characters & Reading Time',
    description:
      'Count words, characters, sentences, paragraphs, and estimate reading time instantly. Free online word counter — no signup, no upload. Works on any text.',
    url: '/text/word-counter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Word Counter Online — Count Words, Characters & Reading Time',
    description:
      'Count words, characters, sentences, paragraphs, and estimate reading time instantly. Free online word counter — no signup, no upload. Works on any text.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
