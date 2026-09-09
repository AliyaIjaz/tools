import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Markdown Preview Online — Live Markdown to HTML Renderer',
  description:
    'Write or paste Markdown and see the rendered HTML preview in real time. Supports CommonMark, tables, code blocks, and more. Free, private, browser-based.',
  alternates: { canonical: '/text/markdown-preview' },
  openGraph: {
    title: 'Markdown Preview Online — Live Markdown to HTML Renderer',
    description:
      'Write or paste Markdown and see the rendered HTML preview in real time. Supports CommonMark, tables, code blocks, and more. Free, private, browser-based.',
    url: '/text/markdown-preview',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Markdown Preview Online — Live Markdown to HTML Renderer',
    description:
      'Write or paste Markdown and see the rendered HTML preview in real time. Supports CommonMark, tables, code blocks, and more. Free, private, browser-based.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
