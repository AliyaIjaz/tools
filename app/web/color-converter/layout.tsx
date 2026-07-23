import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Converter Online — HEX, RGB, HSL & OKLCH',
  description:
    'Convert colors between HEX, RGB, HSL, and OKLCH formats instantly. Free online color converter — no signup, no installation, runs entirely in your browser.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
