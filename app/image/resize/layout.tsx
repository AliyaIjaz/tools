import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Resizer Online — Resize Images Free',
  description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Free, fast, no upload needed.',
  alternates: { canonical: '/image/resize' },
  openGraph: {
    title: 'Image Resizer Online — Resize Images Free',
    description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Free, fast, no upload needed.',
    url: '/image/resize',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Image Resizer Online — Resize Images Free',
    description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Free, fast, no upload needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
