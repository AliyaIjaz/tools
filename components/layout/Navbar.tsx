'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/constants'
import { Category } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getToolsByCategory, AVAILABLE_HREFS } from '@/lib/tools'

const NAV_LINKS: { category: Category; label: string; href: string }[] = [
  { category: 'image', label: 'Image', href: '/image' },
  { category: 'text', label: 'Text', href: '/text' },
  { category: 'web', label: 'Web Dev', href: '/web' },
  { category: 'dev', label: 'Developer', href: '/dev' },
  { category: 'convertor', label: 'Convertor', href: '/convertor' },
  { category: 'typing', label: 'Typing', href: '/typing' },
]

const NAV_COLOR_OVERRIDES: Partial<Record<Category, { color: string; dimColor: string }>> = {
  typing: { color: '#ef4444', dimColor: 'rgba(239, 68, 68, 0.15)' },
}

const LucideIconMap = LucideIcons as unknown as Record<
  string,
  React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>
>

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/z.png"
              alt="Zenveel logo"
              width={44}
              height={44}
              className="transition-all duration-200 group-hover:scale-110 rounded-full"
            />
            <span style={{
              fontFamily: 'var(--font-orbitron)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              fontSize: '1rem',
              background: 'linear-gradient(90deg, var(--color-dev), var(--color-image))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Zenveel
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ category, label, href }) => {
              const active = isActive(href)
              const color = NAV_COLOR_OVERRIDES[category]?.color ?? CATEGORIES[category].color
              const dimColor = NAV_COLOR_OVERRIDES[category]?.dimColor ?? CATEGORIES[category].dimColor
              const tools = getToolsByCategory(category).filter((t) => AVAILABLE_HREFS.has(t.href))
              const showMenu = hoveredCategory === category

              return (
                <div
                  key={href}
                  className="relative"
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory((c) => (c === category ? null : c))}
                >
                  <Link
                    href={href}
                    className={cn(
                      'px-4 py-2 rounded-md text-lg font-medium transition-all duration-150 inline-block',
                      active ? 'text-white' : 'text-white/70 hover:text-white/95'
                    )}
                    style={active ? { color, background: `${color}18` } : (showMenu ? { color } : {})}
                  >
                    {label}
                  </Link>

                  {/* Hover dropdown showing tools in this category */}
                  {showMenu && tools.length > 0 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                      style={{ width: '480px' }}
                    >
                      <div
                        className="rounded-xl p-3 grid grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto"
                        style={{
                          background: 'rgba(15,15,15,0.98)',
                          border: '1px solid var(--border)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        {tools.map((tool) => {
                          const Icon = LucideIconMap[tool.iconName]
                          return (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-base transition-colors"
                              style={{ color: 'rgba(255,255,255,0.85)' }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = dimColor
                                ;(e.currentTarget as HTMLElement).style.color = color
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = 'transparent'
                                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'
                              }}
                            >
                              {Icon && <Icon size={14} style={{ color }} className="shrink-0" />}
                              <span className="leading-snug">{tool.name.replace(/ Online$/, '')}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-white/50 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {NAV_LINKS.map(({ category, label, href }) => {
            const active = isActive(href)
            const color = NAV_COLOR_OVERRIDES[category]?.color ?? CATEGORIES[category].color
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-lg font-medium transition-all"
                style={{
                  color: active ? color : 'rgba(255,255,255,0.75)',
                  background: active ? `${color}18` : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
