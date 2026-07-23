import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Metadata Viewer Online — View EXIF Data',
  description: 'View EXIF metadata, camera settings, GPS location, and image properties from any photo. Free online EXIF viewer — runs in your browser, nothing uploaded.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
