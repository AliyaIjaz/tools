import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator Online',
  description: 'Calculate and convert image aspect ratios instantly. Scale dimensions proportionally for any resolution or screen size. Free browser-based tool — no upload to server, no signup required.',
  alternates: { canonical: '/image/aspect-ratio' },
  openGraph: {
    title: 'Aspect Ratio Calculator Online',
    description: 'Calculate and convert image aspect ratios instantly. Scale dimensions proportionally for any resolution or screen size. Free browser-based tool — no upload to server, no signup required.',
    url: '/image/aspect-ratio',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Aspect Ratio Calculator Online',
    description: 'Calculate and convert image aspect ratios instantly. Scale dimensions proportionally for any resolution or screen size. Free browser-based tool — no upload to server, no signup required.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
