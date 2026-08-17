import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Resizer Online — Resize Images Free',
  description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Download instantly. Free, fast, private — no upload to server needed.',
  alternates: { canonical: '/image/resize' },
  openGraph: {
    title: 'Image Resizer Online — Resize Images Free',
    description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Download instantly. Free, fast, private — no upload to server needed.',
    url: '/image/resize',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image Resizer Online — Resize Images Free',
    description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Download instantly. Free, fast, private — no upload to server needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
