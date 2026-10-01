'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold mb-4" style={{ color: 'rgba(255,255,255,0.08)' }}>404</p>
      <h1 className="text-xl font-semibold text-white mb-2">Tool not found</h1>
      <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
        This page doesn&apos;t exist or the tool hasn&apos;t been built yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium text-white transition-all"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
      >
        <Home size={14} />
        Back to home
      </Link>
    </div>
  )
}
