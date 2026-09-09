import type { Metadata } from 'next'

const title = 'File Size Converter — MB, GB, TB, KB Online'
const description = 'Convert between MB, GB, TB, KB, bytes and binary units (MiB, GiB, TiB) instantly. Free browser-based file size converter — no signup, nothing uploaded.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/dev/file-size-converter' },
  openGraph: {
    title,
    description,
    url: '/dev/file-size-converter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title,
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
