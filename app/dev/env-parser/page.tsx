'use client'

import { useState, useMemo, useRef } from 'react'
import { Upload, Eye, EyeOff } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

const EXAMPLE_ENV = `# Application
APP_NAME=MyApp
APP_ENV=production
APP_PORT=3000
DEBUG=false

# Database
DATABASE_URL=postgres://user:password@localhost:5432/mydb
DATABASE_POOL_SIZE=10

# Auth
JWT_SECRET=super-secret-key-do-not-share
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=another-secret

# External APIs
STRIPE_SECRET_KEY=sk_live_abcdefghijklmnopqrstuvwxyz
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_API_KEY=SG.xxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Feature flags
ENABLE_ANALYTICS=true
ENABLE_MAINTENANCE_MODE=false

# Multiline value
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA1234567890abcdef
-----END RSA PRIVATE KEY-----"

# Empty value
OPTIONAL_VAR=
`

type EnvEntry = {
  key: string
  value: string
  comment: string
  lineNumber: number
  isComment: boolean
  isEmpty: boolean
}

const SECRET_PATTERNS = [
  /secret/i, /password/i, /passwd/i, /token/i, /key/i,
  /api[_-]?key/i, /private/i, /auth/i, /credential/i, /jwt/i,
]

function isSecret(key: string): boolean {
  return SECRET_PATTERNS.some((p) => p.test(key))
}

function parseEnv(raw: string): EnvEntry[] {
  const lines = raw.split('\n')
  const entries: EnvEntry[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const lineNumber = i + 1

    // Blank line
    if (line.trim() === '') {
      i++
      continue
    }

    // Comment-only line
    if (line.trim().startsWith('#')) {
      entries.push({ key: '', value: '', comment: line.trim().slice(1).trim(), lineNumber, isComment: true, isEmpty: false })
      i++
      continue
    }

    // Key=value (possibly with inline comment)
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) { i++; continue }

    const key = line.slice(0, eqIdx).trim()
    let rawVal = line.slice(eqIdx + 1)

    // Handle multiline quoted values
    if ((rawVal.startsWith('"') && !rawVal.slice(1).includes('"')) ||
        (rawVal.startsWith("'") && !rawVal.slice(1).includes("'"))) {
      const quote = rawVal[0]
      let multiline = rawVal.slice(1)
      i++
      while (i < lines.length) {
        const nextLine = lines[i]
        if (nextLine.includes(quote)) {
          multiline += '\n' + nextLine.slice(0, nextLine.indexOf(quote))
          i++
          break
        }
        multiline += '\n' + nextLine
        i++
      }
      entries.push({ key, value: multiline.trim(), comment: '', lineNumber, isComment: false, isEmpty: multiline.trim() === '' })
      continue
    }

    // Strip inline comment
    let comment = ''
    const inlineComment = rawVal.match(/\s+#\s+(.*)$/)
    if (inlineComment) {
      comment = inlineComment[1]
      rawVal = rawVal.slice(0, inlineComment.index)
    }

    // Strip surrounding quotes
    let value = rawVal.trim()
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    entries.push({ key, value, comment, lineNumber, isComment: false, isEmpty: value === '' })
    i++
  }

  return entries
}

function toJson(entries: EnvEntry[]): string {
  const obj: Record<string, string> = {}
  entries.filter((e) => !e.isComment && e.key).forEach((e) => { obj[e.key] = e.value })
  return JSON.stringify(obj, null, 2)
}

function toExportShell(entries: EnvEntry[]): string {
  return entries
    .filter((e) => !e.isComment && e.key)
    .map((e) => `export ${e.key}="${e.value.replace(/"/g, '\\"')}"`)
    .join('\n')
}

function toDockerEnv(entries: EnvEntry[]): string {
  return entries
    .filter((e) => !e.isComment && e.key)
    .map((e) => `--env ${e.key}="${e.value.replace(/"/g, '\\"')}"`)
    .join(' \\\n  ')
}

type ExportFormat = 'table' | 'json' | 'shell' | 'docker'

