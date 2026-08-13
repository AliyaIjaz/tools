import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timestamp Converter Online — Unix Epoch Tool',
  description: 'Convert Unix timestamps to human-readable dates and back. Free online timestamp converter — no signup required.',
  alternates: { canonical: '/dev/timestamp-converter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
