'use client'

import { useState, useMemo } from 'react'
import { encode as encodeCl100k } from 'gpt-tokenizer/encoding/cl100k_base'
import { encode as encodeO200k } from 'gpt-tokenizer/encoding/o200k_base'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type ModelGroup = {
  label: string
  encoder: 'cl100k' | 'o200k'
  models: { name: string; contextWindow: number; inputCostPer1M: number; outputCostPer1M: number }[]
}

const MODEL_GROUPS: ModelGroup[] = [
  {
    label: 'OpenAI — GPT-4o',
    encoder: 'o200k',
    models: [
      { name: 'gpt-4o', contextWindow: 128000, inputCostPer1M: 2.5, outputCostPer1M: 10 },
      { name: 'gpt-4o-mini', contextWindow: 128000, inputCostPer1M: 0.15, outputCostPer1M: 0.6 },
    ],
  },
  {
    label: 'OpenAI — GPT-4 Turbo',
    encoder: 'cl100k',
    models: [
      { name: 'gpt-4-turbo', contextWindow: 128000, inputCostPer1M: 10, outputCostPer1M: 30 },
      { name: 'gpt-4', contextWindow: 8192, inputCostPer1M: 30, outputCostPer1M: 60 },
    ],
  },
  {
    label: 'OpenAI — GPT-3.5',
    encoder: 'cl100k',
    models: [
      { name: 'gpt-3.5-turbo', contextWindow: 16385, inputCostPer1M: 0.5, outputCostPer1M: 1.5 },
    ],
  },
  {
    label: 'Anthropic — Claude 4',
    encoder: 'cl100k',
    models: [
      { name: 'claude-opus-4', contextWindow: 200000, inputCostPer1M: 15, outputCostPer1M: 75 },
      { name: 'claude-sonnet-4', contextWindow: 200000, inputCostPer1M: 3, outputCostPer1M: 15 },
    ],
  },
  {
    label: 'Anthropic — Claude 3.5',
    encoder: 'cl100k',
    models: [
      { name: 'claude-3.5-sonnet', contextWindow: 200000, inputCostPer1M: 3, outputCostPer1M: 15 },
      { name: 'claude-3.5-haiku', contextWindow: 200000, inputCostPer1M: 0.8, outputCostPer1M: 4 },
    ],
  },
  {
    label: 'Google — Gemini',
    encoder: 'cl100k',
    models: [
      { name: 'gemini-2.5-pro', contextWindow: 1000000, inputCostPer1M: 1.25, outputCostPer1M: 10 },
      { name: 'gemini-2.5-flash', contextWindow: 1000000, inputCostPer1M: 0.15, outputCostPer1M: 0.6 },
    ],
  },
]

const ALL_MODELS = MODEL_GROUPS.flatMap((g) => g.models.map((m) => ({ ...m, encoder: g.encoder })))

