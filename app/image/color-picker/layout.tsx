import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Picker Online — Pick Colors from Any Image',
  description: 'Click any pixel on an image to extract its HEX, RGB, and HSL color values instantly. Free online color picker — no upload to server, no signup needed.',
  alternates: { canonical: '/image/color-picker' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
