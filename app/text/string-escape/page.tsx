'use client'

import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Tabs from '@/components/ui/Tabs'
import Textarea from '@/components/ui/Textarea'

type Mode = 'HTML' | 'JSON' | 'Regex'

const MODES: Mode[] = ['HTML', 'JSON', 'Regex']

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function unescapeHtml(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

function escapeJson(s: string) {
  return JSON.stringify(s).slice(1, -1)
}

function unescapeJson(s: string) {
  try { return JSON.parse(`"${s}"`) } catch { return s }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function StringEscapePage() {
  const [mode, setMode] = useState<Mode>('HTML')
  const [tab, setTab] = useState('Escape')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  useEffect(() => {
    if (!input) { setOutput(''); return }
    if (mode === 'HTML') {
      setOutput(tab === 'Escape' ? escapeHtml(input) : unescapeHtml(input))
    } else if (mode === 'JSON') {
      setOutput(tab === 'Escape' ? escapeJson(input) : unescapeJson(input))
    } else {
      setOutput(escapeRegex(input))
    }
  }, [input, mode, tab])

  return (
    <ToolLayout
      toolId="string-escape"
      title="String Escaper"
      description="Escape and unescape HTML entities, JSON strings, and regex special characters"
      seoContent={
        <SeoSection
          about="Escape or unescape strings for HTML, JSON, and regex in one click. HTML escaping converts characters like <, >, and & to safe entities. JSON escaping wraps a string in valid JSON encoding. Regex escaping makes special characters literal. All processing is client-side."
          useCases={[
            'Escaping user-generated text before inserting it into an HTML template',
            'Preparing a string to be safely embedded inside a JSON value',
            'Escaping a literal string before using it as a regex pattern',
            'Unescaping HTML entities from a database or CMS export',
            'Converting raw text to a JSON-safe string for use in API payloads',
          ]}
          faqs={[
            { q: 'What HTML entities are escaped?', a: 'The characters <, >, &, ", and \' are converted to their HTML entity equivalents (&lt;, &gt;, &amp;, &quot;, &#039;).' },
            { q: 'How does JSON escaping work?', a: 'The string is serialized using JSON.stringify, which escapes backslashes, quotes, newlines, tabs, and other control characters.' },
            { q: 'What regex characters are escaped?', a: 'All characters with special meaning in regex — . * + ? ^ $ { } [ ] | ( ) \\ — are prefixed with a backslash to make them literal.' },
          ]}
        />
      }
      category="text"
      iconName="Code"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setInput(''); setOutput('') }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: mode === m ? 'var(--color-text-tool-dim)' : 'var(--surface)',
                  border: `1px solid ${mode === m ? 'var(--color-text-tool)' : 'var(--border)'}`,
                  color: mode === m ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.6)',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {mode !== 'Regex' && (
            <Tabs
              tabs={['Escape', 'Unescape']}
              value={tab}
              onChange={(t) => { setTab(t); setInput(''); setOutput('') }}
            />
          )}
        </div>

        <Textarea
          label={tab === 'Escape' ? 'Input' : 'Escaped input'}
          value={input}
          onChange={setInput}
          placeholder="Enter text…"
          mono
          rows={6}
          showCount
        />

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {mode === 'Regex' ? 'Escaped pattern' : tab === 'Escape' ? 'Escaped output' : 'Unescaped output'}
              </label>
              <CopyButton text={output} />
            </div>
            <Textarea value={output} readOnly mono rows={6} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
