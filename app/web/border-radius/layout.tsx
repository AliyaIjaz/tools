import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Border Radius Generator Online',
  description:
    'Visually build and preview CSS border-radius values per corner. Adjust each corner independently and copy the generated CSS. Free, browser-based tool.',
  alternates: { canonical: '/web/border-radius' },
  openGraph: {
    title: 'CSS Border Radius Generator Online',
    description:
      'Visually build and preview CSS border-radius values per corner. Adjust each corner independently and copy the generated CSS. Free, browser-based tool.',
    url: '/web/border-radius',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CSS Border Radius Generator Online',
    description:
      'Visually build and preview CSS border-radius values per corner. Adjust each corner independently and copy the generated CSS. Free, browser-based tool.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
