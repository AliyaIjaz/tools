import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter Online',
  description: 'Format, validate, and minify JSON online. Paste your JSON and instantly get beautified, syntax-highlighted output with error detection. Free, fast, and runs entirely in your browser.',
  alternates: { canonical: '/dev/json-formatter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
