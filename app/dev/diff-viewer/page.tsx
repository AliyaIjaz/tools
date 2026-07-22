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
    border: '1px solid var(--border)',
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
          about="Paste two blocks of text side by side to instantly see which lines were added, removed, or unchanged. The diff is computed in your browser using the standard Myers diff algorithm — no server needed, and nothing is stored."
          useCases={[
            'Comparing two versions of a config file or JSON payload',
            'Reviewing changes to a document before and after editing',
            'Spotting differences between two API responses',
            'Checking what changed between two versions of a SQL query',
            'Comparing copied code snippets to find subtle discrepancies',
          ]}
          faqs={[
            { q: 'What algorithm is used for diffing?', a: 'Line-by-line diffing using the Myers diff algorithm, the same approach used by git diff.' },
            { q: 'Does it support word-level or character-level diffing?', a: 'Currently the diff is line-by-line. Within a changed line, the entire line is highlighted rather than individual words.' },
            { q: 'Is there a length limit on the input?', a: 'There is no enforced limit. Very large documents may be slower to diff but the tool will still work.' },
          ]}
        />
      }
      category="dev"
      iconName="GitCompare"
    >
      <div className="space-y-5">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Original
            </label>
            <textarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              rows={10}
              placeholder="Paste original text…"
              style={textareaStyle}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Modified
            </label>
            <textarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              rows={10}
              placeholder="Paste modified text…"
              style={textareaStyle}
            />
          </div>
        </div>

        {/* Summary */}
        {(left || right) && (
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}
            >
              +{added} added
            </div>
            <div
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              −{removed} removed
            </div>
          </div>
        )}

        {/* Diff output */}
        {diffs.length > 0 && (
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Diff
            </label>
            <div
              className="rounded-xl overflow-auto"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                maxHeight: '400px',
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '13px',
                lineHeight: '1.6',
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
                        <span style={{ color: part.added || part.removed ? color : 'rgba(255,255,255,0.7)' }}>
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
