import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress WebP Online — Reduce WebP File Size Free',
  description: 'Reduce WebP image file size in your browser quickly and privately. Free online WebP compressor — no upload to server, no signup required.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
