import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favicon Generator Online — Create Website Favicons from Any Image',
  description:
    'Create high-quality website favicons from any image. Upload PNG, JPEG, or WebP and instantly generate favicon PNG files in all standard sizes: 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256. Free, private, browser-based.',
  alternates: { canonical: '/web/favicon-generator' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
