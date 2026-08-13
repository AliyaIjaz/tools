import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Encoder & Decoder Online',
  description: 'Encode and decode URL components online. Convert special characters to percent-encoding or decode URLs back to readable text. Free, instant, browser-based.',
  alternates: { canonical: '/dev/url-encoder' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
