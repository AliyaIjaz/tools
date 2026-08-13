import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Generator Online',
  description: 'Generate JSON Schema from sample JSON automatically. Free browser-based tool — no signup, no server upload required.',
  alternates: { canonical: '/dev/json-schema-generator' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
