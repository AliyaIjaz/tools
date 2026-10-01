import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Images to GIF Converter | Free GIF Maker',
  description: 'Make an animated GIF from PNG, JPG, or WebP images or a ZIP. Reorder frames, set speed and size, and download free. Private, no upload, no watermark.',
  alternates: { canonical: '/convertor/images-to-gif' },
  openGraph: {
    title: 'Images to GIF Converter | Free GIF Maker',
    description: 'Make an animated GIF from PNG, JPG, or WebP images or a ZIP. Reorder frames, set speed and size, and download free. Private, no upload, no watermark.',
    url: '/convertor/images-to-gif',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Images to GIF Converter | Free GIF Maker',
    description: 'Make an animated GIF from PNG, JPG, or WebP images or a ZIP. Reorder frames, set speed and size, and download free. Private, no upload, no watermark.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
