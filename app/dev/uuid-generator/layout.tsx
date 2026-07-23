import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UUID Generator Online',
  description: 'Generate UUID v4 values instantly in your browser. Bulk generate unique IDs, copy to clipboard, and use them in your projects. Free, no signup required.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
