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
    border: '2px solid var(--border-web-idle)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.9)',
    padding: '10px 14px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'var(--font-geist-mono), monospace',
    width: '100px',
  }

  return (
    <ToolLayout
      toolId="css-unit-converter"
      title="CSS Unit Converter"
      description="Convert between px, rem, em, vw, vh, pt, and % with configurable baselines"
      seoContent={
        <SeoSection
          aboutTitle="CSS Unit Converter Online"
          about={<>
            <p className="text-base leading-relaxed">Convert CSS units instantly between px, rem, em, vw, vh, pt, and % with this free online CSS Unit Converter. Simply enter a value in any supported unit, customize the root font size, base font size, or viewport dimensions, and all conversions update automatically in real time.</p>
            <p className="text-base leading-relaxed">Whether you&apos;re building responsive websites, converting design files into CSS, or creating accessible typography, this tool helps you generate accurate CSS measurements without manual calculations.</p>
            <p className="text-base leading-relaxed">Everything runs entirely in your browser for fast, private, and secure conversions.</p>
          </>}
          extraSections={[
            {
              title: 'What Is a CSS Unit Converter?',
              intro: "A CSS Unit Converter is a tool that converts values between different CSS length units used in web development. Since different projects use different units for typography, spacing, layouts, and responsive design, converting between them manually can be time-consuming and error-prone.\n\nThis converter automatically translates values between pixels (px), root em (rem), em, viewport width (vw), viewport height (vh), points (pt), and percentages (%) while respecting your custom project settings.\n\nWhether you're converting measurements from Figma, adapting a design system, or migrating a legacy stylesheet, this tool makes CSS unit conversion quick and reliable.",
              items: [],
            },
            {
              title: 'Features',
              items: [
                'Convert between px, rem, em, vw, vh, pt, and %',
                'Live conversion as you type',
                'Customize root font size',
                'Set a custom parent font size for em',
                'Configure viewport width and height',
                'Accurate responsive unit calculations',
                'Supports decimal values',
                'Copy converted values instantly',
                'Perfect for responsive web design',
                'Great for typography and spacing',
                'No registration required — free to use',
                'Works in all modern browsers, runs entirely in your browser',
              ],
            },
            {
              title: 'Supported CSS Units',
              items: [
                <div key="px" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Pixels (px)</p>
                  <p className="text-base leading-relaxed">Pixels (px) are fixed units representing individual screen pixels. They provide predictable sizing regardless of parent elements and are commonly used for borders, icons, and precise layouts.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'font-size: 16px;'}</pre>
                  <p className="text-base leading-relaxed">Best for: borders, icons, small UI elements, pixel-perfect layouts.</p>
                </div>,
                <div key="rem" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Root EM (rem)</p>
                  <p className="text-base leading-relaxed">rem is relative to the root (html) font size. If the root font size is 16px, then 1rem equals 16px. Using rem makes typography and spacing more scalable and improves accessibility because users can adjust browser font settings.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'font-size: 1.5rem;'}</pre>
                  <p className="text-base leading-relaxed">Best for: typography, margins, padding, responsive layouts, design systems.</p>
                </div>,
                <div key="em" className="space-y-1.5">
                  <p className="text-base font-medium text-white">EM (em)</p>
                  <p className="text-base leading-relaxed">em is relative to the current element&apos;s font size (or its nearest parent). Because em scales with its context, it&apos;s useful for reusable UI components where child elements should scale proportionally.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'padding: 1.25em;'}</pre>
                  <p className="text-base leading-relaxed">Best for: component sizing, buttons, nested typography, reusable UI components.</p>
                </div>,
                <div key="vw" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Viewport Width (vw)</p>
                  <p className="text-base leading-relaxed">vw represents a percentage of the browser&apos;s viewport width. 1vw = 1% of viewport width, 50vw = half the viewport width.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'width: 60vw;'}</pre>
                  <p className="text-base leading-relaxed">Best for: responsive layouts, hero sections, fluid typography, full-width containers.</p>
                </div>,
                <div key="vh" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Viewport Height (vh)</p>
                  <p className="text-base leading-relaxed">vh represents a percentage of the viewport height.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'height: 100vh;'}</pre>
                  <p className="text-base leading-relaxed">Best for: full-screen sections, landing pages, hero banners, mobile layouts.</p>
                </div>,
                <div key="pt" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Points (pt)</p>
                  <p className="text-base leading-relaxed">Points (pt) are primarily used for print stylesheets. 1pt = 1/72 inch. Although pt can be used on screens, px or rem are generally preferred for web interfaces.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'font-size: 12pt;'}</pre>
                  <p className="text-base leading-relaxed">Best for: print styles, PDF layouts, printable documents.</p>
                </div>,
                <div key="pct" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Percentage (%)</p>
                  <p className="text-base leading-relaxed">Percentage values are relative to another property or parent element, depending on the CSS property being used.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{'width: 75%;'}</pre>
                  <p className="text-base leading-relaxed">Best for: flexible layouts, responsive containers, fluid sizing.</p>
                </div>,
              ],
            },
            {
              title: 'How to Use',
              items: [
                'Enter a numeric value.',
                'Choose the source CSS unit.',
                'Set the root font size if using rem.',
                'Set the parent font size if using em.',
                'Configure viewport width and height for vw and vh.',
                'View all converted values instantly.',
                'Copy any converted unit with one click.',
              ],
              closing: 'No downloads or registration are required.',
            },
            {
              title: 'Why Use Relative CSS Units?',
              intro: 'Modern web development increasingly favors relative units because they create layouts that adapt better to different devices and user preferences.\n\nBenefits include:',
              items: [
                'Better accessibility',
                'Improved responsive design',
                'Easier maintenance',
                'Consistent scaling',
                'Better support for browser zoom',
                'Flexible typography',
                'Cleaner design systems',
              ],
              closing: "Using rem for typography and spacing is considered a best practice because it respects the user's preferred font size.",
            },
            {
              title: 'Accessibility Tips',
              intro: 'Using relative units like rem and em improves accessibility because text scales according to the user\'s browser settings.\n\nFor the best user experience:',
              items: [
                'Prefer rem for font sizes.',
                'Use % and viewport units for flexible layouts.',
                'Avoid fixed pixel sizes for body text.',
                'Test layouts with browser zoom enabled.',
                'Verify readability on different screen sizes.',
              ],
              closing: 'These practices help create websites that are easier to use for a wider range of visitors.',
            },
            {
              title: 'Browser Compatibility',
              intro: 'All supported units (px, rem, em, vw, vh, pt, and %) are part of the CSS specification and are supported in all modern browsers, including:',
              items: ['Google Chrome', 'Mozilla Firefox', 'Microsoft Edge', 'Safari', 'Opera'],
              closing: 'Relative units such as rem, em, %, vw, and vh calculate their values based on the current document settings, parent elements, or viewport dimensions.',
            },
          ]}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Converting Figma measurements into CSS',
            'Creating responsive typography',
            'Migrating from px to rem',
            'Building scalable design systems',
            'Creating responsive spacing',
            'Converting print styles to screen styles',
            'Working with CSS frameworks',
            'Developing Tailwind CSS themes',
            'Building reusable UI components',
            'Testing responsive layouts',
            'Verifying viewport-based sizing',
            'Learning modern CSS units',
          ]}
          faqs={[
            { q: 'What is a CSS Unit Converter?', a: 'A CSS Unit Converter is an online tool that converts measurements between different CSS units such as px, rem, em, vw, vh, pt, and %. It simplifies responsive web development by eliminating manual calculations.' },
            { q: 'Which CSS units are supported?', a: 'This tool supports pixels (px), root EM (rem), EM (em), viewport width (vw), viewport height (vh), points (pt), and percentage (%).' },
            { q: 'What is the default root font size?', a: "The default root font size is 16px, which matches the default font size used by most browsers. You can change it to match your project's html { font-size } value." },
            { q: 'What is the difference between rem and em?', a: 'rem is always relative to the root (html) font size, while em is relative to the font size of the current element or its nearest parent. Because of this, rem is generally preferred for consistent typography across a website.' },
            { q: 'How are vw and vh calculated?', a: '1vw equals 1% of the viewport width. 1vh equals 1% of the viewport height. The converter lets you specify custom viewport dimensions for accurate calculations.' },
            { q: 'Why should I use rem instead of px?', a: "Using rem makes text and spacing scale with the user's preferred browser settings, improving accessibility and making responsive layouts easier to maintain." },
            { q: 'Does the converter support decimal values?', a: 'Yes. Decimal values are fully supported for accurate CSS calculations.' },
            { q: 'Can I convert print units?', a: 'Yes. The tool supports converting pt values commonly used in print stylesheets into web-friendly units like px and rem.' },
            { q: 'Are the conversions accurate?', a: 'Yes. All calculations follow standard CSS conversion rules and use the custom settings you provide for root font size, parent font size, and viewport dimensions.' },
            { q: 'Is this CSS Unit Converter free?', a: 'Yes. The tool is completely free to use with no registration, downloads, or installation required.' },
          ]}
        />
      }
      category="web"
      iconName="Ruler"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.85)' }}>Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ ...inputStyle, width: '130px' }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block" style={{ color: 'rgba(255,255,255,0.85)' }}>From unit</label>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => setFromUnit(u)}
                  className="px-4 py-2 rounded-lg text-base font-mono font-semibold transition-all"
                  style={{
                    background: fromUnit === u ? 'var(--color-web-dim)' : 'var(--surface)',
                    border: `1.5px solid ${fromUnit === u ? 'var(--color-web)' : 'var(--border)'}`,
                    color: fromUnit === u ? 'var(--color-web)' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Baselines */}
        <div className="rounded-xl p-5" style={{ background: 'var(--surface)', border: '2px solid var(--border-web-idle)' }}>
          <p className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>Baselines</p>
          <div className="flex flex-wrap gap-5">
            {[
              { label: 'Root font size', value: rootFontSize, set: setRootFontSize, unit: 'px' },
              { label: 'Parent font size', value: parentFontSize, set: setParentFontSize, unit: 'px' },
              { label: 'Viewport width', value: viewportW, set: setViewportW, unit: 'px' },
              { label: 'Viewport height', value: viewportH, set: setViewportH, unit: 'px' },
            ].map(({ label, value: v, set, unit }) => (
              <div key={label}>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={v} onChange={(e) => set(e.target.value)} style={inputStyle} />
                  <span className="text-sm font-mono font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{unit}</span>
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
              className="rounded-xl px-5 py-4"
              style={{
                background: isSelf ? 'var(--color-web-dim)' : 'var(--surface)',
                border: `1.5px solid ${isSelf ? 'var(--color-web)' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono font-semibold" style={{ color: isSelf ? 'var(--color-web)' : 'rgba(255,255,255,0.6)' }}>
                  {unit}
                </span>
                <CopyButton text={`${converted}${unit}`} />
              </div>
              <div className="text-xl font-bold" style={{ color: isSelf ? 'var(--color-web)' : 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-geist-mono)' }}>
                {converted}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
