import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { ChevronRight, Home, Twitter, Linkedin } from 'lucide-react'
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
  const shareUrl = `${BASE_URL}${toolHref}`
  const shareText = `${title} Online — free tool on Zenveel`
  const shareLinks = [
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      Icon: Twitter,
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      Icon: Linkedin,
    },
    {
      label: 'Share on Reddit',
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      Icon: null,
    },
  ]
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

        {/* Share this tool */}
        <div
          className="mt-16 flex flex-col items-center justify-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="text-base font-semibold text-white">
            Share this tool
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
          {shareLinks.map(({ label, href: shareHref, Icon }) => (
            <a
              key={label}
              href={shareHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="flex items-center justify-center w-12 h-12 rounded-xl transition-all"
              style={{ background: dimColor, border: `1px solid ${color}40`, color }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.transform = 'scale(1.15)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              {Icon ? (
                <Icon size={22} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 11.5c0-1.1-.9-2-2-2-.5 0-1 .2-1.35.5-1.3-.9-3.1-1.5-5.1-1.6l.9-4 2.9.65a1.5 1.5 0 102.15-1.9 1.5 1.5 0 00-2.3.65l-3.25-.7a.5.5 0 00-.6.4l-1 4.5c-2 .1-3.8.7-5.1 1.6-.35-.3-.85-.5-1.35-.5-1.1 0-2 .9-2 2 0 .8.5 1.5 1.15 1.85a3.6 3.6 0 00-.05.65c0 2.8 3.2 5.1 7.15 5.1s7.15-2.3 7.15-5.1c0-.2 0-.45-.05-.65.65-.35 1.15-1.05 1.15-1.85zM8.3 13a1.3 1.3 0 112.6 0 1.3 1.3 0 01-2.6 0zm6.6 3.2c-.75.75-2.1.85-2.9.85s-2.15-.1-2.9-.85a.35.35 0 01.5-.5c.5.5 1.55.65 2.4.65s1.9-.15 2.4-.65a.35.35 0 11.5.5zm-.3-1.9a1.3 1.3 0 110-2.6 1.3 1.3 0 010 2.6z" />
                </svg>
              )}
            </a>
          ))}
          </div>
        </div>

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
