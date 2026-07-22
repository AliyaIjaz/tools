'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Minimize2, Maximize2 } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import SeoSection from '@/components/ui/SeoSection'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')

  function format() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
      setStatus('valid')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
      setStatus('invalid')
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
      setStatus('valid')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
      setStatus('invalid')
    }
  }

  function validate() {
    try {
      JSON.parse(input)
      setError('')
      setStatus('valid')
    } catch (e) {
      setError((e as Error).message)
      setStatus('invalid')
    }
  }

  function syntaxHighlight(json: string) {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'text-sky-300'
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'text-violet-300' : 'text-emerald-300'
        } else if (/true|false/.test(match)) {
          cls = 'text-orange-300'
        } else if (/null/.test(match)) {
          cls = 'text-red-400'
        }
        return `<span class="${cls}">${match}</span>`
      }
    )
  }

  return (
    <ToolLayout
      toolId="json-formatter"
      title="JSON Formatter"
      description="Format, validate, and minify JSON with syntax highlighting"
      category="dev"
      iconName="Braces"
      seoContent={
        <SeoSection
          about="Paste raw or minified JSON to instantly format it with proper indentation and syntax highlighting, validate it for errors, or minify it back to a compact string. Everything runs in your browser — no data leaves your machine."
          useCases={[
            'Formatting minified API responses to make them human-readable',
            'Validating JSON before committing it to a config file or codebase',
            'Minifying JSON to reduce payload size in network requests',
            'Debugging malformed JSON by finding the exact parse error',
            'Reviewing the structure of an unfamiliar API response',
          ]}
          faqs={[
            { q: 'What indentation style does the formatter use?', a: 'The formatter uses 2-space indentation, which is the most widely used convention for JSON.' },
            { q: 'Can it handle very large JSON files?', a: 'Yes, but very large payloads (hundreds of MB) may be slow depending on browser memory. For most real-world JSON the tool is instant.' },
            { q: 'Does this tool send my data anywhere?', a: 'No. JSON parsing and formatting happens entirely in your browser using JavaScript\'s built-in JSON.parse and JSON.stringify methods.' },
          ]}
        />
      }
    >
      <div className="space-y-4">
        <Textarea
          label="Input JSON"
          value={input}
          onChange={setInput}
          placeholder='{"hello": "world"}'
          mono
          rows={10}
        />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={format}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
            style={{ background: 'var(--color-dev-dim)', border: '1px solid var(--color-dev)', color: 'var(--color-dev)' }}
          >
            <Maximize2 size={13} className="inline mr-1.5" />
            Format
          </button>
          <button
            onClick={minify}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.6)' }}
          >
            <Minimize2 size={13} className="inline mr-1.5" />
            Minify
          </button>
          <button
            onClick={validate}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.6)' }}
          >
            Validate
          </button>

          {status === 'valid' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle size={13} /> Valid JSON
            </div>
          )}
          {status === 'invalid' && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <XCircle size={13} /> Invalid JSON
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm font-mono"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Output</label>
              <CopyButton text={output} />
            </div>
            <pre
              className="rounded-xl px-4 py-3 text-sm overflow-auto leading-relaxed"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-geist-mono), monospace',
                color: 'rgba(255,255,255,0.8)',
                maxHeight: '400px',
              }}
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(output) }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
