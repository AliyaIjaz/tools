import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GIF to Images | Extract GIF Frames',
  description: 'Split an animated GIF into PNG, JPG, or WebP frames and download them one by one or as a ZIP. Free, private, no upload, no registration, no watermark.',
  alternates: { canonical: '/convertor/gif-to-images' },
  openGraph: {
    title: 'GIF to Images | Extract GIF Frames',
    description: 'Split an animated GIF into PNG, JPG, or WebP frames and download them one by one or as a ZIP. Free, private, no upload, no registration, no watermark.',
    url: '/convertor/gif-to-images',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'GIF to Images | Extract GIF Frames',
    description: 'Split an animated GIF into PNG, JPG, or WebP frames and download them one by one or as a ZIP. Free, private, no upload, no registration, no watermark.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
