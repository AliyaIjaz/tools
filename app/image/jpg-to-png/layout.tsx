import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JPG to PNG Converter Online — Free & Fast',
  description: 'Convert JPG images to lossless PNG format free in your browser. PNG preserves transparency and full quality — ideal for graphics and editing. No upload to server, no signup required.',
  alternates: { canonical: '/image/jpg-to-png' },
  openGraph: {
    title: 'JPG to PNG Converter Online — Free & Fast',
    description: 'Convert JPG images to lossless PNG format free in your browser. PNG preserves transparency and full quality — ideal for graphics and editing. No upload to server, no signup required.',
    url: '/image/jpg-to-png',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JPG to PNG Converter Online — Free & Fast',
    description: 'Convert JPG images to lossless PNG format free in your browser. PNG preserves transparency and full quality — ideal for graphics and editing. No upload to server, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
