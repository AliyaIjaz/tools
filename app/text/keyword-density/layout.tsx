import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keyword Density Checker Online',
  description: 'Analyze keyword frequency and density in your text. Free SEO tool that runs entirely in your browser — no signup needed.',
  alternates: { canonical: '/text/keyword-density' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
