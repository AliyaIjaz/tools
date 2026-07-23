import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Resizer Online — Resize Images Free',
  description: 'Resize images to exact pixel dimensions in your browser. Preserve aspect ratio or set custom width and height. Free, fast, private — no upload to server.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
