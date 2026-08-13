import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Unit Converter Online — px, rem, em, vw & More',
  description:
    'Convert between CSS units including px, rem, em, vw, vh, pt, and percentage. Set custom base font size and viewport. Free online CSS unit converter.',
  alternates: { canonical: '/web/css-unit-converter' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
