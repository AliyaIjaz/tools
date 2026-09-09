import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PNG to JPG Converter Online — Free & Fast',
  description: 'Convert PNG images to JPG format free in your browser. JPG gives smaller file sizes — perfect for photos and web use. No upload to server, no signup required. Download in one click.',
  alternates: { canonical: '/image/png-to-jpg' },
  openGraph: {
    title: 'PNG to JPG Converter Online — Free & Fast',
    description: 'Convert PNG images to JPG format free in your browser. JPG gives smaller file sizes — perfect for photos and web use. No upload to server, no signup required. Download in one click.',
    url: '/image/png-to-jpg',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'PNG to JPG Converter Online — Free & Fast',
    description: 'Convert PNG images to JPG format free in your browser. JPG gives smaller file sizes — perfect for photos and web use. No upload to server, no signup required. Download in one click.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
