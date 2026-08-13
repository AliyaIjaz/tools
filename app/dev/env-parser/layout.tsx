import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ENV File Parser Online',
  description: 'Parse .env files and visualize key-value pairs instantly. Free browser-based tool — no upload to server, no signup required.',
  alternates: { canonical: '/dev/env-parser' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
