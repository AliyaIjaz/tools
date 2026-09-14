import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress JPG Online — Reduce JPEG File Size Free',
  description: 'Reduce JPG and JPEG file size in your browser without losing quality. Free JPG compressor, no upload, no signup.',
  alternates: { canonical: '/image/compress-jpg' },
  openGraph: {
    title: 'Compress JPG Online — Reduce JPEG File Size Free',
    description: 'Reduce JPG and JPEG file size in your browser without losing quality. Free JPG compressor, no upload, no signup.',
    url: '/image/compress-jpg',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Compress JPG Online — Reduce JPEG File Size Free',
    description: 'Reduce JPG and JPEG file size in your browser without losing quality. Free JPG compressor, no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
