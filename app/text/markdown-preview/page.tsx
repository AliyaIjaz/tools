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

function htmlToPlainText(html: string): string {
  if (typeof document === 'undefined') return ''
  const div = document.createElement('div')
  div.innerHTML = html

  // Replace block elements with newlines before stripping
  div.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, tr, br').forEach((el) => {
    el.insertAdjacentText('afterend', '\n')
  })
  div.querySelectorAll('th, td').forEach((el) => {
    el.insertAdjacentText('afterend', '\t')
  })

  const text = (div.textContent ?? '')
    .replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
    .trim()

  return text
}

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

  const plainText = htmlToPlainText(html)

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: '480px',
    resize: 'none',
    background: 'var(--surface)',
    border: '2px solid var(--border-text-idle)',
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
    border: '2px solid var(--border-text-idle)',
    borderRadius: '12px',
    padding: '20px 24px',
    overflowY: 'auto',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '15px',
    lineHeight: '1.75',
  }

  const isPlainView = view === 'Plain Text'
  const copyLabel = view === 'Edit' ? 'Copy MD' : view === 'Plain Text' ? 'Copy Plain Text' : 'Copy HTML'
  const copyText = view === 'Edit' ? md : view === 'Plain Text' ? plainText : html

  return (
    <ToolLayout
      toolId="markdown-preview"
      title="Markdown Preview"
      description="Write Markdown and see the rendered output — or strip it to plain text"
      seoContent={
        <SeoSection
          aboutTitle="About this tool"
          about={<>
            <p className="text-base leading-relaxed"><strong>Markdown Preview Online</strong> is a free browser-based tool that lets you write or paste Markdown and instantly see the rendered HTML output in a live side-by-side preview. It also includes a <strong>Plain Text</strong> mode that strips all Markdown formatting — headings, bold, italic, links, code blocks — down to clean readable text. This is especially useful for removing AI-generated Markdown before pasting into emails, Word documents, or CMS platforms that don&apos;t support Markdown.</p>
            <p className="text-base leading-relaxed">Rendering is powered by the <strong>Marked</strong> library, while the generated HTML is sanitized with <strong>DOMPurify</strong> to help prevent XSS attacks. Everything runs locally in your browser — your Markdown content is never uploaded to a server.</p>
            <p className="text-base leading-relaxed">Whether you&apos;re writing GitHub README files, technical documentation, blog posts, or stripping Markdown from AI-generated output, this tool handles it all in one place with no registration required.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Preview GitHub README.md files before committing or publishing them.',
            'Strip Markdown formatting from AI-generated output before pasting into Word or email.',
            'Write technical documentation with a live Markdown preview.',
            'Remove asterisks, hashes, and backticks from LLM responses.',
            'Draft blog posts and articles using Markdown formatting.',
            'Convert AI chatbot output with Markdown to clean plain text for a CMS.',
            'Verify headings, lists, tables, links, and images before publishing.',
            'Test fenced code blocks and inline code formatting.',
            'Review documentation for static site generators before deployment.',
            'Check how blockquotes, horizontal rules, and emphasis are rendered.',
            'Preview API documentation written in Markdown.',
          ]}
          faqs={[
            { q: 'How does the Plain Text mode work?', a: 'The Plain Text tab renders your Markdown to HTML first, then strips all HTML tags using the browser\'s DOM — preserving the readable content (headings become plain lines, lists become bullet text, code blocks become plain code) while removing all formatting characters.' },
            { q: 'Can I use this to remove Markdown from AI-generated text?', a: 'Yes. Paste any AI output that contains Markdown formatting (asterisks, hashes, backticks, brackets) into the editor, then switch to the Plain Text tab to get a clean, stripped version ready for pasting into any document.' },
            { q: 'Is my Markdown uploaded to a server?', a: 'No. All rendering happens locally in your browser. Your Markdown content is never uploaded, stored, or shared.' },
            { q: 'Which Markdown syntax is supported?', a: 'The tool supports standard CommonMark syntax, including headings, bold and italic text, strikethrough, links, images, blockquotes, ordered and unordered lists, inline code, fenced code blocks, tables, and horizontal rules.' },
            { q: 'Does it support GitHub Flavored Markdown (GFM)?', a: 'Most commonly used GitHub Markdown features are supported, including fenced code blocks, tables, and strikethrough text.' },
            { q: 'Is the generated HTML safe?', a: 'Yes. The rendered HTML is sanitized using DOMPurify, which removes potentially unsafe content and helps protect against cross-site scripting (XSS) attacks.' },
            { q: 'Can I copy the generated HTML or plain text?', a: 'Yes. The copy button in the toolbar adapts to the active tab — it copies Markdown in Edit mode, HTML in Preview mode, and plain text in Plain Text mode.' },
            { q: 'Does the preview update automatically?', a: 'Yes. The preview refreshes instantly whenever you type, paste, or edit your Markdown.' },
          ]}
        />
      }
      category="text"
      iconName="FileText"
      showAllCategory
      compactRelated
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
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Tabs tabs={['Split', 'Edit', 'Preview', 'Plain Text']} value={view} onChange={setView} />
          <CopyButton text={copyText} label={copyLabel} />
        </div>

        {/* Editor + Preview / Plain Text */}
        {isPlainView ? (
          <textarea
            readOnly
            value={plainText}
            style={{
              ...textareaStyle,
              fontFamily: 'inherit',
              color: 'rgba(255,255,255,0.82)',
              cursor: 'default',
            }}
          />
        ) : (
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
        )}
      </div>
    </ToolLayout>
  )
}
