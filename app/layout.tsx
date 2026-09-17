import type { Metadata } from 'next'
import { Geist, Geist_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdSlot from '@/components/ui/AdSlot'
import { BASE_URL } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Zenveel — Free Online Tools for Developers',
    template: '%s — Zenveel',
  },
  description: '60+ free browser-based utility tools for developers and creators. No signup. Everything runs in your browser.',
  alternates: {
    canonical: `${BASE_URL}/`,
  },
  openGraph: {
    title: 'Zenveel — Free Online Tools for Developers',
    description: '60+ free browser-based utility tools for developers and creators. No signup. Everything runs in your browser.',
    url: '/',
    siteName: 'Zenveel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zenveel — Free Online Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenveel — Free Online Tools for Developers',
    description: '60+ free browser-based utility tools for developers and creators. No signup. Everything runs in your browser.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}>
        <Navbar />
        <div className="flex justify-center gap-4 px-4">
          <AdSlot side="left" />
          <main className="min-w-0 flex-1 max-w-7xl">{children}</main>
          <AdSlot side="right" />
        </div>
        <Footer />
      </body>
    </html>
  )
}
