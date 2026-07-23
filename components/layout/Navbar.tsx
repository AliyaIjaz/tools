'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/constants'
import { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

const NAV_LINKS: { category: Category; label: string; href: string }[] = [
  { category: 'image', label: 'Image', href: '/image' },
  { category: 'text', label: 'Text', href: '/text' },
  { category: 'web', label: 'Web Dev', href: '/web' },
  { category: 'dev', label: 'Developer', href: '/dev' },
]

const TYPING_HREF = '/typing/typing-practice'
const TYPING_COLOR = '#ef4444'
const TYPING_BG = 'rgba(239, 68, 68, 0.15)'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const typingActive = pathname === TYPING_HREF

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
              src="/Z.png"
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
              const active = isActive(href) && pathname !== TYPING_HREF
              const color = CATEGORIES[category].color
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-md text-lg font-medium transition-all duration-150',
                    active ? 'text-white' : 'text-white/70 hover:text-white/95'
                  )}
                  style={active ? { color, background: `${color}18` } : {}}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = color
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = ''
                  }}
                >
                  {label}
                </Link>
              )
            })}

            {/* Typing Practice direct link */}
            <Link
              href={TYPING_HREF}
              className={cn(
                'px-4 py-2 rounded-md text-lg font-medium transition-all duration-150',
                typingActive ? 'text-white' : 'text-white/70 hover:text-white/95'
              )}
              style={typingActive ? { color: TYPING_COLOR, background: TYPING_BG } : {}}
              onMouseEnter={(e) => {
                if (!typingActive) (e.currentTarget as HTMLElement).style.color = TYPING_COLOR
              }}
              onMouseLeave={(e) => {
                if (!typingActive) (e.currentTarget as HTMLElement).style.color = ''
              }}
            >
              Typing
            </Link>
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
            const active = isActive(href) && pathname !== TYPING_HREF
            const color = CATEGORIES[category].color
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all"
                style={{
                  color: active ? color : 'rgba(255,255,255,0.75)',
                  background: active ? `${color}18` : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href={TYPING_HREF}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-all"
            style={{
              color: typingActive ? TYPING_COLOR : 'rgba(255,255,255,0.75)',
              background: typingActive ? TYPING_BG : 'transparent',
            }}
          >
            Typing
          </Link>
        </div>
      )}
    </nav>
  )
}
