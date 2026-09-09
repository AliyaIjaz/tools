import type { Metadata } from 'next'

const title = 'Celsius to Fahrenheit Converter — °C, °F, Kelvin, Rankine Online'
const description = 'Free Celsius to Fahrenheit converter — instantly convert °C, °F, Kelvin, and Rankine. Type in any field and all others update live. No signup required.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/web/temperature-converter' },
  openGraph: {
    title,
    description,
    url: '/web/temperature-converter',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title,
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
