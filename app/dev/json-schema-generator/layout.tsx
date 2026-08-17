import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Generator Online',
  description: 'Generate a JSON Schema from sample JSON automatically. Infer types, required fields, and structure in one click. Free browser-based tool — no signup, no server upload required.',
  alternates: { canonical: '/dev/json-schema-generator' },
  openGraph: {
    title: 'JSON Schema Generator Online',
    description: 'Generate a JSON Schema from sample JSON automatically. Infer types, required fields, and structure in one click. Free browser-based tool — no signup, no server upload required.',
    url: '/dev/json-schema-generator',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JSON Schema Generator Online',
    description: 'Generate a JSON Schema from sample JSON automatically. Infer types, required fields, and structure in one click. Free browser-based tool — no signup, no server upload required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
