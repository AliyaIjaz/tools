import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word Counter Online — Count Words, Characters & Reading Time',
  description:
    'Count words, characters, sentences, paragraphs, and estimate reading time instantly. Free online word counter — no signup, no upload. Works on any text.',
  alternates: { canonical: '/text/word-counter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
