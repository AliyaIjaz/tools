import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Converter Online — PNG, JPEG & WebP',
  description: 'Convert images between PNG, JPEG, and WebP formats instantly in your browser. Adjust quality and download the result. Free, no signup.',
  alternates: { canonical: '/image/convert' },
  openGraph: {
    title: 'Image Converter Online — PNG, JPEG & WebP',
    description: 'Convert images between PNG, JPEG, and WebP formats instantly in your browser. Adjust quality and download the result. Free, no signup.',
    url: '/image/convert',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Image Converter Online — PNG, JPEG & WebP',
    description: 'Convert images between PNG, JPEG, and WebP formats instantly in your browser. Adjust quality and download the result. Free, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
