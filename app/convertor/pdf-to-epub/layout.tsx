import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF to EPUB Converter Online | Free eBook Maker',
  description: 'Convert PDF to EPUB free online. Pick reflowable text or page images for Kindle, Kobo, and Apple Books. Fast, private, no server, no registration, no watermark.',
  alternates: { canonical: '/convertor/pdf-to-epub' },
  openGraph: {
    title: 'PDF to EPUB Converter Online | Free eBook Maker',
    description: 'Convert PDF to EPUB free online. Pick reflowable text or page images for Kindle, Kobo, and Apple Books. Fast, private, no server, no registration, no watermark.',
    url: '/convertor/pdf-to-epub',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'PDF to EPUB Converter Online | Free eBook Maker',
    description: 'Convert PDF to EPUB free online. Pick reflowable text or page images for Kindle, Kobo, and Apple Books. Fast, private, no server, no registration, no watermark.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
