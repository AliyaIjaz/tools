import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PNG to WebP Converter Online — Free & Fast',
  description: 'Convert PNG images to WebP format and cut file sizes by up to 30% while keeping transparency. Free and instant in your browser — no upload to server, no signup required.',
  alternates: { canonical: '/image/png-to-webp' },
  openGraph: {
    title: 'PNG to WebP Converter Online — Free & Fast',
    description: 'Convert PNG images to WebP format and cut file sizes by up to 30% while keeping transparency. Free and instant in your browser — no upload to server, no signup required.',
    url: '/image/png-to-webp',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'PNG to WebP Converter Online — Free & Fast',
    description: 'Convert PNG images to WebP format and cut file sizes by up to 30% while keeping transparency. Free and instant in your browser — no upload to server, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
