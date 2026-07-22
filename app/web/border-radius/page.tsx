'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Corner = 'tl' | 'tr' | 'br' | 'bl'
const CORNERS: { key: Corner; label: string }[] = [
  { key: 'tl', label: 'Top left' },
  { key: 'tr', label: 'Top right' },
  { key: 'br', label: 'Bottom right' },
  { key: 'bl', label: 'Bottom left' },
]

export default function BorderRadiusPage() {
  const [linked, setLinked] = useState(true)
  const [unit, setUnit] = useState<'px' | '%'>('px')
  const [radii, setRadii] = useState({ tl: 16, tr: 16, br: 16, bl: 16 })

  const max = unit === '%' ? 50 : 200

  function setRadius(corner: Corner, val: number) {
    const clamped = Math.max(0, Math.min(max, val))
    if (linked) {
      setRadii({ tl: clamped, tr: clamped, br: clamped, bl: clamped })
    } else {
      setRadii((prev) => ({ ...prev, [corner]: clamped }))
    }
  }

  const css = useMemo(() => {
    const { tl, tr, br, bl } = radii
    const u = unit
    const isUniform = tl === tr && tr === br && br === bl
    const value = isUniform
      ? `${tl}${u}`
      : `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`
    return `border-radius: ${value};`
  }, [radii, unit])

  const borderRadiusStyle = `${radii.tl}${unit} ${radii.tr}${unit} ${radii.br}${unit} ${radii.bl}${unit}`

  return (
    <ToolLayout
      toolId="border-radius"
      title="Border Radius Visualizer"
      description="Build and preview CSS border-radius values per corner"
      seoContent={
        <SeoSection
          about="Set independent border-radius values for each corner of a box and see the result live. Drag sliders or type values for top-left, top-right, bottom-right, and bottom-left corners. Copy the resulting CSS with one click."
          useCases={[
            'Creating asymmetric border-radius shapes for buttons or cards',
            'Designing blob or organic-shape outlines using per-corner radius values',
            'Quickly generating CSS for pill-shaped elements with equal radius on all corners',
            'Experimenting with partial rounding for tab or badge components',
            'Understanding how different radius values combine into a single border-radius shorthand',
          ]}
          faqs={[
            { q: 'Can I set different horizontal and vertical radii per corner?', a: 'Currently the tool sets a single radius value per corner. The full shorthand (using /) for elliptical corners may be added in a future update.' },
            { q: 'What does the generated CSS look like?', a: 'The output is a single border-radius shorthand value (e.g. border-radius: 8px 16px 8px 4px) or a single value if all corners are equal (e.g. border-radius: 12px).' },
            { q: 'What is the maximum radius I can set?', a: 'Values up to 200px can be set via the sliders. You can also type higher values directly.' },
          ]}
        />
      }
      category="web"
      iconName="RectangleHorizontal"
    >
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex items-center justify-center py-8">
          <div
            className="w-48 h-48 transition-all duration-150"
            style={{
              background: 'var(--color-web-dim)',
              border: '2px solid var(--color-web)',
              borderRadius: borderRadiusStyle,
            }}
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Unit */}
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {(['px', '%'] as const).map((u) => (
              <button
                key={u}
                onClick={() => { setUnit(u); setRadii({ tl: 16, tr: 16, br: 16, bl: 16 }) }}
                className="px-3 py-1.5 rounded-md text-sm font-mono font-medium transition-all"
                style={{
                  background: unit === u ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: unit === u ? 'white' : 'rgba(255,255,255,0.4)',
                  border: unit === u ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                }}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Linked toggle */}
          <button
            onClick={() => setLinked((v) => !v)}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: linked ? 'var(--color-web)' : 'rgba(255,255,255,0.4)' }}
          >
            <span
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{
                background: linked ? 'var(--color-web-dim)' : 'var(--surface)',
                border: `1px solid ${linked ? 'var(--color-web)' : 'var(--border)'}`,
              }}
            >
              {linked && <span style={{ color: 'var(--color-web)', fontSize: '10px' }}>✓</span>}
            </span>
            Link all corners
          </button>
        </div>

        {/* Per-corner sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CORNERS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
                <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-web)' }}>
                  {radii[key]}{unit}
                </span>
              </div>
              <input
                type="range" min={0} max={max}
                value={radii[key]}
                onChange={(e) => setRadius(key, Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          ))}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>CSS output</label>
            <CopyButton text={css} label="Copy CSS" />
          </div>
          <pre
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {css}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
