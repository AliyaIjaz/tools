import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Cropper Online — Crop Images Free',
  description: 'Crop images interactively in your browser. Select your crop region and download the result instantly. Free online image cropper — no upload needed.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
