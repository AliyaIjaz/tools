'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Role = 'system' | 'user' | 'assistant'
type Provider = 'openai' | 'anthropic' | 'gemini' | 'raw'

type Message = {
  id: string
  role: Role
  content: string
}

let idCounter = 0
function newId() { return `msg-${++idCounter}` }

const ROLE_COLORS: Record<Role, string> = {
  system:    'var(--color-dev)',
  user:      '#34d399',
  assistant: '#c4b5fd',
}

const ROLE_BG: Record<Role, string> = {
  system:    'rgba(139,92,246,0.12)',
  user:      'rgba(52,211,153,0.1)',
  assistant: 'rgba(196,181,253,0.1)',
}

const ROLE_BORDER: Record<Role, string> = {
  system:    'rgba(139,92,246,0.3)',
  user:      'rgba(52,211,153,0.25)',
  assistant: 'rgba(196,181,253,0.25)',
}

// ── Formatters ─────────────────────────────────────────────────────────────

function formatOpenAI(messages: Message[]): string {
  const payload = {
    model: 'gpt-4o',
    messages: messages.map(({ role, content }) => ({ role, content })),
  }
  return JSON.stringify(payload, null, 2)
}

function formatAnthropic(messages: Message[]): string {
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n')
  const turns = messages.filter((m) => m.role !== 'system').map(({ role, content }) => ({ role, content }))
  const payload: Record<string, unknown> = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: turns,
  }
  if (system) payload.system = system
  // Move system to top for readability
  const ordered: Record<string, unknown> = system
    ? { model: payload.model, max_tokens: payload.max_tokens, system, messages: turns }
    : { model: payload.model, max_tokens: payload.max_tokens, messages: turns }
  return JSON.stringify(ordered, null, 2)
}

function formatGemini(messages: Message[]): string {
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n')
  const turns = messages
    .filter((m) => m.role !== 'system')
    .map(({ role, content }) => ({
      role: role === 'assistant' ? 'model' : 'user',
      parts: [{ text: content }],
    }))
  const payload: Record<string, unknown> = { contents: turns }
  if (system) payload.system_instruction = { parts: [{ text: system }] }
  return JSON.stringify(payload, null, 2)
}

function formatRaw(messages: Message[]): string {
  return messages
    .map(({ role, content }) => {
      const label = role.toUpperCase()
      const border = '─'.repeat(40)
      return `[${label}]\n${border}\n${content}`
    })
    .join('\n\n')
}

function formatOutput(messages: Message[], provider: Provider): string {
  if (messages.length === 0) return ''
  switch (provider) {
    case 'openai':    return formatOpenAI(messages)
    case 'anthropic': return formatAnthropic(messages)
    case 'gemini':    return formatGemini(messages)
    case 'raw':       return formatRaw(messages)
  }
}

const PROVIDERS: { id: Provider; label: string; note: string }[] = [
  { id: 'openai',    label: 'OpenAI',    note: 'GPT-4o / GPT-4 Turbo' },
  { id: 'anthropic', label: 'Anthropic', note: 'Claude Sonnet / Opus' },
  { id: 'gemini',    label: 'Gemini',    note: 'Gemini 2.5 Pro / Flash' },
  { id: 'raw',       label: 'Raw Text',  note: 'Human-readable format' },
]

const EXAMPLE_MESSAGES: Message[] = [
  { id: 'm1', role: 'system',    content: 'You are a helpful coding assistant. Always respond with clean, well-commented code. Prefer TypeScript over JavaScript.' },
  { id: 'm2', role: 'user',      content: 'Write a function that debounces another function with a configurable delay.' },
  { id: 'm3', role: 'assistant', content: 'Here is a debounce implementation in TypeScript:\n\n```typescript\nfunction debounce<T extends (...args: unknown[]) => void>(\n  fn: T,\n  delay: number\n): (...args: Parameters<T>) => void {\n  let timer: ReturnType<typeof setTimeout>\n  return (...args) => {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn(...args), delay)\n  }\n}\n```' },
  { id: 'm4', role: 'user',      content: 'Can you add a leading option that fires immediately on the first call?' },
]

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = '#93c5fd'
      if (/^"/.test(match)) color = /:$/.test(match) ? '#c4b5fd' : '#6ee7b7'
      else if (/true|false/.test(match)) color = '#fdba74'
      else if (/null/.test(match)) color = '#f87171'
      return `<span style="color:${color}">${match}</span>`
    }
  )
}

