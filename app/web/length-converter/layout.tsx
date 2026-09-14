import type { Metadata } from 'next'

const title = 'Length Converter Online — km, Miles, m, ft, in'
const description = 'Free km to miles converter — instantly convert between kilometers, miles, feet, meters, cm, inches, yards, and nautical miles. All units update live. No signup.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/web/length-converter' },
  openGraph: {
    title,
    description,
    url: '/web/length-converter',
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
