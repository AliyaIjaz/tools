'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { TOOLS, getToolsByCategory } from '@/lib/tools'
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/constants'
import { Category } from '@/lib/types'
import ToolCard from '@/components/ui/ToolCard'

export default function HomePage() {
  const [query, setQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    )
  }, [query])

  const isSearching = query.trim().length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-14 relative">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)',
          }}
        />
        {/* Glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-48 blur-3xl pointer-events-none"
          style={{ background: 'oklch(0.6 0.2 290 / 0.08)' }}
        />

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{
            background: 'var(--color-dev-dim)',
            border: '1px solid oklch(0.6 0.2 290 / 0.3)',
            color: 'var(--color-dev)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-dev)' }} />
          {TOOLS.length} tools available
        </div>

        <h1
          className="text-6xl sm:text-7xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-orbitron)', letterSpacing: '0.04em' }}
        >
          Zen<span style={{ color: 'var(--color-dev)' }}>veel</span>
        </h1>
        <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Browser-based utility tools. No signup. No server.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-base outline-none transition-all"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--border)',
              color: 'rgba(255,255,255,0.85)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-focus)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>
      </div>

      {/* Search results */}
      {isSearching && (
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
              {searchResults.map((tool) => (
                <ToolCard key={tool.id} tool={tool} showCategory />
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: 'var(--surface)', border: '2px solid var(--border)' }}
            >
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.35)' }}>
                No tools match &ldquo;{query}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Category sections */}
      {!isSearching &&
        CATEGORY_ORDER.map((category: Category) => {
          const meta = CATEGORIES[category]
          const tools = getToolsByCategory(category)
          const featured = tools.slice(0, 4)
          const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[meta.iconName]

          return (
            <section key={category} className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: meta.dimColor }}
                  >
                    {IconComponent && <IconComponent size={15} style={{ color: meta.color }} />}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{meta.label}</h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {tools.length} tools
                    </p>
                  </div>
                </div>
                <Link
                  href={meta.href}
                  className="flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: meta.color }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
                {featured.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}
    </div>
  )
}
