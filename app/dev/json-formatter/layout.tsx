import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter Online',
  description: 'Format, validate, and minify JSON online. Paste your JSON and instantly get beautified, syntax-highlighted output with error detection. Free, fast, runs entirely in your browser — no signup.',
  alternates: { canonical: '/dev/json-formatter' },
  openGraph: {
    title: 'JSON Formatter Online',
    description: 'Format, validate, and minify JSON online. Paste your JSON and instantly get beautified, syntax-highlighted output with error detection. Free, fast, runs entirely in your browser — no signup.',
    url: '/dev/json-formatter',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JSON Formatter Online',
    description: 'Format, validate, and minify JSON online. Paste your JSON and instantly get beautified, syntax-highlighted output with error detection. Free, fast, runs entirely in your browser — no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
