import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor Online — Reduce Image File Size',
  description: 'Compress images and reduce file size in your browser. Supports PNG, JPEG, and WebP. Free online image compressor — no upload, no signup needed.',
  alternates: { canonical: '/image/compress' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
