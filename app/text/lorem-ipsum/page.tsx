'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')

function randomWord(exclude?: string): string {
  let w = WORDS[Math.floor(Math.random() * WORDS.length)]
  if (exclude && WORDS.length > 1) {
    while (w === exclude) w = WORDS[Math.floor(Math.random() * WORDS.length)]
  }
  return w
}

function makeSentence(wordCount: number): string {
  const words = Array.from({ length: wordCount }, (_, i) => {
    const w = randomWord()
    return i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w
  })
  return words.join(' ') + '.'
}

function makeParagraph(): string {
  const sentenceCount = 3 + Math.floor(Math.random() * 3)
  return Array.from({ length: sentenceCount }, () =>
    makeSentence(6 + Math.floor(Math.random() * 10))
  ).join(' ')
}

function generate(type: string, amount: number): string {
  if (type === 'words') {
    return Array.from({ length: amount }, randomWord).join(' ')
  }
  if (type === 'sentences') {
    return Array.from({ length: amount }, () =>
      makeSentence(6 + Math.floor(Math.random() * 10))
    ).join(' ')
  }
  return Array.from({ length: amount }, makeParagraph).join('\n\n')
}

const TYPES = ['words', 'sentences', 'paragraphs']

export default function LoremIpsumPage() {
  const [type, setType] = useState('paragraphs')
  const [amount, setAmount] = useState(3)
  const [output, setOutput] = useState('')

  function handleGenerate() {
    setOutput(generate(type, amount))
  }

  return (
    <ToolLayout
      toolId="lorem-ipsum"
      title="Lorem Ipsum Generator"
      description="Generate configurable placeholder text"
      seoContent={
        <SeoSection
          about="Generate Lorem Ipsum placeholder text in any quantity — by words, sentences, or paragraphs. Lorem Ipsum has been the standard dummy text in design and typesetting since the 1500s, used to fill layouts before real content is available."
          useCases={[
            'Filling wireframes and mockups with realistic-looking placeholder text',
            'Testing how a layout handles different amounts of content',
            'Generating placeholder copy for email templates or UI components',
            'Populating database seeds or test fixtures with text content',
            'Creating print mockups before final copy is written',
          ]}
          faqs={[
            { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is scrambled Latin text derived from Cicero\'s "de Finibus Bonorum et Malorum" (45 BC). It has been used as placeholder text in typesetting since the 1500s because it has a natural-looking letter distribution.' },
            { q: 'Can I choose how much text to generate?', a: 'Yes — you can specify the number of words, sentences, or paragraphs to generate.' },
            { q: 'Is the generated text always the same?', a: 'The text is drawn from the classic Lorem Ipsum passage, so it will look similar each time, which is intentional for a recognizable placeholder.' },
          ]}
        />
      }
      category="text"
      iconName="AlignJustify"
    >
      <div className="space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize"
                style={{
                  background: type === t ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: type === t ? 'white' : 'rgba(255,255,255,0.6)',
                  border: type === t ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Amount</label>
            <input
              type="number"
              min={1}
              max={50}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Math.min(50, Number(e.target.value))))}
              className="w-16 px-2 py-1.5 rounded-lg text-sm text-center outline-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'rgba(255,255,255,0.8)',
              }}
            />
          </div>

          <button
            onClick={handleGenerate}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'var(--color-text-tool-dim)',
              border: '1px solid var(--color-text-tool)',
              color: 'var(--color-text-tool)',
            }}
          >
            Generate
          </button>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {amount} {type}
              </span>
              <CopyButton text={output} />
            </div>
            <div
              className="rounded-xl px-4 py-4 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'rgba(255,255,255,0.75)',
                maxHeight: '420px',
                overflowY: 'auto',
              }}
            >
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
