'use client'

import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Tabs from '@/components/ui/Tabs'

const STARTER = `# Hello, Markdown!

Write **bold**, *italic*, or \`inline code\`.

## Lists

- Item one
- Item two
- Item three

## Code block

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`
\`\`\`

## Quote

> The best tools get out of your way.

[Link example](https://example.com)
`

export default function MarkdownPreviewPage() {
  const [md, setMd] = useState(STARTER)
  const [html, setHtml] = useState('')
  const [view, setView] = useState('Split')

  useEffect(() => {
    async function render() {
      const { marked } = await import('marked')
      const DOMPurify = (await import('dompurify')).default
      const raw = await marked(md)
      setHtml(DOMPurify.sanitize(raw))
    }
    render()
  }, [md])

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: '480px',
    resize: 'none',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'var(--font-geist-mono), monospace',
    lineHeight: '1.7',
    outline: 'none',
  }

  const previewStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '480px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px 24px',
    overflowY: 'auto',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '15px',
    lineHeight: '1.75',
  }

  return (
    <ToolLayout
      toolId="markdown-preview"
      title="Markdown Preview"
      description="Write Markdown and see the rendered output live"
      seoContent={
        <SeoSection
          about="Write or paste Markdown in the left pane and see the rendered HTML output in real time on the right. Supports standard Markdown syntax including headings, bold, italic, links, lists, code blocks, and tables. Rendering uses the marked library with DOMPurify sanitization."
          useCases={[
            'Previewing README files before pushing to GitHub',
            'Drafting blog posts or documentation in Markdown with a live preview',
            'Learning Markdown syntax by seeing the rendered result immediately',
            'Verifying that a Markdown snippet renders correctly before publishing',
            'Converting Markdown to HTML to inspect the generated markup',
          ]}
          faqs={[
            { q: 'What Markdown flavors are supported?', a: 'Standard CommonMark Markdown is supported, including fenced code blocks, tables, and strikethrough text.' },
            { q: 'Is the output sanitized?', a: 'Yes. The rendered HTML is sanitized using DOMPurify to prevent XSS attacks from malicious Markdown input.' },
            { q: 'Can I copy the generated HTML?', a: 'Yes — click the copy button above the preview to copy the rendered HTML to your clipboard.' },
          ]}
        />
      }
      category="text"
      iconName="FileText"
    >
      {/* Markdown prose styles scoped to preview */}
      <style>{`
        .md-preview h1, .md-preview h2, .md-preview h3 {
          color: #fff;
          font-weight: 600;
          margin: 1.25em 0 0.5em;
          line-height: 1.3;
        }
        .md-preview h1 { font-size: 1.6em; }
        .md-preview h2 { font-size: 1.3em; }
        .md-preview h3 { font-size: 1.1em; }
        .md-preview p { margin: 0.75em 0; color: rgba(255,255,255,0.8); }
        .md-preview strong { color: #fff; font-weight: 600; }
        .md-preview em { color: rgba(255,255,255,0.85); font-style: italic; }
        .md-preview code {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 0.875em;
          font-family: var(--font-geist-mono), monospace;
          color: oklch(0.7 0.18 80);
        }
        .md-preview pre {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px 16px;
          overflow-x: auto;
          margin: 1em 0;
        }
        .md-preview pre code {
          background: none;
          border: none;
          padding: 0;
          color: rgba(255,255,255,0.75);
          font-size: 0.85em;
        }
        .md-preview blockquote {
          border-left: 3px solid oklch(0.7 0.18 80 / 0.6);
          margin: 1em 0;
          padding: 4px 16px;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .md-preview ul, .md-preview ol { padding-left: 1.5em; margin: 0.75em 0; }
        .md-preview li { margin: 0.25em 0; color: rgba(255,255,255,0.8); }
        .md-preview a { color: oklch(0.6 0.2 290); text-decoration: underline; text-underline-offset: 3px; }
        .md-preview hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5em 0; }
        .md-preview table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .md-preview th, .md-preview td { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
        .md-preview th { background: rgba(255,255,255,0.05); font-weight: 600; color: #fff; }
      `}</style>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs tabs={['Split', 'Edit', 'Preview']} value={view} onChange={setView} />
          <div className="flex items-center gap-2">
            <CopyButton text={html} label="Copy HTML" />
            <CopyButton text={md} label="Copy MD" />
          </div>
        </div>

        <div className={view === 'Split' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
          {(view === 'Split' || view === 'Edit') && (
            <textarea
              value={md}
              onChange={(e) => setMd(e.target.value)}
              style={textareaStyle}
              spellCheck={false}
            />
          )}
          {(view === 'Split' || view === 'Preview') && (
            <div
              className="md-preview"
              style={previewStyle}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
