import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Metadata Viewer Online — View EXIF Data',
  description: 'View EXIF metadata, camera settings, GPS location, dimensions, and image properties from any photo. Free online EXIF viewer — runs in your browser, nothing is uploaded to a server.',
  alternates: { canonical: '/image/metadata' },
  openGraph: {
    title: 'Image Metadata Viewer Online — View EXIF Data',
    description: 'View EXIF metadata, camera settings, GPS location, dimensions, and image properties from any photo. Free online EXIF viewer — runs in your browser, nothing is uploaded to a server.',
    url: '/image/metadata',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image Metadata Viewer Online — View EXIF Data',
    description: 'View EXIF metadata, camera settings, GPS location, dimensions, and image properties from any photo. Free online EXIF viewer — runs in your browser, nothing is uploaded to a server.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
