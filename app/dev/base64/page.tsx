'use client'

import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import Tabs from '@/components/ui/Tabs'
import Textarea from '@/components/ui/Textarea'
import SeoSection from '@/components/ui/SeoSection'

export default function Base64Page() {
  const [tab, setTab] = useState('Encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    if (!input) { setOutput(''); return }
    try {
      if (tab === 'Encode') {
        // UTF-8 safe encode
        const bytes = new TextEncoder().encode(input)
        const binary = Array.from(bytes).map((b) => String.fromCharCode(b)).join('')
        setOutput(btoa(binary))
      } else {
        // UTF-8 safe decode
        const binary = atob(input)
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
        setOutput(new TextDecoder().decode(bytes))
      }
    } catch {
      setError(tab === 'Encode' ? 'Encoding error' : 'Invalid Base64 string')
      setOutput('')
    }
  }, [input, tab])

  return (
    <ToolLayout
      toolId="base64"
      title="Base64 Encoder"
      description="Encode and decode Base64 strings with UTF-8 support"
      seoContent={
        <SeoSection
          about="Encode text or data to Base64 or decode a Base64 string back to plain text. The tool handles UTF-8 characters correctly, including emoji and non-ASCII text. All encoding and decoding happens client-side with no server round-trips."
          useCases={[
            'Encoding API credentials (username:password) for HTTP Basic Auth headers',
            'Encoding binary data for embedding in JSON payloads',
            'Decoding Base64-encoded tokens or configuration values',
            'Inspecting Base64-encoded email attachments or MIME parts',
            'Encoding strings before storing them in URLs or cookies',
          ]}
          faqs={[
            { q: 'Does it handle Unicode and emoji?', a: 'Yes. The encoder uses TextEncoder to convert the string to UTF-8 bytes before encoding, so all Unicode characters are handled correctly.' },
            { q: 'What is the difference between Base64 and URL-safe Base64?', a: 'Standard Base64 uses + and / characters which must be percent-encoded in URLs. URL-safe Base64 replaces those with - and _, making the output safe in query strings. This tool uses standard Base64.' },
            { q: 'Is there a length limit?', a: 'No hard limit — the tool handles strings of any length your browser can hold in memory.' },
          ]}
        />
      }
      category="dev"
      iconName="Binary"
    >
      <div className="space-y-4">
        <Tabs tabs={['Encode', 'Decode']} value={tab} onChange={(t) => { setTab(t); setInput(''); setOutput('') }} />

        <Textarea
          label={tab === 'Encode' ? 'Plain text' : 'Base64 string'}
          value={input}
          onChange={setInput}
          placeholder={tab === 'Encode' ? 'Enter text to encode…' : 'Enter Base64 to decode…'}
          mono={tab === 'Decode'}
          rows={6}
          showCount
        />

        {error && (
          <div
            className="rounded-lg px-4 py-2 text-xs"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {tab === 'Encode' ? 'Base64 output' : 'Decoded text'}
              </label>
              <CopyButton text={output} />
            </div>
            <Textarea value={output} readOnly mono rows={6} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
