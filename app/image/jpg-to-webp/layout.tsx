import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JPG to WebP Converter Online — Free & Fast',
  description: 'Convert JPG images to WebP format and reduce file size by up to 30% without visible quality loss. Free and instant in your browser — no upload to server, no signup required.',
  alternates: { canonical: '/image/jpg-to-webp' },
  openGraph: {
    title: 'JPG to WebP Converter Online — Free & Fast',
    description: 'Convert JPG images to WebP format and reduce file size by up to 30% without visible quality loss. Free and instant in your browser — no upload to server, no signup required.',
    url: '/image/jpg-to-webp',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JPG to WebP Converter Online — Free & Fast',
    description: 'Convert JPG images to WebP format and reduce file size by up to 30% without visible quality loss. Free and instant in your browser — no upload to server, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
