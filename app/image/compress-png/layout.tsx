import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress PNG Online — Reduce PNG File Size Free',
  description: 'Reduce PNG file size in your browser while preserving transparency. Free online PNG compressor — no server upload, no signup required.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
