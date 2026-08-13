import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Number Base Converter Online',
  description: 'Convert numbers between binary, octal, decimal, and hexadecimal bases. Free browser-based tool — instant, no signup required.',
  alternates: { canonical: '/dev/number-base-converter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
