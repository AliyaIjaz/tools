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
          aboutTitle="About this tool"
          about={<>
            <p className="text-lg leading-relaxed">Text Sorter Online is a free tool that helps you quickly organize and reorder lists of text with just a few clicks. Paste your text into the editor and sort individual lines alphabetically (A–Z), reverse alphabetically (Z–A), by line length, or in a random order. Whether you&apos;re organizing names, keywords, URLs, programming code, or spreadsheet data, this tool makes sorting fast, accurate, and effortless.</p>
            <p className="text-lg leading-relaxed">The tool treats each line as a separate item, making it ideal for sorting lists copied from text files, CSV columns, Markdown documents, configuration files, or code editors. Alphabetical sorting is case-insensitive by default, ensuring that values such as <code className="text-base font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>Apple</code> and <code className="text-base font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>apple</code> are grouped naturally. You can also sort by line length to identify unusually short or long entries or use random sorting to shuffle items for giveaways, quizzes, testing, or sampling.</p>
            <p className="text-lg leading-relaxed">Everything is processed locally in your browser, so your text is never uploaded or stored. There are no registrations, downloads, or usage limits. Whether you&apos;re a developer, student, SEO professional, marketer, researcher, or content editor, this online Text Sorter provides a quick and secure way to organize text without writing scripts or using spreadsheet software.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Alphabetize lists of names, cities, countries, or products.',
            'Sort SEO keyword lists before importing them into marketing tools.',
            'Organize email addresses, usernames, or customer IDs.',
            'Arrange CSS class names, JavaScript imports, or configuration entries alphabetically.',
            'Sort URLs, file names, or directory paths for easier review.',
            'Organize glossary terms, documentation, or Markdown lists.',
            'Sort spreadsheet columns copied from CSV or TSV files.',
            'Order log entries or exported data for easier analysis.',
            'Sort items by line length to identify unusually short or long values.',
            'Randomize participant lists for giveaways, raffles, quizzes, or A/B testing.',
            'Reorder task lists, notes, or research data.',
            'Prepare clean, consistently ordered text before publishing or sharing.',
          ]}
          faqs={[
            { q: 'Is this Text Sorter free?', a: 'Yes. The tool is completely free to use with no subscriptions, registrations, or hidden charges.' },
            { q: 'Is my text uploaded to a server?', a: 'No. All sorting is performed locally in your browser. Your text is never uploaded, stored, or shared.' },
            { q: 'What sorting methods are available?', a: 'The tool supports alphabetical (A–Z), reverse alphabetical (Z–A), sort by line length (shortest or longest first), reverse order, and random shuffle.' },
            { q: 'Is alphabetical sorting case-sensitive?', a: 'No. Alphabetical sorting is case-insensitive by default, so values like apple, Apple, and APPLE are sorted together rather than treated as separate groups.' },
            { q: 'What counts as a line?', a: 'Each line is separated using newline characters. Every line is treated as an individual item during sorting.' },
            { q: 'Are blank lines included in the sort?', a: 'Yes. Blank lines are treated as empty strings and are sorted accordingly. For alphabetical sorting, they usually appear at the beginning of the output.' },
            { q: 'Does the tool remove duplicate lines?', a: 'No. The Text Sorter only changes the order of lines. Duplicate entries remain in the output. If you want to remove repeated lines, use a dedicated Remove Duplicate Lines tool before or after sorting.' },
            { q: 'Can I sort numbers?', a: 'The tool sorts each line as text. Numeric values are therefore sorted lexicographically rather than by their mathematical value. For example, 100 may appear before 20 because sorting is based on character order.' },
            { q: 'How does random sorting work?', a: 'Random sorting shuffles the order of all lines, making it useful for selecting random participants, generating test data, assigning tasks, or creating randomized lists.' },
            { q: 'Is there a limit on the amount of text?', a: 'There is no fixed limit imposed by the tool. Very large lists may take slightly longer to process depending on your browser and device.' },
            { q: 'Can I use this tool on mobile devices?', a: 'Yes. The Text Sorter works in all modern desktop and mobile browsers without requiring installation.' },
            { q: 'Who can use this tool?', a: 'This tool is useful for developers, students, writers, editors, SEO professionals, digital marketers, researchers, data analysts, teachers, and anyone who needs to organize lists of text.' },
            { q: 'Why should I use a Text Sorter?', a: 'Sorting text manually can be slow and error-prone, especially for long lists. A Text Sorter automatically organizes your data in seconds, making it easier to review, compare, search, clean, and prepare information for reports, spreadsheets, documentation, programming projects, SEO campaigns, and everyday tasks.' },
          ]}
        />
      }
      category="text"
      iconName="ArrowUpDown"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Input <span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>— one item per line</span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={7}
            placeholder="Paste lines to sort…"
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

        {/* Sort mode */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Sort by
          </label>
          <div className="flex flex-wrap gap-2">
            {MODES.map(({ label }) => (
              <button
                key={label}
                onClick={() => setMode(label)}
                className="px-4 py-2 rounded-lg text-lg font-semibold transition-all"
                style={{
                  background: mode === label ? 'var(--color-text-tool-dim)' : 'var(--surface)',
                  border: `1.5px solid ${mode === label ? 'var(--color-text-tool)' : 'var(--border)'}`,
                  color: mode === label ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.65)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-5">
          {[
            { label: 'Trim whitespace', state: trimLines, toggle: () => setTrimLines((v) => !v) },
            { label: 'Remove blank lines', state: removeBlank, toggle: () => setRemoveBlank((v) => !v) },
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
        </div>

        {/* Result */}
        {input && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Sorted
                <span className="text-base font-normal ml-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  — {result.split('\n').length} lines
                </span>
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
