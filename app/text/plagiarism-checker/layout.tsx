import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text Similarity Checker Online — Compare Two Texts',
  description:
    'Compare two texts and measure similarity using Jaccard n-gram analysis. Highlights matching phrases and shows a similarity score. Free, private, browser-based.',
  alternates: { canonical: '/text/plagiarism-checker' },
  openGraph: {
    title: 'Text Similarity Checker Online — Compare Two Texts',
    description:
      'Compare two texts and measure similarity using Jaccard n-gram analysis. Highlights matching phrases and shows a similarity score. Free, private, browser-based.',
    url: '/text/plagiarism-checker',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Text Similarity Checker Online — Compare Two Texts',
    description:
      'Compare two texts and measure similarity using Jaccard n-gram analysis. Highlights matching phrases and shows a similarity score. Free, private, browser-based.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
