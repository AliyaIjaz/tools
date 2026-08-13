import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meta Tag Generator Online — SEO, Open Graph & Twitter Cards',
  description:
    'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page looks when shared. Copy the HTML instantly. Free, browser-based.',
  alternates: { canonical: '/web/meta-tag-generator' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
