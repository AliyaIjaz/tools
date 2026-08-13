import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JPG to WebP Converter Online — Free & Fast',
  description: 'Convert JPG images to WebP format free and instantly in your browser. No upload to server, no signup required. Download the converted WebP image instantly.',
  alternates: { canonical: '/image/jpg-to-webp' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
