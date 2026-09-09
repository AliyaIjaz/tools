import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Gradient Generator Online — Linear, Radial & Conic',
  description:
    'Generate CSS gradients visually with a live preview. Build linear, radial, and conic gradients with unlimited color stops. Copy production-ready CSS instantly. Free, browser-based.',
  alternates: { canonical: '/web/css-gradient' },
  openGraph: {
    title: 'CSS Gradient Generator Online — Linear, Radial & Conic',
    description:
      'Generate CSS gradients visually with a live preview. Build linear, radial, and conic gradients with unlimited color stops. Copy production-ready CSS instantly. Free, browser-based.',
    url: '/web/css-gradient',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'CSS Gradient Generator Online — Linear, Radial & Conic',
    description:
      'Generate CSS gradients visually with a live preview. Build linear, radial, and conic gradients with unlimited color stops. Copy production-ready CSS instantly. Free, browser-based.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
