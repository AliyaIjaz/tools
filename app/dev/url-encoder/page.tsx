'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

export default function UrlEncoderPage() {
  const [input, setInput] = useState('')
  const [component, setComponent] = useState('')
  const [full, setFull] = useState('')
  const [decoded, setDecoded] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode' | null>(null)

  function encode() {
    setError('')
    setDecoded('')
    if (!input) return
    setComponent(encodeURIComponent(input))
    setFull(encodeURI(input))
    setMode('encode')
  }

  function decode() {
    setError('')
    setComponent('')
    setFull('')
    if (!input) return
    try {
      setDecoded(decodeURIComponent(input))
      setMode('decode')
    } catch {
      setError('Invalid percent-encoded string')
      setDecoded('')
    }
  }

  return (
    <ToolLayout
      toolId="url-encoder"
      title="URL Encoder"
      description="Encode and decode URL components"
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>URL Encoder Online</strong> is a free browser-based tool that lets you <strong>encode and decode URLs</strong> instantly using standard URL encoding (also known as <strong>percent encoding</strong>). Whether you&apos;re working with query parameters, API requests, redirect URLs, form submissions, or encoded links, this tool helps you safely convert text into a URL-friendly format and decode encoded URLs back into readable text.</p>
            <p className="text-base leading-relaxed">URL encoding replaces characters that are not safe for URLs with their percent-encoded equivalents. For example, a space becomes <code>%20</code>, allowing browsers, servers, and APIs to correctly interpret special characters. This is essential when transmitting data through URLs, especially when query strings contain spaces, symbols, Unicode characters, or reserved URL characters.</p>
            <p className="text-base leading-relaxed">The tool supports both JavaScript&apos;s <strong><code>encodeURIComponent()</code></strong> and <strong><code>encodeURI()</code></strong> functions, allowing you to choose the appropriate encoding method for your use case. Use <code>encodeURIComponent()</code> when encoding individual query parameter values, and <code>encodeURI()</code> when encoding an entire URL while preserving its structure. You can also decode previously encoded URLs using the corresponding decoding functions.</p>
            <p className="text-base leading-relaxed">Designed for developers, testers, system administrators, and students, this URL Encoder and Decoder correctly handles <strong>UTF-8 text</strong>, including emoji, accented characters, and multilingual content. All processing happens entirely <strong>inside your browser</strong>, so your data is never uploaded to a server, ensuring complete privacy and security.</p>
          </>}
          useCases={[
            'Encode query parameter values containing spaces or special characters.',
            'Decode percent-encoded URLs back into readable text.',
            'Build safe URLs for REST APIs and web services.',
            'Generate redirect URLs for authentication and OAuth workflows.',
            'Encode search queries before adding them to URLs.',
            'Debug encoded URLs found in browser developer tools.',
            'Inspect URL parameters received from webhooks and APIs.',
            'Encode JSON strings passed as URL parameters.',
            'Decode tracking links from analytics platforms.',
            'Encode form input before sending HTTP GET requests.',
            'Prepare URLs for QR code generation.',
            'Encode dynamic route parameters in web applications.',
            'Verify encoded links before sharing them with users.',
            'Work with URLs in JavaScript, Node.js, Python, PHP, Java, Go, C#, and other programming languages.',
            'Decode encoded file names or download URLs.',
            'Test browser behavior with reserved URL characters.',
            'Encode Unicode characters, emoji, and international text.',
            'Debug nested query strings containing encoded URLs.',
          ]}
          faqs={[
            { q: 'What is URL encoding?', a: 'URL encoding, also called percent encoding, converts characters that are not safe for URLs into a format that browsers and web servers can safely transmit. Unsafe characters are replaced with a percent sign (%) followed by two hexadecimal digits representing the character\'s UTF-8 byte value.' },
            { q: 'What is a URL Encoder?', a: 'A URL Encoder converts plain text into a URL-safe format by replacing reserved or unsupported characters with percent-encoded values. This ensures URLs work correctly across browsers, servers, and APIs.' },
            { q: 'What is a URL Decoder?', a: 'A URL Decoder converts percent-encoded text back into its original readable form. It restores spaces, special characters, Unicode text, and other encoded values.' },
            { q: 'What is the difference between encodeURIComponent() and encodeURI()?', a: 'encodeURIComponent() encodes nearly every reserved character, making it ideal for individual query parameter values. encodeURI() preserves URL structure characters such as :, /, ?, #, &, and =, making it suitable for encoding an entire URL.' },
            { q: 'When should I use encodeURIComponent()?', a: 'Use encodeURIComponent() whenever you\'re encoding a query parameter, search term, form field, filename, or any other value that will become part of a URL.' },
            { q: 'When should I use encodeURI()?', a: 'Use encodeURI() when encoding a complete URL that already contains its protocol, domain, path, and query string, and you want to preserve its structural characters.' },
            { q: 'Why are spaces encoded as %20?', a: 'According to URL encoding standards, a space is represented as %20. Some web forms and older systems use the + character instead, but %20 is the standard encoding for URLs.' },
            { q: 'Does this tool support Unicode and emoji?', a: 'Yes. The encoder uses UTF-8 encoding, allowing it to correctly encode and decode emoji, accented characters, Asian languages, Arabic, Cyrillic, and other Unicode text.' },
            { q: 'Can I decode an encoded URL?', a: 'Yes. Paste any valid percent-encoded URL into the decoder to restore it to its original readable form.' },
            { q: 'Does URL encoding change the meaning of the data?', a: 'No. URL encoding only changes how characters are represented during transmission. Decoding restores the exact original content.' },
            { q: 'Is URL encoding the same as encryption?', a: 'No. URL encoding is not a security feature. It simply converts characters into a URL-safe format and can be easily reversed. It should not be used to protect sensitive information.' },
            { q: 'What characters need to be URL encoded?', a: 'Characters such as spaces, %, &, =, ?, #, ", <, >, {, }, |, \\, ^, [, ], and other reserved or unsafe characters should be encoded when required by the context.' },
            { q: 'Can I encode JSON for use in URLs?', a: 'Yes. JSON data is commonly URL encoded before being sent as a query parameter or included in redirect URLs and API requests.' },
            { q: 'Is my data uploaded to a server?', a: 'No. All encoding and decoding happen locally in your browser using JavaScript\'s built-in encodeURIComponent(), decodeURIComponent(), encodeURI(), and decodeURI() functions. Your data never leaves your device.' },
            { q: 'Can I use this tool offline?', a: 'Yes. Once the webpage has loaded, all encoding and decoding operations run locally in your browser and do not require an internet connection.' },
            { q: 'Is there a maximum input length?', a: 'There is no fixed limit imposed by the tool itself. The maximum input size depends on your browser\'s available memory and your device\'s hardware capabilities.' },
            { q: 'Which programming languages use URL encoding?', a: 'URL encoding is widely used in JavaScript, TypeScript, Node.js, Python, PHP, Java, C#, Go, Ruby, Swift, Kotlin, Rust, and many other programming languages for web development, APIs, HTTP requests, and URL generation.' },
            { q: 'Why should I URL encode data?', a: 'URL encoding ensures that special characters, spaces, Unicode text, and reserved symbols are transmitted correctly between browsers, web servers, APIs, and applications. It helps prevent malformed URLs, improves compatibility, and ensures query parameters are interpreted exactly as intended.' },
          ]}
        />
      }
      category="dev"
      iconName="Link"
      showAllCategory
    >
      <div className="space-y-5">
        {/* Input */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <label className="block text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setComponent(''); setFull(''); setDecoded(''); setError(''); setMode(null) }}
            placeholder="Enter a URL to encode or a percent-encoded string to decode…"
            rows={4}
            className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none transition-all duration-150 placeholder:text-white/45"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.92)',
              fontFamily: 'var(--font-geist-mono), monospace',
              lineHeight: '1.65',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={encode}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 active:brightness-90"
            style={{ background: 'var(--color-dev)', color: '#fff' }}
          >
            Encode
          </button>
          <button
            onClick={decode}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 active:brightness-75"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
          >
            Decode
          </button>
        </div>

        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm font-mono leading-relaxed"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}
          >
            {error}
          </div>
        )}

        {mode === 'encode' && (
          <div className="space-y-4">
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>encodeURIComponent</span>
                  <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>encodes everything incl. / ? &</span>
                </div>
                <CopyButton text={component} />
              </div>
              <textarea
                value={component}
                readOnly
                rows={3}
                className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.88)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  lineHeight: '1.65',
                }}
              />
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>encodeURI</span>
                  <span className="text-sm ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>preserves / ? # & = etc.</span>
                </div>
                <CopyButton text={full} />
              </div>
              <textarea
                value={full}
                readOnly
                rows={3}
                className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.88)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  lineHeight: '1.65',
                }}
              />
            </div>
          </div>
        )}

        {mode === 'decode' && decoded && (
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Decoded</label>
              <CopyButton text={decoded} />
            </div>
            <textarea
              value={decoded}
              readOnly
              rows={4}
              className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.88)',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.65',
              }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
