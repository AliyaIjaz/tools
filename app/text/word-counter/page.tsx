'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'

export default function WordCounterPage() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime }
  }, [text])

  const statItems = [
    { label: 'Words', value: stats.words.toLocaleString() },
    { label: 'Characters', value: stats.chars.toLocaleString() },
    { label: 'Chars (no spaces)', value: stats.charsNoSpaces.toLocaleString() },
    { label: 'Sentences', value: stats.sentences.toLocaleString() },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
    { label: 'Reading time', value: `~${stats.readingTime} min` },
  ]

  return (
    <ToolLayout
      toolId="word-counter"
      title="Word Counter"
      description="Count words, characters, sentences, paragraphs, and estimate reading time"
      seoContent={
        <SeoSection
          about="Paste any text to instantly see word count, character count (with and without spaces), sentence count, paragraph count, and estimated reading time. Stats update live as you type. No character limits, no uploads."
          useCases={[
            'Checking word count for an essay, article, or assignment with a word limit',
            'Estimating how long a blog post or speech will take to read or deliver',
            'Counting characters before pasting into a platform with a character limit',
            'Analyzing content density — paragraphs and sentence counts help gauge readability',
            'Verifying that a meta description or ad copy fits within character constraints',
          ]}
          faqs={[
            { q: 'How is reading time estimated?', a: 'Based on an average adult reading speed of 200 words per minute, which is a widely used benchmark for general-purpose text.' },
            { q: 'Does character count include spaces?', a: 'Both are shown: characters with spaces and characters without spaces.' },
            { q: 'How are sentences counted?', a: 'Sentences are split on . ! and ? punctuation marks. This is an approximation — abbreviations and ellipses may slightly affect the count.' },
          ]}
        />
      }
      category="text"
      iconName="AlignLeft"
    >
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Type or paste text here…"
            className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-white/20"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.7',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-focus)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statItems.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl px-4 py-4 text-center"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: 'var(--color-text-tool)' }}
              >
                {value}
              </div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
