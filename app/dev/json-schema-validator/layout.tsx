import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Validator Online',
  description: 'Validate JSON against a JSON Schema instantly in your browser. Get detailed error messages per field. Free, fast, runs entirely client-side — no data sent to a server, no signup.',
  alternates: { canonical: '/dev/json-schema-validator' },
  openGraph: {
    title: 'JSON Schema Validator Online',
    description: 'Validate JSON against a JSON Schema instantly in your browser. Get detailed error messages per field. Free, fast, runs entirely client-side — no data sent to a server, no signup.',
    url: '/dev/json-schema-validator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'JSON Schema Validator Online',
    description: 'Validate JSON against a JSON Schema instantly in your browser. Get detailed error messages per field. Free, fast, runs entirely client-side — no data sent to a server, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
