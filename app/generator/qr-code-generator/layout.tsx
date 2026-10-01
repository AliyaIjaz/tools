import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code Generator Online | Free, No Signup',
  description: 'Create QR codes for links, text, Wi-Fi, email, phone, SMS, and contact cards. Customize colors and size, then download PNG or SVG. Free, private, no watermark.',
  alternates: { canonical: '/generator/qr-code-generator' },
  openGraph: {
    title: 'QR Code Generator Online | Free, No Signup',
    description: 'Create QR codes for links, text, Wi-Fi, email, phone, SMS, and contact cards. Customize colors and size, then download PNG or SVG. Free, private, no watermark.',
    url: '/generator/qr-code-generator',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title: 'QR Code Generator Online | Free, No Signup',
    description: 'Create QR codes for links, text, Wi-Fi, email, phone, SMS, and contact cards. Customize colors and size, then download PNG or SVG. Free, private, no watermark.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
