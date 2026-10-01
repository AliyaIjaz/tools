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
    <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}>
      <div className="text-6xl font-bold mb-2 tabular-nums" style={{ color }}>{score}%</div>
      <div className="text-base font-medium mb-4" style={{ color }}>{label}</div>
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
    border: '2px solid var(--border-text-idle)',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: '1.7',
    fontSize: '15px',
    padding: '14px 16px',
  }
  const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.85)', fontSize: '1rem', fontWeight: 600 }

  return (
    <ToolLayout
      toolId="plagiarism-checker"
      title="Plagiarism Checker"
      description="Compare two texts to detect similarity and matching phrases — runs entirely in your browser"
      seoContent={
        <SeoSection
          aboutTitle="About this tool"
          about={<>
            <p className="text-lg leading-relaxed">Text Similarity Checker Online is a free tool that compares two pieces of text and measures how similar they are using <strong>Jaccard similarity on word n-grams</strong>. Simply paste the original text and the comparison text, and the tool calculates a similarity score while highlighting matching words and phrases so you can quickly identify overlapping content. Whether you&apos;re reviewing articles, essays, reports, documentation, or product descriptions, this tool provides a fast and easy way to compare text without uploading your data.</p>
            <p className="text-lg leading-relaxed">Unlike traditional plagiarism checkers, this tool compares <strong>only the two texts you provide</strong>. It does not search the internet, academic databases, or external repositories. Instead, it analyzes the shared word sequences (n-grams) between both texts to estimate content similarity, making it ideal for comparing revisions, checking rewritten content, evaluating AI-generated text, and identifying duplicate passages.</p>
            <p className="text-lg leading-relaxed">Everything runs locally in your browser using JavaScript, so your content remains private and never leaves your device. There are no registrations, downloads, or usage limits. Whether you&apos;re a student, teacher, writer, editor, researcher, developer, SEO professional, or content marketer, this online Text Similarity Checker offers a secure and efficient way to compare documents and measure content overlap.</p>
          </>}
          useCasesTitle="Common use cases"
          useCases={[
            'Compare two essays or assignments for shared content.',
            'Check whether a student submission matches a reference document.',
            'Review different versions of an article or report before publishing.',
            'Measure similarity between AI-generated content and source material.',
            'Compare blog posts to identify duplicate or rewritten sections.',
            'Evaluate product descriptions for duplicate content across an online store.',
            'Compare documentation, manuals, or technical guides after revisions.',
            'Review contracts, policies, or legal documents for overlapping text.',
            'Compare website pages during SEO content audits.',
            'Verify rewritten marketing copy before publishing campaigns.',
            'Analyze research papers or reports for repeated passages.',
            'Compare copied text quickly without using an online plagiarism database.',
          ]}
          faqs={[
            { q: 'Is this Text Similarity Checker free?', a: 'Yes. The tool is completely free to use with no subscriptions, registrations, or hidden charges.' },
            { q: 'Is my text uploaded to a server?', a: 'No. All comparisons are performed locally in your browser using JavaScript. Your text is never uploaded, stored, or shared.' },
            { q: 'How does the similarity checker work?', a: 'The tool compares both texts using Jaccard similarity on word n-grams. It measures how many word sequences are shared between the two texts relative to the total number of unique word sequences, producing a similarity score that reflects their level of overlap.' },
            { q: 'What is Jaccard similarity?', a: 'Jaccard similarity is a mathematical measure used to compare two sets. In this tool, each text is broken into word n-grams, and the similarity score is calculated by dividing the number of shared n-grams by the total number of unique n-grams across both texts.' },
            { q: 'What is a word n-gram?', a: 'A word n-gram is a sequence of consecutive words. For example, with an n-gram size of 2, the sentence "The quick brown fox" becomes: "The quick", "quick brown", "brown fox". Comparing n-grams helps identify matching phrases rather than just individual words.' },
            { q: 'Does the tool highlight matching text?', a: 'Yes. Matching words and phrases shared between both texts are highlighted, making it easy to see exactly where content overlaps.' },
            { q: 'Is this a plagiarism checker?', a: 'No. This tool is not a full plagiarism detection service. It only compares the two texts you provide and does not search websites, books, journals, or academic databases for matching content.' },
            { q: 'What does the similarity percentage mean?', a: 'The similarity score indicates how much content the two texts have in common based on shared word n-grams. Higher percentages generally indicate more overlapping phrases, while lower percentages suggest the texts are more distinct.' },
            { q: 'Does formatting affect the results?', a: 'The comparison focuses on textual content rather than formatting. Differences in fonts, colors, or styling do not influence the similarity calculation.' },
            { q: 'Can I compare large documents?', a: 'Yes. There is no fixed document size limit imposed by the tool. Processing speed depends mainly on your browser and device when analyzing very large texts.' },
            { q: 'Can I compare source code?', a: 'The tool is designed primarily for natural language text such as articles, essays, documentation, and reports. While it can compare code as plain text, the similarity score may not accurately reflect structural differences in programming languages.' },
            { q: 'Can I use this tool on mobile devices?', a: 'Yes. The Text Similarity Checker works in all modern desktop and mobile browsers without requiring installation.' },
            { q: 'Who can use this tool?', a: 'This tool is useful for students, teachers, writers, editors, researchers, SEO professionals, content marketers, developers, technical writers, and businesses reviewing duplicate content.' },
            { q: 'Why should I use a Text Similarity Checker?', a: 'A Text Similarity Checker helps you quickly identify overlapping content between two documents without manually reviewing every line. It is useful for checking revisions, validating rewritten content, comparing reports, reviewing AI-generated text, auditing website content, and ensuring originality before publication.' },
          ]}
        />
      }
      category="text"
      iconName="ShieldAlert"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="block" style={labelStyle}>Original Text</label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={10}
              placeholder="Paste the original / reference text here…"
              className="w-full resize-y rounded-xl outline-none transition-all placeholder:text-white/50"
              style={textareaStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)'; e.currentTarget.style.background = 'var(--surface-hover)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)'; e.currentTarget.style.background = 'var(--surface)' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block" style={labelStyle}>Check Against</label>
            <textarea
              value={suspect}
              onChange={(e) => setSuspect(e.target.value)}
              rows={10}
              placeholder="Paste the text you want to compare…"
              className="w-full resize-y rounded-xl outline-none transition-all placeholder:text-white/50"
              style={textareaStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)'; e.currentTarget.style.background = 'var(--surface-hover)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)'; e.currentTarget.style.background = 'var(--surface)' }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCheck}
            disabled={!original.trim() || !suspect.trim()}
            className="px-6 py-3 rounded-xl text-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: 'var(--color-text-tool)', color: '#000' }}
          >
            Check Similarity
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 rounded-xl text-lg font-medium transition-all"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)', color: 'rgba(255,255,255,0.65)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-text-idle)' }}
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
                  style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-tool)' }}>{value}</div>
                  <div className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
                </div>
              ))}
            </div>

            {result.matchingPhrases.length > 0 ? (
              <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}>
                <div className="text-base font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Matching phrases detected
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {result.matchingPhrases.map((phrase, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-base font-mono"
                      style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: 'var(--color-text-tool)' }}>
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-5 text-lg text-center"
                style={{ color: 'rgba(255,255,255,0.45)', background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}>
                No matching phrases found.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
