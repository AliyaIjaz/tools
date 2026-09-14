import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Metadata Viewer Online — View EXIF Data',
  description: 'View EXIF metadata, camera settings, GPS location, dimensions, and image properties from any photo. Free EXIF viewer, runs in your browser.',
  alternates: { canonical: '/image/metadata' },
  openGraph: {
    title: 'Image Metadata Viewer Online — View EXIF Data',
    description: 'View EXIF metadata, camera settings, GPS location, dimensions, and image properties from any photo. Free EXIF viewer, runs in your browser.',
    url: '/image/metadata',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Image Metadata Viewer Online — View EXIF Data',
    description: 'View EXIF metadata, camera settings, GPS location, dimensions, and image properties from any photo. Free EXIF viewer, runs in your browser.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
