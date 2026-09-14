import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timestamp Converter Online — Unix Epoch Tool',
  description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds, milliseconds, UTC, local time, and ISO 8601 format. Free, no signup.',
  alternates: { canonical: '/dev/timestamp-converter' },
  openGraph: {
    title: 'Timestamp Converter Online — Unix Epoch Tool',
    description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds, milliseconds, UTC, local time, and ISO 8601 format. Free, no signup.',
    url: '/dev/timestamp-converter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Timestamp Converter Online — Unix Epoch Tool',
    description: 'Convert Unix timestamps to human-readable dates and back. Supports seconds, milliseconds, UTC, local time, and ISO 8601 format. Free, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
