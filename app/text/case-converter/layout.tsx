import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Converter Online — All Case Formats',
  description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more — instantly in your browser. Free online case converter, no signup needed.',
  alternates: { canonical: '/text/case-converter' },
  openGraph: {
    title: 'Case Converter Online — All Case Formats',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more — instantly in your browser. Free online case converter, no signup needed.',
    url: '/text/case-converter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Case Converter Online — All Case Formats',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more — instantly in your browser. Free online case converter, no signup needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
