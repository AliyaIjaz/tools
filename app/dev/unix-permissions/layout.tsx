import type { Metadata } from 'next'

const title = 'Unix File Permissions & chmod Calculator Online'
const description = 'Free chmod calculator — convert between numeric (755) and symbolic (rwxr-xr-x) Linux file permissions instantly. Per-bit breakdown for owner, group, and other.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/dev/unix-permissions' },
  openGraph: {
    title,
    description,
    url: '/dev/unix-permissions',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
    title,
    description,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
