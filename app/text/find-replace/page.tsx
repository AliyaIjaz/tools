'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Textarea from '@/components/ui/Textarea'

export default function FindReplacePage() {
  const [text, setText] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)

  const { result, matchCount, error } = useMemo(() => {
    if (!text || !find) return { result: text, matchCount: 0, error: '' }
    try {
      let pattern: RegExp
      if (useRegex) {
        pattern = new RegExp(find, caseSensitive ? 'g' : 'gi')
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        pattern = new RegExp(escaped, caseSensitive ? 'g' : 'gi')
      }
      const matches = text.match(pattern)
      const result = text.replace(pattern, replace)
      return { result, matchCount: matches?.length ?? 0, error: '' }
    } catch (e) {
      return { result: text, matchCount: 0, error: (e as Error).message }
    }
  }, [text, find, replace, useRegex, caseSensitive])

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'rgba(255,255,255,0.85)',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  }

  return (
    <ToolLayout
      toolId="find-replace"
      title="Find & Replace"
      description="Bulk find and replace in text with optional regex support"
      seoContent={
        <SeoSection
          about="Paste text and find-and-replace strings across it in bulk. Supports plain text matching and regular expressions with full JavaScript regex syntax. Changes are shown instantly. Useful for large text edits that would be tedious to do manually."
          useCases={[
            'Replacing all instances of an old domain name or URL in a document',
            'Swapping variable names across a pasted code snippet',
            'Cleaning up exported CSV or TSV data by replacing delimiters',
            'Using regex to strip HTML tags, whitespace, or formatting characters',
            'Normalizing inconsistent spelling or punctuation across a long text',
          ]}
          faqs={[
            { q: 'How do I use regex mode?', a: 'Toggle the regex switch and enter a valid JavaScript regular expression in the Find field. Use capture groups in the pattern and $1, $2, etc. in the Replace field to reference them.' },
            { q: 'Is the replacement global (all occurrences)?', a: 'Yes. All occurrences of the search term are replaced, equivalent to using the g flag in JavaScript\'s String.replace().' },
            { q: 'Is my text sent anywhere?', a: 'No. All find-and-replace operations run locally in your browser using JavaScript string methods.' },
          ]}
        />
      }
      category="text"
      iconName="Replace"
    >
      <div className="space-y-5">
        <Textarea
          label="Input text"
          value={text}
          onChange={setText}
          placeholder="Paste your text here…"
          rows={7}
          showCount
        />

        {/* Find / Replace inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Find
            </label>
            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder={useRegex ? 'Regular expression…' : 'Text to find…'}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Replace with
            </label>
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text…"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          {[
            { label: 'Regex', state: useRegex, toggle: () => setUseRegex((v) => !v) },
            { label: 'Case sensitive', state: caseSensitive, toggle: () => setCaseSensitive((v) => !v) },
          ].map(({ label, state, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: state ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.6)' }}
            >
              <span
                className="w-4 h-4 rounded flex items-center justify-center transition-all"
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

          {find && text && (
            <span className="text-sm ml-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {matchCount} match{matchCount !== 1 ? 'es' : ''}
            </span>
          )}
        </div>

        {error && (
          <div
            className="rounded-lg px-4 py-2 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {result && text && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Result</label>
              <CopyButton text={result} />
            </div>
            <Textarea value={result} readOnly rows={7} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
