'use client'

import Link from 'next/link'
import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { ToolDefinition } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { AVAILABLE_HREFS } from '@/lib/tools'

type Props = {
  tool: ToolDefinition
  showCategory?: boolean
  compact?: boolean
}

export default function ToolCard({ tool, showCategory = false, compact = false }: Props) {
  const available = AVAILABLE_HREFS.has(tool.href)
  const color = CATEGORIES[tool.category].color
  const dimColor = CATEGORIES[tool.category].dimColor
  const [loading, setLoading] = useState(false)

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>>)[tool.iconName]

  const content = (
    <div
      className={`relative rounded-xl transition-all duration-200 h-full ${compact ? 'p-2.5' : 'p-3'}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: available ? 'pointer' : 'default',
      }}
    >
      {/* Hover overlay — CSS only */}
      <style>{`
        .tool-card-inner:hover {
          background: var(--surface-hover) !important;
          border-color: var(--border-hover) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center z-20"
          style={{ background: 'rgba(0,0,0,0.45)' }}>
          <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Coming soon overlay */}
      {!available && (
        <div className="absolute inset-0 rounded-xl flex items-end justify-end p-3 z-10">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
          >
            Soon
          </span>
        </div>
      )}

      <div className={!available ? 'opacity-50' : ''}>
        <div
          className={`rounded-lg flex items-center justify-center mb-2 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}
          style={{ background: dimColor }}
        >
          {IconComponent && <IconComponent size={compact ? 11 : 14} style={{ color }} />}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-medium text-white/90 leading-tight ${compact ? 'text-sm' : 'text-base'}`}>{tool.name}</h3>
          {tool.new && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: `${color}25`, color }}
            >
              New
            </span>
          )}
        </div>

        <p className={`leading-relaxed ${compact ? 'text-[11px]' : 'text-sm'}`} style={{ color: 'rgba(255,255,255,0.65)' }}>
          {tool.description}
        </p>

        {showCategory && (
          <div className="mt-3">
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: dimColor, color }}
            >
              {CATEGORIES[tool.category].label}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  if (!available) return <div className="h-full">{content}</div>

  return (
    <Link href={tool.href} className="block tool-card-inner rounded-xl transition-all duration-200 h-full"
      onClick={() => setLoading(true)}>
      {content}
    </Link>
  )
}
