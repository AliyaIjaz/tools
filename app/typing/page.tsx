import type { Metadata } from 'next'
import { getToolsByCategory } from '@/lib/tools'
import { CATEGORIES } from '@/lib/constants'
import ToolCard from '@/components/ui/ToolCard'

export const metadata: Metadata = {
  title: 'Typing Tools',
  description: 'Free online typing tools — practice typing and measure your WPM and accuracy. Runs entirely in your browser, no signup needed.',
  alternates: { canonical: '/typing' },
  openGraph: {
    title: 'Typing Tools — Zenveel',
    description: 'Free online typing tools — practice typing and measure your WPM and accuracy. Runs entirely in your browser, no signup needed.',
    url: '/typing',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Typing Tools — Zenveel',
    description: 'Free online typing tools — practice typing and measure your WPM and accuracy. Runs entirely in your browser, no signup needed.',
  },
}

export default function TypingPage() {
  const tools = getToolsByCategory('typing')
  const meta = CATEGORIES.typing

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{ background: meta.dimColor, border: `1px solid ${meta.color}40`, color: meta.color }}
        >
          {tools.length} tools
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{meta.label}</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{meta.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
