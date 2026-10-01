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
          aboutTitle="About this tool"
          about={<>
            <p className="text-lg leading-relaxed">Word Counter Online is a free text analysis tool that instantly counts words, characters, characters without spaces, sentences, paragraphs, and estimated reading time. Simply paste or type your text, and all statistics update live as you edit. Whether you&apos;re writing an essay, blog post, report, email, resume, social media caption, or marketing copy, this tool helps you stay within word or character limits while understanding the overall structure of your content.</p>
            <p className="text-lg leading-relaxed">The tool runs entirely in your browser, so your text is never uploaded to a server, ensuring complete privacy. There are no sign-ups, downloads, or character limits, making it suitable for both short snippets and long documents. Writers, students, bloggers, copywriters, marketers, SEO professionals, and anyone working with text can use this online word counter to quickly analyze content before publishing or submitting it.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Checking the word count of essays, assignments, research papers, and reports before submission.',
            'Tracking the length of blog posts and articles to meet SEO or editorial guidelines.',
            'Counting characters for social media posts, advertisements, and messaging platforms with character limits.',
            'Measuring reading time to estimate how long an article, speech, or presentation will take to read.',
            'Reviewing sentence and paragraph counts to improve readability and content structure.',
            'Ensuring meta titles and meta descriptions stay within recommended character limits for search engines.',
            'Monitoring document length while writing books, newsletters, or technical documentation.',
            'Verifying translation length by comparing word and character counts.',
            'Editing resumes, cover letters, and professional emails to keep them concise.',
            'Optimizing landing pages, product descriptions, and website content for better user experience.',
            'Proofreading drafts by identifying unusually long paragraphs or sentences.',
            'Quickly analyzing text without installing software or creating an account.',
          ]}
          faqs={[
            { q: 'Is this Word Counter free?', a: 'Yes. The tool is completely free to use with no subscriptions, registrations, or hidden fees.' },
            { q: 'Is my text uploaded to a server?', a: 'No. Everything is processed locally in your browser. Your text remains private and is never uploaded or stored.' },
            {
              q: 'What statistics does the tool provide?',
              a: <><p className="text-lg leading-relaxed mb-2">The tool displays: word count, character count (with spaces), character count (without spaces), sentence count, paragraph count, and estimated reading time.</p><p className="text-lg leading-relaxed">All statistics update instantly as you type or edit your text.</p></>,
            },
            { q: 'How is word count calculated?', a: 'Words are identified by separating text using spaces and common word boundaries. This provides an accurate count for most everyday writing, including essays, articles, emails, and blog posts.' },
            { q: 'Does character count include spaces?', a: 'Both values are shown. You can view the total number of characters including spaces as well as the count excluding spaces.' },
            { q: 'How are sentences counted?', a: 'Sentences are estimated using common sentence-ending punctuation such as periods (.), question marks (?), and exclamation marks (!). Abbreviations, initials, and ellipses may occasionally affect the count.' },
            { q: 'How are paragraphs counted?', a: 'Paragraphs are counted by detecting blocks of text separated by one or more blank lines. Each text block is treated as a separate paragraph.' },
            { q: 'How is reading time estimated?', a: 'Reading time is calculated using an average adult reading speed of approximately 200 words per minute, which is a commonly accepted benchmark for general reading.' },
            { q: 'Is there a maximum text length?', a: 'No fixed limit is imposed by the tool. You can analyze both short text and lengthy documents. Extremely large documents may take slightly longer to process depending on your browser and device.' },
            { q: 'Can I use this tool on mobile devices?', a: 'Yes. The Word Counter works in modern desktop and mobile browsers without requiring any installation.' },
            {
              q: 'Who can use this tool?',
              a: 'This tool is useful for students, writers, bloggers, journalists, copywriters, SEO professionals, digital marketers, editors, researchers, and anyone who needs quick text statistics.',
            },
            { q: 'Why should I use a word counter?', a: 'A word counter helps ensure your content meets assignment requirements, publishing guidelines, SEO recommendations, and platform character limits. It also provides valuable insights into document length, readability, and estimated reading time, making it easier to write clear and well-structured content.' },
          ]}
        />
      }
      category="text"
      iconName="AlignLeft"
      showAllCategory
      compactRelated
    >
      <div className="space-y-5">
        <div>
          <label className="text-base font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Type or paste text here…"
            className="w-full resize-y rounded-xl px-4 py-3 text-base outline-none transition-all placeholder:text-white/50"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--border-text-idle)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.7',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-text-tool)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-text-idle)'
            }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statItems.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl px-4 py-4 text-center"
              style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: 'var(--color-text-tool)' }}
              >
                {value}
              </div>
              <div className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
