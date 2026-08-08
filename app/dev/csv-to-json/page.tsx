'use client'

import { useState, useRef, useCallback } from 'react'
import { CheckCircle, XCircle, Upload, Download, RotateCcw, ArrowRightLeft } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Mode = 'csv-to-json' | 'json-to-csv'
type ArrayStyle = 'array-of-objects' | 'array-of-arrays'

function csvToJson(raw: string, arrayStyle: ArrayStyle): string {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length === 0) throw new Error('Input is empty')

  const parseRow = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += ch
      }
    }
    result.push(current)
    return result
  }

  const headers = parseRow(lines[0])
  const dataLines = lines.slice(1)

  if (arrayStyle === 'array-of-arrays') {
    const rows = dataLines.map((line) => parseRow(line).map((v) => {
      const n = Number(v)
      if (v === 'true') return true
      if (v === 'false') return false
      if (v !== '' && !isNaN(n)) return n
      return v
    }))
    return JSON.stringify([headers, ...rows], null, 2)
  }

  const result = dataLines.map((line) => {
    const values = parseRow(line)
    const obj: Record<string, string | number | boolean | null> = {}
    headers.forEach((h, i) => {
      const raw = values[i] ?? ''
      const n = Number(raw)
      if (raw === 'true') obj[h] = true
      else if (raw === 'false') obj[h] = false
      else if (raw === 'null') obj[h] = null
      else if (raw !== '' && !isNaN(n)) obj[h] = n
      else obj[h] = raw
    })
    return obj
  })
  return JSON.stringify(result, null, 2)
}

