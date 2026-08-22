'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type UnitId = 'C' | 'F' | 'K' | 'R'

interface Unit {
  id: UnitId
  label: string
  symbol: string
  fullName: string
  toKelvin: (v: number) => number
  fromKelvin: (k: number) => number
}

const UNITS: Unit[] = [
  {
    id: 'C',
    label: 'Celsius',
    symbol: '°C',
    fullName: 'Degrees Celsius',
    toKelvin: (v) => v + 273.15,
    fromKelvin: (k) => k - 273.15,
  },
  {
    id: 'F',
    label: 'Fahrenheit',
    symbol: '°F',
    fullName: 'Degrees Fahrenheit',
    toKelvin: (v) => ((v - 32) * 5) / 9 + 273.15,
    fromKelvin: (k) => ((k - 273.15) * 9) / 5 + 32,
  },
  {
    id: 'K',
    label: 'Kelvin',
    symbol: 'K',
    fullName: 'Kelvin',
    toKelvin: (v) => v,
    fromKelvin: (k) => k,
  },
  {
    id: 'R',
    label: 'Rankine',
    symbol: '°R',
    fullName: 'Degrees Rankine',
    toKelvin: (v) => v * (5 / 9),
    fromKelvin: (k) => k * (9 / 5),
  },
]

const UNIT_MAP = Object.fromEntries(UNITS.map((u) => [u.id, u])) as Record<UnitId, Unit>

const UNIT_COLOR: Record<UnitId, string> = {
  C: 'var(--color-web)',
  F: '#f472b6',
  K: '#facc15',
  R: '#fb923c',
}

const PRESETS = [
  { label: 'Freezing point of water',  C: 0,    F: 32,     K: 273.15,  R: 491.67  },
  { label: 'Body temperature',          C: 37,   F: 98.6,   K: 310.15,  R: 558.27  },
  { label: 'Boiling point of water',    C: 100,  F: 212,    K: 373.15,  R: 671.67  },
  { label: 'Absolute zero',             C: -273.15, F: -459.67, K: 0,   R: 0       },
  { label: 'Room temperature',          C: 20,   F: 68,     K: 293.15,  R: 527.67  },
  { label: 'Oven (baking)',             C: 180,  F: 356,    K: 453.15,  R: 815.67  },
]

function formatResult(v: number): string {
  if (!isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs === 0) return '0'
  if (abs >= 1000 || abs < 0.001) return parseFloat(v.toPrecision(7)).toString()
  return parseFloat(v.toFixed(4)).toString()
}

