import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barcode Generator Online | Code 128, EAN, UPC',
  description: 'Create Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, and more. Adjust size, colors, and labels, then download PNG or SVG. Free, private, no watermark.',
  alternates: { canonical: '/generator/barcode-generator' },
  openGraph: {
    title: 'Barcode Generator Online | Code 128, EAN, UPC',
    description: 'Create Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, and more. Adjust size, colors, and labels, then download PNG or SVG. Free, private, no watermark.',
    url: '/generator/barcode-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Barcode Generator Online | Code 128, EAN, UPC',
    description: 'Create Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, and more. Adjust size, colors, and labels, then download PNG or SVG. Free, private, no watermark.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
