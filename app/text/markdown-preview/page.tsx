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
          aboutTitle="About this tool"
          about={<>
            <p className="text-base leading-relaxed">Markdown Preview Online is a free browser-based tool that lets you write or paste Markdown and instantly see the rendered HTML output in a live side-by-side preview. As you type, the preview updates in real time, making it easy to verify formatting, test Markdown syntax, and prepare content for publishing. The tool supports standard CommonMark features, including headings, bold, italic, links, images, blockquotes, ordered and unordered lists, fenced code blocks, inline code, tables, horizontal rules, and strikethrough text.</p>
            <p className="text-base leading-relaxed">Rendering is powered by the <strong>Marked</strong> library, while the generated HTML is sanitized with <strong>DOMPurify</strong> to help prevent XSS attacks from malicious Markdown input. Everything runs locally in your browser, so your Markdown content is never uploaded to a server, ensuring your documents remain private.</p>
            <p className="text-base leading-relaxed">Whether you&apos;re writing GitHub README files, technical documentation, blog posts, API guides, wiki pages, or project notes, this online Markdown preview tool provides a fast and reliable way to review formatting before publishing. No registration, installation, or file uploads are required.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Preview GitHub README.md files before committing or publishing them.',
            'Write technical documentation with a live Markdown preview.',
            'Draft blog posts and articles using Markdown formatting.',
            'Learn Markdown syntax by seeing rendered output instantly.',
            'Verify headings, lists, tables, links, and images before publishing.',
            'Test fenced code blocks and inline code formatting.',
            'Convert Markdown into rendered HTML for quick inspection.',
            'Review documentation for static site generators before deployment.',
            'Create knowledge base articles and internal documentation.',
            'Check how blockquotes, horizontal rules, and emphasis are rendered.',
            'Preview API documentation written in Markdown.',
            'Experiment with Markdown formatting without installing an editor.',
          ]}
          faqs={[
            { q: 'Is this Markdown Preview tool free?', a: 'Yes. The tool is completely free to use with no registration, subscriptions, or hidden fees.' },
            { q: 'Is my Markdown uploaded to a server?', a: 'No. All rendering happens locally in your browser. Your Markdown content is never uploaded, stored, or shared.' },
            {
              q: 'Which Markdown syntax is supported?',
              a: 'The tool supports standard CommonMark syntax, including headings, bold and italic text, strikethrough, links, images, blockquotes, ordered and unordered lists, inline code, fenced code blocks, tables, and horizontal rules.',
            },
            { q: 'Does it support GitHub Flavored Markdown (GFM)?', a: 'Most commonly used GitHub Markdown features are supported, including fenced code blocks, tables, and strikethrough text. Rendering follows CommonMark with widely adopted extensions.' },
            { q: 'How is the Markdown rendered?', a: 'Markdown is parsed using the Marked library, which converts Markdown into HTML in real time as you type or edit your content.' },
            { q: 'Is the generated HTML safe?', a: 'Yes. The rendered HTML is sanitized using DOMPurify, which removes potentially unsafe content and helps protect against cross-site scripting (XSS) attacks.' },
            { q: 'Can I copy the generated HTML?', a: 'Yes. Click the Copy HTML button above the preview to copy the rendered HTML directly to your clipboard.' },
            { q: 'Does the preview update automatically?', a: 'Yes. The preview refreshes instantly whenever you type, paste, or edit your Markdown, allowing you to see formatting changes in real time.' },
            { q: 'Can I preview images and links?', a: 'Yes. Images and hyperlinks included in your Markdown are rendered in the live preview so you can verify that they appear correctly before publishing.' },
            { q: 'Can I use this tool for GitHub README files?', a: "Absolutely. It's ideal for previewing README.md files before pushing them to GitHub, helping you catch formatting issues early." },
            { q: 'Do I need to install any software?', a: "No. The tool works entirely in your web browser. There's nothing to download or install." },
            { q: 'Who is this tool designed for?', a: 'This tool is useful for developers, technical writers, documentation teams, open-source contributors, bloggers, students, DevOps engineers, and anyone who writes or edits Markdown.' },
            { q: 'Why use a live Markdown preview?', a: 'A live Markdown preview lets you verify formatting as you write, reducing mistakes and saving time. Instead of switching between editing and rendering, you can immediately see how headings, tables, code blocks, images, and other Markdown elements will appear in the final HTML output.' },
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
