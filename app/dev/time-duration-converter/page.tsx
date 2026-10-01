'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import { BASE_URL } from '@/lib/constants'

type UnitId = 'ms' | 's' | 'min' | 'h' | 'd' | 'w' | 'mo' | 'yr'

interface Unit {
  id: UnitId
  label: string
  ms: number
}

const UNITS: Unit[] = [
  { id: 'ms',  label: 'Milliseconds (ms)',  ms: 1 },
  { id: 's',   label: 'Seconds (s)',         ms: 1_000 },
  { id: 'min', label: 'Minutes (min)',       ms: 60_000 },
  { id: 'h',   label: 'Hours (h)',           ms: 3_600_000 },
  { id: 'd',   label: 'Days (d)',            ms: 86_400_000 },
  { id: 'w',   label: 'Weeks (w)',           ms: 604_800_000 },
  { id: 'mo',  label: 'Months (mo)',         ms: 2_629_746_000 },  // average: 365.2425/12 days
  { id: 'yr',  label: 'Years (yr)',          ms: 31_556_952_000 }, // average: 365.2425 days
]

const UNIT_MAP = Object.fromEntries(UNITS.map((u) => [u.id, u])) as Record<UnitId, Unit>

const DEV_COLOR = 'var(--color-dev)'

const COMMON_DURATIONS: { label: string; ms: number }[] = [
  { label: '1 second',    ms: 1_000 },
  { label: '1 minute',    ms: 60_000 },
  { label: '1 hour',      ms: 3_600_000 },
  { label: '24 hours',    ms: 86_400_000 },
  { label: '1 week',      ms: 604_800_000 },
  { label: '30 days',     ms: 2_592_000_000 },
  { label: '1 year',      ms: 31_536_000_000 },
]

function formatResult(totalMs: number, unit: Unit): string {
  const val = totalMs / unit.ms
  if (val === 0) return '0'
  const s = parseFloat(val.toPrecision(10)).toString()
  return s
}

function parseInput(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '')
  if (!cleaned) return null
  const n = Number(cleaned)
  if (isNaN(n) || n < 0) return null
  return n
}

