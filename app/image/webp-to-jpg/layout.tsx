import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebP to JPG Converter Online — Free & Fast',
  description: 'Convert WebP images to JPG format for maximum compatibility with older browsers and apps. Free, instant, no upload, no signup.',
  alternates: { canonical: '/image/webp-to-jpg' },
  openGraph: {
    title: 'WebP to JPG Converter Online — Free & Fast',
    description: 'Convert WebP images to JPG format for maximum compatibility with older browsers and apps. Free, instant, no upload, no signup.',
    url: '/image/webp-to-jpg',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'WebP to JPG Converter Online — Free & Fast',
    description: 'Convert WebP images to JPG format for maximum compatibility with older browsers and apps. Free, instant, no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
