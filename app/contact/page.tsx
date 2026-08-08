'use client'

import { Mail, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText('thesaturndevelopers@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1
        className="text-3xl font-bold mb-4"
        style={{
          background: 'linear-gradient(90deg, var(--color-dev), var(--color-image))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-orbitron)',
        }}
      >
        Contact Us
      </h1>

      <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.75)' }}>
        Have a question, suggestion, or found a bug? We&apos;re happy to hear from you. Reach out and we&apos;ll get
        back to you as soon as we can.
      </p>

      <div className="space-y-4">
        <div
          className="rounded-xl p-6 flex items-start gap-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'color-mix(in srgb, var(--color-image) 15%, transparent)' }}
          >
            <Mail size={18} style={{ color: 'var(--color-image)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</p>
            <a
              href="mailto:thesaturndevelopers@gmail.com"
              className="text-base font-medium text-white underline break-all"
              style={{ color: 'var(--color-image)' }}
            >
              thesaturndevelopers@gmail.com
            </a>
            <div className="mt-3">
              <button
                onClick={copyEmail}
                className="text-sm px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: copied ? 'color-mix(in srgb, var(--color-web) 15%, transparent)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${copied ? 'color-mix(in srgb, var(--color-web) 30%, transparent)' : 'rgba(255,255,255,0.1)'}`,
                  color: copied ? 'var(--color-web)' : 'rgba(255,255,255,0.6)',
                }}
              >
                {copied ? 'Copied!' : 'Copy address'}
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 flex items-start gap-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'color-mix(in srgb, var(--color-dev) 15%, transparent)' }}
          >
            <MessageSquare size={18} style={{ color: 'var(--color-dev)' }} />
          </div>
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>What to include</p>
            <ul className="text-base space-y-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li>The tool you were using (if applicable)</li>
              <li>A short description of your question or issue</li>
              <li>Your browser and OS if reporting a bug</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-sm mt-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
        We typically respond within 1–3 business days.
      </p>
    </div>
  )
}
