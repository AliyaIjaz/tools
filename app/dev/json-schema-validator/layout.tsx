import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Validator Online',
  description: 'Validate JSON against a JSON Schema instantly in your browser. Free, fast, runs entirely client-side with no data sent to a server.',
  alternates: { canonical: '/dev/json-schema-validator' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
