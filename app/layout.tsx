import type { Metadata } from 'next'
import { Geist, Geist_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdSlot from '@/components/ui/AdSlot'

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
  metadataBase: new URL('https://freetools.zenveel.com'),
  title: {
    default: 'Zenveel',
    template: '%s — Zenveel',
  },
  description: 'Fast, free browser-based utility tools. No signup. No server.',
  alternates: {
    canonical: '/',
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
