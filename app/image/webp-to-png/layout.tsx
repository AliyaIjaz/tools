import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebP to PNG Converter Online — Free & Fast',
  description: 'Convert WebP images to PNG format free and instantly in your browser. No upload to server, no signup required. Download the converted image with one click.',
  alternates: { canonical: '/image/webp-to-png' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
