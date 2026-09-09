import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favicon Generator — Create Favicons from Any Image',
  description: 'Create website favicons from any image in seconds. Upload PNG, JPEG, or WebP and generate favicon files at 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256. Free, private, browser-based.',
  alternates: { canonical: '/web/favicon-generator' },
  openGraph: {
    title: 'Favicon Generator — Create Favicons from Any Image',
    description: 'Create website favicons from any image in seconds. Upload PNG, JPEG, or WebP and generate favicon files at 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256. Free, private, browser-based.',
    url: '/web/favicon-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Favicon Generator — Create Favicons from Any Image',
    description: 'Create website favicons from any image in seconds. Upload PNG, JPEG, or WebP and generate favicon files at 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256. Free, private, browser-based.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
