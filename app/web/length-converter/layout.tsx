import type { Metadata } from 'next'

const title = 'km to Miles Converter — Length Converter Online (mm, cm, m, ft, in)'
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
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
