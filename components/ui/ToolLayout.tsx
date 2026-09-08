import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { ChevronRight, Home } from 'lucide-react'
import { getRelatedTools, TOOLS } from '@/lib/tools'
import { CATEGORIES, BASE_URL } from '@/lib/constants'
import { Category } from '@/lib/types'
import ToolCard from './ToolCard'

type Props = {
  toolId: string
  title: string
  description: string
  category: Category
  iconName: string
  children: React.ReactNode
  seoContent?: React.ReactNode
  relatedToolIds?: string[]
  showAllCategory?: boolean
  compactRelated?: boolean
  href?: string
}

export default function ToolLayout({ toolId, title, description, category, iconName, children, seoContent, relatedToolIds, showAllCategory, compactRelated, href }: Props) {
  const related = showAllCategory
    ? TOOLS.filter((t) => t.category === category && t.id !== toolId)
    : relatedToolIds
    ? TOOLS.filter((t) => relatedToolIds.includes(t.id))
    : getRelatedTools(toolId, 3)
  const color = CATEGORIES[category].color
  const dimColor = CATEGORIES[category].dimColor
  const categoryMeta = CATEGORIES[category]

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[iconName]

  const toolHref = href ?? TOOLS.find((t) => t.id === toolId)?.href ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${title} Online`,
    description,
    url: `${BASE_URL}${toolHref}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-medium transition-colors"
            style={{ color: 'var(--color-dev)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
          <Link
            href={categoryMeta.href}
            className="font-medium transition-colors"
            style={{ color }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {categoryMeta.label}
          </Link>
          <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.25)' }} />
          <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</span>
        </nav>

        {/* Tool header */}
        <div className="flex items-start gap-4 mb-8">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: dimColor, border: `1px solid ${color}40` }}
          >
            {IconComponent && <IconComponent size={20} style={{ color }} />}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white mb-1">{title} Online</h1>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>{description}</p>
          </div>
        </div>

        {/* Tool content */}
        <div>{children}</div>

        {/* SEO content */}
        {seoContent && (
          <div className="mt-16 space-y-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {seoContent}
          </div>
        )}

        {/* Related tools */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Related Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {related.map((t) => (
                <ToolCard key={t.id} tool={t} compact={compactRelated} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
