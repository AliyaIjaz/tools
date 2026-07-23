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
          aboutTitle="About this tool"
          about={<>
            <p className="text-base leading-relaxed">Lorem Ipsum Generator Online is a free tool that instantly creates Lorem Ipsum placeholder text for design, development, and publishing projects. Generate any amount of dummy text by words, sentences, or paragraphs to quickly fill layouts before your final content is ready. Whether you&apos;re building a website, designing a mobile app, creating a brochure, or testing a content management system, Lorem Ipsum helps you visualize how text will look without being distracted by meaningful content.</p>
            <p className="text-base leading-relaxed">Lorem Ipsum has been the industry standard placeholder text since the 1500s. It is based on sections of <em>De Finibus Bonorum et Malorum</em>, written by the Roman philosopher Cicero in 45 BC, and is widely used because its natural-looking distribution of letters resembles readable text. Designers, developers, publishers, and content creators rely on Lorem Ipsum to evaluate typography, spacing, alignment, and page layouts during the design process.</p>
            <p className="text-base leading-relaxed">Everything is generated instantly in your browser with no registration or software installation required. Simply choose the number of words, sentences, or paragraphs, generate your placeholder text, and copy it into your project.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Filling website wireframes and UI mockups with realistic-looking placeholder text.',
            'Creating placeholder content for Figma, Adobe XD, Sketch, and other design projects.',
            'Testing website layouts before final copy is available.',
            'Generating sample text for landing pages, blogs, and CMS templates.',
            'Populating database seed data and development environments with dummy text.',
            'Previewing typography, spacing, and paragraph styles in web and print designs.',
            'Building email templates with temporary content during development.',
            'Testing responsive layouts using different amounts of text.',
            'Creating mock brochures, flyers, magazines, and print materials.',
            'Demonstrating website or application prototypes to clients.',
            'Verifying how cards, forms, and UI components behave with sample content.',
            'Quickly generating filler text for presentations, documentation, and training materials.',
          ]}
          faqs={[
            { q: 'What is Lorem Ipsum?', a: "Lorem Ipsum is placeholder text commonly used in graphic design, publishing, web development, and printing. It is based on scrambled sections of Cicero's De Finibus Bonorum et Malorum (45 BC) and has been the industry's standard dummy text since the 1500s." },
            { q: 'Why is Lorem Ipsum used?', a: "Lorem Ipsum allows designers and developers to focus on layout, typography, spacing, and visual hierarchy instead of meaningful content. Because readers are less likely to be distracted by placeholder text, it's ideal for evaluating a design." },
            { q: 'Is Lorem Ipsum real Latin?', a: 'Lorem Ipsum originates from Latin literature but has been altered over centuries. While it contains many Latin words, the generated text is not intended to be grammatically correct or fully meaningful Latin.' },
            { q: 'Can I generate a specific amount of text?', a: 'Yes. You can generate exactly the amount of placeholder text you need by selecting the number of words, sentences, or paragraphs.' },
            { q: 'Can I use the generated text commercially?', a: 'Yes. Lorem Ipsum is standard placeholder text used throughout the design and publishing industries and can be used in personal, educational, and commercial projects.' },
            { q: 'Is the generated text always the same?', a: 'The generated text is based on the classic Lorem Ipsum passage, so it follows the familiar wording and appearance that designers and developers recognize. This consistency makes it suitable for realistic mockups and prototypes.' },
            { q: 'Can I copy the generated text?', a: 'Yes. After generating the text, simply use the copy button to copy it to your clipboard and paste it wherever you need placeholder content.' },
            { q: 'Is this Lorem Ipsum Generator free?', a: 'Yes. The tool is completely free to use with no registration, subscriptions, or hidden charges.' },
            { q: 'Is my data uploaded to a server?', a: 'No. The tool generates placeholder text directly in your browser. No personal content or files are uploaded or stored.' },
            { q: 'Who can use this tool?', a: 'This tool is ideal for UI/UX designers, graphic designers, web developers, front-end developers, WordPress developers, product designers, publishers, content creators, students, and anyone creating mockups, prototypes, or sample documents.' },
            { q: "What's the difference between Lorem Ipsum and real content?", a: 'Lorem Ipsum is intentionally meaningless placeholder text designed to represent the appearance of written content. Real content communicates information, while Lorem Ipsum helps you evaluate design and layout without the influence of readable text.' },
            { q: 'Why should I use a Lorem Ipsum Generator?', a: 'A Lorem Ipsum Generator saves time by instantly producing professional placeholder text for websites, applications, documents, presentations, and print materials. Instead of manually copying sample text, you can generate exactly the number of words, sentences, or paragraphs needed to test layouts, typography, and responsive designs efficiently.' },
          ]}
        />
      }
      category="text"
      iconName="AlignJustify"
      showAllCategory
      compactRelated
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
