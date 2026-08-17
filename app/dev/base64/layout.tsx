import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder Online',
  description: 'Encode text or files to Base64 or decode Base64 strings back to plain text instantly. Supports UTF-8 and binary data. Free online tool — no upload, no signup, runs in your browser.',
  alternates: { canonical: '/dev/base64' },
  openGraph: {
    title: 'Base64 Encoder & Decoder Online',
    description: 'Encode text or files to Base64 or decode Base64 strings back to plain text instantly. Supports UTF-8 and binary data. Free online tool — no upload, no signup, runs in your browser.',
    url: '/dev/base64',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Base64 Encoder & Decoder Online',
    description: 'Encode text or files to Base64 or decode Base64 strings back to plain text instantly. Supports UTF-8 and binary data. Free online tool — no upload, no signup, runs in your browser.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
