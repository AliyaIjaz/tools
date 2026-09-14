import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress WebP Online — Reduce WebP File Size Free',
  description: 'Reduce WebP image file size in your browser quickly and privately. Free WebP compressor, no upload, no signup.',
  alternates: { canonical: '/image/compress-webp' },
  openGraph: {
    title: 'Compress WebP Online — Reduce WebP File Size Free',
    description: 'Reduce WebP image file size in your browser quickly and privately. Free WebP compressor, no upload, no signup.',
    url: '/image/compress-webp',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Compress WebP Online — Reduce WebP File Size Free',
    description: 'Reduce WebP image file size in your browser quickly and privately. Free WebP compressor, no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
