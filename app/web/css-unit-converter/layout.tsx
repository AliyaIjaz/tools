import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Unit Converter Online — px, rem, em, vw & More',
  description:
    'Convert between CSS units including px, rem, em, vw, vh, pt, and percentage. Set custom base font size and viewport. Free online CSS unit converter.',
  alternates: { canonical: '/web/css-unit-converter' },
  openGraph: {
    title: 'CSS Unit Converter Online — px, rem, em, vw & More',
    description:
      'Convert between CSS units including px, rem, em, vw, vh, pt, and percentage. Set custom base font size and viewport. Free online CSS unit converter.',
    url: '/web/css-unit-converter',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CSS Unit Converter Online — px, rem, em, vw & More',
    description:
      'Convert between CSS units including px, rem, em, vw, vh, pt, and percentage. Set custom base font size and viewport. Free online CSS unit converter.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
