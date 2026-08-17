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
  },
  twitter: {
    card: 'summary',
    title: 'Number Base Converter Online',
    description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases instantly. Supports large numbers and live conversion. Free browser-based tool — instant, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
