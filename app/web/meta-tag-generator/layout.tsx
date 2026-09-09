import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meta Tag Generator Online — SEO, Open Graph & Twitter Cards',
  description:
    'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page looks when shared. Copy the HTML instantly. Free, browser-based.',
  alternates: { canonical: '/web/meta-tag-generator' },
  openGraph: {
    title: 'Meta Tag Generator Online — SEO, Open Graph & Twitter Cards',
    description:
      'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page looks when shared. Copy the HTML instantly. Free, browser-based.',
    url: '/web/meta-tag-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Meta Tag Generator Online — SEO, Open Graph & Twitter Cards',
    description:
      'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page looks when shared. Copy the HTML instantly. Free, browser-based.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
