import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPUB to PDF Converter Online | Free & Private',
  description: 'Convert EPUB to PDF free online. Keeps text, headings, and images, adds a cover and title page. Fast, private, no server, no registration. No watermark.',
  alternates: { canonical: '/convertor/epub-to-pdf' },
  openGraph: {
    title: 'EPUB to PDF Converter Online | Free & Private',
    description: 'Convert EPUB to PDF free online. Keeps text, headings, and images, adds a cover and title page. Fast, private, no server, no registration. No watermark.',
    url: '/convertor/epub-to-pdf',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'EPUB to PDF Converter Online | Free & Private',
    description: 'Convert EPUB to PDF free online. Keeps text, headings, and images, adds a cover and title page. Fast, private, no server, no registration. No watermark.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
