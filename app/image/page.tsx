import type { Metadata } from 'next'
import { getToolsByCategory } from '@/lib/tools'
import { CATEGORIES } from '@/lib/constants'
import ToolCard from '@/components/ui/ToolCard'

export const metadata: Metadata = {
  title: 'Image Tools',
  description: 'Free online image tools — resize, crop, convert, compress, rotate images and more. Supports PNG, JPG, WebP. Everything runs in your browser — no upload to server.',
  openGraph: {
    title: 'Image Tools — Zenveel',
    description: 'Free online image tools — resize, crop, convert, compress, rotate images and more. Supports PNG, JPG, WebP. Everything runs in your browser — no upload to server.',
    url: '/image',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Image Tools — Zenveel',
    description: 'Free online image tools — resize, crop, convert, compress, rotate images and more. Supports PNG, JPG, WebP. Everything runs in your browser — no upload to server.',
  },
}

export default function ImagePage() {
  const tools = getToolsByCategory('image')
  const meta = CATEGORIES.image

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
