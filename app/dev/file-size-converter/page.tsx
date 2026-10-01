'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type UnitId =
  | 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'
  | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB'

interface Unit {
  id: UnitId
  label: string
  bytes: number
  group: 'si' | 'iec'
}

const UNITS: Unit[] = [
  // SI (decimal, powers of 1000)
  { id: 'B',   label: 'Bytes (B)',            bytes: 1,                    group: 'si'  },
  { id: 'KB',  label: 'Kilobytes (KB)',        bytes: 1_000,                group: 'si'  },
  { id: 'MB',  label: 'Megabytes (MB)',        bytes: 1_000_000,            group: 'si'  },
  { id: 'GB',  label: 'Gigabytes (GB)',        bytes: 1_000_000_000,        group: 'si'  },
  { id: 'TB',  label: 'Terabytes (TB)',        bytes: 1_000_000_000_000,    group: 'si'  },
  { id: 'PB',  label: 'Petabytes (PB)',        bytes: 1_000_000_000_000_000,group: 'si'  },
  // IEC (binary, powers of 1024)
  { id: 'KiB', label: 'Kibibytes (KiB)',       bytes: 1_024,                group: 'iec' },
  { id: 'MiB', label: 'Mebibytes (MiB)',       bytes: 1_048_576,            group: 'iec' },
  { id: 'GiB', label: 'Gibibytes (GiB)',       bytes: 1_073_741_824,        group: 'iec' },
  { id: 'TiB', label: 'Tebibytes (TiB)',       bytes: 1_099_511_627_776,    group: 'iec' },
  { id: 'PiB', label: 'Pebibytes (PiB)',       bytes: 1_125_899_906_842_624,group: 'iec' },
]

const UNIT_MAP: Record<UnitId, Unit> = Object.fromEntries(UNITS.map((u) => [u.id, u])) as Record<UnitId, Unit>

const SI_COLOR  = 'var(--color-dev)'
const IEC_COLOR = '#34d399'

