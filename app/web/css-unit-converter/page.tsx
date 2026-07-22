'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

const UNITS = ['px', 'rem', 'em', 'vw', 'vh', 'pt', '%'] as const
type Unit = typeof UNITS[number]

export default function CssUnitConverterPage() {
  const [value, setValue] = useState('16')
  const [fromUnit, setFromUnit] = useState<Unit>('px')
  const [rootFontSize, setRootFontSize] = useState('16')
  const [viewportW, setViewportW] = useState('1440')
  const [viewportH, setViewportH] = useState('900')
  const [parentFontSize, setParentFontSize] = useState('16')

  const conversions = useMemo(() => {
    const num = parseFloat(value)
    const root = parseFloat(rootFontSize) || 16
    const vw = parseFloat(viewportW) || 1440
    const vh = parseFloat(viewportH) || 900
    const parent = parseFloat(parentFontSize) || 16
    if (isNaN(num)) return []

    // Convert to px first
    let px = num
    switch (fromUnit) {
      case 'rem': px = num * root; break
      case 'em':  px = num * parent; break
      case 'vw':  px = (num / 100) * vw; break
      case 'vh':  px = (num / 100) * vh; break
      case 'pt':  px = num * (96 / 72); break
      case '%':   px = (num / 100) * parent; break
    }

    return UNITS.map((unit) => {
      let result = px
      switch (unit) {
        case 'rem': result = px / root; break
        case 'em':  result = px / parent; break
        case 'vw':  result = (px / vw) * 100; break
        case 'vh':  result = (px / vh) * 100; break
        case 'pt':  result = px * (72 / 96); break
        case '%':   result = (px / parent) * 100; break
      }
      const display = Number.isFinite(result) ? parseFloat(result.toFixed(4)).toString() : '—'
      return { unit, value: display, isSelf: unit === fromUnit }
    })
  }, [value, fromUnit, rootFontSize, viewportW, viewportH, parentFontSize])

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.85)',
    padding: '6px 10px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'var(--font-geist-mono), monospace',
    width: '80px',
  }

  return (
    <ToolLayout
      toolId="css-unit-converter"
      title="CSS Unit Converter"
      description="Convert between px, rem, em, vw, vh, pt, and % with configurable baselines"
      seoContent={
        <SeoSection
          about="Convert CSS values between px, rem, em, vw, vh, pt, and % instantly. Set a custom root font size, viewport width, and base font size so conversions match your project's exact setup. All results update live."
          useCases={[
            'Converting a px value from a design file to rem for accessible CSS',
            'Checking how many pixels a vw or vh value equals at a given viewport size',
            'Converting pt values from print stylesheets to px for screen use',
            'Translating em values relative to a specific parent font size',
            'Quickly verifying unit conversions during responsive design work',
          ]}
          faqs={[
            { q: 'What is the default root font size?', a: 'The default is 16px, which is the browser default. You can change it to match your project\'s html { font-size } value.' },
            { q: 'How is em different from rem?', a: 'rem (root em) is relative to the root (html) font size. em is relative to the font size of the element itself or its nearest parent.' },
            { q: 'How are vw and vh calculated?', a: 'vw and vh are percentages of the viewport width and height. You can set the viewport dimensions in the tool to match your target screen size.' },
          ]}
        />
      }
      category="web"
      iconName="Ruler"
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ ...inputStyle, width: '100px' }}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>From unit</label>
            <div className="flex flex-wrap gap-1">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => setFromUnit(u)}
                  className="px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-all"
                  style={{
                    background: fromUnit === u ? 'var(--color-web-dim)' : 'var(--surface)',
                    border: `1px solid ${fromUnit === u ? 'var(--color-web)' : 'var(--border)'}`,
                    color: fromUnit === u ? 'var(--color-web)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Baselines */}
        <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>Baselines</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Root font size', value: rootFontSize, set: setRootFontSize, unit: 'px' },
              { label: 'Parent font size', value: parentFontSize, set: setParentFontSize, unit: 'px' },
              { label: 'Viewport width', value: viewportW, set: setViewportW, unit: 'px' },
              { label: 'Viewport height', value: viewportH, set: setViewportH, unit: 'px' },
            ].map(({ label, value: v, set, unit }) => (
              <div key={label}>
                <label className="text-xs mb-1 block" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>
                <div className="flex items-center gap-1">
                  <input type="number" value={v} onChange={(e) => set(e.target.value)} style={inputStyle} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {conversions.map(({ unit, value: converted, isSelf }) => (
            <div
              key={unit}
              className="rounded-xl px-4 py-3"
              style={{
                background: isSelf ? 'var(--color-web-dim)' : 'var(--surface)',
                border: `1px solid ${isSelf ? 'var(--color-web)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-medium" style={{ color: isSelf ? 'var(--color-web)' : 'rgba(255,255,255,0.4)' }}>
                  {unit}
                </span>
                <CopyButton text={`${converted}${unit}`} />
              </div>
              <div className="text-lg font-semibold" style={{ color: isSelf ? 'var(--color-web)' : 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono)' }}>
                {converted}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
