import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Rotator Online — Rotate Images Free',
  description: 'Rotate images 90°, 180°, or 270° and flip horizontally or vertically in your browser. Download the result instantly. Free online image rotator — no server upload, no registration.',
  alternates: { canonical: '/image/rotate' },
  openGraph: {
    title: 'Image Rotator Online — Rotate Images Free',
    description: 'Rotate images 90°, 180°, or 270° and flip horizontally or vertically in your browser. Download the result instantly. Free online image rotator — no server upload, no registration.',
    url: '/image/rotate',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image Rotator Online — Rotate Images Free',
    description: 'Rotate images 90°, 180°, or 270° and flip horizontally or vertically in your browser. Download the result instantly. Free online image rotator — no server upload, no registration.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
