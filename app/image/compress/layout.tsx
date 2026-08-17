import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor Online — Reduce Image File Size',
  description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP with adjustable quality. Download optimized images instantly — free, no upload to server, no signup.',
  alternates: { canonical: '/image/compress' },
  openGraph: {
    title: 'Image Compressor Online — Reduce Image File Size',
    description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP with adjustable quality. Download optimized images instantly — free, no upload to server, no signup.',
    url: '/image/compress',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image Compressor Online — Reduce Image File Size',
    description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP with adjustable quality. Download optimized images instantly — free, no upload to server, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