function formatCost(usd: number): string {
  if (usd < 0.000001) return '<$0.000001'
  if (usd < 0.01) return `$${usd.toFixed(6)}`
  if (usd < 1) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(4)}`
}

function formatNumber(n: number): string {
  return n.toLocaleString()
}

function contextUsageColor(pct: number): string {
  if (pct >= 90) return '#f87171'
  if (pct >= 70) return '#fb923c'
  if (pct >= 50) return '#facc15'
  return '#34d399'
}

export default function TokenCounterPage() {
  const [text, setText] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4o')

  const model = ALL_MODELS.find((m) => m.name === selectedModel) ?? ALL_MODELS[0]

  const { tokenCount, tokens } = useMemo(() => {
    if (!text) return { tokenCount: 0, tokens: [] as number[] }
    try {
      const encoded = model.encoder === 'o200k' ? encodeO200k(text) : encodeCl100k(text)
      return { tokenCount: encoded.length, tokens: encoded as number[] }
    } catch {
      return { tokenCount: 0, tokens: [] as number[] }
    }
  }, [text, model.encoder])

  const charCount = text.length
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const sentenceCount = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) ?? []).length
  const contextPct = model.contextWindow > 0 ? Math.min((tokenCount / model.contextWindow) * 100, 100) : 0
  const inputCost = (tokenCount / 1_000_000) * model.inputCostPer1M

  const stats = [
    { label: 'Tokens', value: formatNumber(tokenCount), accent: true },
    { label: 'Characters', value: formatNumber(charCount) },
    { label: 'Words', value: formatNumber(wordCount) },
    { label: 'Sentences', value: formatNumber(sentenceCount) },
  ]

  return (
    <ToolLayout
      toolId="token-counter"
      title="Token Counter"
      description="Count tokens for GPT-4, Claude, and Gemini models instantly"
      category="dev"
      iconName="Hash"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>Token Counter Online</strong> is a free, browser-based tool that counts tokens in your text for major AI language models including <strong>GPT-4o, GPT-4 Turbo, Claude 3.5, Claude 4, and Gemini</strong>. Tokens are the units AI models use to process text — understanding token counts helps you manage API costs, stay within context limits, and optimize your prompts.</p>
            <p className="text-base leading-relaxed">Select a model, paste your prompt or text, and instantly see the token count, estimated API input cost, and how much of the model&apos;s context window your text occupies. All tokenization runs entirely in your browser — your text is never sent to any server.</p>
            <p className="text-base leading-relaxed">Different models use different tokenizers. GPT-4o uses the <strong>o200k</strong> tokenizer while GPT-4, GPT-3.5, and Claude models use the <strong>cl100k</strong> tokenizer. This tool automatically applies the correct tokenizer for the model you select.</p>
          </>}
          useCases={[
            'Check if your prompt fits within the context window before making an API call.',
            'Estimate API costs before sending large documents to GPT-4 or Claude.',
            'Optimize prompts by trimming token count to reduce inference costs.',
            'Compare token counts across models to choose the most cost-efficient option.',
            'Verify that a conversation history won\'t exceed the model\'s context limit.',
            'Understand how different writing styles affect token usage.',
            'Estimate costs for batch processing large datasets through AI APIs.',
            'Debug why an API call is failing due to context window overflow.',
            'Plan retrieval-augmented generation (RAG) chunk sizes based on token limits.',
          ]}
          faqs={[
            { q: 'What is a token?', a: 'A token is a chunk of text that an AI model processes as a single unit. Tokens are not always whole words — a word like "tokenization" might be split into two tokens, while common short words like "the" are a single token. On average, one token corresponds to roughly 4 characters or 0.75 words in English.' },
            { q: 'Why do different models have different token counts for the same text?', a: 'Different models use different tokenizers (vocabulary sets). GPT-4o uses the o200k tokenizer with a 200,000-token vocabulary, while GPT-4 and Claude use cl100k. The same text can produce slightly different token counts depending on which tokenizer is used.' },
            { q: 'How accurate are the cost estimates?', a: 'Cost estimates are based on publicly listed API pricing and represent input token costs only. Actual costs also include output tokens and may vary based on your pricing tier, discounts, or pricing changes. Always check the provider\'s current pricing page for the most accurate figures.' },
            { q: 'Is my text sent to any server?', a: 'No. All tokenization happens locally in your browser using the gpt-tokenizer JavaScript library. Your text never leaves your device.' },
            { q: 'Why does Claude use the same tokenizer as GPT-4?', a: 'Claude uses a similar BPE (Byte Pair Encoding) tokenizer based on cl100k. While Anthropic\'s tokenizer is not identical, cl100k provides a very close approximation for token counting purposes. Counts may differ by a small percentage from Anthropic\'s actual tokenizer.' },
            { q: 'What is a context window?', a: 'A context window is the maximum number of tokens a model can process in a single request, including both the input prompt and the output response. For example, GPT-4o has a 128,000-token context window — roughly 96,000 words.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Model selector */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <label className="block text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Model
          </label>
          <div className="flex flex-wrap gap-2">
            {MODEL_GROUPS.map((group) =>
              group.models.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModel(m.name)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={selectedModel === m.name
                    ? { background: 'var(--color-dev)', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => { if (selectedModel !== m.name) { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' } }}
                  onMouseLeave={(e) => { if (selectedModel !== m.name) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' } }}
                >
                  {m.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Text input */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Your Text / Prompt
            </label>
            {text && (
              <button
                onClick={() => setText('')}
                className="text-sm px-3 py-1 rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your prompt or text here…"
            rows={12}
            className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none transition-all duration-150 placeholder:text-white/20"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.7',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ label, value, accent }) => (
            <div
              key={label}
              className="rounded-xl px-4 py-4 flex flex-col gap-1"
              style={{ background: 'var(--surface)', border: `1px solid ${accent ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)'}` }}
            >
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: accent ? 'var(--color-dev)' : 'rgba(255,255,255,0.92)' }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Context window + cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Context usage */}
          <div
            className="rounded-xl px-4 py-4 space-y-3"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Context Window
              </span>
              <span className="text-sm font-mono font-semibold" style={{ color: contextUsageColor(contextPct) }}>
                {contextPct.toFixed(1)}%
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${contextPct}%`, background: contextUsageColor(contextPct) }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <span>{formatNumber(tokenCount)} used</span>
              <span>{formatNumber(model.contextWindow)} max</span>
            </div>
          </div>

          {/* Cost estimate */}
          <div
            className="rounded-xl px-4 py-4 space-y-2"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Estimated Input Cost
            </span>
            <div className="text-2xl font-bold font-mono" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {tokenCount === 0 ? '—' : formatCost(inputCost)}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              ${model.inputCostPer1M}/M input · ${model.outputCostPer1M}/M output · <span className="font-mono">{selectedModel}</span>
            </div>
          </div>
        </div>

        {/* Token IDs */}
        {tokens.length > 0 && (
          <div
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Token IDs
                <span className="ml-2 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  ({tokens.length} tokens)
                </span>
              </span>
              <CopyButton text={`[${tokens.join(', ')}]`} />
            </div>
            <div
              className="rounded-lg px-3 py-3 text-xs font-mono overflow-auto leading-relaxed"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                maxHeight: '120px',
              }}
            >
              {tokens.slice(0, 500).join(', ')}{tokens.length > 500 ? ` … +${tokens.length - 500} more` : ''}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
