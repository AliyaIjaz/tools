import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ENV File Parser Online',
  description: 'Parse .env files and visualize key-value pairs in a clean table. Export as JSON or copy values instantly. Free browser-based tool — no upload to server, no signup required.',
  alternates: { canonical: '/dev/env-parser' },
  openGraph: {
    title: 'ENV File Parser Online',
    description: 'Parse .env files and visualize key-value pairs in a clean table. Export as JSON or copy values instantly. Free browser-based tool — no upload to server, no signup required.',
    url: '/dev/env-parser',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ENV File Parser Online',
    description: 'Parse .env files and visualize key-value pairs in a clean table. Export as JSON or copy values instantly. Free browser-based tool — no upload to server, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
