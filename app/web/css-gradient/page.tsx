'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type Stop = { color: string; position: number; id: number }
type GradientType = 'linear' | 'radial' | 'conic'

let _id = 0
const uid = () => ++_id

export default function CssGradientPage() {
  const [type, setType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState<Stop[]>([
    { color: '#6d28d9', position: 0, id: uid() },
    { color: '#0ea5e9', position: 100, id: uid() },
  ])

  const css = useMemo(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position)
    const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(', ')
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopStr})`
    if (type === 'radial') return `radial-gradient(circle, ${stopStr})`
    return `conic-gradient(from ${angle}deg, ${stopStr})`
  }, [type, angle, stops])

  function addStop() {
    setStops((prev) => [...prev, { color: '#ffffff', position: 50, id: uid() }])
  }

  function removeStop(id: number) {
    if (stops.length <= 2) return
    setStops((prev) => prev.filter((s) => s.id !== id))
  }

  function updateStop(id: number, field: keyof Omit<Stop, 'id'>, value: string | number) {
    setStops((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s))
  }

  const TYPES: GradientType[] = ['linear', 'radial', 'conic']

  return (
    <ToolLayout
      toolId="css-gradient"
      title="CSS Gradient Generator"
      description="Build linear, radial, and conic CSS gradients visually"
      seoContent={
        <SeoSection
          about="Build CSS gradients visually with a live preview and instant copy of the generated CSS. Supports linear, radial, and conic gradient types with unlimited color stops. The output is clean, standard CSS that works in all modern browsers."
          useCases={[
            'Creating background gradients for hero sections and banners',
            'Building subtle gradient overlays on top of images or cards',
            'Generating conic gradients for pie charts or loading spinners',
            'Experimenting with color palettes and gradient directions visually',
            'Producing CSS background values for design systems or component libraries',
          ]}
          faqs={[
            { q: 'What gradient types are supported?', a: 'Linear (linear-gradient), radial (radial-gradient), and conic (conic-gradient) are all supported.' },
            { q: 'Can I add more than two color stops?', a: 'Yes. You can add as many color stops as you need, each with its own color and position.' },
            { q: 'Does the output include vendor prefixes?', a: 'No — vendor prefixes for gradients are not needed in any modern browser. The generated CSS uses standard syntax only.' },
          ]}
        />
      }
      category="web"
      iconName="Palette"
    >
      <div className="space-y-5">
        {/* Preview */}
        <div
          className="w-full h-48 rounded-xl"
          style={{ background: css, border: '1px solid var(--border)' }}
        />

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Type</label>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                  style={{
                    background: type === t ? 'var(--color-web-dim)' : 'var(--surface)',
                    border: `1px solid ${type === t ? 'var(--color-web)' : 'var(--border)'}`,
                    color: type === t ? 'var(--color-web)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {type !== 'radial' && (
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Angle — {angle}°
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0} max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="flex-1 accent-white"
                />
                <input
                  type="number" min={0} max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 rounded-lg text-sm text-center outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-geist-mono)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Color stops */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Color stops</label>
            <button
              onClick={addStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.5)' }}
            >
              <Plus size={12} /> Add stop
            </button>
          </div>

          <div className="space-y-2">
            {stops.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer flex-shrink-0"
                  style={{ padding: '2px', background: 'transparent', border: '1px solid var(--border)' }}
                />
                <code className="text-xs flex-shrink-0 w-16" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-geist-mono)' }}>
                  {stop.color}
                </code>
                <input
                  type="range" min={0} max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, 'position', Number(e.target.value))}
                  className="flex-1 accent-white"
                />
                <span className="text-xs w-8 text-right" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-geist-mono)' }}>
                  {stop.position}%
                </span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="p-1.5 rounded-lg transition-colors disabled:opacity-25"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>CSS output</label>
            <div className="flex gap-2">
              <CopyButton text={`background: ${css};`} label="Copy CSS" />
              <CopyButton text={css} label="Copy value" />
            </div>
          </div>
          <pre
            className="rounded-xl px-4 py-3 text-sm break-all whitespace-pre-wrap"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            {`background: ${css};`}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