function formatResult(bytes: number, unit: Unit): string {
  const val = bytes / unit.bytes
  if (val === 0) return '0'
  // Show up to 10 significant digits, trim trailing zeros
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

export default function DataSizeConverterPage() {
  const [activeUnit, setActiveUnit] = useState<UnitId>('MB')
  const [inputValue, setInputValue] = useState('')

  const bytes = parseInput(inputValue) !== null
    ? parseInput(inputValue)! * UNIT_MAP[activeUnit].bytes
    : null

  const handleChange = (unitId: UnitId, raw: string) => {
    setActiveUnit(unitId)
    setInputValue(raw)
  }

  const clearAll = () => setInputValue('')

  const hasInput = inputValue.trim() !== ''

  const faqs = [
    { q: 'What is the difference between KB and KiB?', a: '1 KB (kilobyte) = 1,000 bytes in the SI (decimal) system used by storage manufacturers. 1 KiB (kibibyte) = 1,024 bytes in the IEC (binary) system used by operating systems and RAM specifications. The gap grows significantly at larger scales — a "500 GB" hard drive has only ~465 GiB of usable space as reported by Windows or macOS.' },
    { q: 'Why does my hard drive show less space than advertised?', a: 'Storage manufacturers use SI units (1 GB = 10⁹ bytes) because the numbers look larger in marketing. Operating systems report space in binary units (1 GiB = 2³⁰ bytes), which is a larger base. So a 1 TB drive (10¹² bytes) shows up as ~931 GiB in your OS — the bytes are identical, only the unit interpretation differs.' },
    { q: 'What are SI (decimal) units?', a: 'SI units follow powers of 1,000: 1 KB = 1,000 B, 1 MB = 1,000 KB, 1 GB = 1,000 MB, etc. These are used by hard drive manufacturers, network speed ratings, and the International System of Units (SI).' },
    { q: 'What are IEC (binary) units?', a: 'IEC units follow powers of 1,024: 1 KiB = 1,024 B, 1 MiB = 1,024 KiB, 1 GiB = 1,024 MiB, etc. These are used by operating systems (Windows, macOS, Linux) for RAM, file system sizes, and memory addresses.' },
    { q: 'How many bytes is 1 GB?', a: '1 GB (gigabyte, SI) = 1,000,000,000 bytes (10⁹). 1 GiB (gibibyte, IEC) = 1,073,741,824 bytes (2³⁰). The two definitions diverge by about 7.4%.' },
    { q: 'What is the difference between Mbps and MB/s?', a: 'Mbps (megabits per second) and MB/s (megabytes per second) are both used for network speed, but they differ by a factor of 8. 1 byte = 8 bits, so 100 Mbps ÷ 8 = 12.5 MB/s. Internet providers advertise in Mbps; download managers show MB/s — so a "100 Mbps" plan delivers ~12.5 MB/s of actual file transfer speed.' },
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
      toolId="data-size-converter"
      title="File Size Converter — MB, GB, TB, KB"
      description="Convert between MB, GB, TB, KB, bytes and binary units (MiB, GiB, TiB) instantly"
      category="dev"
      iconName="HardDrive"
      showAllCategory
      compactRelated
      seoContent={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <SeoSection
            aboutTitle="How to Convert File Sizes: MB, GB, TB Explained"
            about={<>
              <p className="text-lg leading-relaxed"><strong>File Size Converter Online</strong> is a free browser-based tool that instantly converts between all standard storage units — both <strong>SI (decimal)</strong> units like KB, MB, GB, TB, PB and <strong>IEC (binary)</strong> units like KiB, MiB, GiB, TiB, PiB. Type a value in any unit and all others update instantly.</p>
              <p className="text-lg leading-relaxed">Understanding the difference matters: a hard drive manufacturer calls 1 GB = 1,000,000,000 bytes (SI), while an operating system may report 1 GiB = 1,073,741,824 bytes (IEC). This tool makes both crystal clear side by side.</p>
              <p className="text-lg leading-relaxed">All conversion runs entirely in your browser — nothing is sent to any server.</p>
            </>}
            useCasesTitle="When to Use a File Size Converter"
            useCases={[
              'Convert file sizes reported by your OS between MB and MiB.',
              'Compare hard drive capacity (SI GB) with OS-reported space (IEC GiB).',
              'Calculate API payload limits, e.g. "max 10 MB" in bytes.',
              'Convert RAM specs between GiB and GB when purchasing memory.',
              'Work out S3 / cloud storage costs based on exact byte counts.',
              'Convert network bandwidth values (Mbps → MB/s → bytes per second).',
              'Understand Docker image and container size limits.',
              'Debug file upload limits expressed in different units.',
            ]}
            faqs={faqs}
          />
        </>
      }
    >
      <div className="space-y-4">

        {/* SI group */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            SI — Decimal&nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,0.3)' }}>powers of 1,000</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {UNITS.filter((u) => u.group === 'si').map((unit) => {
              const isActive = activeUnit === unit.id && hasInput
              const displayVal = bytes !== null ? formatResult(bytes, unit) : (activeUnit === unit.id ? inputValue : '')
              return (
                <UnitField
                  key={unit.id}
                  unit={unit}
                  value={displayVal}
                  isActive={isActive}
                  color={SI_COLOR}
                  onChange={(v) => handleChange(unit.id, v)}
                  onFocus={() => { if (!hasInput) setActiveUnit(unit.id) }}
                />
              )
            })}
          </div>
        </div>

        {/* IEC group */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            IEC — Binary&nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,0.3)' }}>powers of 1,024</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {UNITS.filter((u) => u.group === 'iec').map((unit) => {
              const isActive = activeUnit === unit.id && hasInput
              const displayVal = bytes !== null ? formatResult(bytes, unit) : (activeUnit === unit.id ? inputValue : '')
              return (
                <UnitField
                  key={unit.id}
                  unit={unit}
                  value={displayVal}
                  isActive={isActive}
                  color={IEC_COLOR}
                  onChange={(v) => handleChange(unit.id, v)}
                  onFocus={() => { if (!hasInput) setActiveUnit(unit.id) }}
                />
              )
            })}
          </div>
        </div>

        {/* Byte count callout */}
        {bytes !== null && (
          <div
            className="rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'rgba(139,92,246,0.08)', border: '2px solid var(--border-dev-idle)' }}
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Exact byte count</p>
              <p className="text-lg font-mono font-semibold" style={{ color: 'var(--color-dev)' }}>
                {bytes.toLocaleString()} <span className="text-base font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>bytes</span>
              </p>
            </div>
            <CopyButton text={bytes.toString()} />
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
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>SI (KB/MB/GB) and IEC (KiB/MiB/GiB) update simultaneously</p>
          </div>
        )}

        {/* Reference table */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-dev-idle)' }}
        >
          <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Quick Reference — SI vs IEC</p>
          <div className="overflow-x-auto">
            <table className="w-full text-base font-mono border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 pr-6 text-sm font-semibold uppercase tracking-wider" style={{ color: SI_COLOR }}>SI Unit</th>
                  <th className="text-left pb-2 pr-6 text-sm font-semibold uppercase tracking-wider" style={{ color: SI_COLOR }}>Bytes (SI)</th>
                  <th className="text-left pb-2 pr-6 text-sm font-semibold uppercase tracking-wider" style={{ color: IEC_COLOR }}>IEC Unit</th>
                  <th className="text-left pb-2 text-sm font-semibold uppercase tracking-wider" style={{ color: IEC_COLOR }}>Bytes (IEC)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['KB', '1,000', 'KiB', '1,024'],
                  ['MB', '1,000,000', 'MiB', '1,048,576'],
                  ['GB', '1,000,000,000', 'GiB', '1,073,741,824'],
                  ['TB', '1,000,000,000,000', 'TiB', '1,099,511,627,776'],
                  ['PB', '1,000,000,000,000,000', 'PiB', '1,125,899,906,842,624'],
                ].map(([si, siB, iec, iecB]) => (
                  <tr key={si} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="py-1.5 pr-6" style={{ color: SI_COLOR }}>{si}</td>
                    <td className="py-1.5 pr-6" style={{ color: 'rgba(255,255,255,0.7)' }}>{siB}</td>
                    <td className="py-1.5 pr-6" style={{ color: IEC_COLOR }}>{iec}</td>
                    <td className="py-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{iecB}</td>
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
  color: string
  onChange: (v: string) => void
  onFocus: () => void
}

function UnitField({ unit, value, isActive, color, onChange, onFocus }: UnitFieldProps) {
  return (
    <div
      className="rounded-lg p-3 space-y-1.5 transition-all"
      style={{
        background: 'rgba(0,0,0,0.2)',
        border: `2px solid ${isActive ? color : 'var(--border-dev-idle)'}`,
        boxShadow: isActive ? `0 0 0 1px ${color}22` : 'none',
      }}
    >
      <span className="text-sm font-semibold" style={{ color: isActive ? color : 'rgba(255,255,255,0.55)' }}>
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
            e.currentTarget.style.borderColor = color
          }}
          onBlur={(e) => {
            if (!isActive) e.currentTarget.style.borderColor = 'var(--border-dev)'
          }}
          placeholder="0"
          className="flex-1 min-w-0 rounded-md px-2.5 py-1.5 text-lg font-mono outline-none transition-all placeholder:text-white/50"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: `2px solid ${isActive ? color : 'var(--border-dev)'}`,
            color: isActive ? color : 'rgba(255,255,255,0.92)',
          }}
        />
        {value && <CopyButton text={value} />}
      </div>
    </div>
  )
}
