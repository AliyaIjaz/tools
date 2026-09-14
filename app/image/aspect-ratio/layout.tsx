import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator Online',
  description: 'Calculate and convert image aspect ratios instantly. Scale dimensions proportionally for any resolution or screen size. Free, no upload, no signup.',
  alternates: { canonical: '/image/aspect-ratio' },
  openGraph: {
    title: 'Aspect Ratio Calculator Online',
    description: 'Calculate and convert image aspect ratios instantly. Scale dimensions proportionally for any resolution or screen size. Free, no upload, no signup.',
    url: '/image/aspect-ratio',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Aspect Ratio Calculator Online',
    description: 'Calculate and convert image aspect ratios instantly. Scale dimensions proportionally for any resolution or screen size. Free, no upload, no signup.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
