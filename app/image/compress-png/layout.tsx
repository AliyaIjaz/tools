import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress PNG Online — Reduce PNG File Size Free',
  description: 'Reduce PNG file size in your browser while preserving transparency. Free PNG compressor, no server upload, no signup.',
  alternates: { canonical: '/image/compress-png' },
  openGraph: {
    title: 'Compress PNG Online — Reduce PNG File Size Free',
    description: 'Reduce PNG file size in your browser while preserving transparency. Free PNG compressor, no server upload, no signup.',
    url: '/image/compress-png',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Compress PNG Online — Reduce PNG File Size Free',
    description: 'Reduce PNG file size in your browser while preserving transparency. Free PNG compressor, no server upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
