'use client'

import { useState } from 'react'
import { Clipboard, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Props = {
  text: string
  className?: string
  label?: string
}

export default function CopyButton({ text, className, label }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!text) return
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
        copied
          ? 'text-emerald-400'
          : 'text-white/75 hover:text-white',
        className
      )}
      style={{
        background: copied ? 'rgba(52,211,153,0.1)' : 'var(--surface-hover)',
        border: `1px solid ${copied ? 'rgba(52,211,153,0.25)' : 'var(--border-hover)'}`,
      }}
      title="Copy to clipboard"
    >
      {copied ? <Check size={12} /> : <Clipboard size={12} />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
      {!label && <span>{copied ? 'Copied!' : 'Copy'}</span>}
    </button>
  )
}
