import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter Online',
  description: 'Format, validate, and minify JSON online. Get beautified, syntax-highlighted output with error detection. Free, runs entirely in your browser.',
  alternates: { canonical: '/dev/json-formatter' },
  openGraph: {
    title: 'JSON Formatter Online',
    description: 'Format, validate, and minify JSON online. Get beautified, syntax-highlighted output with error detection. Free, runs entirely in your browser.',
    url: '/dev/json-formatter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'JSON Formatter Online',
    description: 'Format, validate, and minify JSON online. Get beautified, syntax-highlighted output with error detection. Free, runs entirely in your browser.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
