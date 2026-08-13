import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diff Viewer Online — Compare Two Text Files',
  description: 'Compare two blocks of text and highlight the differences side by side. Line-by-line diff viewer for code, documents, and plain text. Free, instant, browser-based.',
  alternates: { canonical: '/dev/diff-viewer' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