export default function EnvParserPage() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<ExportFormat>('table')
  const [maskSecrets, setMaskSecrets] = useState(true)
  const [search, setSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const entries = useMemo(() => parseEnv(input), [input])
  const dataEntries = useMemo(() => entries.filter((e) => !e.isComment && e.key), [entries])

  const filtered = useMemo(() => {
    if (!search.trim()) return dataEntries
    const q = search.toLowerCase()
    return dataEntries.filter((e) => e.key.toLowerCase().includes(q) || e.value.toLowerCase().includes(q))
  }, [dataEntries, search])

  const secretCount = dataEntries.filter((e) => isSecret(e.key)).length

  const jsonOutput  = useMemo(() => toJson(entries), [entries])
  const shellOutput = useMemo(() => toExportShell(entries), [entries])
  const dockerOutput = useMemo(() => toDockerEnv(entries), [entries])

  const copyTarget = format === 'json' ? jsonOutput : format === 'shell' ? shellOutput : format === 'docker' ? dockerOutput : jsonOutput

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setInput(e.target?.result as string)
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const maskValue = (key: string, value: string) =>
    maskSecrets && isSecret(key) && value ? '•'.repeat(Math.min(value.length, 16)) : value

  const btnGhost = { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }
  const onHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  return (
    <ToolLayout
      toolId="env-parser"
      title="ENV File Parser"
      description="Parse .env files into a clean table, JSON, or export format"
      category="dev"
      iconName="FileCode"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>ENV File Parser Online</strong> is a free browser-based tool that parses <code>.env</code> files into a clean, readable table and lets you export the variables as JSON, shell export statements, or Docker <code>--env</code> flags. It handles quoted values, inline comments, multiline values, empty variables, and automatically detects secrets by key name — masking them by default so they are safe to share on screen.</p>
            <p className="text-lg leading-relaxed">Paste your <code>.env</code> content directly or drag-and-drop a file. All parsing happens in your browser — your environment variables are never sent to any server. This is especially important for <code>.env</code> files that contain API keys, database credentials, and JWT secrets.</p>
          </>}
          useCases={[
            'Quickly inspect all variables in a .env file as a clean table.',
            'Convert a .env file to JSON for use in configuration scripts.',
            'Generate shell export statements to source variables in a terminal session.',
            'Build Docker --env flags from a .env file for container runs.',
            'Audit a .env file for missing or empty required variables.',
            'Search across all keys and values to find a specific variable quickly.',
            'Share a .env file review with teammates without exposing secret values.',
            'Compare .env variables across environments (dev, staging, production).',
          ]}
          faqs={[
            { q: 'Is my .env file sent to a server?', a: 'No. All parsing happens locally in your browser using JavaScript. Your environment variables, API keys, and secrets never leave your device.' },
            { q: 'How does secret masking work?', a: 'Keys that contain words like "secret", "password", "token", "key", "api_key", "private", or "auth" are automatically identified as sensitive and their values are masked with dots in the table view. You can toggle masking on or off at any time.' },
            { q: 'Does it handle quoted values?', a: 'Yes. Both single and double quoted values are supported. Quotes are stripped from the parsed value. Multiline values wrapped in double quotes are also handled.' },
            { q: 'Does it support comments?', a: 'Yes. Lines starting with # are parsed as comments and shown as section headers in the table. Inline comments (e.g. KEY=value # comment) are also parsed and shown.' },
            { q: 'Can I upload a .env file directly?', a: 'Yes. Click Upload or drag and drop a .env file onto the input area. The file is read locally.' },
            { q: 'What export formats are available?', a: 'JSON object, shell export statements (export KEY="value"), and Docker --env flags for use with docker run commands.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Input */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>.env Content</label>
            <div className="flex items-center gap-2">
              <input
                ref={fileRef} type="file" accept=".env,.txt" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                style={btnGhost}
                onMouseEnter={(e) => onHover(e, true)}
                onMouseLeave={(e) => onHover(e, false)}
              >
                <Upload size={13} /> Upload
              </button>
              <button
                onClick={() => setInput(EXAMPLE_ENV)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                style={btnGhost}
                onMouseEnter={(e) => onHover(e, true)}
                onMouseLeave={(e) => onHover(e, false)}
              >
                Example
              </button>
              {input && (
                <button
                  onClick={() => { setInput(''); setSearch('') }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                  style={btnGhost}
                  onMouseEnter={(e) => onHover(e, true)}
                  onMouseLeave={(e) => onHover(e, false)}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'# Paste your .env file here or drag-and-drop a file\nAPP_NAME=MyApp\nDATABASE_URL=postgres://...\nAPI_KEY=sk-...'}
            rows={9}
            className="w-full resize-y rounded-lg px-3 py-3 text-base outline-none transition-all placeholder:text-white/50"
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

        {dataEntries.length > 0 && (
          <>
            {/* Stats + controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Stats pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: `${dataEntries.length} variables` },
                  { label: `${secretCount} secrets`, color: secretCount > 0 ? '#fb923c' : undefined },
                  { label: `${dataEntries.filter((e) => e.isEmpty).length} empty` },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="px-2.5 py-1 rounded-lg text-sm font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '2px solid var(--border-dev-idle)',
                      color: color ?? 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Secret mask toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none ml-auto">
                <div
                  className="relative w-9 h-5 rounded-full transition-all flex-shrink-0"
                  style={{ background: maskSecrets ? 'var(--color-dev)' : 'rgba(255,255,255,0.15)' }}
                  onClick={() => setMaskSecrets((v) => !v)}
                >
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: maskSecrets ? '18px' : '2px' }} />
                </div>
                {maskSecrets
                  ? <EyeOff size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  : <Eye size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />}
                <span className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>Mask secrets</span>
              </label>
            </div>

            {/* Format tabs + search + copy */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: '2px solid var(--border-dev)' }}>
                {(['table', 'json', 'shell', 'docker'] as ExportFormat[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className="px-3 py-2 text-base font-medium transition-all capitalize"
                    style={format === f
                      ? { background: 'var(--color-dev)', color: '#fff' }
                      : { background: 'transparent', color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={(e) => { if (format !== f) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' } }}
                    onMouseLeave={(e) => { if (format !== f) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {format === 'table' && (
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search keys or values…"
                  className="flex-1 min-w-36 rounded-lg px-3 py-2 text-base outline-none transition-all placeholder:text-white/50"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '2px solid var(--border-dev-idle)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
                />
              )}

              {format !== 'table' && <CopyButton text={copyTarget} />}
            </div>

            {/* Table view */}
            {format === 'table' && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
              >
                {/* Header */}
                <div
                  className="grid px-4 py-2.5 text-sm font-medium uppercase tracking-widest"
                  style={{
                    gridTemplateColumns: '40px 1fr 1fr 80px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span>#</span>
                  <span>Key</span>
                  <span>Value</span>
                  <span className="text-right">Copy</span>
                </div>

                {/* Rows */}
                {filtered.map((entry, i) => {
                  const secret = isSecret(entry.key)
                  const displayVal = maskValue(entry.key, entry.value)
                  return (
                    <div
                      key={`${entry.key}-${entry.lineNumber}`}
                      className="grid px-4 py-2.5 items-center transition-all"
                      style={{
                        gridTemplateColumns: '40px 1fr 1fr 80px',
                        borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>{entry.lineNumber}</span>
                      <div className="flex items-center gap-2 min-w-0 pr-3">
                        <span className="text-base font-mono font-medium truncate" style={{ color: secret ? '#fdba74' : 'var(--color-dev)' }}>
                          {entry.key}
                        </span>
                        {secret && (
                          <span className="text-sm px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(251,186,74,0.1)', color: '#fdba74', border: '1px solid rgba(251,186,74,0.2)' }}>
                            secret
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 pr-3">
                        {entry.isEmpty
                          ? <span className="text-sm italic" style={{ color: 'rgba(255,255,255,0.25)' }}>empty</span>
                          : <span className="text-base font-mono truncate block" style={{ color: secret && maskSecrets ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)' }}>
                              {displayVal}
                            </span>
                        }
                        {entry.comment && (
                          <span className="text-sm italic block" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            # {entry.comment}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-end">
                        {!entry.isEmpty && <CopyButton text={entry.value} />}
                      </div>
                    </div>
                  )
                })}

                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-base" style={{ color: 'rgba(255,255,255,0.3)' }}>No results</div>
                )}
              </div>
            )}

            {/* Code output views */}
            {format !== 'table' && (
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
              >
                <pre
                  className="text-base overflow-auto leading-relaxed rounded-lg px-3 py-3"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '2px solid var(--border-dev-idle)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    color: 'rgba(255,255,255,0.82)',
                    maxHeight: '480px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {copyTarget}
                </pre>
              </div>
            )}
          </>
        )}

        {!input && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Paste your .env content above or drag-and-drop a file
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Secrets are detected and masked automatically — your data never leaves your browser
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
