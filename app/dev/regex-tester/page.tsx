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
      showAllCategory
      seoContent={
        <SeoSection
          about={`Regex Tester Online is a free browser-based tool that helps you test, debug, validate, and learn regular expressions (regex) in real time. Enter a regular expression and sample text to instantly highlight matches, inspect capture groups, view match counts, and verify whether your pattern behaves exactly as expected. Whether you're building validation rules, parsing text, extracting data, or debugging complex patterns, this tool makes working with regular expressions faster and easier.\n\nA regular expression (regex) is a pattern used to search, match, validate, and manipulate text. Regex is widely used in programming languages, databases, command-line tools, text editors, and web applications for tasks such as validating email addresses, parsing log files, extracting URLs, cleaning data, and performing search-and-replace operations.\n\nThis Regex Tester supports the JavaScript (ECMAScript) regular expression engine, making it ideal for frontend and Node.js development. You can test patterns using commonly used flags such as global (g), case-insensitive (i), multiline (m), and dotAll (s), while viewing live match highlighting, numbered and named capture groups, and match counts as you type.\n\nWhether you're a developer, QA engineer, data analyst, student, or cybersecurity professional, this Regex Tester Online provides a quick way to experiment with character classes, quantifiers, anchors, lookaheads, alternation, and other regex features without installing any software. All processing happens entirely inside your browser, so your text and patterns are never uploaded to a server, ensuring complete privacy.`}
          useCases={[
            'Test regular expressions before using them in production code.',
            'Validate email addresses, phone numbers, and URLs.',
            'Build username and password validation patterns.',
            'Debug complex regular expressions with live match highlighting.',
            'Learn how capture groups and named groups work.',
            'Test lookaheads and lookbehinds for advanced pattern matching.',
            'Extract data from log files and application output.',
            'Parse CSV, JSON, XML, and plain text documents.',
            'Find and replace text using regex-compatible editors.',
            'Validate dates, times, ZIP codes, postal codes, and product IDs.',
            'Test JavaScript regular expressions for web applications.',
            'Build patterns for form validation in frontend frameworks.',
            'Extract hashtags, mentions, or links from social media content.',
            'Clean and transform large text datasets.',
            'Verify webhook payloads, API responses, and configuration files.',
            'Learn regex syntax while studying programming or computer science.',
            'Debug patterns used in Visual Studio Code and other code editors.',
            'Test multiline matching and case-insensitive searches.',
          ]}
          faqs={[
            { q: 'What is a regular expression (regex)?', a: 'A regular expression, or regex, is a sequence of characters that defines a search pattern. It is commonly used to search, match, validate, extract, and replace text in programming languages, databases, text editors, and command-line tools.' },
            { q: 'What is a Regex Tester?', a: 'A Regex Tester is a tool that allows you to write regular expressions and instantly see which parts of your input text match. It helps developers debug, validate, and improve regex patterns before using them in applications.' },
            { q: 'Which regex flavor does this tool use?', a: 'This tool uses the JavaScript (ECMAScript) regular expression engine, which is supported by all modern web browsers and Node.js.' },
            { q: 'Which regex flags are supported?', a: 'You can enable the following JavaScript regex flags: g (Global matching), i (Case-insensitive matching), m (Multiline mode), and s (DotAll mode). These flags can be enabled individually or combined depending on your matching requirements.' },
            { q: 'Are capture groups displayed?', a: 'Yes. Both numbered capture groups and named capture groups are displayed for every successful match, making it easier to understand how your regular expression captures data.' },
            { q: 'Does this tool support lookaheads and lookbehinds?', a: 'Yes. JavaScript regular expressions support positive and negative lookaheads, and modern JavaScript environments also support lookbehinds where available.' },
            { q: 'What are character classes?', a: 'Character classes define sets of characters that can match a single position in text. Examples include \\d for digits, \\w for word characters, \\s for whitespace, and custom ranges such as [A-Z].' },
            { q: 'What are quantifiers?', a: 'Quantifiers specify how many times a character or group may appear. Common examples include *, +, ?, and {n,m}, allowing patterns to match repeated text efficiently.' },
            { q: 'What are anchors in regex?', a: 'Anchors match positions rather than characters. For example, ^ matches the beginning of a line, while $ matches the end of a line.' },
            { q: 'Can I validate email addresses and URLs?', a: 'Yes. This tool is commonly used to test patterns for validating email addresses, URLs, phone numbers, usernames, passwords, dates, postal codes, and many other text formats.' },
            { q: "Why isn't my regex matching?", a: 'A pattern may fail because of incorrect syntax, missing flags, greedy matching, character escaping, or differences between regex flavors. Testing your pattern with sample input can help identify the issue.' },
            { q: 'Does this tool modify my text?', a: 'No. The Regex Tester only analyzes and highlights matches. Your original text remains unchanged.' },
            { q: 'Does this tool support Unicode characters?', a: 'Yes. JavaScript regular expressions support Unicode, allowing you to test patterns against multilingual text, accented characters, emoji, and many international character sets.' },
            { q: 'Is my data uploaded to a server?', a: 'No. All regular expression matching happens locally in your browser. Your text, regex patterns, and test data are never uploaded or stored on any server.' },
            { q: 'Can I use this tool offline?', a: 'Yes. Once the webpage has loaded, all regex matching and highlighting run locally in your browser without requiring an internet connection.' },
            { q: 'Who can benefit from this Regex Tester?', a: 'This tool is useful for web developers, backend developers, QA engineers, DevOps engineers, data analysts, cybersecurity professionals, students, educators, and anyone who works with text processing or regular expressions.' },
            { q: 'Which programming languages use regular expressions?', a: 'Regular expressions are supported by JavaScript, TypeScript, Python, PHP, Java, C#, Go, Ruby, Rust, Kotlin, Swift, Perl, and many other programming languages. While syntax varies slightly between regex engines, the core concepts remain similar across platforms.' },
            { q: 'Why should I test regex before using it?', a: 'Testing regular expressions helps prevent incorrect matches, reduces bugs, improves validation accuracy, simplifies debugging, and ensures your pattern behaves correctly before deploying it in production code.' },
          ]}
        />
      }
      category="dev"
      iconName="Search"
    >
      <div className="space-y-5">
        {/* Pattern input */}
        <div>
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Pattern
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'var(--surface)', border: `1.5px solid ${error ? 'rgba(239,68,68,0.6)' : 'var(--border-hover)'}` }}
          >
            <span className="text-lg font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-geist-mono), monospace' }}
            />
            <span className="text-lg font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>/</span>
            {/* Flag toggles */}
            <div className="flex gap-1.5">
              {FLAGS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  className="w-8 h-8 rounded-lg text-sm font-mono font-bold transition-all"
                  style={{
                    background: flags.has(f) ? 'oklch(0.6 0.2 290 / 0.25)' : 'rgba(255,255,255,0.06)',
                    color: flags.has(f) ? 'var(--color-dev)' : 'rgba(255,255,255,0.5)',
                    border: `1.5px solid ${flags.has(f) ? 'oklch(0.6 0.2 290 / 0.6)' : 'rgba(255,255,255,0.12)'}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm mt-1.5 font-medium" style={{ color: '#f87171' }}>{error}</p>}
        </div>

        {/* Test string */}
        <div>
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Test string
          </label>
          <textarea
            value={testStr}
            onChange={(e) => setTestStr(e.target.value)}
            rows={7}
            placeholder="Enter text to test against…"
            className="w-full resize-y rounded-xl px-4 py-3 text-base outline-none"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--border-dev)',
              color: 'rgba(255,255,255,0.95)',
              fontFamily: 'var(--font-geist-mono), monospace',
              lineHeight: '1.7',
            }}
          />
        </div>

        {/* Highlighted result */}
        {testStr && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Matches</label>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  background: matchCount > 0 ? 'oklch(0.6 0.2 290 / 0.2)' : 'var(--surface)',
                  color: matchCount > 0 ? 'var(--color-dev)' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${matchCount > 0 ? 'oklch(0.6 0.2 290 / 0.35)' : 'var(--border)'}`,
                }}
              >
                {matchCount} match{matchCount !== 1 ? 'es' : ''}
              </span>
            </div>
            <pre
              className="rounded-xl px-4 py-3 text-base overflow-auto whitespace-pre-wrap break-words"
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--border-dev)',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.7',
                maxHeight: '240px',
                color: 'rgba(255,255,255,0.85)',
              }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        {/* Groups */}
        {groups.length > 0 && (
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Capture groups
            </label>
            <div className="space-y-1.5">
              {groups.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm"
                  style={{ background: 'var(--surface)', border: '2px solid var(--border-dev)' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Match {g.match} · Group {g.group}</span>
                  <code style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-geist-mono)' }}>{g.value}</code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
