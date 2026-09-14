import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JPG to PNG Converter Online — Free & Fast',
  description: 'Convert JPG images to lossless PNG format free in your browser. PNG preserves transparency and full quality. No upload to server, no signup.',
  alternates: { canonical: '/image/jpg-to-png' },
  openGraph: {
    title: 'JPG to PNG Converter Online — Free & Fast',
    description: 'Convert JPG images to lossless PNG format free in your browser. PNG preserves transparency and full quality. No upload to server, no signup.',
    url: '/image/jpg-to-png',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'JPG to PNG Converter Online — Free & Fast',
    description: 'Convert JPG images to lossless PNG format free in your browser. PNG preserves transparency and full quality. No upload to server, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
