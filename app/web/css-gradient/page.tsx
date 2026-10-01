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
          aboutTitle="CSS Gradient Generator Online"
          about={<>
            <p className="text-lg leading-relaxed">Create beautiful CSS gradients visually with a live preview and copy production-ready CSS instantly. This free CSS Gradient Generator lets you build linear, radial, and conic gradients, customize unlimited color stops, adjust angles and positions, and generate clean CSS that works in all modern browsers. Everything runs entirely in your browser, so your work stays private and updates instantly.</p>
          </>}
          extraSections={[
            {
              title: 'What Is a CSS Gradient?',
              intro: 'A CSS gradient is a background created entirely with CSS instead of an image. Gradients smoothly transition between two or more colors, making them ideal for modern user interfaces, hero sections, buttons, cards, overlays, and decorative backgrounds. Because gradients are rendered by the browser, they eliminate the need for separate image files and can help reduce page requests.\n\nThis online gradient generator removes the need to write CSS manually. Simply choose your colors, adjust the gradient settings, preview the result in real time, and copy the generated CSS with a single click.',
              items: [],
            },
            {
              title: 'Features',
              items: [
                'Generate Linear Gradients',
                'Create Radial Gradients',
                'Build Conic Gradients',
                'Unlimited color stops',
                'Live visual preview',
                'Adjust gradient angle',
                'Customize color stop positions',
                'Copy generated CSS instantly',
                'Clean, standards-compliant CSS output',
                'No registration required',
                'Works in all modern browsers',
                'Completely free — runs entirely in your browser',
              ],
            },
            {
              title: 'Supported Gradient Types',
              items: [
                <div key="linear" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">Linear Gradient</p>
                  <p className="text-lg leading-relaxed">Linear gradients transition colors in a straight line. Commonly used for website backgrounds, buttons, hero banners, navigation bars, and call-to-action sections.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>{`background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);`}</pre>
                </div>,
                <div key="radial" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">Radial Gradient</p>
                  <p className="text-lg leading-relaxed">Radial gradients spread outward from a central point. Perfect for spotlight effects, circular backgrounds, glowing elements, badges, and decorative UI components.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>{`background: radial-gradient(circle, #ffffff 0%, #3b82f6 100%);`}</pre>
                </div>,
                <div key="conic" className="space-y-1.5">
                  <p className="text-lg font-medium text-white">Conic Gradient</p>
                  <p className="text-lg leading-relaxed">Conic gradients rotate colors around a center point. Useful for pie charts, progress indicators, loading animations, color wheels, and creative visual effects.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <pre className="text-base font-mono px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>{`background: conic-gradient(#3b82f6, #8b5cf6, #ec4899, #3b82f6);`}</pre>
                </div>,
              ],
            },
            {
              title: 'How to Use',
              items: [
                'Select the gradient type.',
                'Add two or more colors.',
                'Adjust the angle or direction (for linear gradients).',
                'Move color stops to fine-tune transitions.',
                'Preview the gradient instantly.',
                'Copy the generated CSS.',
                'Paste it directly into your stylesheet or project.',
              ],
              closing: 'No installation or account is required.',
            },
            {
              title: 'Why Use CSS Gradients Instead of Images?',
              intro: 'Using CSS gradients offers several advantages over image backgrounds:',
              items: [
                'Faster loading since no image file is required',
                'Smaller page size',
                'Fully scalable without quality loss',
                'Easy to edit by changing CSS values',
                'Responsive on every screen size',
                'Smooth rendering in modern browsers',
                'Ideal for dark mode and theme customization',
              ],
              closing: 'For many UI elements, gradients provide a cleaner and more flexible solution than static images.',
            },
            {
              title: 'Browser Compatibility',
              intro: 'The generated CSS uses standard gradient syntax supported by all major modern browsers, including:',
              items: ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Safari', 'Opera'],
              closing: 'Vendor prefixes are no longer necessary for modern browsers.',
            },
            {
              title: 'Tips for Better Gradient Design',
              items: [
                'Limit gradients to two to four primary colors for a cleaner appearance.',
                'Use subtle color transitions for professional interfaces.',
                'Ensure sufficient contrast when placing text over gradients.',
                'Choose complementary or analogous colors for smoother blends.',
                'Avoid excessive saturation that can reduce readability.',
                'Preview gradients on both desktop and mobile devices.',
              ],
            },
          ]}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Creating hero section backgrounds',
            'Designing modern landing pages',
            'Styling buttons and call-to-action elements',
            'Building colorful cards and panels',
            'Adding gradient overlays to images',
            'Creating backgrounds for dashboards',
            'Designing gradients for mobile apps',
            'Producing CSS for component libraries',
            'Building loading animations',
            'Creating pie charts with conic gradients',
            'Experimenting with color palettes',
            'Developing responsive website themes',
          ]}
          faqs={[
            { q: 'What is a CSS Gradient Generator?', a: 'A CSS Gradient Generator is a visual tool that creates CSS code for gradient backgrounds. Instead of writing CSS manually, you can customize colors, angles, and positions through an interactive interface and copy the generated code instantly.' },
            { q: 'What gradient types are supported?', a: 'The tool supports linear gradients (linear-gradient), radial gradients (radial-gradient), and conic gradients (conic-gradient).' },
            { q: 'Can I add more than two color stops?', a: 'Yes. You can add as many color stops as you need. Each stop can have its own color and position, allowing you to create simple or complex multi-color gradients.' },
            { q: 'Does the generated CSS work in all browsers?', a: 'Yes. The generated CSS follows modern CSS standards and works in current versions of Chrome, Firefox, Edge, Safari, and other modern browsers.' },
            { q: 'Are vendor prefixes included?', a: 'No. Vendor prefixes are no longer required for CSS gradients in modern browsers, so the generated CSS uses the standard syntax.' },
            { q: 'Can I use gradients instead of background images?', a: 'Yes. CSS gradients are often a better alternative to image backgrounds because they are scalable, lightweight, and easier to customize without increasing page size.' },
            { q: 'Can I create transparent gradients?', a: 'Yes. You can use transparent or semi-transparent colors to create overlays, fade effects, and layered backgrounds.' },
            { q: 'Are CSS gradients responsive?', a: 'Yes. Since gradients are generated by CSS rather than fixed images, they automatically scale with the size of the element and work well on responsive websites.' },
            { q: 'Can I edit the generated CSS?', a: 'Absolutely. After copying the CSS, you can modify colors, angles, positions, or gradient types directly in your stylesheet.' },
            { q: 'Is this CSS Gradient Generator free?', a: 'Yes. The tool is completely free to use with no registration, downloads, or installation required.' },
          ]}
        />
      }
      category="web"
      iconName="Palette"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Preview */}
        <div
          className="w-full h-52 rounded-xl"
          style={{ background: css, border: '2px solid var(--border-web-idle)' }}
        />

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Type</label>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="flex-1 py-2.5 rounded-lg text-lg font-semibold capitalize transition-all"
                  style={{
                    background: type === t ? 'var(--color-web-dim)' : 'var(--surface)',
                    border: `1.5px solid ${type === t ? 'var(--color-web)' : 'var(--border)'}`,
                    color: type === t ? 'var(--color-web)' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Angle */}
          {type !== 'radial' && (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Angle
                <span className="ml-2 font-mono text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>{angle}°</span>
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
                  className="w-18 px-3 py-2 rounded-lg text-lg text-center outline-none"
                  style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-geist-mono)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Color stops */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Color stops</label>
            <button
              onClick={addStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
              style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)', color: 'rgba(255,255,255,0.65)' }}
            >
              <Plus size={13} /> Add stop
            </button>
          </div>

          <div className="space-y-2">
            {stops.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
              >
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, 'color', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0"
                  style={{ padding: '2px', background: 'transparent', border: '2px solid var(--border-web-idle)' }}
                />
                <code className="text-base flex-shrink-0 w-18" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-geist-mono)' }}>
                  {stop.color}
                </code>
                <input
                  type="range" min={0} max={100}
                  value={stop.position}
                  onChange={(e) => updateStop(stop.id, 'position', Number(e.target.value))}
                  className="flex-1 accent-white"
                />
                <span className="text-base w-10 text-right font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {stop.position}%
                </span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="p-1.5 rounded-lg transition-colors disabled:opacity-25"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>CSS output</label>
            <div className="flex gap-2">
              <CopyButton text={`background: ${css};`} label="Copy CSS" />
              <CopyButton text={css} label="Copy value" />
            </div>
          </div>
          <pre
            className="rounded-xl px-5 py-4 text-base break-all whitespace-pre-wrap"
            style={{
              background: 'var(--surface)',
              border: '2px solid var(--border-web-idle)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: '14px',
              lineHeight: '1.7',
            }}
          >
            {`background: ${css};`}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
