import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Markdown Preview Online — Live Markdown to HTML Renderer',
  description:
    'Write or paste Markdown and see the rendered HTML preview in real time. Supports CommonMark, tables, code blocks, and more. Free, private, browser-based.',
  alternates: { canonical: '/text/markdown-preview' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
