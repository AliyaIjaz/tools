import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Generator Online',
  description: 'Generate a JSON Schema from sample JSON automatically. Infer types, required fields, and structure in one click. Free, browser-based, no signup.',
  alternates: { canonical: '/dev/json-schema-generator' },
  openGraph: {
    title: 'JSON Schema Generator Online',
    description: 'Generate a JSON Schema from sample JSON automatically. Infer types, required fields, and structure in one click. Free, browser-based, no signup.',
    url: '/dev/json-schema-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'JSON Schema Generator Online',
    description: 'Generate a JSON Schema from sample JSON automatically. Infer types, required fields, and structure in one click. Free, browser-based, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
