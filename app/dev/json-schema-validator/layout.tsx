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
  },
  twitter: {
    card: 'summary',
    title: 'JSON Schema Validator Online',
    description: 'Validate JSON against a JSON Schema instantly in your browser. Get detailed error messages per field. Free, fast, runs entirely client-side — no data sent to a server, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
