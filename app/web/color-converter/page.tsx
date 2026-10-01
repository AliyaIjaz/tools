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
    border: '2px solid var(--border-web-idle)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.9)',
    padding: '10px 14px',
    fontSize: '15px',
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
          aboutTitle="Color Converter Online"
          about={<>
            <p className="text-lg leading-relaxed">Convert colors instantly between HEX, RGB, HSL, and OKLCH with this free online Color Converter. Enter a color in any supported format and all other formats update automatically in real time. Whether you&apos;re designing a website, creating a design system, or writing CSS, this tool makes it easy to translate colors accurately between modern color formats.</p>
            <p className="text-lg leading-relaxed">Everything runs entirely in your browser, providing fast, private, and accurate color conversion without uploading or storing any data.</p>
          </>}
          extraSections={[
            {
              title: 'What Is a Color Converter?',
              intro: "A Color Converter is a tool that translates colors between different color models while preserving their visual appearance as accurately as possible. Designers and developers often work with multiple color formats depending on the software, programming language, or CSS feature they're using.\n\nInstead of converting colors manually or using formulas, this tool instantly converts between HEX, RGB, HSL, and OKLCH, making it ideal for web development, UI design, branding, and accessibility testing.",
              items: [],
            },
            {
              title: 'Features',
              items: [
                'Convert between HEX, RGB, HSL, and OKLCH',
                'Real-time color conversion',
                'Live color preview',
                'Instant updates while typing',
                'Copy converted values with one click',
                'Accepts uppercase and lowercase HEX',
                'Supports HEX values with or without the # symbol',
                'Supports 3-digit and 6-digit HEX colors',
                'Accurate color conversions',
                'Clean, responsive interface',
                'No registration required — free to use',
                'Works in all modern browsers, runs entirely in your browser',
              ],
            },
            {
              title: 'Supported Color Formats',
              items: [
                <div key="hex" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">HEX</p>
                  <p className="text-lg leading-relaxed">HEX (Hexadecimal) is the most common color format used on the web. It represents colors using six hexadecimal digits that define the red, green, and blue components.</p>
                  <p className="text-base" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'#3B82F6'}</pre>
                  <p className="text-lg leading-relaxed">HEX is widely used in HTML, CSS, design tools, and branding guidelines.</p>
                </div>,
                <div key="rgb" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">RGB</p>
                  <p className="text-lg leading-relaxed">RGB stands for Red, Green, Blue. Each color channel ranges from 0 to 255, allowing over 16 million possible color combinations.</p>
                  <p className="text-base" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'rgb(59, 130, 246)'}</pre>
                  <p className="text-lg leading-relaxed">RGB is commonly used for CSS, Canvas, SVG, and digital displays.</p>
                </div>,
                <div key="hsl" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">HSL</p>
                  <p className="text-lg leading-relaxed">HSL stands for Hue, Saturation, and Lightness. It provides a more intuitive way to modify colors compared to RGB because you can independently adjust hue, saturation, and brightness.</p>
                  <p className="text-base" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'hsl(217, 91%, 60%)'}</pre>
                  <p className="text-lg leading-relaxed">HSL is popular for creating themes, hover effects, and dark/light mode color variations.</p>
                </div>,
                <div key="oklch" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">OKLCH</p>
                  <p className="text-lg leading-relaxed">OKLCH is a modern perceptual color space that represents colors using L (Lightness), C (Chroma / color intensity), and H (Hue).</p>
                  <p className="text-base" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'oklch(0.65 0.17 255)'}</pre>
                  <p className="text-lg leading-relaxed">Unlike older color models, OKLCH is designed so equal numerical adjustments produce visually consistent changes, making it especially useful for accessible color palettes, design systems, and modern CSS workflows.</p>
                </div>,
              ],
            },
            {
              title: 'How to Use',
              items: [
                'Enter a color in any supported format.',
                'The tool automatically detects the format.',
                'All supported color formats update instantly.',
                'Copy any converted value with one click.',
                'Use the converted color in your CSS, design tool, or application.',
              ],
              closing: 'No downloads or registration are required.',
            },
            {
              title: 'Why Use a Color Converter?',
              intro: "Different tools and frameworks use different color formats. A designer might export a HEX value from Figma, while a developer needs RGB or HSL for CSS. Modern CSS also supports OKLCH, making it easier to build visually balanced themes and accessible interfaces.\n\nA Color Converter eliminates manual calculations, reduces errors, and ensures color consistency across design and development workflows.",
              items: [],
            },
            {
              title: 'Why Use OKLCH?',
              intro: 'OKLCH is becoming increasingly popular because it is based on human perception of color rather than raw RGB values.\n\nAdvantages include:',
              items: [
                'More consistent lightness adjustments',
                'Better color interpolation',
                'Easier creation of accessible palettes',
                'More predictable gradients',
                'Improved dark mode design',
                'Better support for modern design systems',
              ],
              closing: 'Many modern CSS frameworks and design tools are adopting OKLCH because it produces more visually uniform results than older color spaces.',
            },
            {
              title: 'Browser Compatibility',
              items: [
                'HEX, RGB, and HSL are supported by all modern browsers.',
                'OKLCH is supported in current versions of Chrome, Edge, Firefox, and Safari, making it suitable for modern web applications. If compatibility with older browsers is required, you can convert OKLCH colors to HEX or RGB before deployment.',
              ],
            },
            {
              title: 'Accessibility Tips',
              intro: 'Choosing the right color format can simplify accessible design.',
              items: [
                'Use HSL or OKLCH to adjust lightness while preserving hue.',
                'Test text and background contrast before publishing.',
                'Maintain sufficient contrast for readability.',
                'Build consistent light and dark themes using perceptually uniform colors.',
              ],
            },
          ]}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Converting HEX to RGB for CSS',
            'Translating RGB to HSL for easier editing',
            'Creating accessible color palettes',
            'Building design systems',
            'Working with Tailwind CSS projects',
            'Converting colors from Figma to CSS',
            'Creating dark mode themes',
            'Adjusting brand colors',
            'Creating CSS variables',
            'Working with OKLCH in modern CSS',
            'Designing UI components',
            'Frontend web development',
          ]}
          faqs={[
            { q: 'What is a Color Converter?', a: 'A Color Converter is an online tool that converts colors between different formats such as HEX, RGB, HSL, and OKLCH, making it easier to use colors across design tools, CSS, and applications.' },
            { q: 'Which color formats are supported?', a: 'This tool supports HEX, RGB, HSL, and OKLCH. Entering a value in any supported format automatically updates the others.' },
            { q: 'What is the difference between HEX and RGB?', a: 'HEX represents colors using hexadecimal notation, while RGB uses separate numerical values for the red, green, and blue channels. Both describe the same colors but use different formats.' },
            { q: 'Why should I use HSL?', a: 'HSL makes color adjustments more intuitive because hue, saturation, and lightness can be modified independently. It\'s especially useful for creating themes and color variations.' },
            { q: 'What is OKLCH?', a: 'OKLCH is a perceptually uniform color model that represents colors using lightness, chroma, and hue. It produces more visually consistent results than traditional RGB or HSL when creating color palettes and gradients.' },
            { q: 'Can I enter HEX colors without the # symbol?', a: 'Yes. The tool accepts HEX values with or without the leading #.' },
            { q: 'Does the tool support shorthand HEX values?', a: 'Yes. Three-digit shorthand colors such as #FFF are automatically expanded to their six-digit equivalents.' },
            { q: 'Are the conversions accurate?', a: 'Yes. The tool performs precise mathematical conversions between supported color spaces while preserving the color as accurately as possible.' },
            { q: 'Can I use these colors in CSS?', a: 'Absolutely. All generated values are ready to use in CSS, including HEX, RGB, HSL, and OKLCH syntax where supported.' },
            { q: 'Is this Color Converter free?', a: 'Yes. The tool is completely free and works entirely in your browser without requiring registration or downloads.' },
          ]}
        />
      }
      category="web"
      iconName="Palette"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Preview + HEX input */}
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-xl flex-shrink-0 border"
            style={{ background: error ? '#333' : hex, borderColor: 'var(--border)' }}
          />
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>HEX</label>
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
                className="w-11 h-11 rounded-lg cursor-pointer flex-shrink-0"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)', padding: '2px' }}
              />
            </div>
            {error && <p className="text-base mt-0.5" style={{ color: '#f87171' }}>{error}</p>}
          </div>
        </div>

        {/* RGB sliders */}
        {rgb && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}>
            <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>RGB</p>
            {(['r', 'g', 'b'] as (keyof RGB)[]).map((ch) => (
              <div key={ch} className="flex items-center gap-3">
                <span className="text-base uppercase font-mono font-semibold w-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{ch}</span>
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
                  style={{ ...inputStyle, width: '64px', textAlign: 'center', padding: '8px 6px' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* HSL sliders */}
        {hsl && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}>
            <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>HSL</p>
            {([
              { ch: 'h' as keyof HSL, max: 360, unit: '°' },
              { ch: 's' as keyof HSL, max: 100, unit: '%' },
              { ch: 'l' as keyof HSL, max: 100, unit: '%' },
            ]).map(({ ch, max, unit }) => (
              <div key={ch} className="flex items-center gap-3">
                <span className="text-base uppercase font-mono font-semibold w-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{ch}</span>
                <input
                  type="range" min={0} max={max}
                  value={hsl[ch]}
                  onChange={(e) => handleHslChange(ch, e.target.value)}
                  className="flex-1 accent-white"
                />
                <span className="text-base font-mono w-14 text-right" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {hsl[ch]}{unit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* All format outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formats.map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-4" style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                <CopyButton text={value} />
              </div>
              <code className="text-base" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-geist-mono), monospace' }}>
                {value}
              </code>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
