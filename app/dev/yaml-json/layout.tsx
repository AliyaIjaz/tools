import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YAML to JSON Converter Online',
  description: 'Convert YAML to JSON and JSON to YAML instantly in your browser. Free, fast, runs entirely client-side.',
  alternates: { canonical: '/dev/yaml-json' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
