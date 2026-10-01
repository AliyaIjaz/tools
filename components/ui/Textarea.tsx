'use client'

import { cn } from '@/lib/utils'

type Props = {
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  label?: string
  mono?: boolean
  rows?: number
  readOnly?: boolean
  showCount?: boolean
  className?: string
}

export default function Textarea({
  value,
  onChange,
  placeholder,
  label,
  mono = false,
  rows = 8,
  readOnly = false,
  showCount = false,
  className,
}: Props) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showCount) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {label}
            </label>
          )}
          {showCount && (
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {value.length} chars
            </span>
          )}
        </div>
      )}
      <textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl px-4 py-3 text-lg outline-none transition-all duration-150 placeholder:text-white/55"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border-hover)',
          color: 'rgba(255,255,255,0.95)',
          fontFamily: mono ? 'var(--font-geist-mono), monospace' : 'inherit',
          lineHeight: '1.7',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-focus)'
          e.currentTarget.style.background = 'var(--surface-hover)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-hover)'
          e.currentTarget.style.background = 'var(--surface)'
        }}
      />
    </div>
  )
}
