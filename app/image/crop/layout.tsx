import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Cropper Online — Crop Images Free',
  description: 'Crop images interactively in your browser — select the region, adjust boundaries, and download instantly. Free image cropper, no upload needed.',
  alternates: { canonical: '/image/crop' },
  openGraph: {
    title: 'Image Cropper Online — Crop Images Free',
    description: 'Crop images interactively in your browser — select the region, adjust boundaries, and download instantly. Free image cropper, no upload needed.',
    url: '/image/crop',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Image Cropper Online — Crop Images Free',
    description: 'Crop images interactively in your browser — select the region, adjust boundaries, and download instantly. Free image cropper, no upload needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
