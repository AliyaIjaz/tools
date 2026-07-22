'use client'

import { useState, useCallback } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type RGB = { r: number; g: number; b: number }
type HSL = { h: number; s: number; l: number }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
}

function rgbToOklch({ r, g, b }: RGB): string {
  // Approximate via linearization
  const toLinear = (v: number) => {
    const n = v / 255
    return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b)
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  const lc = Math.cbrt(l), mc = Math.cbrt(m), sc = Math.cbrt(s)
  const L = 0.2104542553 * lc + 0.7936177850 * mc - 0.0040720468 * sc
  const a = 1.9779984951 * lc - 2.4285922050 * mc + 0.4505937099 * sc
  const bk = 0.0259040371 * lc + 0.7827717662 * mc - 0.8086757660 * sc
  const C = Math.sqrt(a * a + bk * bk)
  const H = Math.atan2(bk, a) * 180 / Math.PI
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${((H + 360) % 360).toFixed(1)})`
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#6d28d9')
  const [error, setError] = useState('')

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb) : null
  const oklch = rgb ? rgbToOklch(rgb) : null

  const handleHexInput = useCallback((val: string) => {
    setHex(val)
    const clean = val.startsWith('#') ? val : '#' + val
    setError(hexToRgb(clean) ? '' : 'Invalid hex color')
  }, [])

  const handleRgbChange = useCallback((channel: keyof RGB, val: string) => {
    if (!rgb) return
    const num = Math.max(0, Math.min(255, Number(val)))
    setHex(rgbToHex({ ...rgb, [channel]: isNaN(num) ? 0 : num }))
    setError('')
  }, [rgb])

  const handleHslChange = useCallback((channel: keyof HSL, val: string) => {
    const num = Number(val)
    if (!hsl || isNaN(num)) return
    const updated = { ...hsl, [channel]: num }
    setHex(rgbToHex(hslToRgb(updated)))
    setError('')
  }, [hsl])

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.85)',
    padding: '6px 10px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'var(--font-geist-mono), monospace',
    width: '100%',
  }

  const formats = rgb && hsl ? [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'OKLCH', value: oklch ?? '' },
  ] : []

  return (
    <ToolLayout
      toolId="color-converter"
      title="Color Converter"
      description="Convert between HEX, RGB, HSL, and OKLCH color formats"
      seoContent={
        <SeoSection
          about="Convert colors instantly between HEX, RGB, HSL, and OKLCH formats. Enter a value in any format and all others update immediately. Useful for translating colors between design tools, CSS variables, and code."
          useCases={[
            'Converting a HEX color from a design tool to RGB for use in CSS rgba()',
            'Translating brand colors into HSL for easier lightness adjustments',
            'Converting colors to OKLCH for perceptually uniform color manipulation',
            'Checking the HSL values of a color to create accessible dark/light variants',
            'Translating colors between Figma, Tailwind, and CSS codebases',
          ]}
          faqs={[
            { q: 'What is OKLCH?', a: 'OKLCH is a perceptually uniform color space where L is lightness, C is chroma (colorfulness), and H is hue. It is supported in modern browsers and produces more consistent results when creating color palettes.' },
            { q: 'Can I enter colors with or without the # symbol?', a: 'Yes. HEX values can be entered with or without the leading # character.' },
            { q: 'Does it support shorthand HEX like #fff?', a: 'Yes. 3-digit shorthand HEX values are expanded automatically to 6-digit equivalents.' },
          ]}
        />
      }
      category="web"
      iconName="Palette"
    >
      <div className="space-y-6">
        {/* Preview + HEX input */}
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl flex-shrink-0 border"
            style={{ background: error ? '#333' : hex, borderColor: 'var(--border)' }}
          />
          <div className="flex-1">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.45)' }}>HEX</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexInput(e.target.value)}
                style={{ ...inputStyle, textTransform: 'uppercase' }}
                maxLength={7}
              />
              <input
                type="color"
                value={hex.length === 7 ? hex : '#6d28d9'}
                onChange={(e) => { setHex(e.target.value); setError('') }}
                className="w-10 h-10 rounded-lg cursor-pointer"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2px' }}
              />
            </div>
            {error && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{error}</p>}
          </div>
        </div>

        {/* RGB sliders */}
        {rgb && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>RGB</p>
            {(['r', 'g', 'b'] as (keyof RGB)[]).map((ch) => (
              <div key={ch} className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono w-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{ch}</span>
                <input
                  type="range" min={0} max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, e.target.value)}
                  className="flex-1 accent-white"
                />
                <input
                  type="number" min={0} max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleRgbChange(ch, e.target.value)}
                  style={{ ...inputStyle, width: '56px', textAlign: 'center' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* HSL sliders */}
        {hsl && (
          <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>HSL</p>
            {([
              { ch: 'h' as keyof HSL, max: 360, unit: '°' },
              { ch: 's' as keyof HSL, max: 100, unit: '%' },
              { ch: 'l' as keyof HSL, max: 100, unit: '%' },
            ]).map(({ ch, max, unit }) => (
              <div key={ch} className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono w-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{ch}</span>
                <input
                  type="range" min={0} max={max}
                  value={hsl[ch]}
                  onChange={(e) => handleHslChange(ch, e.target.value)}
                  className="flex-1 accent-white"
                />
                <span className="text-xs font-mono w-14 text-right" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {hsl[ch]}{unit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* All format outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formats.map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                <CopyButton text={value} />
              </div>
              <code className="text-sm" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                {value}
              </code>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
