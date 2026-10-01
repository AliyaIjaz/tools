'use client'

import { cn } from '@/lib/utils'

type Props = {
  tabs: string[]
  value: string
  onChange: (tab: string) => void
  className?: string
}

export default function Tabs({ tabs, value, onChange, className }: Props) {
  return (
    <div
      className={cn('inline-flex items-center gap-1 p-1 rounded-lg', className)}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
    >
      {tabs.map((tab) => {
        const active = tab === value
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              'px-3 py-1.5 rounded-md text-base font-medium transition-all duration-150',
              active ? 'text-white' : 'text-white/40 hover:text-white/70'
            )}
            style={
              active
                ? {
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }
                : {}
            }
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
