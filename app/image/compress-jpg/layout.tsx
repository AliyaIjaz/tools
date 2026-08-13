import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compress JPG Online — Reduce JPEG File Size Free',
  description: 'Reduce JPG and JPEG file size in your browser without losing quality. Free online JPG compressor — no upload to server, no signup required.',
  alternates: { canonical: '/image/compress-jpg' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
