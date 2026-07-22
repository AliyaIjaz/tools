'use client'

import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import SeoSection from '@/components/ui/SeoSection'

const ALGOS = [
  { label: 'SHA-1', algo: 'SHA-1' },
  { label: 'SHA-256', algo: 'SHA-256' },
  { label: 'SHA-512', algo: 'SHA-512' },
]

async function hash(text: string, algo: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!input) { setHashes({}); return }
    Promise.all(ALGOS.map(({ algo }) => hash(input, algo))).then((results) => {
      const map: Record<string, string> = {}
      ALGOS.forEach(({ algo }, i) => { map[algo] = results[i] })
      setHashes(map)
    })
  }, [input])

  return (
    <ToolLayout
      toolId="hash-generator"
      title="Hash Generator"
      description="Generate cryptographic hashes using the browser's Web Crypto API"
      seoContent={
        <SeoSection
          about="Generate SHA-1, SHA-256, and SHA-512 hashes from any text string using the browser's Web Crypto API. Hashes update live as you type. No data is sent to a server — this is a fully client-side tool."
          useCases={[
            'Verifying the integrity of a downloaded file by comparing checksums',
            'Generating content hashes for cache-busting in build pipelines',
            'Learning and comparing the output length of different hash algorithms',
            'Quickly creating a SHA-256 hash of a string for testing',
            'Checking whether two strings produce the same hash',
          ]}
          faqs={[
            { q: 'Which hash algorithms are supported?', a: 'SHA-1, SHA-256, and SHA-512. Note that SHA-1 is considered cryptographically broken and should not be used for security purposes — use SHA-256 or SHA-512 instead.' },
            { q: 'Is the output hex-encoded?', a: 'Yes. The hash is returned as a lowercase hexadecimal string, which is the standard format for displaying cryptographic hashes.' },
            { q: 'Can I hash binary data or files?', a: 'Currently the tool hashes text input only. File hashing support may be added in a future update.' },
          ]}
        />
      }
      category="dev"
      iconName="Hash"
    >
      <div className="space-y-5">
        <Textarea
          label="Input text"
          value={input}
          onChange={setInput}
          placeholder="Enter text to hash…"
          rows={4}
          showCount
        />

        <div className="space-y-3">
          {ALGOS.map(({ label, algo }) => (
            <div key={algo}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
                {hashes[algo] && <CopyButton text={hashes[algo]} />}
              </div>
              <div
                className="px-4 py-3 rounded-xl text-xs leading-relaxed break-all"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: hashes[algo] ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  minHeight: '2.75rem',
                }}
              >
                {hashes[algo] || (input ? 'Computing…' : 'Output will appear here')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
