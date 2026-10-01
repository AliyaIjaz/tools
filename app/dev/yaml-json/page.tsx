'use client'

import { useState, useRef } from 'react'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'
import { CheckCircle, XCircle, Upload, Download, RotateCcw, ArrowLeftRight } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Mode = 'yaml-to-json' | 'json-to-yaml'

const EXAMPLE_YAML = `# Kubernetes-style deployment config
name: my-service
version: "1.0.0"
replicas: 3
enabled: true

environment:
  name: production
  region: us-east-1
  debug: false

resources:
  cpu: 500m
  memory: 512Mi
  limits:
    cpu: "1"
    memory: 1Gi

ports:
  - name: http
    containerPort: 8080
    protocol: TCP
  - name: metrics
    containerPort: 9090
    protocol: TCP

envVars:
  - name: DATABASE_URL
    value: postgres://db:5432/app
  - name: API_KEY
    valueFrom: secret`

const EXAMPLE_JSON = `{
  "name": "my-service",
  "version": "1.0.0",
  "replicas": 3,
  "enabled": true,
  "environment": {
    "name": "production",
    "region": "us-east-1",
    "debug": false
  },
  "resources": {
    "cpu": "500m",
    "memory": "512Mi",
    "limits": {
      "cpu": "1",
      "memory": "1Gi"
    }
  },
  "ports": [
    { "name": "http", "containerPort": 8080, "protocol": "TCP" },
    { "name": "metrics", "containerPort": 9090, "protocol": "TCP" }
  ]
}`

function convert(value: string, mode: Mode): string {
  if (mode === 'yaml-to-json') {
    const parsed = yamlLoad(value)
    return JSON.stringify(parsed, null, 2)
  } else {
    const parsed = JSON.parse(value)
    return yamlDump(parsed, { indent: 2, lineWidth: -1 })
  }
}

function jsonSyntaxHighlight(json: string) {
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

function yamlSyntaxHighlight(yaml: string) {
  return yaml
    .split('\n')
    .map((line) => {
      // Comments
      if (/^\s*#/.test(line)) return `<span style="color:rgba(255,255,255,0.35);font-style:italic">${line}</span>`
      // Key: value
      return line.replace(/^(\s*)([\w-]+)(\s*:)(.*)$/, (_, indent, key, colon, rest) => {
        const coloredRest = (rest as string).replace(
          /\b(true|false|null)\b/g, (m: string) => `<span style="color:#fdba74">${m}</span>`
        ).replace(
          /\b(\d+(?:\.\d+)?)\b/g, (m: string) => `<span style="color:#93c5fd">${m}</span>`
        ).replace(
          /"([^"]*)"/g, (m: string) => `<span style="color:#6ee7b7">${m}</span>`
        )
        return `${indent}<span style="color:#c4b5fd">${key}</span><span style="color:rgba(255,255,255,0.5)">${colon}</span>${coloredRest}`
      })
    })
    .join('\n')
}

