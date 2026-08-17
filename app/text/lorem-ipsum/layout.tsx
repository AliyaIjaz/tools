import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator Online — Placeholder Text Generator',
  description:
    'Generate Lorem Ipsum placeholder text by words, sentences, or paragraphs instantly. Free online lorem ipsum generator — no signup or installation required.',
  alternates: { canonical: '/text/lorem-ipsum' },
  openGraph: {
    title: 'Lorem Ipsum Generator Online — Placeholder Text Generator',
    description:
      'Generate Lorem Ipsum placeholder text by words, sentences, or paragraphs instantly. Free online lorem ipsum generator — no signup or installation required.',
    url: '/text/lorem-ipsum',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Lorem Ipsum Generator Online — Placeholder Text Generator',
    description:
      'Generate Lorem Ipsum placeholder text by words, sentences, or paragraphs instantly. Free online lorem ipsum generator — no signup or installation required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
