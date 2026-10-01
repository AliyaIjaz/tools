'use client'

import { useMemo, useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

// Common English stop words to filter out by default
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','it','its','this','that','these','those','are','was',
  'were','be','been','being','have','has','had','do','does','did','will',
  'would','could','should','may','might','shall','can','not','no','nor',
  'so','yet','both','either','neither','as','if','then','than','because',
  'while','although','though','since','until','unless','whether','about',
  'above','after','before','between','into','through','during','without',
  'within','along','following','across','behind','beyond','plus','except',
  'up','out','around','down','off','over','under','again','there','here',
  'when','where','why','how','all','each','every','both','few','more',
  'most','other','some','such','only','own','same','also','just','my',
  'your','his','her','our','their','we','they','i','you','he','she','it',
  'me','him','us','them','what','which','who','whom','any','one','two',
  's','t','re','ve','ll','d','m',
])

type NGramMode = 1 | 2 | 3
type Entry = { phrase: string; count: number; density: number }

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter((w) => w.length > 1)
}

function buildNgrams(tokens: string[], n: NGramMode, stopFilter: boolean): Entry[] {
  const freq: Map<string, number> = new Map()
  const filtered = stopFilter ? tokens.filter((t) => !STOP_WORDS.has(t)) : tokens
  const source = n === 1 ? filtered : tokens

  for (let i = 0; i <= source.length - n; i++) {
    const gram = source.slice(i, i + n).join(' ')
    // For bigrams/trigrams, skip if all words are stop words
    if (n > 1 && stopFilter) {
      const parts = gram.split(' ')
      if (parts.every((p) => STOP_WORDS.has(p))) continue
    }
    freq.set(gram, (freq.get(gram) ?? 0) + 1)
  }

  const total = n === 1 ? filtered.length : Math.max(1, tokens.length - n + 1)

  return Array.from(freq.entries())
    .map(([phrase, count]) => ({ phrase, count, density: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count)
}

function densityBar(density: number, max: number): number {
  return max > 0 ? (density / max) * 100 : 0
}

function barColor(density: number): string {
  if (density >= 5) return '#f87171'   // over-optimized
  if (density >= 3) return '#fb923c'   // high
  if (density >= 1) return '#34d399'   // good
  return 'rgba(255,255,255,0.25)'      // low
}

const PLACEHOLDER = `Paste your article, blog post, or any text here. The tool will analyze keyword frequency, density percentages, and surface your most-used single words, phrases, and trigrams — perfect for SEO content audits and AI-generated text analysis.`

export default function KeywordDensityPage() {
  const [text, setText] = useState('')
  const [ngramMode, setNgramMode] = useState<NGramMode>(1)
  const [stopFilter, setStopFilter] = useState(true)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(30)

  const tokens = useMemo(() => tokenize(text), [text])
  const totalWords = tokens.length

  const entries = useMemo(
    () => buildNgrams(tokens, ngramMode, stopFilter),
    [tokens, ngramMode, stopFilter]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return entries
    const q = search.toLowerCase()
    return entries.filter((e) => e.phrase.includes(q))
  }, [entries, search])

  const displayed = filtered.slice(0, limit)
  const maxDensity = displayed[0]?.density ?? 0

  const csvExport = entries
    .map((e) => `"${e.phrase}",${e.count},${e.density.toFixed(2)}%`)
    .join('\n')
  const csvFull = `Phrase,Count,Density\n${csvExport}`

  return (
    <ToolLayout
      toolId="keyword-density"
      title="Keyword Density Checker"
      description="Analyze keyword frequency and density in your text"
      category="text"
      iconName="BarChart2"
      showAllCategory
      compactRelated
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>Keyword Density Checker Online</strong> is a free browser-based tool that analyzes your text and shows the frequency and density percentage of every word, phrase (bigram), and three-word phrase (trigram). It is designed for <strong>SEO content audits</strong>, checking AI-generated articles for keyword stuffing, and ensuring your content focuses on the right topics.</p>
            <p className="text-lg leading-relaxed">Paste any text and instantly see a ranked list of your most-used keywords with their count and density percentage. Toggle between single keywords, two-word phrases, and three-word phrases. Filter out common stop words like &ldquo;the&rdquo;, &ldquo;and&rdquo;, &ldquo;is&rdquo; to focus on meaningful content words. Color-coded density bars make it easy to spot over-optimized keywords (above 3–5%) at a glance.</p>
            <p className="text-lg leading-relaxed">All analysis runs locally in your browser — your text is never uploaded to any server.</p>
          </>}
          useCases={[
            'Audit blog posts and articles for keyword stuffing before publishing.',
            'Check that AI-generated content focuses on your target keywords.',
            'Find the most-used phrases in a competitor\'s article by pasting it in.',
            'Verify keyword distribution across a long-form piece of content.',
            'Identify topic drift in AI-generated text by checking keyword focus.',
            'Optimize landing page copy by checking keyword density.',
            'Review product descriptions for repeated words or phrases.',
            'Analyze transcripts, speeches, or interview text for key themes.',
            'Export keyword frequency data as CSV for further analysis.',
          ]}
          faqs={[
            { q: 'What is keyword density?', a: 'Keyword density is the percentage of times a keyword or phrase appears relative to the total word count. A density of 1–2% is generally considered natural. Above 3–5% may be flagged as keyword stuffing by search engines.' },
            { q: 'What are stop words?', a: 'Stop words are common words like &ldquo;the&rdquo;, &ldquo;and&rdquo;, &ldquo;is&rdquo;, &ldquo;in&rdquo; that carry little SEO meaning. Filtering them out lets you focus on the meaningful content words in your text.' },
            { q: 'What are bigrams and trigrams?', a: 'Bigrams are two-word phrases (e.g. "keyword density"). Trigrams are three-word phrases (e.g. "keyword density checker"). Analyzing these helps you understand how phrases — not just individual words — are distributed in your content.' },
            { q: 'What density percentage is ideal for SEO?', a: 'There is no universal ideal, but most SEO practitioners aim for 1–2% for primary keywords. Above 3% risks over-optimization penalties. Below 0.5% may indicate the keyword is underrepresented.' },
            { q: 'Is my text sent to a server?', a: 'No. All analysis runs locally in your browser using JavaScript. Nothing is uploaded or stored.' },
            { q: 'Can I export the results?', a: 'Yes. Click the CSV export button to copy all keyword data (phrase, count, density) in CSV format, which you can paste into Excel or Google Sheets.' },
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
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Your Text</label>
            <div className="flex items-center gap-3">
              {totalWords > 0 && (
                <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {totalWords.toLocaleString()} words
                </span>
              )}
              {text && (
                <button
                  onClick={() => { setText(''); setSearch('') }}
                  className="text-base px-3 py-1 rounded-lg transition-all"
                  style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '2px solid var(--border-text-idle)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setLimit(30) }}
            placeholder={PLACEHOLDER}
            rows={9}
            className="w-full resize-y rounded-lg px-3 py-3 text-base outline-none transition-all duration-150 placeholder:text-white/50"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '2px solid var(--border-text)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.7',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)' }}
          />
        </div>

        {/* Controls */}
        {totalWords > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {/* N-gram toggle */}
            <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: '2px solid var(--border-text)' }}>
              {([1, 2, 3] as NGramMode[]).map((n) => (
                <button
                  key={n}
                  onClick={() => { setNgramMode(n); setLimit(30) }}
                  className="px-4 py-2 text-base font-medium transition-all"
                  style={ngramMode === n
                    ? { background: 'var(--color-text-tool)', color: '#000' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={(e) => { if (ngramMode !== n) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' } }}
                  onMouseLeave={(e) => { if (ngramMode !== n) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
                >
                  {n === 1 ? 'Keywords' : n === 2 ? 'Phrases' : 'Trigrams'}
                </button>
              ))}
            </div>

            {/* Stop words toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                className="relative w-9 h-5 rounded-full transition-all flex-shrink-0"
                style={{ background: stopFilter ? 'var(--color-text-tool)' : 'rgba(255,255,255,0.15)' }}
                onClick={() => setStopFilter((v) => !v)}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: stopFilter ? '18px' : '2px' }}
                />
              </div>
              <span className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>Filter stop words</span>
            </label>

            {/* Search */}
            <div className="flex-1 min-w-40">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search keywords…"
                className="w-full rounded-lg px-3 py-2 text-base outline-none transition-all placeholder:text-white/50"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '2px solid var(--border-text-idle)',
                  color: 'rgba(255,255,255,0.85)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)' }}
              />
            </div>

            {/* CSV export */}
            <CopyButton text={csvFull} label="Export CSV" />
          </div>
        )}

        {/* Results table */}
        {totalWords > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
          >
            {/* Table header */}
            <div
              className="grid gap-3 px-4 py-2.5 text-sm font-medium uppercase tracking-widest"
              style={{
                gridTemplateColumns: '1fr 3fr 72px 80px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              <span>#</span>
              <span>Keyword / Phrase</span>
              <span className="text-right">Count</span>
              <span className="text-right">Density</span>
            </div>

            {/* Rows */}
            {displayed.length === 0 ? (
              <div className="px-4 py-8 text-center text-base" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No results found
              </div>
            ) : (
              displayed.map((entry, i) => (
                <div
                  key={entry.phrase}
                  className="grid gap-3 px-4 py-2.5 items-center transition-all"
                  style={{
                    gridTemplateColumns: '1fr 3fr 72px 80px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>{i + 1}</span>
                  <div className="space-y-1 min-w-0">
                    <span className="text-base font-medium block truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>{entry.phrase}</span>
                    {/* Bar */}
                    <div className="w-full rounded-full overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${densityBar(entry.density, maxDensity)}%`,
                          background: barColor(entry.density),
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-base font-mono text-right" style={{ color: 'rgba(255,255,255,0.65)' }}>{entry.count}</span>
                  <span
                    className="text-base font-mono font-semibold text-right"
                    style={{ color: barColor(entry.density) }}
                  >
                    {entry.density.toFixed(2)}%
                  </span>
                </div>
              ))
            )}

            {/* Load more */}
            {filtered.length > limit && (
              <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setLimit((l) => l + 30)}
                  className="w-full py-2 rounded-lg text-base font-medium transition-all"
                  style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  Show more ({filtered.length - limit} remaining)
                </button>
              </div>
            )}

            {/* Summary footer */}
            <div
              className="px-4 py-2.5 flex items-center justify-between text-sm"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
            >
              <span>Showing {displayed.length} of {filtered.length} {ngramMode === 1 ? 'keywords' : ngramMode === 2 ? 'phrases' : 'trigrams'}</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#34d399' }} /> 1–3% good</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#fb923c' }} /> 3–5% high</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#f87171' }} /> 5%+ over</span>
              </span>
            </div>
          </div>
        )}

        {!text && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Paste any text above to analyze keyword frequency and density
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Works for blog posts, articles, AI-generated content, landing pages, and more
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