function jsonToCsv(raw: string): string {
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('JSON must be an array of objects or an array of arrays')
  if (parsed.length === 0) return ''

  const escapeCell = (val: unknown): string => {
    const str = val === null || val === undefined ? '' : String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  if (Array.isArray(parsed[0])) {
    return parsed.map((row: unknown[]) => row.map(escapeCell).join(',')).join('\n')
  }

  const headers = Array.from(new Set(parsed.flatMap((row: Record<string, unknown>) => Object.keys(row))))
  const headerRow = headers.map(escapeCell).join(',')
  const rows = parsed.map((row: Record<string, unknown>) =>
    headers.map((h) => escapeCell(row[h])).join(',')
  )
  return [headerRow, ...rows].join('\n')
}

export default function CsvToJsonPage() {
  const [mode, setMode] = useState<Mode>('csv-to-json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [arrayStyle, setArrayStyle] = useState<ArrayStyle>('array-of-objects')
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const convert = useCallback((value: string, currentMode: Mode, style: ArrayStyle) => {
    if (!value.trim()) { setOutput(''); setError(''); setStatus('idle'); return }
    try {
      const result = currentMode === 'csv-to-json' ? csvToJson(value, style) : jsonToCsv(value)
      setOutput(result)
      setError('')
      setStatus('success')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
      setStatus('error')
    }
  }, [])

  const handleInput = (val: string) => {
    setInput(val)
    convert(val, mode, arrayStyle)
  }

  const handleMode = (m: Mode) => {
    setMode(m)
    setInput('')
    setOutput('')
    setError('')
    setStatus('idle')
  }

  const handleStyleChange = (s: ArrayStyle) => {
    setArrayStyle(s)
    convert(input, mode, s)
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setInput(text)
      convert(text, mode, arrayStyle)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const downloadOutput = () => {
    const ext = mode === 'csv-to-json' ? 'json' : 'csv'
    const mime = mode === 'csv-to-json' ? 'application/json' : 'text/csv'
    const blob = new Blob([output], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
    setStatus('idle')
  }

  const inputLabel = mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'
  const outputLabel = mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'
  const placeholder = mode === 'csv-to-json'
    ? 'name,age,city\nAlice,30,London\nBob,25,Paris'
    : '[{"name":"Alice","age":30},{"name":"Bob","age":25}]'

  return (
    <ToolLayout
      toolId="csv-to-json"
      title="CSV to JSON Converter"
      description="Convert CSV to JSON or JSON to CSV instantly —  no server, no signup"
      category="dev"
      iconName="Table"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>CSV to JSON Converter Online</strong> is a free, browser-based tool that converts CSV (Comma-Separated Values) data to JSON, and JSON back to CSV, entirely in your browser. Whether you are working with data exports from spreadsheets, databases, or APIs, this tool gives you clean, well-formatted output in seconds.</p>
            <p className="text-base leading-relaxed">Paste your CSV directly, drag and drop a file, or upload a <code>.csv</code> or <code>.json</code> file. The converter automatically detects numbers, booleans, and null values so your JSON output is typed correctly — not just strings. You can choose between <strong>array of objects</strong> (one object per row) or <strong>array of arrays</strong> (matrix-style) output format.</p>
            <p className="text-base leading-relaxed">All processing happens locally in your browser using JavaScript. Your data is never sent to any server, making this tool safe for sensitive or proprietary datasets.</p>
          </>}
          useCases={[
            'Convert a CSV export from Excel, Google Sheets, or Numbers to JSON for use in a web app.',
            'Transform database query results exported as CSV into JSON for API payloads.',
            'Convert JSON API responses back to CSV for analysis in a spreadsheet.',
            'Prepare test fixture data by converting a CSV dataset to a JSON array.',
            'Build configuration or seed data files from a CSV source of truth.',
            'Transform survey or form export data from CSV to structured JSON.',
            'Convert CSV logs to JSON for ingestion into log analysis tools.',
            'Quickly move data between tools that expect different formats.',
            'Generate array-of-arrays (matrix) JSON from tabular CSV data.',
            'Preview and validate CSV structure before writing an import script.',
          ]}
          faqs={[
            { q: 'Does this tool handle quoted fields with commas?', a: 'Yes. The parser fully supports RFC 4180 CSV: fields wrapped in double quotes can contain commas, newlines, and escaped double quotes (two consecutive double quotes).' },
            { q: 'Are numbers and booleans typed correctly in the JSON output?', a: 'Yes. Values that look like numbers, booleans (true/false), or null are automatically converted to the correct JSON type. Strings remain as strings.' },
            { q: 'What is the difference between array of objects and array of arrays?', a: 'Array of objects produces one JSON object per row using the CSV headers as keys — the most common format for data exchange. Array of arrays produces a 2D array where the first row contains headers and subsequent rows contain values — useful for matrix-style processing.' },
            { q: 'Can I convert JSON back to CSV?', a: 'Yes. Use the JSON → CSV mode. The tool accepts an array of objects or an array of arrays and produces a properly formatted CSV with headers.' },
            { q: 'Can I upload a file instead of pasting?', a: 'Yes. Click the upload button or drag and drop a .csv or .json file onto the input area. The file is read locally — nothing is uploaded to a server.' },
            { q: 'Is my data sent to a server?', a: 'No. All conversion happens inside your browser using JavaScript. Your data never leaves your device.' },
            { q: 'Is there a file size limit?', a: 'There is no built-in limit. The maximum size depends on your browser\'s available memory. Most CSV files up to several megabytes convert instantly.' },
            { q: 'Does the tool support different delimiters like semicolons or tabs?', a: 'Currently the tool supports comma-delimited CSV. Tab-separated (TSV) and semicolon-delimited support may be added in a future update.' },
          ]}
        />
      }
    >
      <div className="space-y-5">
        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMode('csv-to-json')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={mode === 'csv-to-json'
              ? { background: 'var(--color-dev)', color: '#fff' }
              : { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }}
            onMouseEnter={(e) => { if (mode !== 'csv-to-json') e.currentTarget.style.background = 'rgba(255,255,255,0.13)' }}
            onMouseLeave={(e) => { if (mode !== 'csv-to-json') e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
          >
            CSV → JSON
          </button>
          <button
            onClick={() => handleMode('json-to-csv')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={mode === 'json-to-csv'
              ? { background: 'var(--color-dev)', color: '#fff' }
              : { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }}
            onMouseEnter={(e) => { if (mode !== 'json-to-csv') e.currentTarget.style.background = 'rgba(255,255,255,0.13)' }}
            onMouseLeave={(e) => { if (mode !== 'json-to-csv') e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
          >
            JSON → CSV
          </button>

          {mode === 'csv-to-json' && (
            <div className="ml-auto flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: '2px solid var(--border-dev)' }}>
              <button
                onClick={() => handleStyleChange('array-of-objects')}
                className="px-3 py-1.5 text-sm font-medium transition-all"
                style={arrayStyle === 'array-of-objects'
                  ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.95)' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={(e) => { if (arrayStyle !== 'array-of-objects') { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
                onMouseLeave={(e) => { if (arrayStyle !== 'array-of-objects') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
              >
                Objects
              </button>
              <button
                onClick={() => handleStyleChange('array-of-arrays')}
                className="px-3 py-1.5 text-sm font-medium transition-all"
                style={arrayStyle === 'array-of-arrays'
                  ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.95)' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={(e) => { if (arrayStyle !== 'array-of-arrays') { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
                onMouseLeave={(e) => { if (arrayStyle !== 'array-of-arrays') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
              >
                Arrays
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="rounded-xl p-4 transition-all"
          style={{
            background: 'var(--surface)',
            border: isDragging ? '1px solid var(--color-dev)' : '1px solid rgba(255,255,255,0.1)',
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {inputLabel}
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.json,.txt"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
              >
                <Upload size={13} /> Upload
              </button>
              {input && (
                <button
                  onClick={clear}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  <RotateCcw size={13} /> Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={placeholder}
            rows={10}
            className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none transition-all duration-150 placeholder:text-white/50"
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
          {isDragging && (
            <div className="mt-2 text-sm text-center" style={{ color: 'var(--color-dev)' }}>
              Drop file to load
            </div>
          )}
        </div>

        {/* Status bar */}
        {status !== 'idle' && (
          <div className="flex items-center gap-2">
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                <CheckCircle size={15} />
                Converted successfully
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-red-400">
                <XCircle size={15} />
                {error}
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
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {outputLabel}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadOutput}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  <Download size={13} />
                  Download
                </button>
                <CopyButton text={output} />
              </div>
            </div>
            <pre
              className="rounded-lg px-3 py-3 text-sm overflow-auto leading-relaxed"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '2px solid var(--border-dev-idle)',
                fontFamily: 'var(--font-geist-mono), monospace',
                color: 'rgba(255,255,255,0.88)',
                maxHeight: '480px',
              }}
            >
              {output}
            </pre>
          </div>
        )}

        {/* Empty state hint */}
        {!input && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-3 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <ArrowRightLeft size={28} style={{ color: 'var(--color-dev)', opacity: 0.5 }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Paste {mode === 'csv-to-json' ? 'CSV' : 'JSON'} above or drag and drop a file to convert
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
