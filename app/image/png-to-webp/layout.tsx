import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PNG to WebP Converter Online — Free & Fast',
  description: 'Convert PNG images to WebP format free and instantly in your browser. No upload to server, no signup required. Download the converted WebP image instantly.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
