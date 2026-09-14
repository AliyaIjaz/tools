import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Picker Online — Pick Colors from Any Image',
  description: 'Click any pixel on an image to extract its exact HEX, RGB, and HSL color values instantly. Free color picker — no upload, no signup.',
  alternates: { canonical: '/image/color-picker' },
  openGraph: {
    title: 'Color Picker Online — Pick Colors from Any Image',
    description: 'Click any pixel on an image to extract its exact HEX, RGB, and HSL color values instantly. Free color picker — no upload, no signup.',
    url: '/image/color-picker',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Color Picker Online — Pick Colors from Any Image',
    description: 'Click any pixel on an image to extract its exact HEX, RGB, and HSL color values instantly. Free color picker — no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
