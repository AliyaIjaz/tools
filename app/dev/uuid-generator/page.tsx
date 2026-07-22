'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import { copyToClipboard } from '@/lib/utils'

const AMOUNTS = [1, 5, 10]

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([crypto.randomUUID()])
  const [amount, setAmount] = useState(1)
  const [justCopiedAll, setJustCopiedAll] = useState(false)

  function generate() {
    setUuids(Array.from({ length: amount }, () => crypto.randomUUID()))
  }

  async function copyAll() {
    await copyToClipboard(uuids.join('\n'))
    setJustCopiedAll(true)
    setTimeout(() => setJustCopiedAll(false), 2000)
  }

  return (
    <ToolLayout
      toolId="uuid-generator"
      title="UUID Generator"
      description="Generate UUID v4 values using the browser's crypto API"
      seoContent={
        <SeoSection
          about="Generate cryptographically random UUID v4 identifiers instantly in your browser. UUIDs are generated using the browser's built-in crypto.randomUUID() API, which produces high-quality randomness suitable for production use."
          useCases={[
            'Generating unique IDs for database records, users, or sessions',
            'Creating placeholder IDs during development and prototyping',
            'Generating unique filenames to avoid collisions in storage buckets',
            'Creating correlation IDs for distributed system tracing',
            'Producing test fixtures that require unique identifiers',
          ]}
          faqs={[
            { q: 'What is UUID v4?', a: 'UUID v4 is a 128-bit identifier where most bits are randomly generated. It looks like 550e8400-e29b-41d4-a716-446655440000 and has astronomically low collision probability.' },
            { q: 'Are the UUIDs suitable for use in production?', a: 'Yes. Generation uses crypto.randomUUID(), which relies on a cryptographically secure random number generator (CSPRNG) built into the browser.' },
            { q: 'Can I generate multiple UUIDs at once?', a: 'Yes — choose 1, 5, or 10 UUIDs to generate in a single click.' },
          ]}
        />
      }
      category="dev"
      iconName="Fingerprint"
    >
      <div className="space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {AMOUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setAmount(n)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                style={{
                  background: amount === n ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: amount === n ? 'white' : 'rgba(255,255,255,0.4)',
                  border: amount === n ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                }}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'var(--color-dev-dim)', border: '1px solid var(--color-dev)', color: 'var(--color-dev)' }}
          >
            <RefreshCw size={13} />
            Generate
          </button>

          {uuids.length > 1 && (
            <button
              onClick={copyAll}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: justCopiedAll ? 'rgba(52,211,153,0.1)' : 'var(--surface)',
                border: `1px solid ${justCopiedAll ? 'rgba(52,211,153,0.25)' : 'var(--border)'}`,
                color: justCopiedAll ? '#34d399' : 'rgba(255,255,255,0.5)',
              }}
            >
              {justCopiedAll ? 'Copied all!' : 'Copy all'}
            </button>
          )}
        </div>

        {/* UUID list */}
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <code
                className="text-sm flex-1 tracking-wide"
                style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {uuid}
              </code>
              <CopyButton text={uuid} />
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
