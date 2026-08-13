import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Converter Online — PNG, JPEG & WebP',
  description: 'Convert images between PNG, JPEG, and WebP formats instantly in your browser. Free online image converter — no signup, no server upload required.',
  alternates: { canonical: '/image/convert' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
