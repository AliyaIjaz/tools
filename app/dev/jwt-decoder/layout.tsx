import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Decoder Online',
  description: 'Decode and inspect JWT tokens instantly — view the header, payload, and signature in a readable format. Free online JWT decoder, browser-based, nothing sent to a server.',
  alternates: { canonical: '/dev/jwt-decoder' },
  openGraph: {
    title: 'JWT Decoder Online',
    description: 'Decode and inspect JWT tokens instantly — view the header, payload, and signature in a readable format. Free online JWT decoder, browser-based, nothing sent to a server.',
    url: '/dev/jwt-decoder',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'JWT Decoder Online',
    description: 'Decode and inspect JWT tokens instantly — view the header, payload, and signature in a readable format. Free online JWT decoder, browser-based, nothing sent to a server.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
