'use client'

import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean)
}

function getNgrams(tokens: string[], n: number): Set<string> {
  const grams = new Set<string>()
  for (let i = 0; i <= tokens.length - n; i++) grams.add(tokens.slice(i, i + n).join(' '))
  return grams
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0
  const intersection = [...a].filter((x) => b.has(x)).length
  return intersection / (a.size + b.size - intersection)
}

interface AnalysisResult {
  score: number
  matchingPhrases: string[]
  totalWords: number
  uniquePhrases: number
}

function analyze(original: string, suspect: string): AnalysisResult {
  const tokensA = tokenize(original)
  const tokensB = tokenize(suspect)
  const N = 4
  const gramsA = getNgrams(tokensA, N)
  const gramsB = getNgrams(tokensB, N)
  const score = Math.round(jaccardSimilarity(gramsA, gramsB) * 100)
  const matchingSet = new Set([...gramsA].filter((x) => gramsB.has(x)))
  return {
    score,
    matchingPhrases: [...matchingSet].slice(0, 40),
    totalWords: tokensB.length,
    uniquePhrases: Math.max(0, gramsB.size - matchingSet.size),
  }
}

function ScoreMeter({ score }: { score: number }) {
  const color = score < 20 ? '#4ade80' : score < 50 ? '#fbbf24' : '#f87171'
  const label = score < 20 ? 'Low Similarity' : score < 50 ? 'Moderate Similarity' : 'High Similarity — Possible Plagiarism'
  return (
    <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="text-6xl font-bold mb-2 tabular-nums" style={{ color }}>{score}%</div>
      <div className="text-sm font-medium mb-4" style={{ color }}>{label}</div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function PlagiarismCheckerPage() {
  const [original, setOriginal] = useState('')
  const [suspect, setSuspect] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleCheck = useCallback(() => {
    if (!original.trim() || !suspect.trim()) return
    setResult(analyze(original, suspect))
  }, [original, suspect])

  const handleClear = useCallback(() => {
    setOriginal('')
    setSuspect('')
    setResult(null)
  }, [])

  const textareaStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.7',
  }
  const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600 }

  return (
    <ToolLayout
      toolId="plagiarism-checker"
      title="Plagiarism Checker"
      description="Compare two texts to detect similarity and matching phrases — runs entirely in your browser"
      seoContent={
        <SeoSection
          about="Compare two texts to measure how similar they are using Jaccard similarity on word n-grams. Matching phrases are highlighted so you can see exactly which sections overlap. The entire analysis runs in your browser — no text is sent to a server."
          useCases={[
            'Checking whether a student submission matches a reference document',
            'Comparing two versions of an article to find copy-pasted sections',
            'Detecting if AI-generated content was sourced from a specific passage',
            'Verifying originality before publishing a blog post or report',
            'Measuring content overlap between two product descriptions',
          ]}
          faqs={[
            { q: 'What similarity algorithm is used?', a: 'Jaccard similarity on word n-grams — it measures the proportion of shared phrases between the two texts relative to their combined unique phrases.' },
            { q: 'Is this the same as a full plagiarism detection service?', a: 'No. This tool compares only the two texts you provide. It does not search the web or a database of academic papers.' },
            { q: 'Is my text sent anywhere?', a: 'No. All comparison logic runs locally in your browser using JavaScript. Your text is never transmitted.' },
          ]}
        />
      }
      category="text"
      iconName="ShieldAlert"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block" style={labelStyle}>Original Text</label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={10}
              placeholder="Paste the original / reference text here…"
              className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-white/20"
              style={textareaStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>
          <div>
            <label className="mb-2 block" style={labelStyle}>Check Against</label>
            <textarea
              value={suspect}
              onChange={(e) => setSuspect(e.target.value)}
              rows={10}
              placeholder="Paste the text you want to check for plagiarism…"
              className="w-full resize-y rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-white/20"
              style={textareaStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-focus)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCheck}
            disabled={!original.trim() || !suspect.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: 'var(--color-text-tool)', color: '#000' }}
          >
            Check Similarity
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Clear
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <ScoreMeter score={result.score} />

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Words Checked', value: result.totalWords.toLocaleString() },
                { label: 'Matching Phrases', value: result.matchingPhrases.length.toLocaleString() },
                { label: 'Unique Phrases', value: result.uniquePhrases.toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-4 py-4 text-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-tool)' }}>{value}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>

            {result.matchingPhrases.length > 0 ? (
              <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Matching phrases detected
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {result.matchingPhrases.map((phrase, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono"
                      style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: 'var(--color-text-tool)' }}>
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-4 text-sm text-center"
                style={{ color: 'rgba(255,255,255,0.4)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                No matching phrases found.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
