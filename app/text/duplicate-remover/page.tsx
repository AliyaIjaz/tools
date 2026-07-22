'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Textarea from '@/components/ui/Textarea'

export default function DuplicateRemoverPage() {
  const [input, setInput] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [trimLines, setTrimLines] = useState(true)
  const [removeBlank, setRemoveBlank] = useState(false)

  const { result, originalCount, uniqueCount, removedCount } = useMemo(() => {
    const lines = input.split('\n')
    const processed = lines
      .map((l) => (trimLines ? l.trim() : l))
      .filter((l) => !removeBlank || l !== '')

    const seen = new Set<string>()
    const unique = processed.filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return {
      result: unique.join('\n'),
      originalCount: processed.length,
      uniqueCount: unique.length,
      removedCount: processed.length - unique.length,
    }
  }, [input, caseSensitive, trimLines, removeBlank])

  return (
    <ToolLayout
      toolId="duplicate-remover"
      title="Duplicate Line Remover"
      description="Remove duplicate lines from text with flexible options"
      seoContent={
        <SeoSection
          about="Paste a list and instantly remove duplicate lines, keeping only the first occurrence of each unique line. Options include case-insensitive matching and trimming leading/trailing whitespace before comparison. Useful for cleaning lists, logs, and exported data."
          useCases={[
            'Deduplicating a list of email addresses or usernames',
            'Removing repeated log lines from a copied server log',
            'Cleaning up keyword lists before importing to an ad platform',
            'Deduplicating a list of URLs, IDs, or file paths',
            'Removing repeated entries from a pasted CSV column',
          ]}
          faqs={[
            { q: 'Does it preserve the original order?', a: 'Yes. The first occurrence of each line is kept in its original position. Subsequent duplicates are removed.' },
            { q: 'Can it ignore case when detecting duplicates?', a: 'Yes — enable the case-insensitive option to treat "Apple" and "apple" as duplicates.' },
            { q: 'Does it trim whitespace before comparing?', a: 'There is a trim option that strips leading and trailing spaces before comparison, so "  apple  " and "apple" are treated as duplicates.' },
          ]}
        />
      }
      category="text"
      iconName="Layers"
    >
      <div className="space-y-5">
        <Textarea
          label="Input (one item per line)"
          value={input}
          onChange={setInput}
          placeholder="Paste lines here — duplicates will be removed…"
          rows={8}
        />

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Case sensitive', state: caseSensitive, toggle: () => setCaseSensitive((v) => !v) },
            { label: 'Trim whitespace', state: trimLines, toggle: () => setTrimLines((v) => !v) },
            { label: 'Remove blank lines', state: removeBlank, toggle: () => setRemoveBlank((v) => !v) },
          ].map(({ label, state, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: state ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.6)' }}
            >
              <span
                className="w-4 h-4 rounded flex items-center justify-center"
                style={{
                  background: state ? 'var(--color-text-tool-dim)' : 'var(--surface)',
                  border: `1px solid ${state ? 'var(--color-text-tool)' : 'var(--border)'}`,
                }}
              >
                {state && <span style={{ color: 'var(--color-text-tool)', fontSize: '10px' }}>✓</span>}
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Stats */}
        {input && (
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total lines', value: originalCount },
              { label: 'Unique', value: uniqueCount, accent: true },
              { label: 'Removed', value: removedCount, warn: removedCount > 0 },
            ].map(({ label, value, accent, warn }) => (
              <div
                key={label}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${accent ? 'var(--color-text-tool)' : warn ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                }}
              >
                <span style={{ color: accent ? 'var(--color-text-tool)' : warn && value > 0 ? '#f87171' : 'rgba(255,255,255,0.7)' }}>
                  <strong>{value}</strong>
                </span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {input && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Result</label>
              <CopyButton text={result} />
            </div>
            <Textarea value={result} readOnly rows={8} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
