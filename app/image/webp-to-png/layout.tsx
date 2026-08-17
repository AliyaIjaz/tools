import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebP to PNG Converter Online — Free & Fast',
  description: 'Convert WebP images to lossless PNG format for full quality and transparency support. Free and instant in your browser — no upload to server, no signup required. Download in one click.',
  alternates: { canonical: '/image/webp-to-png' },
  openGraph: {
    title: 'WebP to PNG Converter Online — Free & Fast',
    description: 'Convert WebP images to lossless PNG format for full quality and transparency support. Free and instant in your browser — no upload to server, no signup required. Download in one click.',
    url: '/image/webp-to-png',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'WebP to PNG Converter Online — Free & Fast',
    description: 'Convert WebP images to lossless PNG format for full quality and transparency support. Free and instant in your browser — no upload to server, no signup required. Download in one click.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
