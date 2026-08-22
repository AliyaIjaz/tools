'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type UnitId = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi' | 'nmi'

interface Unit {
  id: UnitId
  label: string
  symbol: string
  meters: number
  group: 'metric' | 'imperial'
}

const UNITS: Unit[] = [
  { id: 'mm',  label: 'Millimeter',    symbol: 'mm',  meters: 0.001,          group: 'metric'   },
  { id: 'cm',  label: 'Centimeter',    symbol: 'cm',  meters: 0.01,           group: 'metric'   },
  { id: 'm',   label: 'Meter',         symbol: 'm',   meters: 1,              group: 'metric'   },
  { id: 'km',  label: 'Kilometer',     symbol: 'km',  meters: 1000,           group: 'metric'   },
  { id: 'in',  label: 'Inch',          symbol: 'in',  meters: 0.0254,         group: 'imperial' },
  { id: 'ft',  label: 'Foot',          symbol: 'ft',  meters: 0.3048,         group: 'imperial' },
  { id: 'yd',  label: 'Yard',          symbol: 'yd',  meters: 0.9144,         group: 'imperial' },
  { id: 'mi',  label: 'Mile',          symbol: 'mi',  meters: 1609.344,       group: 'imperial' },
  { id: 'nmi', label: 'Nautical Mile', symbol: 'nmi', meters: 1852,           group: 'imperial' },
]

const UNIT_MAP = Object.fromEntries(UNITS.map((u) => [u.id, u])) as Record<UnitId, Unit>

const METRIC_COLOR   = 'var(--color-web)'
const IMPERIAL_COLOR = '#f472b6'

function formatResult(meters: number, unit: Unit): string {
  const val = meters / unit.meters
  if (val === 0) return '0'
  const abs = Math.abs(val)
  if (abs >= 1e9 || (abs < 1e-4 && abs > 0)) return parseFloat(val.toPrecision(7)).toString()
  return parseFloat(val.toFixed(6)).toString()
}

function parseInput(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '')
  if (!cleaned) return null
  const n = Number(cleaned)
  if (isNaN(n) || n < 0) return null
  return n
}

const PRESETS = [
  { label: '1 mile',          unit: 'mi'  as UnitId, value: '1'     },
  { label: '1 kilometer',     unit: 'km'  as UnitId, value: '1'     },
  { label: '1 foot',          unit: 'ft'  as UnitId, value: '1'     },
  { label: '5\'10" (person)', unit: 'in'  as UnitId, value: '70'    },
  { label: '100 meters',      unit: 'm'   as UnitId, value: '100'   },
  { label: '26.2 mi (marathon)', unit: 'mi' as UnitId, value: '26.2' },
]

