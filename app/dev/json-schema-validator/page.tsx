'use client'

import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

const EXAMPLE_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email", "age"],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "role": {
      "type": "string",
      "enum": ["admin", "user", "guest"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    }
  }
}`

const EXAMPLE_VALID = `{
  "id": "a3f2c1d4-e5b6-7890-abcd-ef1234567890",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 30,
  "role": "admin",
  "tags": ["developer", "typescript"]
}`

const EXAMPLE_INVALID = `{
  "id": "not-a-uuid",
  "name": "",
  "email": "not-an-email",
  "age": -5,
  "role": "superuser",
  "tags": ["dev", "dev"],
  "extraField": "not allowed"
}`

type ValidationError = {
  path: string
  message: string
  keyword: string
}

type ValidationResult =
  | { status: 'valid' }
  | { status: 'invalid'; errors: ValidationError[] }
  | { status: 'schema-error'; message: string }
  | { status: 'json-error'; target: 'schema' | 'data'; message: string }

async function validate(schemaText: string, dataText: string): Promise<ValidationResult> {
  let schema: unknown
  let data: unknown

  try {
    schema = JSON.parse(schemaText)
  } catch (e) {
    return { status: 'json-error', target: 'schema', message: (e as Error).message }
  }

  try {
    data = JSON.parse(dataText)
  } catch (e) {
    return { status: 'json-error', target: 'data', message: (e as Error).message }
  }

  try {
    const Ajv = (await import('ajv')).default
    const addFormats = (await import('ajv-formats')).default
    const ajv = new Ajv({ allErrors: true, strict: false })
    addFormats(ajv)

    let validateFn: ReturnType<typeof ajv.compile>
    try {
      validateFn = ajv.compile(schema as object)
    } catch (e) {
      return { status: 'schema-error', message: (e as Error).message }
    }

    const valid = validateFn(data)
    if (valid) return { status: 'valid' }

    const errors: ValidationError[] = (validateFn.errors ?? []).map((err) => ({
      path: err.instancePath || '(root)',
      message: err.message ?? 'Unknown error',
      keyword: err.keyword,
    }))

    return { status: 'invalid', errors }
  } catch (e) {
    return { status: 'schema-error', message: (e as Error).message }
  }
}

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = '#93c5fd'
      if (/^"/.test(match)) color = /:$/.test(match) ? '#c4b5fd' : '#6ee7b7'
      else if (/true|false/.test(match)) color = '#fdba74'
      else if (/null/.test(match)) color = '#f87171'
      return `<span style="color:${color}">${match}</span>`
    }
  )
}

export default function JsonSchemaValidatorPage() {
  const [schema, setSchema] = useState('')
  const [data, setData] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const run = useCallback(async (s: string, d: string) => {
    if (!s.trim() || !d.trim()) { setResult(null); return }
    setLoading(true)
    const r = await validate(s, d)
    setResult(r)
    setLoading(false)
  }, [])

  const handleSchema = (v: string) => { setSchema(v); run(v, data) }
  const handleData   = (v: string) => { setData(v);   run(schema, v) }

  const loadExample = (valid: boolean) => {
    setSchema(EXAMPLE_SCHEMA)
    const d = valid ? EXAMPLE_VALID : EXAMPLE_INVALID
    setData(d)
    run(EXAMPLE_SCHEMA, d)
  }

  const clear = () => { setSchema(''); setData(''); setResult(null) }

  const textareaStyle = (): React.CSSProperties => ({
    width: '100%',
    minHeight: '260px',
    resize: 'vertical',
    background: 'rgba(0,0,0,0.35)',
    border: '2px solid var(--border-dev)',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.92)',
    fontFamily: 'var(--font-geist-mono), monospace',
    lineHeight: '1.65',
    outline: 'none',
    transition: 'border-color 0.15s',
  })

  const btnGhost = { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }
  const onHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  return (
    <ToolLayout
      toolId="json-schema-validator"
      title="JSON Schema Validator"
      description="Validate JSON against a JSON Schema with detailed error messages"
      category="dev"
      iconName="ShieldCheck"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>JSON Schema Validator Online</strong> is a free browser-based tool that validates any JSON document against a JSON Schema and shows detailed, human-readable error messages. It uses <strong>AJV (Another JSON Validator)</strong> — the fastest and most widely used JSON Schema validator — with full support for Draft-07 and common string formats like email, uuid, date-time, and uri.</p>
            <p className="text-base leading-relaxed">Paste your JSON Schema on the left and your JSON data on the right. Results update automatically. Each validation error shows the exact path in your JSON that failed, the validation keyword that triggered the error, and a clear explanation of what went wrong — making it easy to debug schema issues in API payloads, AI structured outputs, configuration files, and form data.</p>
            <p className="text-base leading-relaxed">All validation runs locally in your browser using AJV compiled to WebAssembly-friendly JavaScript. Your data is never sent to any server.</p>
          </>}
          useCases={[
            'Validate OpenAI structured output responses against your function calling schema.',
            'Test JSON Schema definitions before using them in your codebase.',
            'Debug API request/response payloads that fail schema validation.',
            'Validate configuration files against a defined schema.',
            'Test AJV-compatible schemas for use with Express, Fastify, or NestJS validators.',
            'Verify form submissions match expected data shapes.',
            'Check that database seed data matches your schema before importing.',
            'Validate LangChain or CrewAI tool output schemas.',
            'Catch schema errors (wrong types, missing required fields, extra properties) quickly.',
            'Use alongside the JSON Schema Generator to test generated schemas.',
          ]}
          faqs={[
            { q: 'What JSON Schema versions are supported?', a: 'This tool uses AJV which fully supports Draft-07 (the most widely used version, required by OpenAI function calling). It also handles most Draft 2019-09 and Draft 2020-12 keywords via AJV\'s compatibility layer.' },
            { q: 'What string formats are supported?', a: 'AJV with ajv-formats supports: date, date-time, time, duration, email, idn-email, hostname, idn-hostname, ipv4, ipv6, uri, uri-reference, iri, iri-reference, uri-template, json-pointer, relative-json-pointer, regex, and uuid.' },
            { q: 'What does "allErrors" mode mean?', a: 'By default, some validators stop at the first error. This tool uses allErrors: true so every validation error in your JSON is reported at once — not just the first one. This makes debugging much faster.' },
            { q: 'What does the error path mean?', a: 'The error path shows exactly where in your JSON the validation failed. For example, /user/email means the email field inside the user object failed. (root) means the top-level value itself failed.' },
            { q: 'Is my data sent to a server?', a: 'No. AJV runs entirely in your browser via JavaScript. Nothing is uploaded or stored.' },
            { q: 'Can I use this with OpenAI function calling schemas?', a: 'Yes. OpenAI function calling schemas are Draft-07 JSON Schemas. Paste the schema from your tool definition and validate sample AI outputs against it.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadExample(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={btnGhost}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onHover(e, false)}
          >
            <CheckCircle size={13} style={{ color: '#34d399' }} /> Load valid example
          </button>
          <button
            onClick={() => loadExample(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={btnGhost}
            onMouseEnter={(e) => onHover(e, true)}
            onMouseLeave={(e) => onHover(e, false)}
          >
            <XCircle size={13} style={{ color: '#f87171' }} /> Load invalid example
          </button>
          {(schema || data) && (
            <button
              onClick={clear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={btnGhost}
              onMouseEnter={(e) => onHover(e, true)}
              onMouseLeave={(e) => onHover(e, false)}
            >
              Clear
            </button>
          )}
        </div>

        {/* Editor grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Schema panel */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>JSON Schema</label>
              {schema && <CopyButton text={schema} />}
            </div>
            <textarea
              value={schema}
              onChange={(e) => handleSchema(e.target.value)}
              placeholder={'{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": { ... }\n}'}
              style={textareaStyle()}
              spellCheck={false}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
            />
            {result?.status === 'json-error' && result.target === 'schema' && (
              <div
                className="rounded-lg px-3 py-2.5 text-xs font-mono"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }}
              >
                Schema JSON error: {result.message}
              </div>
            )}
            {result?.status === 'schema-error' && (
              <div
                className="rounded-lg px-3 py-2.5 text-xs font-mono"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }}
              >
                Invalid schema: {result.message}
              </div>
            )}
          </div>

          {/* Data panel */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>JSON Data</label>
              {data && <CopyButton text={data} />}
            </div>
            <textarea
              value={data}
              onChange={(e) => handleData(e.target.value)}
              placeholder={'{\n  "name": "Alice",\n  "age": 30\n}'}
              style={textareaStyle()}
              spellCheck={false}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
            />
            {result?.status === 'json-error' && result.target === 'data' && (
              <div
                className="rounded-lg px-3 py-2.5 text-xs font-mono"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5' }}
              >
                Data JSON error: {result.message}
              </div>
            )}
          </div>
        </div>

        {/* Result banner */}
        {loading && (
          <div
            className="rounded-xl px-5 py-4 text-sm"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)', color: 'rgba(255,255,255,0.5)' }}
          >
            Validating…
          </div>
        )}

        {!loading && result?.status === 'valid' && (
          <div
            className="rounded-xl px-5 py-4 flex items-center gap-3"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)' }}
          >
            <CheckCircle size={20} style={{ color: '#34d399', flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold text-emerald-400">Valid</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                The JSON data is valid against the provided schema.
              </p>
            </div>
          </div>
        )}

        {!loading && result?.status === 'invalid' && (
          <div className="space-y-3">
            {/* Error summary */}
            <div
              className="rounded-xl px-5 py-4 flex items-center gap-3"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)' }}
            >
              <XCircle size={20} style={{ color: '#f87171', flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold text-red-400">
                  Invalid — {result.errors.length} error{result.errors.length !== 1 ? 's' : ''} found
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Fix the issues below and re-validate.
                </p>
              </div>
            </div>

            {/* Error list */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
            >
              {/* Header */}
              <div
                className="grid gap-3 px-4 py-2.5 text-xs font-medium uppercase tracking-widest"
                style={{
                  gridTemplateColumns: '200px 1fr 100px',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                <span>Path</span>
                <span>Error</span>
                <span>Keyword</span>
              </div>

              {result.errors.map((err, i) => (
                <div
                  key={i}
                  className="grid gap-3 px-4 py-3 items-start transition-all"
                  style={{
                    gridTemplateColumns: '200px 1fr 100px',
                    borderBottom: i < result.errors.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <code
                    className="text-xs font-mono break-all"
                    style={{ color: '#f87171' }}
                  >
                    {err.path}
                  </code>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {err.message}
                  </span>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded w-fit"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {err.keyword}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <AlertCircle size={24} style={{ color: 'var(--color-dev)', opacity: 0.4 }} />
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Paste a JSON Schema and JSON data to validate
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Or load one of the examples above to see it in action
            </p>
          </div>
        )}

        {/* Syntax-highlighted data preview */}
        {data && result?.status === 'valid' && (
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Validated Data</label>
              <CopyButton text={data} />
            </div>
            <pre
              className="rounded-lg px-3 py-3 text-xs overflow-auto leading-relaxed"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontFamily: 'var(--font-geist-mono), monospace',
                color: 'rgba(255,255,255,0.85)',
                maxHeight: '300px',
              }}
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
