'use client'

import { useState, useMemo } from 'react'
import { diffLines } from 'diff'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'

export default function DiffViewerPage() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const { diffs, added, removed } = useMemo(() => {
    if (!left && !right) return { diffs: [], added: 0, removed: 0 }
    const changes = diffLines(left, right)
    let added = 0, removed = 0
    for (const c of changes) {
      if (c.added) added += c.count ?? 0
      if (c.removed) removed += c.count ?? 0
    }
    return { diffs: changes, added, removed }
  }, [left, right])

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    resize: 'vertical',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '13px',
    outline: 'none',
    background: 'var(--surface)',
    border: '2px solid var(--border-dev-idle)',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'var(--font-geist-mono), monospace',
    lineHeight: '1.6',
  }

  return (
    <ToolLayout
      toolId="diff-viewer"
      title="Diff Viewer"
      description="Compare two text blocks and highlight the differences"
      seoContent={
        <SeoSection
          about={`Diff Viewer Online is a free browser-based tool that lets you compare two blocks of text side by side and instantly highlight the differences between them. Whether you're reviewing source code, configuration files, JSON documents, SQL queries, Markdown files, or plain text, this tool makes it easy to identify added, removed, modified, and unchanged lines in seconds.\n\nA diff (short for "difference") is a comparison between two versions of the same content. Developers, writers, system administrators, and editors use diff tools to review changes, debug problems, verify updates, and ensure files match before deployment or publication. Instead of manually reading two documents line by line, a diff viewer automatically identifies exactly what has changed, making reviews faster and more accurate.\n\nThis tool performs line-by-line comparisons using the well-known Myers diff algorithm, the same approach used by Git and many version control systems. It clearly displays inserted, deleted, and modified lines, allowing you to quickly understand differences between two versions of a document. Whether you're comparing code snippets, API responses, configuration files, or documentation, the visual side-by-side layout helps you spot even subtle changes.\n\nAll comparisons are performed entirely inside your browser, meaning your text is never uploaded, stored, or transmitted to any server. Whether you're a software developer, DevOps engineer, QA tester, technical writer, database administrator, or student, this Diff Viewer Online provides a fast, private, and reliable way to compare text and review changes without installing additional software.`}
          useCases={[
            'Compare two versions of source code before deployment.',
            'Review Git changes without opening a repository.',
            'Compare JSON responses returned by APIs.',
            'Find differences between two configuration files.',
            'Compare SQL queries before running them in production.',
            'Review changes made to Markdown documentation.',
            'Compare HTML, CSS, and JavaScript files.',
            'Verify changes between XML, YAML, or CSV files.',
            'Compare application log files while troubleshooting issues.',
            'Review AI-generated text against the original version.',
            'Compare copied code snippets to identify hidden differences.',
            'Validate environment configuration files before deployment.',
            'Compare exported database records or reports.',
            'Review legal documents, contracts, or written content.',
            'Compare plain text files line by line.',
            'Detect accidental edits before publishing documents.',
            'Review pull request changes during software development.',
            'Compare notes, reports, or research documents for revisions.',
          ]}
          faqs={[
            { q: 'What is a Diff Viewer?', a: 'A Diff Viewer is a tool that compares two versions of text and highlights the differences between them. It helps identify added, removed, modified, and unchanged lines, making it easier to review changes and detect mistakes.' },
            { q: 'What is a diff?', a: 'A diff (difference) is the result of comparing two versions of a file or document. It shows exactly which lines have been added, removed, or modified between the two versions.' },
            { q: 'What algorithm does this tool use?', a: 'This tool uses the Myers diff algorithm, one of the most widely used algorithms for text comparison. It is also used by Git and many modern version control systems because it efficiently identifies the smallest set of changes between two documents.' },
            { q: 'Can I compare source code?', a: 'Yes. The Diff Viewer works well with JavaScript, TypeScript, Python, Java, C#, Go, PHP, Ruby, Rust, Kotlin, Swift, HTML, CSS, SQL, and many other programming languages because it compares plain text.' },
            { q: 'Can I compare JSON, XML, or YAML files?', a: 'Yes. You can compare structured text formats such as JSON, XML, YAML, CSV, Markdown, INI, configuration files, and many other text-based formats.' },
            { q: 'Does this tool compare entire files?', a: 'The tool compares any text you paste into the two editors. Simply copy the contents of two files into the tool to compare them side by side.' },
            { q: 'Does it compare line by line or word by word?', a: 'This version performs line-by-line comparison. Entire changed lines are highlighted rather than individual words or characters.' },
            { q: 'Does whitespace affect the comparison?', a: 'Yes. Differences in spaces, tabs, indentation, or blank lines are treated as text changes because they can be significant in many programming languages and configuration files.' },
            { q: 'Can I compare very large documents?', a: 'Yes. There is no fixed size limit imposed by the tool. Performance depends primarily on your browser\'s available memory and your device\'s hardware.' },
            { q: 'Can I use this tool for Git reviews?', a: 'Yes. The Myers diff algorithm is the same core algorithm used by Git, making this tool useful for reviewing code changes, pull requests, patches, and revisions outside of a Git repository.' },
            { q: 'Does this tool modify my text?', a: 'No. The Diff Viewer only compares your input and highlights the differences. Your original text remains unchanged.' },
            { q: 'Is my text uploaded to a server?', a: 'No. All comparisons happen locally in your browser. Your documents, code, and other content are never uploaded, stored, or shared with any server.' },
            { q: 'Can I use this tool offline?', a: 'Yes. Once the webpage has loaded, all comparisons are performed locally in your browser without requiring an internet connection.' },
            { q: 'Which file types can I compare?', a: 'Any text-based content can be compared, including plain text, source code, JSON, XML, YAML, CSV, SQL, Markdown, HTML, CSS, JavaScript, TypeScript, configuration files, log files, and documentation.' },
            { q: 'Who should use a Diff Viewer?', a: 'This tool is useful for software developers, DevOps engineers, QA testers, technical writers, database administrators, students, editors, researchers, and anyone who needs to compare two versions of text quickly and accurately.' },
            { q: 'Why use a Diff Viewer?', a: 'A Diff Viewer saves time by automatically identifying differences between two versions of text. It helps reduce mistakes during code reviews, document editing, configuration management, debugging, and quality assurance, making it easier to understand exactly what has changed before sharing, deploying, or publishing your work.' },
          ]}
        />
      }
      category="dev"
      iconName="GitCompare"
      showAllCategory
    >
      <div className="space-y-5">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-base font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Original
            </label>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              rows={10}
              placeholder="Paste original text…"
              style={{
                ...textareaStyle,
                fontSize: '14px',
                border: '2px solid var(--border-dev)',
                color: 'rgba(255,255,255,0.95)',
                lineHeight: '1.7',
              }}
            />
          </div>
          <div>
            <label className="text-base font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Modified
            </label>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              rows={10}
              placeholder="Paste modified text…"
              style={{
                ...textareaStyle,
                fontSize: '14px',
                border: '2px solid var(--border-dev)',
                color: 'rgba(255,255,255,0.95)',
                lineHeight: '1.7',
              }}
            />
          </div>
        </div>

        {/* Summary */}
        {(left || right) && (
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-1.5 text-base font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.12)', border: '1.5px solid rgba(52,211,153,0.35)', color: '#34d399' }}
            >
              +{added} added
            </div>
            <div
              className="flex items-center gap-1.5 text-base font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.35)', color: '#f87171' }}
            >
              −{removed} removed
            </div>
          </div>
        )}

        {/* Diff output */}
        {diffs.length > 0 && (
          <div>
            <label className="text-base font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Diff
            </label>
            <div
              className="rounded-xl overflow-auto"
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--border-dev)',
                maxHeight: '440px',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '14px',
                lineHeight: '1.7',
              }}
            >
              {diffs.map((part, i) => {
                const bg = part.added
                  ? 'rgba(52,211,153,0.1)'
                  : part.removed
                  ? 'rgba(239,68,68,0.1)'
                  : 'transparent'
                const color = part.added
                  ? '#34d399'
                  : part.removed
                  ? '#f87171'
                  : 'rgba(255,255,255,0.5)'
                const prefix = part.added ? '+' : part.removed ? '−' : ' '

                return (
                  <div key={i} style={{ background: bg }}>
                    {part.value.split('\n').filter((line, j, arr) => j < arr.length - 1 || line !== '').map((line, j) => (
                      <div key={j} className="flex gap-3 px-4 py-0.5">
                        <span style={{ color, userSelect: 'none', minWidth: '12px' }}>{prefix}</span>
                        <span style={{ color: part.added || part.removed ? color : 'rgba(255,255,255,0.85)' }}>
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
