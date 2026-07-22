'use client'

import { useState, useMemo } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import SeoSection from '@/components/ui/SeoSection'

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'color:#86efac'
      if (/^"/.test(match)) cls = /:$/.test(match) ? 'color:#c4b5fd' : 'color:#86efac'
      else if (/true|false/.test(match)) cls = 'color:#fdba74'
      else if (/null/.test(match)) cls = 'color:#f87171'
      else cls = 'color:#7dd3fc'
      return `<span style="${cls}">${match}</span>`
    }
  )
}

export default function JwtDecoderPage() {
  const [jwt, setJwt] = useState('')

  const result = useMemo(() => {
    const token = jwt.trim()
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return { error: 'Invalid JWT: expected 3 parts separated by dots' }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0]))
      const payload = JSON.parse(decodeBase64Url(parts[1]))
      const headerStr = JSON.stringify(header, null, 2)
      const payloadStr = JSON.stringify(payload, null, 2)

      let expiry: { status: 'valid' | 'expired'; date: string } | null = null
      if (payload.exp) {
        const expMs = payload.exp * 1000
        const expired = Date.now() > expMs
        expiry = { status: expired ? 'expired' : 'valid', date: new Date(expMs).toLocaleString() }
      }

      return { header, payload, headerStr, payloadStr, expiry, signature: parts[2] }
    } catch {
      return { error: 'Failed to decode JWT — invalid base64url or JSON' }
    }
  }, [jwt])

  return (
    <ToolLayout
      toolId="jwt-decoder"
      title="JWT Decoder"
      description="Decode JWT tokens to inspect header and payload"
      seoContent={
        <SeoSection
          about="Paste any JSON Web Token to instantly decode and inspect the header, payload, and expiry status. The signature is displayed but not verified — this tool is for reading token contents, not cryptographic validation. Everything is decoded locally."
          useCases={[
            'Inspecting the claims inside a JWT received from an authentication server',
            'Checking token expiry (exp) without running backend code',
            'Debugging auth issues by verifying what claims a token contains',
            'Reading the algorithm (alg) and key ID (kid) from the token header',
            'Quickly decoding tokens during API development and testing',
          ]}
          faqs={[
            { q: 'Does this verify the JWT signature?', a: 'No. The signature is displayed but not cryptographically verified. Verification requires the signing secret or public key, which should never be pasted into a browser tool.' },
            { q: 'Is it safe to paste my JWT here?', a: 'The token is decoded entirely in your browser — nothing is sent to a server. However, be cautious about pasting production tokens containing sensitive data into any web tool.' },
            { q: 'What token formats are supported?', a: 'Standard three-part JWTs with a header, payload, and signature separated by dots are supported. The payload must be valid Base64url-encoded JSON.' },
          ]}
        />
      }
      category="dev"
      iconName="KeyRound"
    >
      <div className="space-y-5">
        <Textarea
          label="JWT token"
          value={jwt}
          onChange={setJwt}
          placeholder="Paste your JWT token here…"
          mono
          rows={4}
        />

        {result?.error && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
          >
            {result.error}
          </div>
        )}

        {result && !result.error && (
          <>
            {/* Expiry status */}
            {result.expiry && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{
                  background: result.expiry.status === 'valid' ? 'rgba(52,211,153,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${result.expiry.status === 'valid' ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  color: result.expiry.status === 'valid' ? '#34d399' : '#f87171',
                }}
              >
                {result.expiry.status === 'valid'
                  ? <CheckCircle size={14} />
                  : <XCircle size={14} />}
                <span className="font-medium capitalize">{result.expiry.status}</span>
                <Clock size={12} style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }} />
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Expires {result.expiry.date}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Header</label>
                  <CopyButton text={result.headerStr!} />
                </div>
                <pre
                  className="rounded-xl px-4 py-3 text-xs overflow-auto"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    lineHeight: '1.6',
                    maxHeight: '220px',
                  }}
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(result.headerStr!) }}
                />
              </div>

              {/* Payload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Payload</label>
                  <CopyButton text={result.payloadStr!} />
                </div>
                <pre
                  className="rounded-xl px-4 py-3 text-xs overflow-auto"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    lineHeight: '1.6',
                    maxHeight: '220px',
                  }}
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(result.payloadStr!) }}
                />
              </div>
            </div>

            {/* Signature */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Signature <span style={{ color: 'rgba(255,255,255,0.2)' }}>(not verified)</span>
              </label>
              <div
                className="px-4 py-2 rounded-xl text-xs break-all"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                }}
              >
                {result.signature}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