export default function YamlJsonPage() {
  const [mode, setMode] = useState<Mode>('yaml-to-json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function run(value: string, currentMode: Mode) {
    if (!value.trim()) { setOutput(''); setError(''); setStatus('idle'); return }
    try {
      const result = convert(value, currentMode)
      setOutput(result)
      setError('')
      setStatus('success')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
      setStatus('error')
    }
  }

  const handleInput = (val: string) => { setInput(val); run(val, mode) }

  const handleMode = (m: Mode) => {
    setMode(m)
    setInput('')
    setOutput('')
    setError('')
    setStatus('idle')
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setInput(text)
      run(text, mode)
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const loadExample = () => {
    const ex = mode === 'yaml-to-json' ? EXAMPLE_YAML : EXAMPLE_JSON
    setInput(ex)
    run(ex, mode)
  }

  const clear = () => { setInput(''); setOutput(''); setError(''); setStatus('idle') }

  const downloadOutput = () => {
    const ext = mode === 'yaml-to-json' ? 'json' : 'yaml'
    const mime = mode === 'yaml-to-json' ? 'application/json' : 'text/yaml'
    const blob = new Blob([output], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const outputHighlighted = output
    ? mode === 'yaml-to-json'
      ? jsonSyntaxHighlight(output)
      : yamlSyntaxHighlight(output)
    : ''

  const btnGhost = {
    background: 'rgba(255,255,255,0.07)',
    border: '2px solid var(--border-dev)',
    color: 'rgba(255,255,255,0.65)',
  }
  const onHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  return (
    <ToolLayout
      toolId="yaml-json"
      title="YAML ↔ JSON Converter"
      description="Convert YAML to JSON and JSON to YAML instantly — no server, no signup"
      category="dev"
      iconName="ArrowLeftRight"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>YAML to JSON Converter Online</strong> is a free, browser-based tool for converting YAML to JSON and JSON to YAML instantly. Whether you are working with Kubernetes configs, Docker Compose files, GitHub Actions workflows, LangChain agents, or any other YAML-based configuration, this tool converts between formats with full fidelity — preserving types, nested structures, arrays, and booleans.</p>
            <p className="text-lg leading-relaxed">Paste your YAML or JSON directly, drag and drop a file, or upload a <code>.yaml</code>, <code>.yml</code>, or <code>.json</code> file. Output is syntax-highlighted for easy reading and can be copied or downloaded in one click. All conversion runs entirely in your browser using the <strong>js-yaml</strong> library — your data is never sent to any server.</p>
          </>}
          useCases={[
            'Convert Kubernetes YAML manifests to JSON for use with kubectl or API clients.',
            'Transform Docker Compose files to JSON for programmatic processing.',
            'Convert GitHub Actions workflow YAML to JSON for inspection or editing.',
            'Transform LangChain, CrewAI, or Hugging Face config files between formats.',
            'Convert JSON API responses to YAML for cleaner human-readable config files.',
            'Prepare YAML configs for tools that only accept JSON input.',
            'Convert OpenAPI YAML specs to JSON for use with code generators.',
            'Quickly inspect deeply nested YAML structures in JSON format.',
            'Convert Ansible playbooks or Helm chart values to JSON.',
            'Transform CI/CD pipeline configs between YAML and JSON formats.',
          ]}
          faqs={[
            { q: 'Does this tool preserve types like booleans and numbers?', a: 'Yes. The converter uses js-yaml which correctly parses YAML types. Booleans (true/false), integers, floats, and null values are preserved as their proper JSON types — not converted to strings.' },
            { q: 'Can I convert multi-document YAML files?', a: 'The tool handles single YAML documents. Multi-document YAML (separated by ---) will only parse the first document. Split your documents before converting.' },
            { q: 'Does it support YAML anchors and aliases?', a: 'Yes. js-yaml resolves YAML anchors (&) and aliases (*) during parsing, so the output JSON will contain the fully resolved values.' },
            { q: 'Can I upload a .yml or .yaml file?', a: 'Yes. Click the Upload button or drag and drop a .yaml, .yml, or .json file. The file is read locally — nothing is uploaded to a server.' },
            { q: 'Are YAML comments preserved in the output?', a: 'No. JSON does not support comments, so YAML comments are lost when converting to JSON. When converting JSON to YAML, no comments are added.' },
            { q: 'Is my data sent to a server?', a: 'No. All conversion happens in your browser using js-yaml. Your data never leaves your device.' },
            { q: 'What YAML version does this support?', a: 'js-yaml supports YAML 1.2, which covers the vast majority of real-world YAML files including Kubernetes, Docker, GitHub Actions, and other DevOps tooling.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Mode toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['yaml-to-json', 'json-to-yaml'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold transition-all"
              style={mode === m
                ? { background: 'var(--color-dev)', color: '#fff' }
                : btnGhost}
              onMouseEnter={(e) => { if (mode !== m) onHover(e, true) }}
              onMouseLeave={(e) => { if (mode !== m) onHover(e, false) }}
            >
              {m === 'yaml-to-json' ? 'YAML → JSON' : 'JSON → YAML'}
            </button>
          ))}
        </div>

        {/* Input / Output grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Input panel */}
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
              <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {mode === 'yaml-to-json' ? 'YAML' : 'JSON'} Input
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".yaml,.yml,.json,.txt"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
                />
                <button
                  onClick={loadExample}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                  style={btnGhost}
                  onMouseEnter={(e) => onHover(e, true)}
                  onMouseLeave={(e) => onHover(e, false)}
                >
                  Example
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                  style={btnGhost}
                  onMouseEnter={(e) => onHover(e, true)}
                  onMouseLeave={(e) => onHover(e, false)}
                >
                  <Upload size={13} /> Upload
                </button>
                {input && (
                  <button
                    onClick={clear}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                    style={btnGhost}
                    onMouseEnter={(e) => onHover(e, true)}
                    onMouseLeave={(e) => onHover(e, false)}
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              placeholder={mode === 'yaml-to-json'
                ? 'name: Alice\nage: 30\nenabled: true'
                : '{\n  "name": "Alice",\n  "age": 30\n}'}
              rows={18}
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
            {isDragging && (
              <p className="mt-2 text-base text-center" style={{ color: 'var(--color-dev)' }}>Drop file to load</p>
            )}
          </div>

          {/* Output panel */}
          <div
            className="rounded-xl p-4 flex flex-col"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {mode === 'yaml-to-json' ? 'JSON' : 'YAML'} Output
                </label>
                {status === 'success' && (
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <CheckCircle size={12} /> Done
                  </span>
                )}
                {status === 'error' && (
                  <span className="flex items-center gap-1 text-sm font-medium text-red-400">
                    <XCircle size={12} /> Error
                  </span>
                )}
              </div>
              {output && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadOutput}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                    style={btnGhost}
                    onMouseEnter={(e) => onHover(e, true)}
                    onMouseLeave={(e) => onHover(e, false)}
                  >
                    <Download size={13} /> Download
                  </button>
                  <CopyButton text={output} />
                </div>
              )}
            </div>

            {status === 'error' && error && (
              <div
                className="rounded-lg px-4 py-3 text-base font-mono leading-relaxed mb-3"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
              >
                {error}
              </div>
            )}

            {output ? (
              <pre
                className="flex-1 rounded-lg px-3 py-3 text-base overflow-auto leading-relaxed"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '2px solid var(--border-dev-idle)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(255,255,255,0.88)',
                  minHeight: '200px',
                  maxHeight: '460px',
                }}
                dangerouslySetInnerHTML={{ __html: outputHighlighted }}
              />
            ) : (
              <div
                className="flex-1 rounded-lg flex flex-col items-center justify-center gap-3"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  minHeight: '200px',
                }}
              >
                <ArrowLeftRight size={24} style={{ color: 'var(--color-dev)', opacity: 0.3 }} />
                <p className="text-base" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Output will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
