'use client'

import { useState, useEffect } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import Tabs from '@/components/ui/Tabs'
import Textarea from '@/components/ui/Textarea'
import SeoSection from '@/components/ui/SeoSection'

export default function UrlEncoderPage() {
  const [tab, setTab] = useState('Encode')
  const [input, setInput] = useState('')
  const [component, setComponent] = useState('')
  const [full, setFull] = useState('')
  const [decoded, setDecoded] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    if (!input) { setComponent(''); setFull(''); setDecoded(''); return }

    if (tab === 'Encode') {
      setComponent(encodeURIComponent(input))
      setFull(encodeURI(input))
      setDecoded('')
    } else {
      try {
        setDecoded(decodeURIComponent(input))
        setComponent('')
        setFull('')
      } catch {
        setError('Invalid percent-encoded string')
        setDecoded('')
      }
    }
  }, [input, tab])

  return (
    <ToolLayout
      toolId="url-encoder"
      title="URL Encoder"
      description="Encode and decode URL components"
      seoContent={
        <SeoSection
          about="Encode or decode URL components using both encodeURIComponent (encodes all special characters) and encodeURI (preserves URL structure characters). Useful for building query strings, debugging redirect URLs, or decoding encoded API parameters."
          useCases={[
            'Encoding query parameter values that contain spaces or special characters',
            'Decoding percent-encoded URLs from server logs or analytics tools',
            'Building URL-safe strings for redirect parameters',
            'Debugging URLs that contain encoded JSON or nested parameters',
            'Checking what encodeURIComponent vs encodeURI produce for a given string',
          ]}
          faqs={[
            { q: 'What is the difference between encodeURIComponent and encodeURI?', a: 'encodeURIComponent encodes everything except letters, digits, and - _ . ! ~ * \' ( ). encodeURI additionally preserves URL structure characters like : / ? # [ ] @ & = + $ , so it is used on full URLs rather than individual parameter values.' },
            { q: 'How do I encode a space?', a: 'encodeURIComponent converts a space to %20. Some systems use + for spaces in query strings, but %20 is the standard for URL encoding.' },
            { q: 'Is my data sent to a server?', a: 'No. Encoding and decoding use JavaScript\'s built-in encodeURIComponent and decodeURIComponent functions, entirely in your browser.' },
          ]}
        />
      }
      category="dev"
      iconName="Link"
    >
      <div className="space-y-4">
        <Tabs tabs={['Encode', 'Decode']} value={tab} onChange={(t) => { setTab(t); setInput('') }} />

        <Textarea
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={tab === 'Encode' ? 'https://example.com/path?q=hello world' : 'https%3A%2F%2Fexample.com%2F'}
          mono
          rows={4}
        />

        {error && (
          <div
            className="rounded-lg px-4 py-2 text-xs"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {tab === 'Encode' && input && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  encodeURIComponent <span style={{ color: 'rgba(255,255,255,0.25)' }}>(encodes everything incl. / ? &)</span>
                </label>
                <CopyButton text={component} />
              </div>
              <Textarea value={component} readOnly mono rows={3} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  encodeURI <span style={{ color: 'rgba(255,255,255,0.25)' }}>(preserves / ? # & = etc.)</span>
                </label>
                <CopyButton text={full} />
              </div>
              <Textarea value={full} readOnly mono rows={3} />
            </div>
          </div>
        )}

        {tab === 'Decode' && decoded && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Decoded</label>
              <CopyButton text={decoded} />
            </div>
            <Textarea value={decoded} readOnly mono rows={4} />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
