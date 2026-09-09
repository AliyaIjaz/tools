import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keyword Density Checker Online',
  description: 'Analyze keyword frequency and density in your text. Identify top words and phrases for SEO optimization. Free browser-based keyword density checker — no signup, no data sent.',
  alternates: { canonical: '/text/keyword-density' },
  openGraph: {
    title: 'Keyword Density Checker Online',
    description: 'Analyze keyword frequency and density in your text. Identify top words and phrases for SEO optimization. Free browser-based keyword density checker — no signup, no data sent.',
    url: '/text/keyword-density',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Keyword Density Checker Online',
    description: 'Analyze keyword frequency and density in your text. Identify top words and phrases for SEO optimization. Free browser-based keyword density checker — no signup, no data sent.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
