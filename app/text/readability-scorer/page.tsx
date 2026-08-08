'use client'

import { useMemo, useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'

// ── Syllable counting (English heuristic) ──────────────────────────────────
function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1
  const cleaned = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const matches = cleaned.match(/[aeiouy]{1,2}/g)
  return Math.max(1, matches ? matches.length : 1)
}

// ── Text stats ─────────────────────────────────────────────────────────────
function analyze(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return null

  const sentences = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const words = trimmed
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z']/g, ''))
    .filter((w) => w.length > 0)

  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const chars = trimmed.replace(/\s/g, '').length
  const paragraphs = trimmed.split(/\n{2,}/).filter((p) => p.trim()).length

  const sentenceCount = Math.max(1, sentences.length)
  const wordCount = Math.max(1, words.length)

  // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const fre = 206.835
    - 1.015 * (wordCount / sentenceCount)
    - 84.6 * (syllables / wordCount)
  const flesch = Math.min(100, Math.max(0, Math.round(fre * 10) / 10))

  // Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  const fkgl = 0.39 * (wordCount / sentenceCount)
    + 11.8 * (syllables / wordCount)
    - 15.59
  const gradeLevel = Math.max(0, Math.round(fkgl * 10) / 10)

  // Gunning Fog: 0.4 * ((words/sentences) + 100*(complexWords/words))
  const complexWords = words.filter((w) => countSyllables(w) >= 3).length
  const fog = Math.max(0, Math.round((0.4 * (wordCount / sentenceCount + 100 * (complexWords / wordCount))) * 10) / 10)

  // Avg sentence length
  const avgSentenceLen = Math.round((wordCount / sentenceCount) * 10) / 10

  // Reading time (238 wpm avg)
  const readingTimeSecs = Math.ceil((wordCount / 238) * 60)

  return {
    flesch,
    gradeLevel,
    fog,
    wordCount,
    sentenceCount,
    syllables,
    chars,
    paragraphs,
    complexWords,
    avgSentenceLen,
    readingTimeSecs,
  }
}

function fleschLabel(score: number): { label: string; color: string; audience: string } {
  if (score >= 90) return { label: 'Very Easy', color: '#34d399', audience: '5th grade' }
  if (score >= 80) return { label: 'Easy', color: '#4ade80', audience: '6th grade' }
  if (score >= 70) return { label: 'Fairly Easy', color: '#a3e635', audience: '7th grade' }
  if (score >= 60) return { label: 'Standard', color: '#facc15', audience: '8th–9th grade' }
  if (score >= 50) return { label: 'Fairly Difficult', color: '#fb923c', audience: '10th–12th grade' }
  if (score >= 30) return { label: 'Difficult', color: '#f87171', audience: 'College level' }
  return { label: 'Very Confusing', color: '#e879f9', audience: 'Professional' }
}

function fogLabel(score: number): { label: string; color: string } {
  if (score <= 8) return { label: 'Easy', color: '#34d399' }
  if (score <= 12) return { label: 'Acceptable', color: '#facc15' }
  if (score <= 16) return { label: 'Hard', color: '#fb923c' }
  return { label: 'Very Hard', color: '#f87171' }
}

