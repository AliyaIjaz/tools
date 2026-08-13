import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Readability Scorer Online',
  description: 'Check readability scores (Flesch-Kincaid, Gunning Fog, and more) for your text. Free browser-based tool — no signup required.',
  alternates: { canonical: '/text/readability-scorer' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
