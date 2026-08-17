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
  },
  twitter: {
    card: 'summary',
    title: 'PNG to JPG Converter Online — Free & Fast',
    description: 'Convert PNG images to JPG format free in your browser. JPG gives smaller file sizes — perfect for photos and web use. No upload to server, no signup required. Download in one click.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