function formatReadingTime(secs: number): string {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function gradeLabel(grade: number): string {
  if (grade <= 6) return 'Middle school'
  if (grade <= 9) return 'High school'
  if (grade <= 13) return 'College'
  return 'Post-graduate'
}

const PLACEHOLDER = `Paste your text here to analyze its readability. This tool calculates the Flesch Reading Ease score, Flesch-Kincaid Grade Level, and Gunning Fog Index — three widely used readability formulas. Great for checking AI-generated content, blog posts, technical documentation, emails, or any writing you want to make more accessible.`

export default function ReadabilityScorerPage() {
  const [text, setText] = useState('')
  const stats = useMemo(() => analyze(text), [text])

  const flesch = stats ? fleschLabel(stats.flesch) : null
  const fog = stats ? fogLabel(stats.fog) : null

  // Arc for the Flesch gauge (SVG circle)
  const gaugeScore = stats ? stats.flesch : 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (gaugeScore / 100) * circumference

  return (
    <ToolLayout
      toolId="readability-scorer"
      title="Readability Scorer"
      description="Check Flesch Reading Ease, grade level, and readability of your text"
      category="text"
      iconName="BookOpen"
      showAllCategory
      compactRelated
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>Readability Scorer Online</strong> is a free browser-based tool that analyzes your text using three industry-standard readability formulas: <strong>Flesch Reading Ease</strong>, <strong>Flesch-Kincaid Grade Level</strong>, and the <strong>Gunning Fog Index</strong>. It also shows word count, sentence count, average sentence length, syllable count, complex word count, and estimated reading time — all instantly as you type.</p>
            <p className="text-base leading-relaxed">This tool is especially useful for writers who use AI to generate content and want to verify that the output is readable for their target audience. AI-generated text often scores at a high grade level with long, complex sentences — this tool helps you identify and simplify those areas.</p>
            <p className="text-base leading-relaxed">All analysis runs entirely in your browser. Your text is never sent to any server.</p>
          </>}
          useCases={[
            'Check if AI-generated blog posts are readable for a general audience.',
            'Verify that technical documentation is accessible to your target readers.',
            'Improve email newsletters by reducing sentence length and complexity.',
            'Optimize landing page copy for a lower grade level to improve conversions.',
            'Check readability of academic papers and research summaries.',
            'Simplify legal or medical documents for patient or public communication.',
            'Ensure journalism and news articles meet readability standards.',
            'Review marketing copy before publishing to ensure it\'s easy to scan.',
            'Check student writing assignments for grade-appropriate complexity.',
            'Analyze speeches or presentations for audience accessibility.',
          ]}
          faqs={[
            { q: 'What is the Flesch Reading Ease score?', a: 'Flesch Reading Ease is a score from 0 to 100. Higher scores mean easier text. A score of 60–70 is considered standard (8th–9th grade level) and suitable for most general audiences. Scores below 30 indicate very complex, professional-level writing.' },
            { q: 'What is the Flesch-Kincaid Grade Level?', a: 'The Flesch-Kincaid Grade Level maps text complexity to US school grade levels. A grade of 8 means the text is appropriate for an 8th grader. Most web content targets a grade level of 6–8 for maximum accessibility.' },
            { q: 'What is the Gunning Fog Index?', a: 'The Gunning Fog Index estimates the years of formal education needed to understand a piece of text. A score below 12 is generally considered accessible. It weighs the proportion of complex words (3+ syllables) heavily.' },
            { q: 'What counts as a complex word?', a: 'In the Gunning Fog formula, a complex word is any word with three or more syllables. Proper nouns and compound words are technically excluded in strict implementations, but this tool counts all words with 3+ syllables for simplicity.' },
            { q: 'How accurate is the syllable counting?', a: 'The syllable counter uses a heuristic algorithm based on English vowel patterns. It is accurate for the vast majority of common English words. Unusual proper nouns or technical terms may occasionally be miscounted by one syllable.' },
            { q: 'Is my text sent to a server?', a: 'No. All analysis runs locally in your browser using JavaScript. Nothing is uploaded or stored.' },
            { q: 'What reading level should I target?', a: 'For general web content and blogs, aim for a Flesch score of 60–70 (grade 7–9). For marketing copy or mass-market content, 70–80 is better. Technical documentation can go lower. The right level depends on your audience.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Input */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Your Text</label>
            {text && (
              <button
                onClick={() => setText('')}
                className="text-sm px-3 py-1 rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={10}
            className="w-full resize-y rounded-lg px-3 py-3 text-base outline-none transition-all duration-150 placeholder:text-white/50"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: '1.7',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)' }}
          />
        </div>

        {stats && flesch && fog && (
          <>
            {/* Top row — Flesch gauge + key scores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Flesch gauge */}
              <div
                className="rounded-xl p-5 flex flex-col items-center gap-2"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
              >
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Flesch Reading Ease</p>
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                    <circle
                      cx="64" cy="64" r={radius} fill="none"
                      stroke={flesch.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono" style={{ color: flesch.color }}>{stats.flesch}</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>/100</span>
                  </div>
                </div>
                <span className="text-base font-semibold" style={{ color: flesch.color }}>{flesch.label}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{flesch.audience}</span>
              </div>

              {/* Grade Level */}
              <div
                className="rounded-xl p-5 flex flex-col justify-between"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
              >
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>FK Grade Level</p>
                <div>
                  <span className="text-5xl font-bold font-mono" style={{ color: 'rgba(255,255,255,0.95)' }}>{stats.gradeLevel}</span>
                  <span className="ml-1 text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>grade</span>
                </div>
                <p className="text-base mt-3" style={{ color: 'rgba(255,255,255,0.75)' }}>{gradeLabel(stats.gradeLevel)}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>US education level needed to understand the text</p>
              </div>

              {/* Gunning Fog */}
              <div
                className="rounded-xl p-5 flex flex-col justify-between"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
              >
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>Gunning Fog</p>
                <div>
                  <span className="text-5xl font-bold font-mono" style={{ color: fog.color }}>{stats.fog}</span>
                </div>
                <p className="text-base mt-3" style={{ color: fog.color }}>{fog.label}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Years of education needed · target &lt;12</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Words', value: stats.wordCount.toLocaleString() },
                { label: 'Sentences', value: stats.sentenceCount.toLocaleString() },
                { label: 'Syllables', value: stats.syllables.toLocaleString() },
                { label: 'Characters', value: stats.chars.toLocaleString() },
                { label: 'Avg sentence', value: `${stats.avgSentenceLen} words` },
                { label: 'Complex words', value: `${stats.complexWords} (${Math.round((stats.complexWords / stats.wordCount) * 100)}%)` },
                { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
                { label: 'Reading time', value: formatReadingTime(stats.readingTimeSecs) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl px-4 py-3"
                  style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
                >
                  <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</p>
                  <p className="text-base font-semibold font-mono" style={{ color: 'rgba(255,255,255,0.95)' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Flesch scale legend */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
            >
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Flesch Reading Ease Scale</p>
              <div className="space-y-1.5">
                {[
                  { range: '90–100', label: 'Very Easy', note: '5th grade · conversational English', color: '#34d399' },
                  { range: '80–90', label: 'Easy', note: '6th grade · simple prose', color: '#4ade80' },
                  { range: '70–80', label: 'Fairly Easy', note: '7th grade · most consumer content', color: '#a3e635' },
                  { range: '60–70', label: 'Standard', note: '8th–9th grade · recommended for web', color: '#facc15' },
                  { range: '50–60', label: 'Fairly Difficult', note: '10th–12th grade', color: '#fb923c' },
                  { range: '30–50', label: 'Difficult', note: 'College level', color: '#f87171' },
                  { range: '0–30', label: 'Very Confusing', note: 'Professional / academic', color: '#e879f9' },
                ].map(({ range, label, note, color }) => (
                  <div key={range} className="flex items-center gap-3">
                    <span className="w-16 text-sm font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{range}</span>
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: color, boxShadow: stats.flesch >= parseInt(range) && stats.flesch < parseInt(range.split('–')[1] ?? '101') ? `0 0 6px ${color}` : 'none' }}
                    />
                    <span className="text-base font-medium flex-shrink-0" style={{ color }}>{label}</span>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!text && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>Paste any text above to see its readability scores</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Works great for AI-generated content, blog posts, emails, and documentation</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
