import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YAML to JSON Converter Online',
  description: 'Convert YAML to JSON and JSON to YAML instantly in your browser. Supports multi-document YAML and nested structures. Free, fast, private — runs entirely client-side, no signup.',
  alternates: { canonical: '/dev/yaml-json' },
  openGraph: {
    title: 'YAML to JSON Converter Online',
    description: 'Convert YAML to JSON and JSON to YAML instantly in your browser. Supports multi-document YAML and nested structures. Free, fast, private — runs entirely client-side, no signup.',
    url: '/dev/yaml-json',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'YAML to JSON Converter Online',
    description: 'Convert YAML to JSON and JSON to YAML instantly in your browser. Supports multi-document YAML and nested structures. Free, fast, private — runs entirely client-side, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
