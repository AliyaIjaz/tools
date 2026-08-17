import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSV to JSON Converter Online',
  description: 'Convert CSV files to JSON instantly in your browser. Paste or upload CSV data and get clean, formatted JSON output. Supports custom delimiters. Free, fast, no upload required.',
  alternates: { canonical: '/dev/csv-to-json' },
  openGraph: {
    title: 'CSV to JSON Converter Online',
    description: 'Convert CSV files to JSON instantly in your browser. Paste or upload CSV data and get clean, formatted JSON output. Supports custom delimiters. Free, fast, no upload required.',
    url: '/dev/csv-to-json',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CSV to JSON Converter Online',
    description: 'Convert CSV files to JSON instantly in your browser. Paste or upload CSV data and get clean, formatted JSON output. Supports custom delimiters. Free, fast, no upload required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
