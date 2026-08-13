import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder Online',
  description: 'Encode text to Base64 or decode Base64 strings back to plain text instantly. Supports UTF-8. Free online tool — no upload, no signup.',
  alternates: { canonical: '/dev/base64' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
