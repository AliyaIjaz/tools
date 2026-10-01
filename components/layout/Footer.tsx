'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-24 py-10 px-4"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
        {/* Row 1: logo + links + copyright */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-lg"
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, var(--color-dev), var(--color-image))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Zenveel
          </span>

          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1">
            {[
              { href: '/all-tools', label: 'All Tools' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
              { href: '/privacy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms' },
            ].map(({ href, label }, i, arr) => (
              <span key={href} className="flex items-center gap-4">
                <Link
                  href={href}
                  className="text-base font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
                >
                  {label}
                </Link>
                {i < arr.length - 1 && (
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                )}
              </span>
            ))}
          </div>

          <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Zenveel
          </span>
        </div>

        {/* Row 2: privacy badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          <Shield size={14} style={{ color: 'var(--color-web)' }} />
          <span>All tools run in your browser — no data is sent to any server.</span>
        </div>
      </div>
    </footer>
  )
}
