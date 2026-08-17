import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timestamp Converter Online — Unix Epoch Tool',
  description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, UTC and local time, and ISO 8601 format. Free online timestamp converter — no signup.',
  alternates: { canonical: '/dev/timestamp-converter' },
  openGraph: {
    title: 'Timestamp Converter Online — Unix Epoch Tool',
    description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, UTC and local time, and ISO 8601 format. Free online timestamp converter — no signup.',
    url: '/dev/timestamp-converter',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Timestamp Converter Online — Unix Epoch Tool',
    description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds, UTC and local time, and ISO 8601 format. Free online timestamp converter — no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
