import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Box Shadow Generator Online – Free CSS Box Shadow Maker',
  description:
    'Build CSS box shadows with interactive controls and a live preview. Customize blur, spread, offset, color, and opacity. Copy the CSS instantly. Free, browser-based.',
  alternates: { canonical: '/web/box-shadow' },
  openGraph: {
    title: 'CSS Box Shadow Generator Online – Free CSS Box Shadow Maker',
    description:
      'Build CSS box shadows with interactive controls and a live preview. Customize blur, spread, offset, color, and opacity. Copy the CSS instantly. Free, browser-based.',
    url: '/web/box-shadow',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CSS Box Shadow Generator Online – Free CSS Box Shadow Maker',
    description:
      'Build CSS box shadows with interactive controls and a live preview. Customize blur, spread, offset, color, and opacity. Copy the CSS instantly. Free, browser-based.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