export default function PromptFormatterPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: newId(), role: 'system', content: '' },
    { id: newId(), role: 'user',   content: '' },
  ])
  const [provider, setProvider] = useState<Provider>('openai')
  const [showProviderMenu, setShowProviderMenu] = useState(false)

  const output = formatOutput(messages, provider)
  const isJson = provider !== 'raw'

  const addMessage = (role: Role) => {
    setMessages((prev) => [...prev, { id: newId(), role, content: '' }])
  }

  const updateMessage = (id: string, field: keyof Message, value: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const loadExample = () => setMessages(EXAMPLE_MESSAGES.map((m) => ({ ...m, id: newId() })))
  const clear = () => setMessages([{ id: newId(), role: 'system', content: '' }, { id: newId(), role: 'user', content: '' }])

  const currentProvider = PROVIDERS.find((p) => p.id === provider)!

  const btnGhost = { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }
  const onHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  return (
    <ToolLayout
      toolId="prompt-formatter"
      title="Prompt Formatter"
      description="Format prompts into OpenAI, Anthropic, and Gemini message structures"
      category="dev"
      iconName="MessageSquareCode"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>Prompt Formatter Online</strong> is a free browser-based tool for structuring AI prompts into the correct message format for <strong>OpenAI (GPT-4o)</strong>, <strong>Anthropic (Claude)</strong>, and <strong>Google Gemini</strong> APIs. Build a conversation with system, user, and assistant turns, then export the exact JSON payload ready to paste into your API call or codebase.</p>
            <p className="text-base leading-relaxed">Each provider uses a slightly different message structure. OpenAI uses a flat <code>messages</code> array with a <code>role</code> field. Anthropic separates the system prompt from the conversation turns and uses a top-level <code>system</code> field. Gemini uses <code>contents</code> with <code>parts</code> arrays and renames the assistant role to <code>model</code>. This tool handles all those differences automatically — just write your prompt and switch providers.</p>
            <p className="text-base leading-relaxed">All formatting runs locally in your browser. Nothing is sent to any server.</p>
          </>}
          useCases={[
            'Build a multi-turn prompt and export it for OpenAI, Claude, or Gemini with one click.',
            'Convert a prompt from one provider format to another when switching APIs.',
            'Quickly scaffold the correct JSON structure for an API call without looking up docs.',
            'Test different system prompt variations by editing and re-exporting.',
            'Build few-shot prompts with user/assistant example turns.',
            'Format prompts for use with the Anthropic SDK, OpenAI SDK, or Google GenAI SDK.',
            'Create a clean, readable plain-text version of a multi-turn conversation.',
            'Share a prompt structure with teammates in a standard JSON format.',
          ]}
          faqs={[
            { q: 'What is the difference between system, user, and assistant roles?', a: 'The system message sets the AI\'s behavior, persona, and constraints. User messages are the human\'s inputs. Assistant messages are the AI\'s previous responses — used to provide few-shot examples or to continue an existing conversation.' },
            { q: 'How does Anthropic handle the system prompt differently?', a: 'Anthropic\'s API takes the system prompt as a separate top-level field (system) rather than as a message in the messages array. This tool automatically moves system messages to the correct location when exporting in Anthropic format.' },
            { q: 'Why does Gemini use "model" instead of "assistant"?', a: 'Google\'s Gemini API uses "model" as the role name for AI responses instead of "assistant". The formatter handles this rename automatically.' },
            { q: 'Can I have multiple system messages?', a: 'For Anthropic and Gemini, multiple system messages are concatenated into a single system field. For OpenAI, all messages including multiple system messages are included in the messages array as-is.' },
            { q: 'What is the Raw Text format?', a: 'Raw Text produces a human-readable version of the conversation with clearly labeled [SYSTEM], [USER], and [ASSISTANT] sections — useful for documentation, sharing with non-technical stakeholders, or storing prompts in plain text files.' },
            { q: 'Is my prompt content sent to a server?', a: 'No. All formatting runs locally in your browser using JavaScript. Your prompts never leave your device.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Provider selector */}
          <div className="relative">
            <button
              onClick={() => setShowProviderMenu((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--color-dev)', color: '#fff' }}
            >
              {currentProvider.label}
              <ChevronDown size={14} style={{ transform: showProviderMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
            </button>
            {showProviderMenu && (
              <div
                className="absolute top-full mt-1 left-0 z-10 rounded-xl overflow-hidden min-w-44"
                style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
              >
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setShowProviderMenu(false) }}
                    className="w-full text-left px-4 py-3 transition-all"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <p className="text-sm font-semibold" style={{ color: provider === p.id ? 'var(--color-dev)' : 'rgba(255,255,255,0.85)' }}>{p.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.note}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={loadExample} className="px-3 py-2 rounded-lg text-sm font-medium transition-all" style={btnGhost} onMouseEnter={(e) => onHover(e, true)} onMouseLeave={(e) => onHover(e, false)}>
            Load example
          </button>
          <button onClick={clear} className="px-3 py-2 rounded-lg text-sm font-medium transition-all" style={btnGhost} onMouseEnter={(e) => onHover(e, true)} onMouseLeave={(e) => onHover(e, false)}>
            Reset
          </button>
        </div>

        {/* Messages builder + Output side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left: message editor */}
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${ROLE_BORDER[msg.role]}`, background: ROLE_BG[msg.role] }}
              >
                {/* Message header */}
                <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <GripVertical size={14} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  {/* Role selector */}
                  <div className="flex rounded-md overflow-hidden flex-shrink-0" style={{ border: `1px solid ${ROLE_BORDER[msg.role]}` }}>
                    {(['system', 'user', 'assistant'] as Role[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateMessage(msg.id, 'role', r)}
                        className="px-2.5 py-1 text-xs font-semibold capitalize transition-all"
                        style={msg.role === r
                          ? { background: ROLE_COLORS[r], color: '#000' }
                          : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
                        onMouseEnter={(e) => { if (msg.role !== r) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                        onMouseLeave={(e) => { if (msg.role !== r) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono ml-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>#{idx + 1}</span>
                  <button
                    onClick={() => removeMessage(msg.id)}
                    className="p-1 rounded transition-all flex-shrink-0"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Content textarea */}
                <textarea
                  value={msg.content}
                  onChange={(e) => updateMessage(msg.id, 'content', e.target.value)}
                  placeholder={
                    msg.role === 'system'    ? 'You are a helpful assistant…' :
                    msg.role === 'user'      ? 'User message…' :
                    'Assistant response…'
                  }
                  rows={4}
                  className="w-full resize-y px-3 py-2.5 text-sm outline-none transition-all placeholder:text-white/50"
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.88)',
                    lineHeight: '1.65',
                    border: 'none',
                  }}
                />
              </div>
            ))}

            {/* Add message buttons */}
            <div className="flex gap-2 flex-wrap">
              {(['system', 'user', 'assistant'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => addMessage(r)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                  style={{ background: ROLE_BG[r], border: `1px solid ${ROLE_BORDER[r]}`, color: ROLE_COLORS[r] }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  <Plus size={13} /> {r}
                </button>
              ))}
            </div>
          </div>

          {/* Right: formatted output */}
          <div
            className="rounded-xl p-4 flex flex-col"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {currentProvider.label} Format
                </span>
                <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{currentProvider.note}</span>
              </div>
              {output && <CopyButton text={output} />}
            </div>

            {output ? (
              <pre
                className="flex-1 rounded-lg px-3 py-3 text-xs overflow-auto leading-relaxed"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  color: 'rgba(255,255,255,0.82)',
                  minHeight: '300px',
                  maxHeight: '600px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: isJson ? syntaxHighlight(output) : output.replace(/\[(\w+)\]/g, '<span style="color:var(--color-dev);font-weight:600">[$1]</span>').replace(/─+/g, '<span style="color:rgba(255,255,255,0.15)">$&</span>') }}
              />
            ) : (
              <div
                className="flex-1 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.07)', minHeight: '300px' }}
              >
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>Add message content to see output</p>
              </div>
            )}

            {/* Token hint */}
            {output && (
              <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                ~{Math.ceil(output.length / 4).toLocaleString()} estimated tokens · use the{' '}
                <a href="/dev/token-counter" className="underline underline-offset-2" style={{ color: 'var(--color-dev)' }}>
                  Token Counter
                </a>{' '}
                for an exact count
              </p>
            )}
          </div>
        </div>

        {/* Quick reference */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Format differences</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { provider: 'OpenAI', detail: 'system / user / assistant all in messages[]', color: '#34d399' },
              { provider: 'Anthropic', detail: 'system is a top-level field; conversation in messages[]', color: '#c4b5fd' },
              { provider: 'Gemini', detail: 'system_instruction at root; assistant renamed to model; content in parts[]', color: '#93c5fd' },
            ].map(({ provider: p, detail, color }) => (
              <div key={p} className="rounded-lg px-3 py-3 space-y-1" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold" style={{ color }}>{p}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
