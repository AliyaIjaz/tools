import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Number Base Converter Online',
  description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases instantly. Supports large numbers and live conversion. Free browser-based tool — instant, no signup required.',
  alternates: { canonical: '/dev/number-base-converter' },
  openGraph: {
    title: 'Number Base Converter Online',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases instantly. Supports large numbers and live conversion. Free browser-based tool — instant, no signup required.',
    url: '/dev/number-base-converter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'Number Base Converter Online',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases instantly. Supports large numbers and live conversion. Free browser-based tool — instant, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
