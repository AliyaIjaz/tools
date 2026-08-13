import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebP to JPG Converter Online — Free & Fast',
  description: 'Convert WebP images to JPG format free and instantly in your browser. No upload to server, no signup required. Download the converted JPG image instantly.',
  alternates: { canonical: '/image/webp-to-jpg' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
