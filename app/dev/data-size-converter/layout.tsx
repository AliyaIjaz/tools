import type { Metadata } from 'next'

const title = 'File Size Converter — MB, GB, TB, KB Online'
const description = 'Convert between MB, GB, TB, KB, bytes and binary units (MiB, GiB, TiB) instantly. Free browser-based file size converter — no signup, nothing uploaded.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/dev/data-size-converter' },
  openGraph: {
    title,
    description,
    url: '/dev/data-size-converter',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
