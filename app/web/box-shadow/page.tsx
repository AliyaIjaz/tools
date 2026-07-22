'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Shadow = {
  id: number
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

let _id = 0
const uid = () => ++_id

function makeShadow(): Shadow {
  return { id: uid(), x: 4, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 40, inset: false }
}

function shadowToCss(s: Shadow): string {
  const alpha = Math.round(s.opacity * 2.55).toString(16).padStart(2, '0')
  return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}${alpha}`
}

function shadowSummary(s: Shadow): string {
  return `${s.inset ? 'inset · ' : ''}${s.x}px ${s.y}px · blur ${s.blur}px · ${s.opacity}%`
}

export default function BoxShadowPage() {
  const [shadows, setShadows] = useState<Shadow[]>([makeShadow()])
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())
  const [bg, setBg] = useState('#1a1a2e')
  const [boxColor, setBoxColor] = useState('#ffffff')

  const css = useMemo(() => shadows.map(shadowToCss).join(',\n     '), [shadows])
  const fullCss = `box-shadow: ${css};`

  function update(id: number, field: keyof Shadow, value: unknown) {
    setShadows((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s))
  }

  function addShadow() {
    const s = makeShadow()
    setShadows((prev) => [...prev, s])
    // new layers start expanded
    setCollapsed((prev) => { const next = new Set(prev); next.delete(s.id); return next })
  }

  function removeShadow(id: number) {
    if (shadows.length <= 1) return
    setShadows((prev) => prev.filter((s) => s.id !== id))
    setCollapsed((prev) => { const next = new Set(prev); next.delete(id); return next })
  }

  function toggleCollapse(id: number) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const sliders: { key: keyof Shadow; label: string; min: number; max: number; unit: string }[] = [
    { key: 'x', label: 'X offset', min: -100, max: 100, unit: 'px' },
    { key: 'y', label: 'Y offset', min: -100, max: 100, unit: 'px' },
    { key: 'blur', label: 'Blur', min: 0, max: 100, unit: 'px' },
    { key: 'spread', label: 'Spread', min: -50, max: 50, unit: 'px' },
    { key: 'opacity', label: 'Opacity', min: 0, max: 100, unit: '%' },
  ]

  return (
    <ToolLayout
      toolId="box-shadow"
      title="Box Shadow Generator"
      description="Build CSS box shadows with interactive controls and live preview"
      seoContent={
        <SeoSection
          about="Design CSS box shadows interactively with a live preview. Adjust offset, blur, spread, color, and opacity for each shadow layer. Stack multiple shadow layers to create depth effects. Copy the finished CSS value with one click."
          useCases={[
            'Creating card elevation shadows for UI components and dashboards',
            'Building inset shadows for pressed-button or input-field effects',
            'Layering multiple shadows to achieve realistic depth and material design effects',
            'Generating glow effects using colored box shadows with zero spread',
            'Quickly experimenting with shadow values before writing CSS manually',
          ]}
          faqs={[
            { q: 'Can I add multiple shadow layers?', a: 'Yes. Add as many layers as you need — they are combined into a single comma-separated box-shadow value.' },
            { q: 'What is the difference between blur and spread?', a: 'Blur controls how soft the shadow edge is. Spread expands or contracts the shadow size before blurring.' },
            { q: 'What is an inset shadow?', a: 'An inset shadow appears inside the element rather than behind it, useful for creating recessed or pressed visual effects.' },
          ]}
        />
      }
      category="web"
      iconName="Square"
    >
      <div className="space-y-5">
        {/* Preview */}
        <div
          className="w-full h-52 rounded-xl flex items-center justify-center"
          style={{ background: bg, border: '1px solid var(--border)' }}
        >
          <div
            className="w-28 h-28 rounded-xl transition-all duration-150"
            style={{ background: boxColor, boxShadow: shadows.map(shadowToCss).join(', ') }}
          />
        </div>

        {/* Preview bg / box color */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Background</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer" style={{ padding: '2px', border: '1px solid var(--border)', background: 'transparent' }} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Box color</label>
            <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer" style={{ padding: '2px', border: '1px solid var(--border)', background: 'transparent' }} />
          </div>
        </div>

        {/* Shadow layers */}
        <div className="space-y-2">
          {shadows.map((shadow, idx) => {
            const isCollapsed = collapsed.has(shadow.id)
            return (
              <div
                key={shadow.id}
                className="rounded-xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                {/* Layer header — always visible, click to collapse */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleCollapse(shadow.id)}
                >
                  {/* Color swatch */}
                  <div
                    className="w-4 h-4 rounded flex-shrink-0"
                    style={{ background: shadow.color, border: '1px solid rgba(255,255,255,0.15)' }}
                  />

                  <span className="text-xs font-medium flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Layer {idx + 1}
                  </span>

                  {/* Summary shown when collapsed */}
                  {isCollapsed && (
                    <span className="text-xs flex-1 truncate" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-geist-mono)' }}>
                      {shadowSummary(shadow)}
                    </span>
                  )}

                  <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      disabled={shadows.length <= 1}
                      className="p-1 rounded transition-colors disabled:opacity-20"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <ChevronDown
                    size={14}
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Collapsible body */}
                {!isCollapsed && (
                  <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* Inset + color row */}
                    <div className="flex items-center gap-4 pt-3">
                      <label
                        className="flex items-center gap-2 text-xs cursor-pointer"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) => update(shadow.id, 'inset', e.target.checked)}
                          className="accent-white"
                        />
                        Inset
                      </label>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <label className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Color</label>
                        <input
                          type="color"
                          value={shadow.color}
                          onChange={(e) => update(shadow.id, 'color', e.target.value)}
                          className="w-7 h-7 rounded cursor-pointer"
                          style={{ padding: '2px', border: '1px solid var(--border)', background: 'transparent' }}
                        />
                        <code className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-geist-mono)' }}>
                          {shadow.color}
                        </code>
                      </div>
                    </div>

                    {sliders.map(({ key, label, min, max, unit }) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-xs w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                        <input
                          type="range" min={min} max={max}
                          value={shadow[key] as number}
                          onChange={(e) => update(shadow.id, key, Number(e.target.value))}
                          className="flex-1 accent-white"
                        />
                        <span className="text-xs w-12 text-right" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-geist-mono)' }}>
                          {shadow[key] as number}{unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <button
            onClick={addShadow}
            className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'rgba(255,255,255,0.4)' }}
          >
            <Plus size={14} /> Add layer
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>CSS output</label>
            <CopyButton text={fullCss} label="Copy CSS" />
          </div>
          <pre
            className="rounded-xl px-4 py-3 text-sm whitespace-pre-wrap break-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {fullCss}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
