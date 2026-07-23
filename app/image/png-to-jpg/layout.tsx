import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PNG to JPG Converter Online — Free & Fast',
  description: 'Convert PNG images to JPG format free and instantly in your browser. No upload to server, no signup required. Download the converted image with one click.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
