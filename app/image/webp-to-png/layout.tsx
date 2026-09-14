import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebP to PNG Converter Online — Free & Fast',
  description: 'Convert WebP images to lossless PNG format for full quality and transparency support. Free, instant, no upload, no signup.',
  alternates: { canonical: '/image/webp-to-png' },
  openGraph: {
    title: 'WebP to PNG Converter Online — Free & Fast',
    description: 'Convert WebP images to lossless PNG format for full quality and transparency support. Free, instant, no upload, no signup.',
    url: '/image/webp-to-png',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'WebP to PNG Converter Online — Free & Fast',
    description: 'Convert WebP images to lossless PNG format for full quality and transparency support. Free, instant, no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
