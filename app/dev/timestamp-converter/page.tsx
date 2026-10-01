'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ArrowDown, ArrowUp } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

const TIMEZONES = [
  { label: 'UTC', tz: 'UTC' },
  { label: 'US/New York', tz: 'America/New_York' },
  { label: 'US/Los Angeles', tz: 'America/Los_Angeles' },
  { label: 'US/Chicago', tz: 'America/Chicago' },
  { label: 'UK/London', tz: 'Europe/London' },
  { label: 'EU/Paris', tz: 'Europe/Paris' },
  { label: 'EU/Berlin', tz: 'Europe/Berlin' },
  { label: 'Asia/Dubai', tz: 'Asia/Dubai' },
  { label: 'Asia/Karachi', tz: 'Asia/Karachi' },
  { label: 'Asia/Mumbai', tz: 'Asia/Kolkata' },
  { label: 'Asia/Singapore', tz: 'Asia/Singapore' },
  { label: 'Asia/Tokyo', tz: 'Asia/Tokyo' },
  { label: 'Asia/Shanghai', tz: 'Asia/Shanghai' },
  { label: 'AU/Sydney', tz: 'Australia/Sydney' },
]

type Unit = 'seconds' | 'milliseconds'

function toDate(value: string, unit: Unit): Date | null {
  const n = Number(value.trim())
  if (isNaN(n)) return null
  return new Date(unit === 'milliseconds' ? n : n * 1000)
}

function formatInTz(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    }).format(date).replace(',', '')
  } catch {
    return '—'
  }
}

function relativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  const abs = Math.abs(diff)
  const future = diff < 0
  const fmt = (n: number, unit: string) => `${future ? 'in ' : ''}${n} ${unit}${n !== 1 ? 's' : ''}${future ? '' : ' ago'}`
  if (abs < 60) return fmt(abs, 'second')
  if (abs < 3600) return fmt(Math.floor(abs / 60), 'minute')
  if (abs < 86400) return fmt(Math.floor(abs / 3600), 'hour')
  if (abs < 86400 * 30) return fmt(Math.floor(abs / 86400), 'day')
  if (abs < 86400 * 365) return fmt(Math.floor(abs / (86400 * 30)), 'month')
  return fmt(Math.floor(abs / (86400 * 365)), 'year')
}

