import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Decoder Online',
  description: 'Decode JWT tokens instantly to inspect the header and payload. Paste any JSON Web Token and see its contents formatted and readable. Free, private, browser-based.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
