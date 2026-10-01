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
    border: '2px solid var(--border-text-idle)',
    color: 'rgba(255,255,255,0.9)',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '16px',
    outline: 'none',
    width: '100%',
    lineHeight: '1.5',
  }

  return (
    <ToolLayout
      toolId="find-replace"
      title="Find & Replace"
      description="Bulk find and replace in text with optional regex support"
      seoContent={
        <SeoSection
          aboutTitle="About this tool"
          about={<>
            <p className="text-lg leading-relaxed">Find and Replace Online is a free text editing tool that lets you quickly search for specific words, phrases, or patterns and replace them throughout your text in seconds. Simply paste your content, enter the text you want to find, specify the replacement, and see the updated result instantly. Whether you&apos;re editing plain text, source code, Markdown, HTML, CSV files, or documentation, this tool helps automate repetitive text changes and saves valuable time.</p>
            <p className="text-lg leading-relaxed">The tool supports both standard text matching and <strong>JavaScript regular expressions (regex)</strong>, allowing you to perform advanced search-and-replace operations using capture groups, pattern matching, and replacement references such as <strong>$1</strong>, <strong>$2</strong>, and more. This makes it useful for simple edits as well as complex text transformations.</p>
            <p className="text-lg leading-relaxed">Everything runs locally in your browser, so your text is never uploaded or stored. There are no registrations, downloads, or character limits, making the tool suitable for everything from short notes to large documents and code snippets. Whether you&apos;re a developer, writer, editor, student, SEO professional, or data analyst, this online Find and Replace tool provides a fast, secure, and efficient way to edit text in bulk.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Replace every occurrence of an old company name, product name, or URL in a document.',
            'Update variable names or function names across pasted source code.',
            'Rename CSS classes, HTML attributes, or JavaScript identifiers during development.',
            'Clean imported CSV or TSV files by replacing delimiters or unwanted characters.',
            'Remove extra whitespace, line breaks, or formatting using regular expressions.',
            'Normalize inconsistent spelling, punctuation, or capitalization throughout long documents.',
            'Replace email addresses, phone numbers, or placeholders in templates.',
            'Update Markdown files before publishing documentation or GitHub README files.',
            'Refactor code snippets using regex capture groups and replacement patterns.',
            'Remove HTML tags or unwanted markup from copied content.',
            'Format exported log files or machine-generated text.',
            'Perform bulk search-and-replace operations without installing desktop software.',
          ]}
          faqs={[
            { q: 'Is this Find and Replace tool free?', a: 'Yes. The tool is completely free to use with no subscriptions, registrations, or hidden fees.' },
            { q: 'Is my text uploaded to a server?', a: 'No. All find-and-replace operations are performed locally in your browser. Your text is never uploaded, stored, or shared.' },
            { q: 'How do I use Find and Replace?', a: 'Paste or type your text into the editor, enter the text or pattern you want to search for in the Find field, specify the replacement text in the Replace field, and the updated result is generated instantly.' },
            { q: 'Does it replace every occurrence?', a: "Yes. All matching occurrences are replaced automatically, equivalent to using the global (g) flag in JavaScript's String.replace() method." },
            { q: 'Does the tool support regular expressions (regex)?', a: 'Yes. Enable Regex Mode to use JavaScript regular expressions for advanced search-and-replace operations, including character classes, quantifiers, alternation, lookaheads (where supported), and capture groups.' },
            { q: 'Can I use capture groups?', a: 'Yes. Capture groups created with parentheses can be referenced in the replacement text using $1, $2, $3, and so on. This is useful for reformatting dates, names, phone numbers, and other structured text.' },
            { q: 'Does the tool support plain text matching?', a: 'Yes. If Regex Mode is disabled, the tool performs standard text matching and replaces all occurrences of the specified search term.' },
            { q: 'Can I replace HTML, Markdown, or source code?', a: 'Yes. The tool works with any plain text, including HTML, CSS, JavaScript, JSON, Markdown, XML, SQL, CSV, TSV, configuration files, and programming code.' },
            { q: 'Is there a limit on how much text I can process?', a: 'There is no fixed limit imposed by the tool. Performance depends mainly on your browser and device when working with very large documents.' },
            { q: 'Can I use this tool on mobile devices?', a: 'Yes. The Find and Replace tool works in modern desktop and mobile browsers without requiring installation.' },
            { q: 'Who can benefit from this tool?', a: 'This tool is useful for developers, programmers, technical writers, content editors, SEO professionals, students, researchers, data analysts, copywriters, and anyone editing large amounts of text.' },
            { q: 'Why use an online Find and Replace tool?', a: 'Manually editing repeated words or phrases can be slow and error-prone. An online Find and Replace tool lets you update text instantly, ensuring consistent edits across documents, code, spreadsheets, and other text-based content. With regex support, you can perform powerful pattern-based replacements that would be difficult or impossible to do manually.' },
          ]}
        />
      }
      category="text"
      iconName="Replace"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Input text */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Input text
            </label>
            <span className="text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {text.length} chars
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Paste your text here…"
            className="w-full resize-y rounded-xl outline-none transition-all duration-150 placeholder:text-white/50"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--border-text-idle)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '15px',
              lineHeight: '1.7',
              padding: '14px 16px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-text-tool)'
              e.currentTarget.style.background = 'var(--surface-hover)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-text-idle)'
              e.currentTarget.style.background = 'var(--surface)'
            }}
          />
        </div>

        {/* Find / Replace inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Find
            </label>
            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder={useRegex ? 'Regular expression…' : 'Text to find…'}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)'; e.currentTarget.style.background = 'var(--surface-hover)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)'; e.currentTarget.style.background = 'var(--surface)' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Replace with
            </label>
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text…"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)'; e.currentTarget.style.background = 'var(--surface-hover)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)'; e.currentTarget.style.background = 'var(--surface)' }}
            />
          </div>
        </div>

        {/* Options + match count */}
        <div className="flex flex-wrap items-center gap-5">
          {[
            { label: 'Regex mode', state: useRegex, toggle: () => setUseRegex((v) => !v) },
            { label: 'Case sensitive', state: caseSensitive, toggle: () => setCaseSensitive((v) => !v) },
          ].map(({ label, state, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className="flex items-center gap-2.5 transition-colors"
              style={{ color: state ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.65)' }}
            >
              <span
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: state ? 'var(--color-text-tool-dim)' : 'var(--surface)',
                  border: `1.5px solid ${state ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.2)'}`,
                }}
              >
                {state && <span style={{ color: 'var(--color-text-tool)', fontSize: '11px', lineHeight: 1 }}>✓</span>}
              </span>
              <span className="text-lg font-medium">{label}</span>
            </button>
          ))}

          {find && text && (
            <span
              className="ml-auto text-base font-semibold px-3 py-1 rounded-full"
              style={{
                background: matchCount > 0 ? 'var(--color-text-tool-dim)' : 'rgba(255,255,255,0.06)',
                color: matchCount > 0 ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${matchCount > 0 ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {matchCount} match{matchCount !== 1 ? 'es' : ''}
            </span>
          )}
        </div>

        {error && (
          <div
            className="rounded-xl px-5 py-3 text-lg"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {result && text && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Result</label>
              <CopyButton text={result} />
            </div>
            <Textarea value={result} readOnly rows={8} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
