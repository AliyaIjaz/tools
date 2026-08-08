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
          aboutTitle="Box Shadow Generator Online"
          about={<>
            <p className="text-base leading-relaxed">Create custom CSS box shadows visually with a live preview and generate production-ready CSS in seconds. This free Box Shadow Generator lets you adjust horizontal and vertical offsets, blur radius, spread radius, color, opacity, and inset effects. Stack multiple shadow layers to build realistic depth, soft glows, or modern Material Design-inspired interfaces, then copy the generated CSS with a single click.</p>
            <p className="text-base leading-relaxed">Everything runs directly in your browser, so your work stays private and updates instantly.</p>
          </>}
          extraSections={[
            {
              title: 'What Is a CSS Box Shadow?',
              intro: 'The CSS box-shadow property adds one or more shadows around an HTML element without requiring image files. Box shadows are widely used in modern web design to create depth, highlight interactive elements, improve visual hierarchy, and make interfaces feel more polished.\n\nInstead of writing CSS manually, this online Box Shadow Generator provides an interactive editor where you can fine-tune every shadow property and preview the results in real time before copying the generated CSS.',
              items: [],
            },
            {
              title: 'Features',
              items: [
                'Live box shadow preview',
                'Generate clean, standards-compliant CSS',
                'Adjust horizontal offset',
                'Adjust vertical offset',
                'Customize blur radius',
                'Control spread radius',
                'Choose any shadow color',
                'Adjust shadow opacity',
                'Create inset shadows',
                'Stack unlimited shadow layers',
                'Build glow and elevation effects',
                'Copy CSS with one click',
                'No registration required — free to use',
                'Works in all modern browsers, runs entirely in your browser',
              ],
            },
            {
              title: 'Shadow Properties Explained',
              items: [
                <div key="x" className="space-y-1"><p className="text-base font-medium text-white">Horizontal Offset</p><p className="text-base leading-relaxed">Moves the shadow left or right. Positive values move it to the right, while negative values move it to the left.</p></div>,
                <div key="y" className="space-y-1"><p className="text-base font-medium text-white">Vertical Offset</p><p className="text-base leading-relaxed">Moves the shadow up or down. Positive values move it downward, while negative values move it upward.</p></div>,
                <div key="blur" className="space-y-1"><p className="text-base font-medium text-white">Blur Radius</p><p className="text-base leading-relaxed">Controls how soft the shadow appears. Smaller values create sharp shadows, while larger values produce smooth, diffused shadows.</p></div>,
                <div key="spread" className="space-y-1"><p className="text-base font-medium text-white">Spread Radius</p><p className="text-base leading-relaxed">Expands or shrinks the size of the shadow before blur is applied. Positive values increase the shadow size, while negative values reduce it.</p></div>,
                <div key="color" className="space-y-1"><p className="text-base font-medium text-white">Shadow Color</p><p className="text-base leading-relaxed">Choose any HEX, RGB, HSL, or RGBA color to match your design. Transparent colors are commonly used to create natural-looking shadows.</p></div>,
                <div key="opacity" className="space-y-1"><p className="text-base font-medium text-white">Opacity</p><p className="text-base leading-relaxed">Adjust the transparency of the shadow to make it subtle or more prominent without changing its color.</p></div>,
                <div key="inset" className="space-y-1"><p className="text-base font-medium text-white">Inset Shadow</p><p className="text-base leading-relaxed">An inset shadow is drawn inside the element instead of outside it. Commonly used for pressed buttons, input fields, recessed panels, and neumorphic interfaces.</p></div>,
              ],
            },
            {
              title: 'How to Use',
              items: [
                'Select a shadow color.',
                'Adjust the horizontal and vertical offsets.',
                'Fine-tune the blur radius.',
                'Modify the spread radius if needed.',
                'Change the shadow opacity.',
                'Enable Inset for inner shadows if desired.',
                'Add additional shadow layers for more realistic depth.',
                'Preview the result instantly.',
                'Copy the generated CSS and paste it into your stylesheet.',
              ],
            },
            {
              title: 'Example CSS',
              items: [
                <div key="simple" className="space-y-1.5"><p className="text-base font-medium text-white">Simple Shadow</p><pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'}</pre></div>,
                <div key="layered" className="space-y-1.5"><p className="text-base font-medium text-white">Layered Shadow</p><pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'box-shadow:\n  0 2px 4px rgba(0,0,0,.08),\n  0 8px 24px rgba(0,0,0,.12);'}</pre></div>,
                <div key="inset" className="space-y-1.5"><p className="text-base font-medium text-white">Inset Shadow</p><pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'box-shadow: inset 0 2px 6px rgba(0,0,0,.2);'}</pre></div>,
              ],
            },
            {
              title: 'Why Use a Box Shadow Generator?',
              intro: 'Writing box-shadow values by hand can be difficult because even small adjustments to blur, spread, or offsets can significantly change the appearance.\n\nA visual Box Shadow Generator helps you:',
              items: [
                'Design faster with instant previews',
                'Experiment without memorizing CSS syntax',
                'Create consistent shadows across projects',
                'Fine-tune complex layered shadows',
                'Generate production-ready CSS',
                'Improve UI consistency',
                'Save development time',
              ],
            },
            {
              title: 'Design Tips',
              items: [
                'Use low opacity for natural-looking shadows.',
                'Combine multiple shadow layers for realistic depth.',
                'Increase blur radius for softer shadows.',
                'Use small spread values for cleaner interfaces.',
                'Avoid overly dark shadows on light backgrounds.',
                'Use inset shadows sparingly for recessed effects.',
                'Test shadows on both light and dark themes.',
              ],
            },
            {
              title: 'Browser Compatibility',
              intro: 'The generated box-shadow CSS follows the official CSS specification and is fully supported in all modern browsers, including:',
              items: ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Safari', 'Opera'],
              closing: 'Vendor prefixes are no longer required.',
            },
          ]}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Creating elevated cards',
            'Designing modern dashboards',
            'Building buttons with depth',
            'Styling navigation menus',
            'Creating modal dialog shadows',
            'Designing floating panels',
            'Building Material Design interfaces',
            'Creating glow effects',
            'Adding focus states to form inputs',
            'Designing neumorphic UI components',
            'Creating hover animations',
            'Styling product cards and pricing tables',
          ]}
          faqs={[
            { q: 'What is a Box Shadow Generator?', a: 'A Box Shadow Generator is an online tool that visually creates CSS box-shadow values. It allows you to adjust shadow settings interactively and copy the generated CSS without writing code manually.' },
            { q: 'Can I add multiple shadow layers?', a: 'Yes. You can add as many shadow layers as you need. The tool combines them into a single comma-separated box-shadow value that can create realistic depth and advanced visual effects.' },
            { q: 'What is the difference between blur and spread?', a: 'Blur controls how soft the edges of the shadow appear, while spread changes the overall size of the shadow before blur is applied.' },
            { q: 'What is an inset shadow?', a: "Inset shadows are drawn inside an element instead of outside it. They're commonly used for pressed buttons, input fields, recessed containers, and neumorphic user interfaces." },
            { q: 'Can I create glow effects?', a: 'Yes. Using bright colors with a large blur radius and little or no spread creates soft glow effects that work well for buttons, icons, and interactive elements.' },
            { q: 'Does the generated CSS work in all browsers?', a: 'Yes. The generated CSS uses the standard box-shadow property supported by all modern browsers.' },
            { q: 'Can I use transparent colors?', a: 'Absolutely. Transparent colors using RGBA or HSLA are commonly used to create subtle, realistic shadows.' },
            { q: 'Is there a limit to the number of shadow layers?', a: 'No. You can create as many shadow layers as your design requires, though keeping the number reasonable helps maintain readability and performance.' },
            { q: 'Can I edit the generated CSS later?', a: 'Yes. After copying the CSS, you can modify any values manually in your stylesheet.' },
            { q: 'Is this Box Shadow Generator free?', a: 'Yes. The tool is completely free and works entirely in your browser without requiring registration or downloads.' },
          ]}
        />
      }
      category="web"
      iconName="Square"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Preview */}
        <div
          className="w-full h-52 rounded-xl flex items-center justify-center"
          style={{ background: bg, border: '2px solid var(--border-web-idle)' }}
        >
          <div
            className="w-28 h-28 rounded-xl transition-all duration-150"
            style={{ background: boxColor, boxShadow: shadows.map(shadowToCss).join(', ') }}
          />
        </div>

        {/* Preview bg / box color */}
        <div className="flex gap-5">
          <div className="flex items-center gap-2.5">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Background</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer" style={{ padding: '2px', border: '2px solid var(--border-web-idle)', background: 'transparent' }} />
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Box color</label>
            <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer" style={{ padding: '2px', border: '2px solid var(--border-web-idle)', background: 'transparent' }} />
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
                style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}
              >
                {/* Layer header */}
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
                  onClick={() => toggleCollapse(shadow.id)}
                >
                  <div
                    className="w-5 h-5 rounded flex-shrink-0"
                    style={{ background: shadow.color, border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                  <span className="text-base font-semibold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Layer {idx + 1}
                  </span>
                  {isCollapsed && (
                    <span className="text-sm flex-1 truncate font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {shadowSummary(shadow)}
                    </span>
                  )}
                  <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => removeShadow(shadow.id)}
                      disabled={shadows.length <= 1}
                      className="p-1.5 rounded transition-colors disabled:opacity-20"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <ChevronDown
                    size={16}
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Collapsible body */}
                {!isCollapsed && (
                  <div className="px-4 pb-5 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                    {/* Inset + color row */}
                    <div className="flex items-center gap-5 pt-4">
                      <label
                        className="flex items-center gap-2.5 cursor-pointer"
                        style={{ color: 'rgba(255,255,255,0.65)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) => update(shadow.id, 'inset', e.target.checked)}
                          className="w-4 h-4 accent-white"
                        />
                        <span className="text-base font-medium">Inset</span>
                      </label>
                      <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        <label className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>Color</label>
                        <input
                          type="color"
                          value={shadow.color}
                          onChange={(e) => update(shadow.id, 'color', e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer"
                          style={{ padding: '2px', border: '2px solid var(--border-web-idle)', background: 'transparent' }}
                        />
                        <code className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {shadow.color}
                        </code>
                      </div>
                    </div>

                    {sliders.map(({ key, label, min, max, unit }) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-20 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                        <input
                          type="range" min={min} max={max}
                          value={shadow[key] as number}
                          onChange={(e) => update(shadow.id, key, Number(e.target.value))}
                          className="flex-1 accent-white"
                        />
                        <span className="text-sm font-mono w-14 text-right" style={{ color: 'rgba(255,255,255,0.8)' }}>
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
            className="w-full py-3 rounded-xl text-base font-medium flex items-center justify-center gap-2 transition-all"
            style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'rgba(255,255,255,0.55)' }}
          >
            <Plus size={15} /> Add layer
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>CSS output</label>
            <CopyButton text={fullCss} label="Copy CSS" />
          </div>
          <pre
            className="rounded-xl px-5 py-4 whitespace-pre-wrap break-all"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono), monospace', fontSize: '14px', lineHeight: '1.7' }}
          >
            {fullCss}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
