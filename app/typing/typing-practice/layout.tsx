import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Typing Practice Online — Test & Improve Typing Speed',
  description:
    'Practice typing and measure your WPM and accuracy with real-time feedback. Free online typing test — no signup required, works in all modern browsers.',
  alternates: { canonical: '/typing/typing-practice' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
