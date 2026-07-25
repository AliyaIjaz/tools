import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Rotator Online — Rotate Images Free',
  description: 'Rotate images 90°, 180°, or 270° and flip horizontally or vertically in your browser. Free online image rotator — no server upload, no registration.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
