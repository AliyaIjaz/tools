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
          aboutTitle="About this tool"
          about={<>
            <p className="text-base leading-relaxed">Remove Duplicate Lines Online is a free text-cleaning tool that instantly removes repeated lines from your text while preserving the original order of the remaining entries. Simply paste your list, click the button, and the tool keeps only the first occurrence of each unique line, making it easy to clean large datasets, keyword lists, logs, and copied text. Whether you&apos;re working with plain text, CSV columns, email lists, URLs, file names, or programming output, this tool helps eliminate duplicate entries in seconds.</p>
            <p className="text-base leading-relaxed">For more control over the results, you can enable <strong>case-insensitive matching</strong> to treat values such as <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>Apple</code> and <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>apple</code> as duplicates, or use the <strong>trim whitespace</strong> option to ignore leading and trailing spaces when comparing lines. These options make the tool especially useful when cleaning data from spreadsheets, databases, content management systems, or exported reports.</p>
            <p className="text-base leading-relaxed">Everything is processed locally in your browser, so your text is never uploaded or stored. There are no registrations, downloads, or usage limits. Whether you&apos;re a developer, SEO professional, marketer, student, researcher, or data analyst, this online duplicate line remover provides a fast, secure, and reliable way to create clean, unique lists.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Remove duplicate email addresses from mailing lists.',
            'Deduplicate keyword lists before importing them into SEO or advertising tools.',
            'Clean repeated URLs collected from crawlers or exported reports.',
            'Remove duplicate usernames, customer IDs, or product codes.',
            'Deduplicate file names and directory paths.',
            'Clean server logs by removing repeated log entries.',
            'Remove duplicate rows copied from spreadsheet columns or CSV files.',
            'Prepare clean datasets before importing them into databases.',
            'Remove repeated values from AI-generated or OCR-generated text.',
            'Clean Markdown lists and documentation before publishing.',
            'Organize copied notes, task lists, and research data.',
            'Process exported reports without manually deleting duplicate lines.',
          ]}
          faqs={[
            { q: 'Is this Remove Duplicate Lines tool free?', a: 'Yes. The tool is completely free to use with no subscriptions, registrations, or hidden fees.' },
            { q: 'Is my text uploaded to a server?', a: 'No. All duplicate detection and removal happen locally in your browser. Your data is never uploaded, stored, or shared.' },
            { q: 'How does the tool remove duplicate lines?', a: 'The tool compares each line in the order it appears and keeps only the first occurrence of every unique line. Any repeated occurrences found later in the text are removed automatically.' },
            { q: 'Does it preserve the original order?', a: 'Yes. The first occurrence of each unique line remains in its original position. Only duplicate lines appearing later are removed.' },
            { q: 'Can it ignore uppercase and lowercase differences?', a: 'Yes. Enable the case-insensitive option to treat lines like Apple, APPLE, and apple as identical when detecting duplicates.' },
            { q: 'What does the Trim Whitespace option do?', a: 'The Trim Whitespace option removes leading and trailing spaces before comparing lines. For example, "apple" with extra spaces and "apple" without are considered duplicates when this option is enabled.' },
            { q: 'Are blank lines treated as duplicates?', a: 'Blank lines are processed like any other line. If multiple blank lines exist, duplicate blank lines may be removed depending on your selected options.' },
            { q: 'Can I remove duplicates from CSV or spreadsheet data?', a: 'Yes. The tool works well with copied spreadsheet columns, CSV files, TSV files, and other plain text formats where each value appears on its own line.' },
            { q: 'Is there a limit on the amount of text?', a: 'There is no fixed limit imposed by the tool. Performance depends primarily on your browser and device when processing very large datasets.' },
            { q: 'Can I use this tool on mobile devices?', a: 'Yes. The tool works in all modern desktop and mobile browsers without requiring installation.' },
            { q: 'Who can use this tool?', a: 'This tool is useful for developers, SEO professionals, digital marketers, data analysts, researchers, students, content editors, system administrators, database administrators, and anyone working with lists or text data.' },
            { q: "What's the difference between removing duplicate lines and removing duplicate words?", a: 'This tool compares entire lines of text, not individual words within a line. If two complete lines are identical (based on your selected comparison options), only the first one is kept.' },
            { q: 'Why should I use a Remove Duplicate Lines tool?', a: 'Removing duplicate entries manually can be slow and error-prone, especially when working with large lists. This tool automatically identifies repeated lines while preserving the original order, helping you clean text, improve data quality, prepare imports, organize records, and save time without installing any software.' },
          ]}
        />
      }
      category="text"
      iconName="Layers"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Input <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.45)' }}>— one item per line</span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder="Paste lines here — duplicates will be removed…"
            className="w-full resize-y rounded-xl outline-none transition-all duration-150 placeholder:text-white/20"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '15px',
              lineHeight: '1.7',
              padding: '14px 16px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-focus)'
              e.currentTarget.style.background = 'var(--surface-hover)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.background = 'var(--surface)'
            }}
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-5">
          {[
            { label: 'Case sensitive', state: caseSensitive, toggle: () => setCaseSensitive((v) => !v) },
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
              <span className="text-base font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Stats */}
        {input && (
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total lines', value: originalCount, accent: false, warn: false },
              { label: 'Unique', value: uniqueCount, accent: true, warn: false },
              { label: 'Removed', value: removedCount, accent: false, warn: removedCount > 0 },
            ].map(({ label, value, accent, warn }) => (
              <div
                key={label}
                className="px-5 py-3 rounded-xl"
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${accent ? 'var(--color-text-tool)' : warn ? 'rgba(239,68,68,0.35)' : 'var(--border)'}`,
                }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: accent ? 'var(--color-text-tool)' : warn && value > 0 ? '#f87171' : 'rgba(255,255,255,0.9)' }}
                >
                  {value}
                </span>
                <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {input && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Result</label>
              <CopyButton text={result} />
            </div>
            <Textarea value={result} readOnly rows={8} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