export default function TemperatureConverterPage() {
  const [activeUnit, setActiveUnit] = useState<UnitId>('C')
  const [inputValue, setInputValue] = useState('100')

  const kelvin: number | null = (() => {
    const n = parseFloat(inputValue)
    if (inputValue.trim() === '' || isNaN(n)) return null
    const k = UNIT_MAP[activeUnit].toKelvin(n)
    return isFinite(k) ? k : null
  })()

  const hasInput = inputValue.trim() !== '' && !isNaN(parseFloat(inputValue))

  const getDisplay = (unit: Unit): string => {
    if (kelvin === null) return unit.id === activeUnit ? inputValue : ''
    return formatResult(unit.fromKelvin(kelvin))
  }

  const handleChange = (unitId: UnitId, raw: string) => {
    setActiveUnit(unitId)
    setInputValue(raw)
  }

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setActiveUnit('C')
    setInputValue(preset.C.toString())
  }

  const clearAll = () => setInputValue('')

  const faqs = [
    { q: 'How do I convert Celsius to Fahrenheit?', a: 'Multiply by 9/5 then add 32: °F = (°C × 9/5) + 32. For example, 100°C = (100 × 1.8) + 32 = 212°F. The reverse Fahrenheit to Celsius conversion is: °C = (°F − 32) × 5/9.' },
    { q: 'What is 37 degrees Celsius in Fahrenheit?', a: '37°C = 98.6°F. This is normal human body temperature. Using the formula: (37 × 9/5) + 32 = 66.6 + 32 = 98.6°F. A temperature of 37.5°C (99.5°F) or above is generally considered a low-grade fever in adults; 38°C (100.4°F) is the clinical threshold for fever.' },
    { q: 'What is 100 degrees Fahrenheit in Celsius?', a: '100°F = 37.78°C. Using the formula: (100 − 32) × 5/9 = 68 × 0.5556 = 37.78°C. This is just above normal body temperature — a reading of 100°F (37.8°C) is considered a low-grade fever.' },
    { q: 'What is 180 degrees Celsius in Fahrenheit?', a: '180°C = 356°F. Using the formula: (180 × 9/5) + 32 = 324 + 32 = 356°F. 180°C is a common baking temperature for cakes, cookies, and roasting vegetables. Other key oven conversions: 160°C = 320°F (slow/fan), 200°C = 392°F (hot), 220°C = 428°F (very hot).' },
    { q: 'What is 0 degrees Fahrenheit in Celsius?', a: '0°F = −17.78°C. Using the formula: (0 − 32) × 5/9 = −32 × 0.5556 = −17.78°C. This is well below the freezing point of water (0°C / 32°F) and represents a very cold winter day or typical home freezer temperature (around −18°C / 0°F).' },
    { q: 'How do I convert Celsius to Kelvin?', a: 'Add 273.15: K = °C + 273.15. For example, 0°C = 273.15 K and 100°C = 373.15 K. Kelvin uses the same degree size as Celsius — it just starts at absolute zero instead of the freezing point of water.' },
    { q: 'What is absolute zero?', a: 'Absolute zero is the lowest possible temperature — 0 K, −273.15°C, or −459.67°F. At absolute zero, particles have the minimum possible thermal motion. It is theoretically unreachable but has been approached to within a billionth of a degree in laboratory conditions.' },
    { q: 'What is the difference between Kelvin and Rankine?', a: 'Both Kelvin and Rankine start at absolute zero, but they use different degree sizes. Kelvin uses Celsius-sized degrees (1 K = 1°C change), while Rankine uses Fahrenheit-sized degrees (1°R = 1°F change). The conversion is: K = °R × 5/9, or °R = K × 9/5. Rankine is used in some US engineering and thermodynamics contexts.' },
    { q: 'What temperature is the same in Celsius and Fahrenheit?', a: '−40° is identical in both Celsius and Fahrenheit. This is the crossing point of the two scales — below −40°, Fahrenheit numbers are less negative (closer to zero) than Celsius; above −40°, Celsius is the smaller number. You can verify: (−40 × 9/5) + 32 = −72 + 32 = −40°F.' },
    { q: 'What is normal human body temperature in Celsius and Kelvin?', a: 'Normal body temperature is approximately 37°C, 98.6°F, 310.15 K, or 558.27°R. In practice body temperature varies by individual and measurement site — oral, axillary, and rectal readings differ by up to 0.5°C.' },
    { q: 'What is the boiling point of water at sea level?', a: 'Water boils at 100°C (212°F, 373.15 K, 671.67°R) at standard atmospheric pressure (1 atm / 101.325 kPa). At higher altitudes where air pressure is lower, water boils at a lower temperature — on top of Everest it boils at roughly 70°C (158°F).' },
    { q: 'Why does cooking use Fahrenheit in the US but Celsius elsewhere?', a: 'The US retained the Fahrenheit scale from its historical connection to British imperial units, while most other countries adopted Celsius as part of the metric system. For cooking, a useful rule of thumb: 350°F ≈ 175°C (moderate oven), 400°F ≈ 200°C (hot oven), 450°F ≈ 230°C (very hot oven).' },
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
      toolId="temperature-converter"
      title="Celsius to Fahrenheit Converter"
      description="Free Celsius to Fahrenheit converter — instantly convert °C, °F, Kelvin, and Rankine. Type in any field and all others update live."
      category="web"
      iconName="Thermometer"
      showAllCategory
      compactRelated
      seoContent={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <SeoSection
            aboutTitle="Celsius to Fahrenheit Converter — °C, °F, Kelvin & Rankine Explained"
            about={<>
              <p className="text-base leading-relaxed"><strong>Celsius to Fahrenheit Converter Online</strong> is a free browser-based tool for instant temperature conversion between <strong>Celsius (°C)</strong>, <strong>Fahrenheit (°F)</strong>, <strong>Kelvin (K)</strong>, and <strong>Rankine (°R)</strong>. Type a value in any field and all three other scales update simultaneously — no button to press. The Celsius to Fahrenheit conversion formula is °F = (°C × 9/5) + 32; the reverse is °C = (°F − 32) × 5/9.</p>
              <p className="text-base leading-relaxed">All four temperature scales are supported: Celsius and Fahrenheit for everyday weather and cooking use, Kelvin for science and physics, and Rankine for US engineering thermodynamics. Common reference points — freezing point, boiling point, body temperature, absolute zero — are available as one-click presets.</p>
              <p className="text-base leading-relaxed">All temperature conversion runs entirely in your browser — nothing is sent to any server.</p>
            </>}
            useCasesTitle="Common Temperature Conversion Use Cases"
            useCases={[
              'Convert Celsius to Fahrenheit for oven temperatures in international recipes.',
              'Convert Fahrenheit to Celsius when reading US weather forecasts abroad.',
              'Convert Celsius to Kelvin for chemistry, physics, or thermodynamics calculations.',
              'Convert body temperature between °C and °F to check for fever (37°C = 98.6°F).',
              'Convert Fahrenheit to Kelvin or Rankine for US engineering problems.',
              'Look up absolute zero and other physical constants across all four scales.',
              'Convert scientific data from Kelvin to Celsius for lab reports.',
              'Understand weather extremes — heatwaves, cold snaps, wind chills — in both scales.',
            ]}
            extraSections={[
              {
                title: 'Celsius to Fahrenheit Conversion Chart',
                intro: 'Quick reference table for common Celsius to Fahrenheit conversions. Use the calculator above for any value not listed here.',
                items: [
                  <div key="chart" className="overflow-x-auto">
                    <table className="w-full text-sm font-mono border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 pr-8 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-web)' }}>Celsius (°C)</th>
                          <th className="text-left pb-2 pr-8 text-xs font-semibold uppercase tracking-wider" style={{ color: '#f472b6' }}>Fahrenheit (°F)</th>
                          <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: '#facc15' }}>Kelvin (K)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [-40, -40, 233.15, 'Extreme cold / °C = °F crossover'],
                          [-20, -4, 253.15, 'Very cold winter'],
                          [-10, 14, 263.15, 'Cold winter day'],
                          [0, 32, 273.15, 'Freezing point of water'],
                          [10, 50, 283.15, 'Cool day'],
                          [20, 68, 293.15, 'Room temperature'],
                          [25, 77, 298.15, 'Warm room / mild day'],
                          [30, 86, 303.15, 'Hot summer day'],
                          [37, 98.6, 310.15, 'Normal body temperature'],
                          [40, 104, 313.15, 'Heat wave / high fever'],
                          [100, 212, 373.15, 'Boiling point of water'],
                          [150, 302, 423.15, 'Low oven'],
                          [180, 356, 453.15, 'Moderate oven (baking)'],
                          [200, 392, 473.15, 'Hot oven'],
                          [220, 428, 493.15, 'Very hot oven'],
                        ].map(([c, f, k, note]) => (
                          <tr key={c} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <td className="py-1.5 pr-8" style={{ color: 'var(--color-web)' }}>{c}°C</td>
                            <td className="py-1.5 pr-8" style={{ color: '#f472b6' }}>{f}°F</td>
                            <td className="py-1.5 pr-8" style={{ color: '#facc15' }}>{k} K</td>
                            <td className="py-1.5 text-xs hidden sm:table-cell" style={{ color: 'rgba(255,255,255,0.4)' }}>{note}</td>
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

        {/* Unit input cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {UNITS.map((unit) => {
            const color = UNIT_COLOR[unit.id]
            const isActive = activeUnit === unit.id && hasInput
            const displayVal = getDisplay(unit)

            return (
              <div
                key={unit.id}
                className="rounded-xl p-4 space-y-2 transition-all"
                style={{
                  background: 'var(--surface)',
                  border: `2px solid ${isActive ? color : 'var(--border-web-idle)'}`,
                  boxShadow: isActive ? `0 0 0 1px ${color}22` : 'none',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded font-mono"
                      style={{ background: `${color}20`, color }}
                    >
                      {unit.symbol}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      {unit.label}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{unit.fullName}</span>
                </div>

                {/* Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={displayVal}
                    onChange={(e) => handleChange(unit.id, e.target.value)}
                    onFocus={(e) => {
                      setActiveUnit(unit.id)
                      e.currentTarget.style.borderColor = color
                    }}
                    onBlur={(e) => {
                      if (activeUnit !== unit.id || !hasInput) {
                        e.currentTarget.style.borderColor = 'var(--border-web)'
                      }
                    }}
                    placeholder={`Enter ${unit.label}…`}
                    spellCheck={false}
                    className="flex-1 min-w-0 rounded-lg px-3 py-2.5 text-base font-mono outline-none transition-all placeholder:text-white/50"
                    style={{
                      background: 'rgba(0,0,0,0.35)',
                      border: `2px solid ${isActive ? color : 'var(--border-web)'}`,
                      color: isActive ? color : 'rgba(255,255,255,0.92)',
                    }}
                  />
                  {displayVal && <CopyButton text={`${displayVal}${unit.symbol}`} />}
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty state */}
        {!hasInput && (
          <div
            className="rounded-xl px-5 py-8 flex flex-col items-center gap-2 text-center"
            style={{ background: 'var(--surface)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Type a temperature in any field to convert</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>°C, °F, K, and °R all update simultaneously</p>
          </div>
        )}

        {/* Kelvin callout */}
        {kelvin !== null && (
          <div
            className="rounded-xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'rgba(16,185,129,0.07)', border: '2px solid var(--border-web-idle)' }}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Kelvin (absolute scale)</p>
              <p className="text-lg font-mono font-semibold" style={{ color: 'var(--color-web)' }}>
                {formatResult(kelvin)} <span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.6)' }}>K</span>
              </p>
            </div>
            <CopyButton text={formatResult(kelvin)} />
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

        {/* Common presets */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Common Reference Points</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const activeCVal = kelvin !== null ? formatResult(UNIT_MAP['C'].fromKelvin(kelvin)) : null
              const isSelected = activeCVal === preset.C.toString()
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
                  <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{preset.label}</p>
                  <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {preset.C}°C · {preset.F}°F · {preset.K} K
                  </p>
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
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Conversion Formulas</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>From</th>
                  <th className="text-left pb-2 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>To</th>
                  <th className="text-left pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Formula</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { from: '°C', to: '°F', formula: '(°C × 9/5) + 32',    fColor: UNIT_COLOR.C, tColor: UNIT_COLOR.F },
                  { from: '°F', to: '°C', formula: '(°F − 32) × 5/9',    fColor: UNIT_COLOR.F, tColor: UNIT_COLOR.C },
                  { from: '°C', to: 'K',  formula: '°C + 273.15',         fColor: UNIT_COLOR.C, tColor: UNIT_COLOR.K },
                  { from: 'K',  to: '°C', formula: 'K − 273.15',          fColor: UNIT_COLOR.K, tColor: UNIT_COLOR.C },
                  { from: '°F', to: 'K',  formula: '(°F − 32) × 5/9 + 273.15', fColor: UNIT_COLOR.F, tColor: UNIT_COLOR.K },
                  { from: 'K',  to: '°R', formula: 'K × 9/5',             fColor: UNIT_COLOR.K, tColor: UNIT_COLOR.R },
                ].map(({ from, to, formula, fColor, tColor }, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="py-1.5 pr-6 font-mono font-semibold" style={{ color: fColor }}>{from}</td>
                    <td className="py-1.5 pr-6 font-mono font-semibold" style={{ color: tColor }}>{to}</td>
                    <td className="py-1.5 font-mono text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{formula}</td>
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