export default function TimestampConverterPage() {
  const [tsInput, setTsInput] = useState('')
  const [unit, setUnit] = useState<Unit>('seconds')
  const [dateInput, setDateInput] = useState('')
  const [selectedTz, setSelectedTz] = useState('UTC')
  const [now, setNow] = useState<Date>(new Date())

  // Live clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const parsedDate = tsInput ? toDate(tsInput, unit) : null
  const isValidTs = parsedDate !== null && !isNaN(parsedDate.getTime())

  const parsedFromDate = dateInput ? new Date(dateInput) : null
  const isValidDate = parsedFromDate !== null && !isNaN(parsedFromDate.getTime())

  const useNow = useCallback(() => {
    const d = new Date()
    setTsInput(String(unit === 'seconds' ? Math.floor(d.getTime() / 1000) : d.getTime()))
  }, [unit])

  const setUnitAndConvert = (u: Unit) => {
    setUnit(u)
    if (tsInput) {
      const n = Number(tsInput)
      if (!isNaN(n)) {
        setTsInput(String(u === 'seconds' ? Math.round(n / 1000) : n * 1000))
      }
    }
  }

  const btnGhost = { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-dev)', color: 'rgba(255,255,255,0.65)' }
  const onHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  const nowSecs = Math.floor(now.getTime() / 1000)
  const nowMs = now.getTime()

  return (
    <ToolLayout
      toolId="timestamp-converter"
      title="Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and back"
      category="dev"
      iconName="Clock"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>Timestamp Converter Online</strong> is a free browser-based tool for converting Unix timestamps to human-readable dates and times, and vice versa. It supports both <strong>seconds</strong> and <strong>milliseconds</strong> epoch formats and displays results across 14 major timezones simultaneously — making it ideal for developers debugging API responses, logs, database records, or AI-generated data.</p>
            <p className="text-lg leading-relaxed">Paste any Unix timestamp and instantly see the equivalent UTC date, ISO 8601 string, relative time (e.g. &ldquo;3 days ago&rdquo;), and local times across multiple timezones. You can also go the other direction — pick a date and time to get the corresponding Unix timestamp in seconds and milliseconds.</p>
            <p className="text-lg leading-relaxed">Everything runs in your browser with no server requests and no data sent anywhere.</p>
          </>}
          useCases={[
            'Convert API response timestamps to a readable date for debugging.',
            'Check what Unix timestamp corresponds to a specific date and time.',
            'Find the current Unix timestamp in seconds or milliseconds.',
            'Compare timestamps across timezones when working with distributed teams.',
            'Convert database createdAt / updatedAt fields from epoch to local time.',
            'Verify JWT expiry (exp) or issued-at (iat) claim values.',
            'Convert timestamps in log files to a readable format.',
            'Calculate relative time — how long ago or until a given timestamp.',
            'Generate Unix timestamps for test fixtures or seed data.',
          ]}
          faqs={[
            { q: 'What is a Unix timestamp?', a: 'A Unix timestamp (also called epoch time) is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC. It is a common way to represent dates and times in software because it is timezone-independent and easy to compare mathematically.' },
            { q: 'What is the difference between seconds and milliseconds timestamps?', a: 'Unix timestamps in seconds are 10 digits (e.g. 1700000000). Millisecond timestamps are 13 digits (e.g. 1700000000000). JavaScript\'s Date.now() returns milliseconds, while most server-side languages and APIs return seconds by default.' },
            { q: 'What is ISO 8601 format?', a: 'ISO 8601 is an international standard for representing dates and times, such as 2024-11-14T22:13:20.000Z. The trailing Z means UTC. This format is widely used in JSON APIs, databases, and log files.' },
            { q: 'Why do some timestamps show as invalid?', a: 'Very small numbers (e.g. 0–999) are valid timestamps but represent dates in 1970. Very large numbers may exceed JavaScript\'s safe date range. Always check whether your timestamp is in seconds or milliseconds — a common source of confusion.' },
            { q: 'How do I convert a date to a Unix timestamp?', a: 'Use the "Date → Timestamp" section: pick a date and time, and the tool immediately shows the corresponding Unix timestamp in both seconds and milliseconds.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Live clock */}
        <div
          className="rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Current Unix Time</p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl font-bold font-mono" style={{ color: 'var(--color-dev)' }}>{nowSecs}</span>
              <span className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{nowMs} ms</span>
            </div>
          </div>
          <div className="flex gap-2">
            <CopyButton text={String(nowSecs)} />
            <button
              onClick={useNow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
              style={btnGhost}
              onMouseEnter={(e) => onHover(e, true)}
              onMouseLeave={(e) => onHover(e, false)}
            >
              <RefreshCw size={13} /> Use now
            </button>
          </div>
        </div>

        {/* Timestamp → Date */}
        <div
          className="rounded-xl p-4 space-y-4"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <div className="flex items-center gap-2">
            <ArrowDown size={14} style={{ color: 'var(--color-dev)' }} />
            <span className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Timestamp → Date</span>
          </div>

          {/* Input row */}
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={tsInput}
              onChange={(e) => setTsInput(e.target.value)}
              placeholder="e.g. 1700000000"
              className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-base outline-none transition-all font-mono placeholder:text-white/50"
              style={{
                background: 'rgba(0,0,0,0.35)',
                border: '2px solid var(--border-dev)',
                color: 'rgba(255,255,255,0.92)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
            />
            {/* Unit toggle */}
            <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: '2px solid var(--border-dev)' }}>
              {(['seconds', 'milliseconds'] as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnitAndConvert(u)}
                  className="px-3 py-2 text-base font-medium transition-all"
                  style={unit === u
                    ? { background: 'var(--color-dev)', color: '#fff' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={(e) => { if (unit !== u) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' } }}
                  onMouseLeave={(e) => { if (unit !== u) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
                >
                  {u === 'seconds' ? 's' : 'ms'}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {isValidTs && parsedDate && (
            <div className="space-y-2">
              {[
                { label: 'ISO 8601 (UTC)', value: parsedDate.toISOString() },
                { label: 'UTC', value: parsedDate.toUTCString() },
                { label: 'Relative', value: relativeTime(parsedDate) },
                { label: 'Seconds', value: String(Math.floor(parsedDate.getTime() / 1000)) },
                { label: 'Milliseconds', value: String(parsedDate.getTime()) },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-sm font-medium w-28 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span className="flex-1 text-base font-mono truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>{value}</span>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          )}

          {tsInput && !isValidTs && (
            <p className="text-base" style={{ color: '#f87171' }}>Invalid timestamp — enter a numeric Unix timestamp</p>
          )}
        </div>

        {/* Timezone grid */}
        {isValidTs && parsedDate && (
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Timezone Breakdown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIMEZONES.map(({ label, tz }) => (
                <div
                  key={tz}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                  style={{
                    background: selectedTz === tz ? 'rgba(139,92,246,0.12)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${selectedTz === tz ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedTz(tz)}
                >
                  <span className="text-sm font-medium w-28 flex-shrink-0" style={{ color: selectedTz === tz ? 'var(--color-dev)' : 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span className="flex-1 text-base font-mono" style={{ color: 'rgba(255,255,255,0.82)' }}>{formatInTz(parsedDate, tz)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date → Timestamp */}
        <div
          className="rounded-xl p-4 space-y-4"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <div className="flex items-center gap-2">
            <ArrowUp size={14} style={{ color: 'var(--color-dev)' }} />
            <span className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Date → Timestamp</span>
          </div>

          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full rounded-lg px-3 py-2.5 text-base outline-none transition-all font-mono"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '2px solid var(--border-dev)',
              color: 'rgba(255,255,255,0.92)',
              colorScheme: 'dark',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-dev)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
          />

          {isValidDate && parsedFromDate && (
            <div className="space-y-2">
              {[
                { label: 'Seconds', value: String(Math.floor(parsedFromDate.getTime() / 1000)) },
                { label: 'Milliseconds', value: String(parsedFromDate.getTime()) },
                { label: 'ISO 8601', value: parsedFromDate.toISOString() },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-sm font-medium w-28 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span className="flex-1 text-base font-mono truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>{value}</span>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          )}

          {!dateInput && (
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Pick a date and time to get the Unix timestamp
            </p>
          )}
        </div>

      </div>
    </ToolLayout>
  )
}
