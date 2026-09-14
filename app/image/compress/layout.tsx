import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor Online — Reduce Image File Size',
  description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP with adjustable quality. Free, no upload, no signup.',
  alternates: { canonical: '/image/compress' },
  openGraph: {
    title: 'Image Compressor Online — Reduce Image File Size',
    description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP with adjustable quality. Free, no upload, no signup.',
    url: '/image/compress',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Image Compressor Online — Reduce Image File Size',
    description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP with adjustable quality. Free, no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
