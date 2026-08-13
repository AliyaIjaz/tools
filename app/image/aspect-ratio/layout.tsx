import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator Online',
  description: 'Calculate and convert image aspect ratios instantly. Free browser-based tool — no upload to server, no signup required.',
  alternates: { canonical: '/image/aspect-ratio' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
