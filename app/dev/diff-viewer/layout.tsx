import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diff Viewer Online — Compare Two Text Files',
  description: 'Compare two blocks of text and highlight the differences line by line. Side-by-side diff viewer for code, documents, and plain text. Free, instant, browser-based — no signup.',
  alternates: { canonical: '/dev/diff-viewer' },
  openGraph: {
    title: 'Diff Viewer Online — Compare Two Text Files',
    description: 'Compare two blocks of text and highlight the differences line by line. Side-by-side diff viewer for code, documents, and plain text. Free, instant, browser-based — no signup.',
    url: '/dev/diff-viewer',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Diff Viewer Online — Compare Two Text Files',
    description: 'Compare two blocks of text and highlight the differences line by line. Side-by-side diff viewer for code, documents, and plain text. Free, instant, browser-based — no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
