import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSV to JSON Converter Online',
  description: 'Convert CSV files to JSON instantly in your browser. Paste CSV data and get clean, formatted JSON output. Free, fast, no upload required.',
  alternates: { canonical: '/dev/csv-to-json' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
