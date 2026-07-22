'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'

const FLAGS = ['g', 'i', 'm', 's'] as const

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']))
  const [testStr, setTestStr] = useState('')

  function toggleFlag(f: string) {
    setFlags((prev) => {
      const next = new Set(prev)
      if (next.has(f)) { next.delete(f) } else { next.add(f) }
      return next
    })
  }

  const { highlighted, matchCount, groups, error } = useMemo(() => {
    if (!pattern || !testStr) return { highlighted: testStr, matchCount: 0, groups: [], error: '' }
    try {
      const flagStr = Array.from(flags).join('')
      const allMatches: RegExpExecArray[] = []
      let m: RegExpExecArray | null
      const safeRe = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g')
      while ((m = safeRe.exec(testStr)) !== null) {
        allMatches.push(m)
        if (!flagStr.includes('g')) break
        if (m[0].length === 0) safeRe.lastIndex++
      }

      // Build highlighted HTML
      let result = ''
      let lastIndex = 0
      for (const match of allMatches) {
        const start = match.index
        const end = start + match[0].length
        result += escapeHtml(testStr.slice(lastIndex, start))
        result += `<mark style="background:oklch(0.6 0.2 290 / 0.35);color:white;border-radius:2px;padding:0 1px">${escapeHtml(match[0])}</mark>`
        lastIndex = end
        if (match[0].length === 0) { result += escapeHtml(testStr[lastIndex] || ''); lastIndex++ }
      }
      result += escapeHtml(testStr.slice(lastIndex))

      const groups = allMatches.flatMap((m, i) =>
        m.slice(1).map((g, j) => ({ match: i + 1, group: j + 1, value: g ?? 'undefined' }))
      )

      return { highlighted: result, matchCount: allMatches.length, groups, error: '' }
    } catch (e) {
      return { highlighted: escapeHtml(testStr), matchCount: 0, groups: [], error: (e as Error).message }
    }
  }, [pattern, flags, testStr])

  function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  return (
    <ToolLayout
      toolId="regex-tester"
      title="Regex Tester"
      description="Test regular expressions with live match highlighting"
      seoContent={
        <SeoSection
          about="Test and debug regular expressions against real input with live match highlighting. Matches, capture groups, and match count update instantly as you type. Supports the g, i, m, and s flags. All matching runs locally in your browser."
          useCases={[
            'Validating and debugging regex patterns before putting them in code',
            'Testing email, phone, or URL validation patterns',
            'Building patterns for find-and-replace in text editors',
            'Learning how capture groups and lookaheads behave on real input',
            'Verifying that a pattern matches only the intended strings',
          ]}
          faqs={[
            { q: 'Which regex flags are supported?', a: 'The g (global), i (case-insensitive), m (multiline), and s (dotAll) flags can be toggled individually.' },
            { q: 'Are capture groups shown?', a: 'Yes. Named and numbered capture groups are listed below the match count for each match.' },
            { q: 'What regex flavor is this?', a: 'JavaScript regex (ECMAScript), which is the flavor used in all browser-based JavaScript environments.' },
          ]}
        />
      }
      category="dev"
      iconName="Search"
    >
      <div className="space-y-4">
        {/* Pattern input */}
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Pattern
          </label>
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: 'var(--surface)', border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'var(--border)'}` }}
          >
            <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-geist-mono)' }}>/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono), monospace' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-geist-mono)' }}>/</span>
            {/* Flag toggles */}
            <div className="flex gap-1">
              {FLAGS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  className="w-6 h-6 rounded text-xs font-mono font-bold transition-all"
                  style={{
                    background: flags.has(f) ? 'oklch(0.6 0.2 290 / 0.2)' : 'transparent',
                    color: flags.has(f) ? 'var(--color-dev)' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${flags.has(f) ? 'oklch(0.6 0.2 290 / 0.4)' : 'transparent'}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{error}</p>}
        </div>

        {/* Test string */}
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Test string
          </label>
          <textarea
            value={testStr}
            onChange={(e) => setTestStr(e.target.value)}
            rows={6}
            placeholder="Enter text to test against…"
            className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-geist-mono), monospace',
              lineHeight: '1.6',
            }}
          />
        </div>

        {/* Highlighted result */}
        {testStr && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Matches</label>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: matchCount > 0 ? 'oklch(0.6 0.2 290 / 0.15)' : 'var(--surface)',
                  color: matchCount > 0 ? 'var(--color-dev)' : 'rgba(255,255,255,0.3)',
                }}
              >
                {matchCount} match{matchCount !== 1 ? 'es' : ''}
              </span>
            </div>
            <pre
              className="rounded-xl px-4 py-3 text-sm overflow-auto whitespace-pre-wrap break-words"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.6',
                maxHeight: '200px',
              }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        {/* Groups */}
        {groups.length > 0 && (
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Capture groups
            </label>
            <div className="space-y-1">
              {groups.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>Match {g.match} · Group {g.group}</span>
                  <code style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-geist-mono)' }}>{g.value}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
