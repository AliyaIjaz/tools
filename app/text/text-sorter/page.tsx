'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Textarea from '@/components/ui/Textarea'

const MODES = [
  { label: 'A → Z', fn: (lines: string[]) => [...lines].sort((a, b) => a.localeCompare(b)) },
  { label: 'Z → A', fn: (lines: string[]) => [...lines].sort((a, b) => b.localeCompare(a)) },
  { label: 'Shortest first', fn: (lines: string[]) => [...lines].sort((a, b) => a.length - b.length) },
  { label: 'Longest first', fn: (lines: string[]) => [...lines].sort((a, b) => b.length - a.length) },
  { label: 'Reverse order', fn: (lines: string[]) => [...lines].reverse() },
  { label: 'Shuffle', fn: (lines: string[]) => [...lines].sort(() => Math.random() - 0.5) },
]

export default function TextSorterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState(MODES[0].label)
  const [trimLines, setTrimLines] = useState(true)
  const [removeBlank, setRemoveBlank] = useState(false)

  const result = useMemo(() => {
    let lines = input.split('\n')
    if (trimLines) lines = lines.map((l) => l.trim())
    if (removeBlank) lines = lines.filter((l) => l !== '')
    const sortFn = MODES.find((m) => m.label === mode)?.fn
    return (sortFn ? sortFn(lines) : lines).join('\n')
  }, [input, mode, trimLines, removeBlank])

  return (
    <ToolLayout
      toolId="text-sorter"
      title="Text Sorter"
      description="Sort lines alphabetically, by length, randomly, or reversed"
      seoContent={
        <SeoSection
          about="Paste a list of lines and sort them alphabetically (A–Z or Z–A), by line length, or randomly. Useful for organizing lists, cleaning up data, or randomizing items for testing. All processing is instant and client-side."
          useCases={[
            'Alphabetizing a list of names, countries, or keywords',
            'Sorting a list of CSS class names or imports alphabetically',
            'Arranging items by length to spot outliers in a dataset',
            'Randomizing a list for giveaways, lotteries, or A/B test ordering',
            'Reversing the order of a list quickly without writing code',
          ]}
          faqs={[
            { q: 'Is the sort case-sensitive?', a: 'Alphabetical sorting is case-insensitive by default, so "apple" and "Apple" sort together rather than separately.' },
            { q: 'Are blank lines included in the sort?', a: 'Blank lines are sorted as empty strings, so they typically appear at the top for A–Z sorts. You can remove them first using the Duplicate Remover tool.' },
            { q: 'What counts as a line?', a: 'Lines are split on newline characters (\\n), matching what you see when you paste multi-line text.' },
          ]}
        />
      }
      category="text"
      iconName="ArrowUpDown"
    >
      <div className="space-y-5">
        <Textarea
          label="Input (one item per line)"
          value={input}
          onChange={setInput}
          placeholder="Paste lines to sort…"
          rows={7}
        />

        {/* Sort mode */}
        <div>
          <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Sort by
          </label>
          <div className="flex flex-wrap gap-2">
            {MODES.map(({ label }) => (
              <button
                key={label}
                onClick={() => setMode(label)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: mode === label ? 'var(--color-text-tool-dim)' : 'var(--surface)',
                  border: `1px solid ${mode === label ? 'var(--color-text-tool)' : 'var(--border)'}`,
                  color: mode === label ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.6)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          {[
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

        {input && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Sorted — {result.split('\n').length} lines
              </label>
              <CopyButton text={result} />
            </div>
            <Textarea value={result} readOnly rows={7} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
