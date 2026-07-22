'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Textarea from '@/components/ui/Textarea'

const CASES = [
  { label: 'UPPER CASE', fn: (s: string) => s.toUpperCase() },
  { label: 'lower case', fn: (s: string) => s.toLowerCase() },
  {
    label: 'Title Case',
    fn: (s: string) =>
      s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    label: 'Sentence case',
    fn: (s: string) =>
      s.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()).replace(/(?<![.!?])\s+(\w)/g, (_, c) => ' ' + c.toLowerCase()),
  },
  {
    label: 'camelCase',
    fn: (s: string) =>
      s
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (c) => c.toLowerCase()),
  },
  {
    label: 'PascalCase',
    fn: (s: string) =>
      s
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (c) => c.toUpperCase()),
  },
  {
    label: 'snake_case',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_'),
  },
  {
    label: 'kebab-case',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
  },
]

export default function CaseConverterPage() {
  const [input, setInput] = useState('')

  return (
    <ToolLayout
      toolId="case-converter"
      title="Case Converter"
      description="Convert text between upper, lower, title, camel, snake, kebab, and more"
      seoContent={
        <SeoSection
          about="Convert text to any naming case instantly: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, or kebab-case. Useful for normalizing text, renaming variables, or reformatting content between systems."
          useCases={[
            'Converting variable names between camelCase and snake_case when switching languages',
            'Normalizing headings to Title Case for a blog or documentation site',
            'Converting database column names to camelCase for JavaScript objects',
            'Reformatting API field names from snake_case to kebab-case for CSS custom properties',
            'Fixing ALL CAPS text pasted from an external source',
          ]}
          faqs={[
            { q: 'What is the difference between camelCase and PascalCase?', a: 'camelCase starts with a lowercase letter (e.g. myVariable), while PascalCase starts with an uppercase letter (e.g. MyComponent). Both capitalize each subsequent word.' },
            { q: 'How does the converter detect word boundaries?', a: 'Words are split on spaces, underscores, hyphens, and transitions between lowercase and uppercase letters, so "myVariableName" and "my-variable-name" both parse correctly.' },
            { q: 'Does it handle Unicode or accented characters?', a: 'Case conversion uses JavaScript\'s built-in toUpperCase/toLowerCase, which handles most Unicode characters including accented Latin letters.' },
          ]}
        />
      }
      category="text"
      iconName="CaseSensitive"
    >
      <div className="space-y-5">
        <Textarea
          label="Input text"
          value={input}
          onChange={setInput}
          placeholder="Type or paste your text here…"
          rows={5}
          showCount
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CASES.map(({ label, fn }) => {
            const result = input ? fn(input) : ''
            return (
              <div
                key={label}
                className="rounded-xl p-4"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {label}
                  </span>
                  <CopyButton text={result} />
                </div>
                <p
                  className="text-sm leading-relaxed break-all min-h-[1.5rem]"
                  style={{ color: result ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' }}
                >
                  {result || 'Output will appear here'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </ToolLayout>
  )
}
