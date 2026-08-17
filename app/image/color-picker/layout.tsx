import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Picker Online — Pick Colors from Any Image',
  description: 'Click any pixel on an image to extract its exact HEX, RGB, and HSL color values instantly. Free online color picker from image — no upload to server, no signup needed.',
  alternates: { canonical: '/image/color-picker' },
  openGraph: {
    title: 'Color Picker Online — Pick Colors from Any Image',
    description: 'Click any pixel on an image to extract its exact HEX, RGB, and HSL color values instantly. Free online color picker from image — no upload to server, no signup needed.',
    url: '/image/color-picker',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Color Picker Online — Pick Colors from Any Image',
    description: 'Click any pixel on an image to extract its exact HEX, RGB, and HSL color values instantly. Free online color picker from image — no upload to server, no signup needed.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