export default function LengthConverterPage() {
  const [activeUnit, setActiveUnit] = useState<UnitId>('m')
  const [inputValue, setInputValue] = useState('1')

  const meters: number | null = (() => {
    const n = parseInput(inputValue)
    if (n === null) return null
    return n * UNIT_MAP[activeUnit].meters
  })()

  const hasInput = inputValue.trim() !== '' && parseInput(inputValue) !== null

  const getDisplay = (unit: Unit): string => {
    if (meters === null) return unit.id === activeUnit ? inputValue : ''
    return formatResult(meters, unit)
  }

  const handleChange = (unitId: UnitId, raw: string) => {
    setActiveUnit(unitId)
    setInputValue(raw)
  }

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setActiveUnit(preset.unit)
    setInputValue(preset.value)
  }

  const clearAll = () => setInputValue('')

  const faqs = [
    { q: 'How do I convert km to miles?', a: 'Multiply by 0.621371: miles = km × 0.621371. For example, 5 km = 5 × 0.621371 = 3.107 miles. The reverse (miles to km) is: km = miles × 1.60934. A quick mental shortcut: multiply km by 0.6 for a rough mile estimate.' },
    { q: 'How many km in a mile?', a: 'There are exactly 1.60934 kilometers in one statute mile (or 1,609.344 meters). So 1 mile = 1.609 km, 5 miles = 8.047 km, 10 miles = 16.093 km. The reverse: 1 km = 0.621371 miles.' },
    { q: 'How many feet in a mile?', a: 'There are exactly 5,280 feet in one statute mile. This also equals 1,760 yards, 63,360 inches, or 1,609.344 meters. A half mile is 2,640 feet; a quarter mile (common in athletics) is 1,320 feet.' },
    { q: 'How many inches in a foot?', a: 'There are exactly 12 inches in one foot. This is the foundation of US/imperial measurement: 1 foot = 12 inches, 1 yard = 3 feet = 36 inches, 1 mile = 5,280 feet = 63,360 inches.' },
    { q: 'How many cm in a meter?', a: 'There are exactly 100 centimeters in one meter. The metric prefix "centi-" means one-hundredth, so 1 cm = 0.01 m. Other metric relations: 1 m = 10 dm (decimeters) = 100 cm = 1,000 mm.' },
    { q: 'How many yards in a mile?', a: 'There are exactly 1,760 yards in one statute mile. This also equals 5,280 feet or 1,609.344 meters. In American football, a field is 100 yards (91.44 m); so a mile is about 17.6 football fields.' },
    { q: 'How many feet are in a meter?', a: 'There are 3.28084 feet in one meter (exactly 3 feet and 3.37 inches). The exact conversion is 1 m = 39.3701 inches = 3.28084 feet. Conversely, 1 foot = 0.3048 meters exactly.' },
    { q: 'How many centimeters are in an inch?', a: 'There are exactly 2.54 centimeters in one inch. This is the internationally defined exact value: 1 inch = 2.54 cm. So 1 cm = 0.3937 inches. For example, 6 inches = 15.24 cm, 12 inches (1 foot) = 30.48 cm.' },
    { q: 'How do I convert feet and inches to centimeters?', a: 'Convert everything to inches first (feet × 12 + remaining inches), then multiply by 2.54. For example, 5 feet 10 inches = (5 × 12) + 10 = 70 inches × 2.54 = 177.8 cm. Enter 70 in the inches field above to see all units at once.' },
    { q: 'How long is 100 meters in feet?', a: '100 meters = 328.084 feet (or 109.361 yards). This is the length of an Olympic sprint track. Other sport references: a football field (100 yards) = 91.44 m; a basketball court (94 ft) = 28.65 m.' },
    { q: 'What is a nautical mile?', a: 'A nautical mile is exactly 1,852 meters (1.852 km or about 1.1508 statute miles). It is used in maritime and aviation navigation because one nautical mile corresponds to approximately one arcminute of latitude. A knot is one nautical mile per hour.' },
    { q: 'What is the difference between a mile and a nautical mile?', a: 'A statute (land) mile is 1,609.344 meters. A nautical mile is 1,852 meters — about 15% longer. Nautical miles are used at sea and in aviation; statute miles are used on land in the US and UK. 1 nautical mile ≈ 1.1508 statute miles.' },
    { q: 'How do I convert inches to millimeters?', a: 'Multiply by 25.4: mm = inches × 25.4. This comes from the definition: 1 inch = 2.54 cm = 25.4 mm exactly. For example, 1/4 inch = 6.35 mm, 1/2 inch = 12.7 mm — useful for screw, bolt, and drill bit sizing.' },
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
      toolId="length-converter"
      title="km to Miles & Length Converter"
      description="Free km to miles converter — instantly convert between kilometers, miles, feet, meters, cm, inches, yards, and nautical miles. All units update live."
      category="web"
      iconName="Ruler"
      showAllCategory
      compactRelated
      seoContent={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <SeoSection
            aboutTitle="km to Miles, Feet to Meters & Length Converter — Metric & Imperial Explained"
            about={<>
              <p className="text-base leading-relaxed"><strong>km to Miles & Length Converter Online</strong> is a free browser-based tool for instant length conversion between all common metric and imperial units. Convert <strong>kilometers to miles</strong> (or miles to km), <strong>feet to meters</strong> (or meters to feet), <strong>cm to inches</strong>, and more — type in any field and all others update simultaneously. Supported units: <strong>mm, cm, m, km, in, ft, yd, mi, nmi</strong>.</p>
              <p className="text-base leading-relaxed">Metric and imperial length units are used in parallel across different countries and industries — kilometers in Europe, miles in the US, nautical miles at sea, millimeters in engineering. The km-to-miles conversion (1 km = 0.621371 mi) and feet-to-meters conversion (1 ft = 0.3048 m) are among the most common unit conversions in everyday use. This tool handles all nine units simultaneously, grouped by system for easy comparison.</p>
              <p className="text-base leading-relaxed">All length conversion runs entirely in your browser — nothing is sent to any server.</p>
            </>}
            useCasesTitle="Common km to Miles & Length Conversions"
            useCases={[
              'Convert kilometers to miles for US road distances or running pace.',
              'Convert feet and inches to centimeters for height comparisons.',
              'Convert inches to millimeters for hardware, bolts, and engineering specs.',
              'Convert meters to feet for building heights and room dimensions.',
              'Convert miles to kilometers when reading international race distances.',
              'Convert nautical miles to kilometers for maritime or aviation planning.',
              'Convert centimeters to inches for clothing and shoe sizes.',
              'Convert yards to meters for fabric, sports fields, and landscaping.',
            ]}
            extraSections={[
              {
                title: 'Kilometers to Miles Conversion Chart',
                intro: 'Quick reference for km to miles — the most-searched length conversion. All values rounded to 3 decimal places.',
                items: [
                  <div key="km-miles-chart" className="overflow-x-auto">
                    <table className="w-full text-sm font-mono border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 pr-8 text-xs font-semibold uppercase tracking-wider" style={{ color: METRIC_COLOR }}>Kilometers (km)</th>
                          <th className="text-left pb-2 pr-8 text-xs font-semibold uppercase tracking-wider" style={{ color: IMPERIAL_COLOR }}>Miles (mi)</th>
                          <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.4)' }}>Context</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['1 km',      '0.621 mi',  ''],
                          ['2 km',      '1.243 mi',  ''],
                          ['5 km',      '3.107 mi',  '5K race'],
                          ['10 km',     '6.214 mi',  '10K race'],
                          ['20 km',     '12.427 mi', ''],
                          ['21.098 km', '13.109 mi', 'Half marathon'],
                          ['42.195 km', '26.219 mi', 'Marathon'],
                          ['50 km',     '31.069 mi', ''],
                          ['100 km',    '62.137 mi', ''],
                          ['1 mi',      '1.609 km',  'Reverse: miles → km'],
                          ['5 mi',      '8.047 km',  ''],
                          ['10 mi',     '16.093 km', ''],
                          ['26.2 mi',   '42.165 km', 'Marathon (miles)'],
                        ].map(([km, mi, ctx]) => (
                          <tr key={km} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <td className="py-1.5 pr-8" style={{ color: METRIC_COLOR }}>{km}</td>
                            <td className="py-1.5 pr-8" style={{ color: IMPERIAL_COLOR }}>{mi}</td>
                            <td className="py-1.5 text-xs hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.4)' }}>{ctx}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>,
                ],
              },
              {
                title: 'Metric to Imperial Length Conversion Chart',
                intro: 'Quick reference for common length conversions between meters, centimeters, inches, and feet.',
                items: [
                  <div key="metric-imperial-chart" className="overflow-x-auto">
                    <table className="w-full text-sm font-mono border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: METRIC_COLOR }}>Meters (m)</th>
                          <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: METRIC_COLOR }}>cm</th>
                          <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: IMPERIAL_COLOR }}>Inches (in)</th>
                          <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: IMPERIAL_COLOR }}>Feet (ft)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['0.01 m',    '1 cm',      '0.394 in',   '0.033 ft'  ],
                          ['0.0254 m',  '2.54 cm',   '1 in',       '0.083 ft'  ],
                          ['0.1 m',     '10 cm',     '3.937 in',   '0.328 ft'  ],
                          ['0.3048 m',  '30.48 cm',  '12 in',      '1 ft'      ],
                          ['0.9144 m',  '91.44 cm',  '36 in',      '3 ft (1 yd)'],
                          ['1 m',       '100 cm',    '39.37 in',   '3.281 ft'  ],
                          ['10 m',      '1,000 cm',  '393.7 in',   '32.81 ft'  ],
                          ['100 m',     '10,000 cm', '3,937 in',   '328.1 ft'  ],
                        ].map(([m, cm, inch, ft]) => (
                          <tr key={m} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <td className="py-1.5 pr-6" style={{ color: METRIC_COLOR }}>{m}</td>
                            <td className="py-1.5 pr-6" style={{ color: 'rgba(255,255,255,0.6)' }}>{cm}</td>
                            <td className="py-1.5 pr-6" style={{ color: IMPERIAL_COLOR }}>{inch}</td>
                            <td className="py-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{ft}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>,
                ],
              },
            ]}
            faqs={faqs}
          />
        </>
      }
    >
      <div className="space-y-4">

        {/* Metric group */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Metric&nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,0.3)' }}>mm · cm · m · km</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {UNITS.filter((u) => u.group === 'metric').map((unit) => {
              const isActive = activeUnit === unit.id && hasInput
              const displayVal = getDisplay(unit)
              return (
                <UnitField
                  key={unit.id}
                  unit={unit}
                  value={displayVal}
                  isActive={isActive}
                  color={METRIC_COLOR}
                  onChange={(v) => handleChange(unit.id, v)}
                  onFocus={() => { if (!hasInput) setActiveUnit(unit.id) }}
                />
              )
            })}
          </div>
        </div>

        {/* Imperial group */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Imperial / US&nbsp;&nbsp;<span style={{ color: 'rgba(255,255,255,0.3)' }}>in · ft · yd · mi · nmi</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {UNITS.filter((u) => u.group === 'imperial').map((unit) => {
              const isActive = activeUnit === unit.id && hasInput
              const displayVal = getDisplay(unit)
              return (
                <UnitField
                  key={unit.id}
                  unit={unit}
                  value={displayVal}
                  isActive={isActive}
                  color={IMPERIAL_COLOR}
                  onChange={(v) => handleChange(unit.id, v)}
                  onFocus={() => { if (!hasInput) setActiveUnit(unit.id) }}
                />
              )
            })}
          </div>
        </div>

        {/* Empty state */}
        {!hasInput && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Type a value in any field to convert</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Metric and imperial units all update simultaneously</p>
          </div>
        )}

        {/* Meters callout */}
        {meters !== null && (
          <div
            className="rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'rgba(16,185,129,0.07)', border: '2px solid var(--border-web-idle)' }}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Exact meter value</p>
              <p className="text-lg font-mono font-semibold" style={{ color: 'var(--color-web)' }}>
                {formatResult(meters, UNIT_MAP['m'])} <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>m</span>
              </p>
            </div>
            <CopyButton text={formatResult(meters, UNIT_MAP['m'])} />
          </div>
        )}

        {/* Clear */}
        {hasInput && (
          <div className="flex justify-end">
            <button
              onClick={clearAll}
              className="text-sm px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.06)', border: '2px solid var(--border-web-idle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Presets */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Common Reference Values</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const isSelected = activeUnit === preset.unit && inputValue === preset.value
              return (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="rounded-lg px-3 py-2.5 text-left transition-all"
                  style={{
                    background: isSelected ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.2)',
                    border: `2px solid ${isSelected ? 'var(--color-web)' : 'var(--border-web-idle)'}`,
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-web)' }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-web-idle)' }}
                >
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{preset.label}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{preset.value} {UNIT_MAP[preset.unit].symbol}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Reference table */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Conversion Factors — Base Unit: Meter</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Unit</th>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Symbol</th>
                  <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Meters</th>
                </tr>
              </thead>
              <tbody>
                {UNITS.map((unit) => (
                  <tr key={unit.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="py-1.5 pr-6" style={{ color: unit.group === 'metric' ? METRIC_COLOR : IMPERIAL_COLOR }}>{unit.label}</td>
                    <td className="py-1.5 pr-6" style={{ color: 'rgba(255,255,255,0.6)' }}>{unit.symbol}</td>
                    <td className="py-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{unit.meters}</td>
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
        border: `2px solid ${isActive ? color : 'var(--border-web-idle)'}`,
        boxShadow: isActive ? `0 0 0 1px ${color}22` : 'none',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: isActive ? color : 'rgba(255,255,255,0.55)' }}>
          {unit.label}
        </span>
        <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{unit.symbol}</span>
      </div>
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
            if (!isActive) e.currentTarget.style.borderColor = 'var(--border-web)'
          }}
          placeholder="0"
          className="flex-1 min-w-0 rounded-md px-2.5 py-1.5 text-base font-mono outline-none transition-all placeholder:text-white/50"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: `2px solid ${isActive ? color : 'var(--border-web)'}`,
            color: isActive ? color : 'rgba(255,255,255,0.92)',
          }}
        />
        {value && <CopyButton text={`${value}${unit.symbol}`} />}
      </div>
    </div>
  )
}
