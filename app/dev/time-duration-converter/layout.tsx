import type { Metadata } from 'next'

const title = 'Milliseconds to Seconds Converter — ms, Minutes, Hours, Days Online'
const description = 'Convert between milliseconds, seconds, minutes, hours, days, weeks, months, and years instantly. Free tool for API timeouts and cron intervals.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/dev/time-duration-converter' },
  openGraph: {
    title,
    description,
    url: '/dev/time-duration-converter',
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
