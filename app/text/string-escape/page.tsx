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
          aboutTitle="About this tool"
          about={<>
            <p className="text-base leading-relaxed">String Escaper Online is a free developer tool that lets you quickly escape or unescape text for <strong>HTML</strong>, <strong>JSON</strong>, and <strong>regular expressions (regex)</strong>. Whether you&apos;re preparing user input for HTML, embedding strings inside JSON payloads, creating literal regex patterns, or decoding escaped text, this tool performs the conversion instantly with just one click.</p>
            <p className="text-base leading-relaxed">The tool supports multiple escaping modes to suit different development tasks. <strong>HTML escaping</strong> converts reserved characters such as <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>&lt;</code>, <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>&gt;</code>, <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>&amp;</code>, <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>&#34;</code>, and <code className="text-sm font-mono px-1 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)'}}>&#39;</code> into their corresponding HTML entities, making text safe for display in HTML documents. <strong>JSON escaping</strong> converts text into a valid JSON string by escaping quotation marks, backslashes, newlines, tabs, and other special characters. <strong>Regex escaping</strong> automatically escapes characters with special meaning in regular expressions so they are treated as literal text rather than regex operators.</p>
            <p className="text-base leading-relaxed">All processing happens locally in your browser, so your text is never uploaded or stored. There are no registrations, downloads, or usage limits. Whether you&apos;re a frontend developer, backend engineer, API developer, technical writer, QA tester, or student, this online String Escaper helps you safely prepare and transform text for web applications, APIs, configuration files, documentation, and programming projects.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Escape user-generated text before displaying it inside an HTML page.',
            'Decode HTML entities copied from websites, CMS platforms, or databases.',
            'Prepare strings for inclusion in JSON objects and API request payloads.',
            'Escape quotation marks, backslashes, and control characters in JSON strings.',
            'Convert plain text into a literal regular expression pattern.',
            'Escape special regex characters before performing dynamic searches.',
            'Prepare code examples for documentation and technical tutorials.',
            'Safely display HTML snippets in blogs, documentation, or learning materials.',
            'Debug JSON data copied from APIs or configuration files.',
            'Clean escaped text exported from content management systems.',
            'Generate safe strings for JavaScript, Node.js, React, or other web applications.',
            'Quickly convert between escaped and unescaped text without installing software.',
          ]}
          faqs={[
            { q: 'Is this String Escaper free?', a: 'Yes. The tool is completely free to use with no subscriptions, registrations, or hidden charges.' },
            { q: 'Is my text uploaded to a server?', a: 'No. All escaping and unescaping operations are performed locally in your browser. Your text is never uploaded, stored, or shared.' },
            { q: 'Which escaping modes are supported?', a: 'The tool supports HTML Escape, HTML Unescape, JSON Escape, JSON Unescape, and Regex Escape. Each mode is designed for a specific use case and produces output suitable for that format.' },
            {
              q: 'What is HTML escaping?',
              a: <><p className="text-base leading-relaxed mb-2">HTML escaping converts reserved HTML characters into entity references so they are displayed as text instead of being interpreted as HTML:</p><ul className="space-y-1 text-base"><li><code className="font-mono text-sm">&lt;</code> → <code className="font-mono text-sm">&amp;lt;</code></li><li><code className="font-mono text-sm">&gt;</code> → <code className="font-mono text-sm">&amp;gt;</code></li><li><code className="font-mono text-sm">&amp;</code> → <code className="font-mono text-sm">&amp;amp;</code></li><li><code className="font-mono text-sm">&#34;</code> → <code className="font-mono text-sm">&amp;quot;</code></li><li><code className="font-mono text-sm">&#39;</code> → <code className="font-mono text-sm">&amp;#039;</code></li></ul></>,
            },
            { q: 'What is HTML unescaping?', a: 'HTML unescaping converts HTML entities back into their original characters. For example, &amp;lt;div&amp;gt; becomes <div>.' },
            { q: 'How does JSON escaping work?', a: "JSON escaping converts a string into valid JSON format by escaping quotation marks, backslashes, newline characters, tabs, carriage returns, and other control characters. The tool uses JavaScript's JSON.stringify() behavior to produce properly escaped JSON strings." },
            { q: "What is regex escaping?", a: 'Regex escaping automatically adds a backslash before characters that have special meaning in regular expressions — such as . * + ? ^ $ { } [ ] | ( ) \\ — so they are matched literally instead of acting as regex operators.' },
            { q: "What's the difference between escaping and encoding?", a: 'Escaping replaces special characters with safe representations meaningful within a particular syntax, such as HTML or JSON. Encoding transforms data into another representation, such as Base64 or URL encoding, for storage or transmission.' },
            { q: 'Can I escape multiline text?', a: 'Yes. The tool supports both single-line and multiline input. Line breaks and other control characters are escaped appropriately for the selected format.' },
            { q: 'Can I use this tool for JavaScript and API development?', a: "Yes. It's useful for preparing JSON payloads, debugging API responses, creating JavaScript string literals, escaping regular expressions, and safely displaying HTML in web applications." },
            { q: 'Is there a limit on the amount of text?', a: 'There is no fixed limit imposed by the tool. Very large inputs may take slightly longer to process depending on your browser and device.' },
            { q: 'Can I use this tool on mobile devices?', a: 'Yes. The String Escaper works in all modern desktop and mobile browsers without requiring installation.' },
            { q: 'Who can use this tool?', a: 'This tool is ideal for frontend developers, backend developers, full-stack developers, API developers, QA engineers, DevOps engineers, technical writers, students, software engineers, and anyone working with HTML, JSON, or regular expressions.' },
            { q: 'Why should I use a String Escaper?', a: 'Special characters can cause unexpected behavior when inserted into HTML documents, JSON payloads, or regular expressions without proper escaping. A String Escaper ensures your text is safely formatted for the target context, helping prevent syntax errors, rendering issues, and incorrect pattern matching while saving time during development and debugging.' },
          ]}
        />
      }
      category="text"
      iconName="Code"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Mode + Escape/Unescape controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setInput(''); setOutput('') }}
                className="px-4 py-2 rounded-lg text-base font-semibold transition-all"
                style={{
                  background: mode === m ? 'var(--color-text-tool-dim)' : 'var(--surface)',
                  border: `1.5px solid ${mode === m ? 'var(--color-text-tool)' : 'var(--border)'}`,
                  color: mode === m ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.65)',
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

        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {tab === 'Escape' ? 'Input' : 'Escaped input'}
            </label>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {input.length} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={7}
            placeholder="Enter text…"
            className="w-full resize-y rounded-xl outline-none transition-all duration-150 placeholder:text-white/20"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '15px',
              lineHeight: '1.7',
              padding: '14px 16px',
              fontFamily: 'var(--font-geist-mono), monospace',
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

        {/* Output */}
        {output && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {mode === 'Regex' ? 'Escaped pattern' : tab === 'Escape' ? 'Escaped output' : 'Unescaped output'}
              </label>
              <CopyButton text={output} />
            </div>
            <Textarea value={output} readOnly mono rows={7} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
