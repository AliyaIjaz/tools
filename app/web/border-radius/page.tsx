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
          aboutTitle="Border Radius Generator Online"
          about={<>
            <p className="text-base leading-relaxed">Create custom rounded corners for your website with this free Border Radius Generator. Adjust the top-left, top-right, bottom-right, and bottom-left corner radius independently, preview the result instantly, and copy production-ready CSS with one click.</p>
            <p className="text-base leading-relaxed">Whether you're designing buttons, cards, badges, forms, avatars, or modern user interfaces, this tool makes it easy to generate accurate CSS border-radius values without writing code manually.</p>
            <p className="text-base leading-relaxed">Everything runs entirely in your browser. No data is uploaded or stored.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-1">What Is CSS border-radius?</h3>
            <p className="text-base leading-relaxed">The CSS <code className="text-sm font-mono px-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>border-radius</code> property rounds the corners of HTML elements. It is one of the most widely used CSS properties for creating modern user interfaces, allowing developers to soften sharp corners or create circles, pills, and custom organic shapes.</p>
            <p className="text-base leading-relaxed">Instead of manually experimenting with different values, this online Border Radius Generator provides a live preview so you can visually adjust each corner and instantly generate the corresponding CSS.</p>
            <p className="text-base leading-relaxed">Rounded corners are commonly used in buttons, cards, navigation menus, input fields, profile images, badges, dialog boxes, product cards, mobile interfaces, and dashboard components.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Border Radius Properties Explained</h3>
            <p className="text-base leading-relaxed"><strong className="text-white">Top-Left Radius</strong> — Controls how rounded the upper-left corner of the element appears.</p>
            <p className="text-base leading-relaxed"><strong className="text-white">Top-Right Radius</strong> — Adjusts the curvature of the upper-right corner.</p>
            <p className="text-base leading-relaxed"><strong className="text-white">Bottom-Right Radius</strong> — Changes the roundness of the lower-right corner.</p>
            <p className="text-base leading-relaxed"><strong className="text-white">Bottom-Left Radius</strong> — Controls the curvature of the lower-left corner.</p>
            <p className="text-base leading-relaxed">By setting different values for each corner, you can create unique shapes ranging from subtle rounded rectangles to modern asymmetric designs.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">CSS Shorthand Explained</h3>
            <p className="text-base leading-relaxed">The <code className="text-sm font-mono px-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>border-radius</code> property supports one to four values.</p>
            <p className="text-base font-medium text-white mt-3 mb-1">One Value — All four corners use the same radius.</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`border-radius: 12px;`}</pre>
            <p className="text-base font-medium text-white mt-3 mb-1">Two Values — First applies to top-left & bottom-right; second to top-right & bottom-left.</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`border-radius: 12px 24px;`}</pre>
            <p className="text-base font-medium text-white mt-3 mb-1">Three Values — Top-left, then top-right & bottom-left, then bottom-right.</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`border-radius: 12px 24px 8px;`}</pre>
            <p className="text-base font-medium text-white mt-3 mb-1">Four Values — Each corner receives its own value (top-left, top-right, bottom-right, bottom-left).</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`border-radius: 12px 24px 8px 16px;`}</pre>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Example CSS</h3>
            <p className="text-base font-medium text-white mb-1">Rounded Button</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`button {\n  border-radius: 8px;\n}`}</pre>
            <p className="text-base font-medium text-white mt-3 mb-1">Pill Button</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`button {\n  border-radius: 9999px;\n}`}</pre>
            <p className="text-base font-medium text-white mt-3 mb-1">Card Component</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`.card {\n  border-radius: 16px;\n}`}</pre>
            <p className="text-base font-medium text-white mt-3 mb-1">Asymmetrical Shape</p>
            <pre className="text-sm rounded-lg p-3 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)' }}>{`.box {\n  border-radius: 40px 8px 32px 12px;\n}`}</pre>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Design Tips</h3>
          </>}
          useCasesTitle="Features"
          useCases={[
            'Live border-radius preview',
            'Adjust each corner independently',
            'Control top-left, top-right, bottom-right, and bottom-left radii',
            'Generate CSS shorthand automatically',
            'Copy CSS with one click',
            'Supports pixel values',
            'Interactive sliders for quick editing',
            'Manual value entry for precision',
            'Great for responsive UI design',
            'Beginner-friendly interface',
            'No registration required',
            'Free to use',
            'Works in all modern browsers',
            'Runs entirely in your browser',
          ]}
          benefits={{
            title: 'Design Tips',
            items: [
              'Use 4–8px for subtle rounding.',
              'Use 12–16px for modern cards and panels.',
              'Use 9999px for pill-shaped buttons.',
              'Keep corner radii consistent across similar UI components.',
              'Combine different corner values to create unique visual styles.',
              'Avoid excessive rounding on very small elements.',
              'Test your design on different screen sizes.',
            ],
          }}
          extraSections={[
            {
              title: 'Common Use Cases',
              items: [
                'Designing rounded buttons',
                'Creating modern cards',
                'Styling navigation menus',
                'Creating badges and labels',
                'Designing avatars',
                'Building dashboard widgets',
                'Creating pricing cards',
                'Styling forms and inputs',
                'Designing product cards',
                'Creating notification panels',
                'Building mobile app interfaces',
                'Experimenting with organic UI shapes',
              ],
            },
            {
              title: 'Why Use a Border Radius Generator?',
              intro: 'Although border-radius is a simple CSS property, finding the perfect combination of values can take time. A visual generator allows you to:',
              items: [
                'Preview changes instantly',
                'Experiment without writing CSS manually',
                'Create consistent UI components',
                'Generate clean shorthand CSS',
                'Save development time',
                'Improve design accuracy',
                'Build professional-looking interfaces faster',
              ],
            },
            {
              title: 'Browser Compatibility',
              intro: 'The CSS border-radius property is fully supported by all modern browsers, including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and Opera. Vendor prefixes are no longer required.',
              items: [],
            },
          ]}
          faqs={[
            { q: 'What is a Border Radius Generator?', a: 'A Border Radius Generator is an online tool that creates CSS border-radius values visually. Instead of manually writing CSS, you can adjust corner radii using sliders and copy the generated code instantly.' },
            { q: 'Can I set different values for each corner?', a: 'Yes. You can independently control the top-left, top-right, bottom-right, and bottom-left corners to create unique or asymmetrical shapes.' },
            { q: 'How does CSS border-radius shorthand work?', a: 'The border-radius property accepts one to four values: one value for all corners, two values for opposite corners, three values for top-left / top-right & bottom-left / bottom-right, or four values for each corner individually. The generator automatically produces the shortest valid shorthand where possible.' },
            { q: 'Can I create pill-shaped buttons?', a: 'Yes. Using a very large radius (such as 9999px) creates pill-shaped buttons and badges.' },
            { q: 'Can I create a perfect circle?', a: 'Yes. Apply border-radius: 50% to a square element with equal width and height to create a perfect circle. This tool currently generates pixel-based values, making it ideal for rounded rectangles and custom corner radii.' },
            { q: 'Can I set different horizontal and vertical radii?', a: 'Currently, the tool generates a single radius value per corner. CSS also supports elliptical corner radii using the / syntax, which may be added in a future update.' },
            { q: 'What is the maximum radius?', a: 'The sliders support values up to 200px, and you can manually enter larger values if needed.' },
            { q: 'Does border-radius affect images?', a: 'Yes. Applying border-radius to an image rounds its corners, making it useful for profile pictures, thumbnails, and gallery images.' },
            { q: 'Does the generated CSS work in all browsers?', a: 'Yes. The generated CSS uses the standard border-radius property supported by all modern browsers.' },
            { q: 'Is this Border Radius Generator free?', a: 'Yes. The tool is completely free to use without registration or downloads.' },
          ]}
        />
      }
      category="web"
      iconName="RectangleHorizontal"
      showAllCategory
    >
      <div className="space-y-6">
        {/* Preview */}
        <div
          className="flex items-center justify-center py-10 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-hover)' }}
        >
          <div
            className="w-52 h-52 transition-all duration-150"
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
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border-hover)' }}>
            {(['px', '%'] as const).map((u) => (
              <button
                key={u}
                onClick={() => { setUnit(u); setRadii({ tl: 16, tr: 16, br: 16, bl: 16 }) }}
                className="px-4 py-1.5 rounded-md text-sm font-mono font-semibold transition-all"
                style={{
                  background: unit === u ? 'var(--color-web-dim)' : 'transparent',
                  color: unit === u ? 'var(--color-web)' : 'rgba(255,255,255,0.5)',
                  border: unit === u ? '1px solid var(--color-web)' : '1px solid transparent',
                }}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Linked toggle */}
          <button
            onClick={() => setLinked((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: linked ? 'var(--color-web)' : 'rgba(255,255,255,0.55)' }}
          >
            <span
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{
                background: linked ? 'var(--color-web-dim)' : 'var(--surface)',
                border: `1px solid ${linked ? 'var(--color-web)' : 'var(--border-hover)'}`,
              }}
            >
              {linked && <span style={{ color: 'var(--color-web)', fontSize: '10px' }}>✓</span>}
            </span>
            Link all corners
          </button>
        </div>

        {/* Per-corner sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CORNERS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-hover)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-white">{label}</label>
                <span className="text-base font-mono font-semibold" style={{ color: 'var(--color-web)' }}>
                  {radii[key]}{unit}
                </span>
              </div>
              <input
                type="range" min={0} max={max}
                value={radii[key]}
                onChange={(e) => setRadius(key, Number(e.target.value))}
                className="w-full accent-emerald-400"
                style={{ accentColor: 'var(--color-web)' }}
              />
            </div>
          ))}
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-white">CSS output</label>
            <CopyButton text={css} label="Copy CSS" />
          </div>
          <pre
            className="rounded-xl px-4 py-4 text-base"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-hover)', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            {css}
          </pre>
        </div>
      </div>
    </ToolLayout>
  )
}
