'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type SchemaOptions = {
  required: boolean
  additionalProperties: boolean
  inferTypes: boolean
  draft: 'draft-07' | '2020-12'
}

function inferSchema(value: unknown, options: SchemaOptions, depth = 0): Record<string, unknown> {
  if (value === null) return { type: 'null' }

  if (Array.isArray(value)) {
    if (value.length === 0) return { type: 'array', items: {} }
    // Merge all item schemas
    const itemSchemas = value.map((item) => inferSchema(item, options, depth + 1))
    const merged = mergeSchemas(itemSchemas)
    return { type: 'array', items: merged }
  }

  if (typeof value === 'object') {
    const props: Record<string, unknown> = {}
    const requiredKeys: string[] = []

    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      props[k] = inferSchema(v, options, depth + 1)
      if (options.required) requiredKeys.push(k)
    }

    const schema: Record<string, unknown> = { type: 'object', properties: props }
    if (options.required && requiredKeys.length > 0) schema.required = requiredKeys
    if (!options.additionalProperties) schema.additionalProperties = false
    return schema
  }

  if (!options.inferTypes) return {}

  if (typeof value === 'string') {
    const schema: Record<string, unknown> = { type: 'string' }
    // Detect common string formats
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) schema.format = 'date'
    else if (/^\d{4}-\d{2}-\d{2}T[\d:.]+Z?$/.test(value)) schema.format = 'date-time'
    else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) schema.format = 'email'
    else if (/^https?:\/\//.test(value)) schema.format = 'uri'
    else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) schema.format = 'uuid'
    return schema
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' }
  }

  if (typeof value === 'boolean') return { type: 'boolean' }

  return {}
}

function mergeSchemas(schemas: Record<string, unknown>[]): Record<string, unknown> {
  if (schemas.length === 1) return schemas[0]
  const types = new Set(schemas.map((s) => s.type))
  if (types.size === 1) return schemas[0]
  return { oneOf: schemas }
}

function generateSchema(json: unknown, options: SchemaOptions): Record<string, unknown> {
  const schemaUrl = options.draft === '2020-12'
    ? 'https://json-schema.org/draft/2020-12/schema'
    : 'http://json-schema.org/draft-07/schema#'

  const inner = inferSchema(json, options)
  return {
    $schema: schemaUrl,
    ...inner,
  }
}

const EXAMPLE_JSON = `{
  "id": "a3f2c1d4-e5b6-7890-abcd-ef1234567890",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 30,
  "isPremium": true,
  "createdAt": "2024-01-15T08:30:00Z",
  "score": 98.5,
  "tags": ["developer", "ai", "typescript"],
  "address": {
    "street": "123 Main St",
    "city": "London",
    "country": "UK"
  },
  "metadata": null
}`

export default function JsonSchemaGeneratorPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [options, setOptions] = useState<SchemaOptions>({
    required: true,
    additionalProperties: false,
    inferTypes: true,
    draft: 'draft-07',
  })
  const [showOptions, setShowOptions] = useState(false)

  function generate(value: string, opts: SchemaOptions) {
    if (!value.trim()) { setOutput(''); setError(''); setStatus('idle'); return }
    try {
      const parsed = JSON.parse(value)
      const schema = generateSchema(parsed, opts)
      setOutput(JSON.stringify(schema, null, 2))
      setError('')
      setStatus('success')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
      setStatus('error')
    }
  }

  const handleInput = (val: string) => {
    setInput(val)
    generate(val, options)
  }

  const handleOption = <K extends keyof SchemaOptions>(key: K, val: SchemaOptions[K]) => {
    const next = { ...options, [key]: val }
    setOptions(next)
    generate(input, next)
  }

  const loadExample = () => {
    setInput(EXAMPLE_JSON)
    generate(EXAMPLE_JSON, options)
  }

  function syntaxHighlight(json: string) {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'color: #93c5fd'
        if (/^"/.test(match)) cls = /:$/.test(match) ? 'color: #c4b5fd' : 'color: #6ee7b7'
        else if (/true|false/.test(match)) cls = 'color: #fdba74'
        else if (/null/.test(match)) cls = 'color: #f87171'
        return `<span style="${cls}">${match}</span>`
      }
    )
  }

  const btnBase = 'px-3 py-1.5 rounded-lg text-base font-medium transition-all'
  const btnGhost = { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }
  const btnHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  return (
    <ToolLayout
      toolId="json-schema-generator"
      title="JSON Schema Generator"
      description="Generate JSON Schema from example JSON instantly"
      category="dev"
      iconName="FileJson"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>JSON Schema Generator Online</strong> is a free browser-based tool that automatically generates a <strong>JSON Schema (Draft-07 or 2020-12)</strong> from any example JSON you provide. Simply paste a sample JSON object and get a complete, valid schema — including property types, required fields, nested objects, arrays, and common string formats like email, UUID, date, and URI.</p>
            <p className="text-lg leading-relaxed">This tool is especially useful for developers working with <strong>OpenAI function calling</strong>, <strong>structured outputs</strong>, API validation, form generation, or any workflow that requires a formal schema definition. Instead of writing schemas by hand, paste an example and let the generator do the work.</p>
            <p className="text-lg leading-relaxed">All processing runs entirely in your browser — your JSON is never uploaded to any server.</p>
          </>}
          useCases={[
            'Generate schemas for OpenAI function calling and structured output definitions.',
            'Create JSON Schema for API request/response validation.',
            'Build schemas from database record samples for documentation.',
            'Generate schemas to use with AJV, Zod, or other validation libraries.',
            'Quickly scaffold TypeScript interfaces from real JSON data.',
            'Validate JSON payloads in CI/CD pipelines using generated schemas.',
            'Create OpenAPI/Swagger component schemas from example payloads.',
            'Generate schemas for form builders that use JSON Schema (e.g. react-jsonschema-form).',
            'Produce schemas for LangChain, CrewAI, or other agent framework tool definitions.',
          ]}
          faqs={[
            { q: 'What is JSON Schema?', a: 'JSON Schema is a vocabulary for annotating and validating JSON documents. It describes the shape of JSON data — what fields exist, their types, which are required, and constraints like format or additional properties.' },
            { q: 'Which JSON Schema draft does this tool generate?', a: 'You can choose between Draft-07 (the most widely supported version, used by OpenAI function calling) and Draft 2020-12 (the latest standard). Both are available via the options panel.' },
            { q: 'Does it detect formats like email, UUID, or date automatically?', a: 'Yes. When "Infer types & formats" is enabled, string values are checked against common patterns and assigned format keywords like email, uuid, date, date-time, and uri.' },
            { q: 'What does "Additional properties: false" do?', a: 'Setting additionalProperties to false in a schema means that JSON objects must not contain any properties beyond those explicitly listed. This is required for OpenAI structured outputs and is good practice for strict API validation.' },
            { q: 'Can I use the generated schema with OpenAI function calling?', a: 'Yes. Use Draft-07, enable "Mark all fields required", and enable "No additional properties" — these settings match what OpenAI expects for function and tool definitions.' },
            { q: 'Does this handle nested objects and arrays?', a: 'Yes. The generator recursively processes nested objects and arrays of any depth, producing the correct nested schema structure.' },
            { q: 'Is my JSON sent to a server?', a: 'No. All schema generation runs locally in your browser using JavaScript. Nothing is uploaded.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Options bar */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <button
            onClick={() => setShowOptions((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold transition-all"
            style={{ color: 'rgba(255,255,255,0.75)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <span>Options</span>
            <ChevronDown
              size={15}
              style={{
                color: 'rgba(255,255,255,0.4)',
                transform: showOptions ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {showOptions && (
            <div
              className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Draft */}
              <div className="space-y-2">
                <span className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Schema Draft</span>
                <div className="flex gap-2">
                  {(['draft-07', '2020-12'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => handleOption('draft', d)}
                      className={`${btnBase} flex-1`}
                      style={options.draft === d
                        ? { background: 'var(--color-dev)', color: '#fff', border: 'none' }
                        : btnGhost}
                      onMouseEnter={(e) => { if (options.draft !== d) btnHover(e, true) }}
                      onMouseLeave={(e) => { if (options.draft !== d) btnHover(e, false) }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                {[
                  { key: 'required' as const, label: 'Mark all fields required' },
                  { key: 'additionalProperties' as const, label: 'Allow additional properties' },
                  { key: 'inferTypes' as const, label: 'Infer types & formats' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      className="relative w-9 h-5 rounded-full transition-all flex-shrink-0"
                      style={{ background: options[key] ? 'var(--color-dev)' : 'rgba(255,255,255,0.12)' }}
                      onClick={() => handleOption(key, !options[key])}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: options[key] ? '18px' : '2px' }}
                      />
                    </div>
                    <span className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Example JSON
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={loadExample}
                className={btnBase}
                style={btnGhost}
                onMouseEnter={(e) => btnHover(e, true)}
                onMouseLeave={(e) => btnHover(e, false)}
              >
                Load example
              </button>
              {input && (
                <button
                  onClick={() => { setInput(''); setOutput(''); setError(''); setStatus('idle') }}
                  className={btnBase}
                  style={btnGhost}
                  onMouseEnter={(e) => btnHover(e, true)}
                  onMouseLeave={(e) => btnHover(e, false)}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={'{\n  "name": "Alice",\n  "age": 30,\n  "email": "alice@example.com"\n}'}
            rows={12}
            className="w-full resize-y rounded-lg px-3 py-3 text-base outline-none transition-all duration-150 placeholder:text-white/50"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '2px solid var(--border-dev)',
              color: 'rgba(255,255,255,0.92)',
              fontFamily: 'var(--font-geist-mono), monospace',
              lineHeight: '1.65',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
          />
        </div>

        {/* Status */}
        {status !== 'idle' && (
          <div className="flex items-center gap-2">
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-base font-medium text-emerald-400">
                <CheckCircle size={15} /> Schema generated
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-base font-medium text-red-400">
                <XCircle size={15} /> {error}
              </div>
            )}
          </div>
        )}

        {/* Output */}
        {output && (
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                JSON Schema
                <span className="ml-2 text-sm font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {options.draft}
                </span>
              </label>
              <CopyButton text={output} />
            </div>
            <pre
              className="rounded-lg px-3 py-3 text-base overflow-auto leading-relaxed"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '2px solid var(--border-dev-idle)',
                fontFamily: 'var(--font-geist-mono), monospace',
                color: 'rgba(255,255,255,0.88)',
                maxHeight: '520px',
              }}
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(output) }}
            />
          </div>
        )}

        {/* Quick tips */}
        {!input && (
          <div
            className="rounded-xl px-5 py-5 space-y-3"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Tips</p>
            <ul className="space-y-1.5">
              {[
                'For OpenAI function calling: use Draft-07, required: on, additional properties: off',
                'String formats auto-detected: email, uuid, date, date-time, uri',
                'Arrays are typed from their first element',
                'null values produce { "type": "null" }',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.3)' }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