export default function TimeDurationConverterPage() {
  const [activeUnit, setActiveUnit] = useState<UnitId>('s')
  const [inputValue, setInputValue] = useState('')

  const totalMs = parseInput(inputValue) !== null
    ? parseInput(inputValue)! * UNIT_MAP[activeUnit].ms
    : null

  const handleChange = (unitId: UnitId, raw: string) => {
    setActiveUnit(unitId)
    setInputValue(raw)
  }

  const handlePreset = (ms: number) => {
    setActiveUnit('ms')
    setInputValue(String(ms))
  }

  const clearAll = () => setInputValue('')

  const hasInput = inputValue.trim() !== ''

  const faqs = [
    { q: 'How many milliseconds are in a second?', a: '1 second = 1,000 milliseconds. Milliseconds are the standard unit for API timeouts, database query durations, and animation timing in browsers.' },
    { q: 'How many seconds are in an hour?', a: '1 hour = 3,600 seconds. That comes from 60 minutes × 60 seconds. It\'s one of the most common values in backend configuration — JWT expiry, OAuth token lifetimes, and rate-limit windows are frequently set to 3600 seconds.' },
    { q: 'How many seconds are in a day?', a: '1 day = 86,400 seconds (24 hours × 60 minutes × 60 seconds). This is a standard constant for daily TTL values, cache max-age headers, and cron schedules.' },
    { q: 'What is 86400 seconds in hours?', a: '86,400 seconds = exactly 24 hours = 1 full day. Divide by 3600 to convert: 86400 ÷ 3600 = 24. This is the most common daily TTL value in Redis and HTTP cache configurations.' },
    { q: 'How many minutes are in a day?', a: '1 day = 1,440 minutes (24 hours × 60 minutes). In milliseconds that\'s 86,400,000 ms.' },
    { q: 'How do I convert seconds to minutes in JavaScript?', a: 'Divide by 60: const minutes = seconds / 60. To convert milliseconds to seconds first: const seconds = ms / 1000. Chained: const minutes = ms / 1000 / 60.' },
    { q: 'How are months and years calculated?', a: 'Months use an average of 30.436875 days (365.2425 / 12), and years use 365.2425 days to account for leap years. These are the standard Gregorian calendar averages used in most programming contexts.' },
    { q: 'What is a TTL and how is it expressed?', a: 'TTL (Time To Live) defines how long a value is cached or valid. Redis and most caches express TTL in seconds. HTTP Cache-Control headers use seconds. DNS TTL values are also in seconds.' },
    { q: 'What are common cron interval durations?', a: 'Every minute = 60s, every 5 minutes = 300s, every hour = 3600s, every day = 86400s, every week = 604800s. Use this tool to quickly sanity-check cron job configurations and rate limits.' },
    { q: 'How many milliseconds in an hour?', a: '1 hour = 3,600,000 ms. That\'s 3600 seconds × 1000. JWT expiry and OAuth token lifetimes are often expressed in seconds or milliseconds depending on the library.' },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <ToolLayout
      toolId="time-duration-converter"
      title="Milliseconds to Seconds Converter — ms, Minutes, Hours, Days"
      description="Convert between milliseconds, seconds, minutes, hours, days, weeks, months, and years"
      category="dev"
      iconName="Timer"
      showAllCategory
      compactRelated
      seoContent={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Milliseconds to Seconds Converter Online',
            url: `${BASE_URL}/dev/time-duration-converter`,
            featureList: ['Milliseconds to seconds', 'Seconds to minutes', 'Minutes to hours', 'Hours to days', 'Time unit converter', 'API timeout calculator', 'TTL converter', 'Cron interval converter'],
          }) }} />
          <SeoSection
            aboutTitle="How to Convert Time Durations: ms, Seconds, Minutes, Hours"
            about={<>
              <p className="text-lg leading-relaxed"><strong>Milliseconds to Seconds Converter</strong> is a free browser-based tool that instantly converts between all common time units — milliseconds, seconds, minutes, hours, days, weeks, months, and years. Type any value and every other unit updates live.</p>
              <p className="text-lg leading-relaxed">Useful for developers working with API timeouts, Redis TTLs, JWT token expiry, rate limits, cache durations, and cron job intervals. All conversion runs in your browser — nothing is sent to any server.</p>
              <p className="text-lg leading-relaxed">Common reference values: <strong>1 second = 1,000 ms</strong> · <strong>1 minute = 60 seconds = 60,000 ms</strong> · <strong>1 hour = 3,600 seconds = 3,600,000 ms</strong> · <strong>1 day = 86,400 seconds</strong>. Conversion formulas: ms ÷ 1,000 = seconds · seconds ÷ 60 = minutes · minutes ÷ 60 = hours.</p>
            </>}
            useCasesTitle="When to Use a Time Duration Converter"
            useCases={[
              'Convert milliseconds to seconds for API timeout configuration.',
              'Set Redis TTL values — confirm hours expressed in seconds.',
              'Verify JWT expiry: "expires_in: 3600" = exactly 1 hour.',
              'Convert cron interval durations to human-readable time.',
              'Check cache max-age values in HTTP Cache-Control headers.',
              'Calculate rate-limit windows (e.g. 1000 req / 15 minutes in ms).',
              'Verify OAuth token lifetimes against policy requirements.',
              'Convert durations for monitoring alerts and SLA definitions.',
            ]}
            faqs={faqs}
          />
        </>
      }
    >
      <div className="space-y-4">

        {/* Unit fields */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Duration Units
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {UNITS.map((unit) => {
              const isActive = activeUnit === unit.id && hasInput
              const displayVal = totalMs !== null ? formatResult(totalMs, unit) : (activeUnit === unit.id ? inputValue : '')
              return (
                <UnitField
                  key={unit.id}
                  unit={unit}
                  value={displayVal}
                  isActive={isActive}
                  onChange={(v) => handleChange(unit.id, v)}
                  onFocus={() => { if (!hasInput) setActiveUnit(unit.id) }}
                />
              )
            })}
          </div>
        </div>

        {/* Millisecond callout */}
        {totalMs !== null && (
          <div
            className="rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'rgba(139,92,246,0.08)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Exact millisecond count</p>
              <p className="text-lg font-mono font-semibold" style={{ color: DEV_COLOR }}>
                {totalMs.toLocaleString()} <span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>ms</span>
              </p>
            </div>
            <CopyButton text={totalMs.toString()} />
          </div>
        )}

        {/* Clear */}
        {hasInput && (
          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className="text-base px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', border: '2px solid var(--border-dev-idle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Empty state */}
        {!hasInput && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Type a value in any unit to convert</p>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>All units update simultaneously</p>
          </div>
        )}

        {/* Common presets */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Common Durations</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DURATIONS.map(({ label, ms }) => (
              <button
                key={label}
                onClick={() => handlePreset(ms)}
                className="text-base px-3 py-1.5 rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(139,92,246,0.08)', border: '2px solid var(--border-dev-idle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-dev)'; e.currentTarget.style.borderColor = 'var(--color-dev)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'var(--border-dev-idle)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Reference table */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Quick Reference</p>
          <div className="overflow-x-auto">
            <table className="w-full text-base font-mono border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 pr-6 text-sm font-semibold uppercase tracking-wider" style={{ color: DEV_COLOR }}>Unit</th>
                  <th className="text-left pb-2 pr-6 text-sm font-semibold uppercase tracking-wider" style={{ color: DEV_COLOR }}>In Seconds</th>
                  <th className="text-left pb-2 text-sm font-semibold uppercase tracking-wider" style={{ color: DEV_COLOR }}>In Milliseconds</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1 minute',  '60',          '60,000'],
                  ['1 hour',    '3,600',        '3,600,000'],
                  ['1 day',     '86,400',       '86,400,000'],
                  ['1 week',    '604,800',      '604,800,000'],
                  ['1 month',   '2,629,746',    '2,629,746,000'],
                  ['1 year',    '31,556,952',   '31,556,952,000'],
                ].map(([unit, secs, ms]) => (
                  <tr key={unit} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="py-1.5 pr-6" style={{ color: DEV_COLOR }}>{unit}</td>
                    <td className="py-1.5 pr-6" style={{ color: 'rgba(255,255,255,0.7)' }}>{secs}</td>
                    <td className="py-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </ToolLayout>
  )
}

interface UnitFieldProps {
  unit: Unit
  value: string
  isActive: boolean
  onChange: (v: string) => void
  onFocus: () => void
}

function UnitField({ unit, value, isActive, onChange, onFocus }: UnitFieldProps) {
  return (
    <div
      className="rounded-lg p-3 space-y-1.5 transition-all"
      style={{
        background: 'rgba(0,0,0,0.2)',
        border: `2px solid ${isActive ? DEV_COLOR : 'var(--border-dev-idle)'}`,
        boxShadow: isActive ? `0 0 0 1px ${DEV_COLOR}22` : 'none',
      }}
    >
      <span className="text-sm font-semibold" style={{ color: isActive ? DEV_COLOR : 'rgba(255,255,255,0.55)' }}>
        {unit.label}
      </span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => {
            onFocus()
            e.currentTarget.style.borderColor = DEV_COLOR
          }}
          onBlur={(e) => {
            if (!isActive) e.currentTarget.style.borderColor = 'var(--border-dev)'
          }}
          placeholder="0"
          className="flex-1 min-w-0 rounded-md px-2.5 py-1.5 text-lg font-mono outline-none transition-all placeholder:text-white/50"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: `2px solid ${isActive ? DEV_COLOR : 'var(--border-dev)'}`,
            color: isActive ? DEV_COLOR : 'rgba(255,255,255,0.92)',
          }}
        />
        {value && <CopyButton text={value} />}
      </div>
    </div>
  )
}
