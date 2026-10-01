import type { Metadata } from 'next'
import Link from 'next/link'
import { TOOLS, getToolsByCategory } from '@/lib/tools'
import { CATEGORIES, CATEGORY_ORDER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'All Tools',
  description: `Browse all ${TOOLS.length} free online tools on Zenveel — developer, text, web, image, convertor, and typing utilities. All run in your browser, no signup needed.`,
  openGraph: {
    title: 'All Tools — Zenveel',
    description: `Browse all ${TOOLS.length} free online tools on Zenveel — developer, text, web, image, convertor, and typing utilities. All run in your browser, no signup needed.`,
    url: '/all-tools',
    siteName: 'Zenveel',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'All Tools — Zenveel',
    description: `Browse all ${TOOLS.length} free online tools on Zenveel — developer, text, web, image, convertor, and typing utilities.`,
  },
}

export default function AllToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{ background: 'var(--color-dev-dim)', border: '1px solid oklch(0.6 0.2 290 / 0.3)', color: 'var(--color-dev)' }}
        >
          {TOOLS.length} tools
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">All Tools</h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          A complete index of every tool on Zenveel, grouped by category.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORIES[category]
          const tools = getToolsByCategory(category)
          if (tools.length === 0) return null

          return (
            <section key={category}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  <Link
                    href={meta.href}
                    className="transition-colors"
                    style={{ color: 'white' }}
                  >
                    {meta.label}
                  </Link>
                </h2>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 pl-1"
              >
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className="text-sm underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
