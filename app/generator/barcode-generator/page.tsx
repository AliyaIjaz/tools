'use client'

import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { Download } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import { downloadBlob } from '@/lib/utils'

type Format = {
  value: string
  label: string
  example: string
  hint: string
}

const FORMATS: Format[] = [
  { value: 'CODE128', label: 'Code 128', example: 'ZENVEEL-1234', hint: 'Any ASCII text, letters and numbers. The best general-purpose choice.' },
  { value: 'CODE39', label: 'Code 39', example: 'ZENVEEL 123', hint: 'Uppercase letters, digits, and - . $ / + % space.' },
  { value: 'EAN13', label: 'EAN-13', example: '5901234123457', hint: '12 or 13 digits. The 13th check digit is added or verified for you.' },
  { value: 'EAN8', label: 'EAN-8', example: '96385074', hint: '7 or 8 digits. The 8th check digit is added or verified for you.' },
  { value: 'UPC', label: 'UPC-A', example: '123456789012', hint: '11 or 12 digits. The 12th check digit is added or verified for you.' },
  { value: 'ITF14', label: 'ITF-14', example: '12345678901231', hint: '13 or 14 digits, used on shipping cartons.' },
  { value: 'ITF', label: 'Interleaved 2 of 5', example: '123456', hint: 'An even number of digits.' },
  { value: 'codabar', label: 'Codabar', example: 'A12345B', hint: 'Digits and - $ : / . +, optionally wrapped in start/stop letters A–D.' },
  { value: 'MSI', label: 'MSI', example: '1234567', hint: 'Digits only. Used for inventory and shelf labels.' },
  { value: 'pharmacode', label: 'Pharmacode', example: '1234', hint: 'A whole number from 3 to 131070.' },
]

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(0,0,0,0.3)',
  border: '2px solid var(--border-generator)',
}

const focusProps = {
  onFocus: (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'var(--color-generator)'),
  onBlur: (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'var(--border-generator-idle)'),
}

const PNG_SCALE = 3

export default function BarCodeGeneratorPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [format, setFormat] = useState('CODE128')
  const [text, setText] = useState('ZENVEEL-1234')
  const [barWidth, setBarWidth] = useState(2)
  const [height, setHeight] = useState(100)
  const [margin, setMargin] = useState(20)
  const [showText, setShowText] = useState(true)
  const [fontSize, setFontSize] = useState(20)
  const [fg, setFg] = useState('#000000')
  const [bg, setBg] = useState('#ffffff')
  const [valid, setValid] = useState(false)
  const [error, setError] = useState('')

  const current = FORMATS.find((f) => f.value === format) ?? FORMATS[0]

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.innerHTML = ''
    if (!text) {
      setValid(false)
      setError('')
      return
    }
    try {
      JsBarcode(svg, text, {
        format,
        width: barWidth,
        height,
        margin,
        displayValue: showText,
        fontSize,
        lineColor: fg,
        background: bg,
        font: 'monospace',
        textMargin: 4,
        valid: (ok: boolean) => {
          if (!ok) throw new Error('invalid')
        },
      })
      svg.setAttribute('shape-rendering', 'crispEdges')
      setValid(true)
      setError('')
    } catch {
      svg.innerHTML = ''
      setValid(false)
      setError(`"${text}" isn't valid for ${current.label}. ${current.hint}`)
    }
  }, [text, format, barWidth, height, margin, showText, fontSize, fg, bg, current])

  function serialize() {
    const svg = svgRef.current
    if (!svg) return null
    const clone = svg.cloneNode(true) as SVGSVGElement
    const vb = svg.viewBox.baseVal
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', String(vb.width))
    clone.setAttribute('height', String(vb.height))
    return { xml: new XMLSerializer().serializeToString(clone), w: vb.width, h: vb.height }
  }

  function downloadSvg() {
    const s = serialize()
    if (!s) return
    downloadBlob(new Blob([s.xml], { type: 'image/svg+xml' }), 'barcode.svg')
  }

  function downloadPng() {
    const s = serialize()
    if (!s) return
    const url = URL.createObjectURL(new Blob([s.xml], { type: 'image/svg+xml' }))
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = s.w * PNG_SCALE
      canvas.height = s.h * PNG_SCALE
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((b) => b && downloadBlob(b, 'barcode.png'), 'image/png')
      }
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      setError('Could not create the PNG. Try the SVG download instead.')
    }
    img.src = url
  }

  const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '2px solid var(--border-generator-idle)' }
  const labelCls = 'block text-sm font-medium mb-1.5'
  const labelColor = { color: 'rgba(255,255,255,0.7)' }

  return (
    <ToolLayout
      toolId="barcode-generator"
      title="Barcode Generator"
      description="Create Code 128, EAN, UPC, and other barcodes — download as PNG or SVG"
      category="generator"
      iconName="Barcode"
      showAllCategory
      seoContent={
        <SeoSection
          about={<>
            <p className="text-lg leading-relaxed"><strong>Barcode Generator Online</strong> creates scannable barcodes in the most common formats, including <strong>Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, Codabar, MSI, and Pharmacode</strong>. Enter your value, tweak the bar width, height, colors, and label, and download a sharp <strong>PNG or SVG</strong>.</p>
            <p className="text-lg leading-relaxed">Everything is generated <strong>in your browser</strong>. Your data is never uploaded, and the downloads carry no watermark. For retail formats (EAN and UPC) the check digit is calculated for you when you enter one digit fewer than the full length, and verified when you enter the full number.</p>
            <p className="text-lg leading-relaxed">Not sure which format to pick? <strong>Code 128</strong> handles any text and is ideal for inventory, shipping labels, and internal IDs. Use <strong>EAN-13 or UPC-A</strong> for products sold in stores, and <strong>ITF-14</strong> for cartons and cases. Pick the SVG download for print so the bars stay crisp at any size.</p>
          </>}
          useCases={[
            'Label inventory, shelves, and storage bins.',
            'Make asset tags for equipment and devices.',
            'Create product barcodes for retail packaging.',
            'Print shipping and carton labels.',
            'Add scannable IDs to tickets, badges, and membership cards.',
            'Generate test barcodes while developing scanning software.',
            'Number library books, files, and documents.',
            'Prepare barcode artwork for designers and printers.',
          ]}
          extraSections={[
            {
              title: 'Which barcode type should I use?',
              intro: 'The right format depends on where the barcode will be scanned.',
              items: [
                <><strong>Code 128</strong> — any text, letters and numbers. The best choice for inventory, shipping labels, asset tags, and internal IDs.</>,
                <><strong>EAN-13 and UPC-A</strong> — numeric retail product codes. EAN-13 is used worldwide; UPC-A is the 12-digit North American version.</>,
                <><strong>EAN-8</strong> — a short 8-digit retail code for small packages.</>,
                <><strong>ITF-14</strong> — 14 digits, used on shipping cartons and cases that hold retail items.</>,
                <><strong>Code 39</strong> — uppercase letters, digits, and a few symbols. Common in older industrial and government systems.</>,
                <><strong>Interleaved 2 of 5, Codabar, MSI, and Pharmacode</strong> — numeric formats for logistics, libraries, blood banks, shelf labels, and pharmaceutical packaging.</>,
              ],
              closing: 'If nothing requires a specific format, choose Code 128. It encodes the most characters in the least space and is read by nearly every scanner.',
            },
            {
              title: 'How barcode check digits work',
              intro: 'EAN-13, EAN-8, and UPC-A end with a check digit that lets scanners catch misreads. For EAN-13 you add the first 12 digits with alternating weights of 1 and 3, then pick the digit that brings the total up to the next multiple of 10. For 590123412345 the weighted sum is 83, so the check digit is 7 and the full code is 5901234123457.',
              items: [
                'Enter one digit fewer than the full length and this tool calculates the check digit for you.',
                'Enter the full number and the tool verifies it, showing an error if the last digit is wrong.',
              ],
              closing: 'A correct check digit only means the number is well-formed. Numbers for products sold in stores must still be issued through GS1, the organization that assigns company prefixes.',
            },
            {
              title: 'Printing and scanning tips',
              items: [
                'Leave a blank quiet zone on both sides of the bars, roughly ten times the bar width for Code 128. The margin setting here warns you if it is too small, and a dark background around the barcode will make it unreadable.',
                'Keep strong contrast. Black bars on a white background is safest; avoid red bars and low-contrast color pairs.',
                'Do not stretch or squash the image. Resize it proportionally, or use the SVG so the bars stay sharp at any size.',
                'Retail EAN-13 codes are designed at about 37 mm wide by 26 mm tall and are normally printed between 80% and 200% of that size.',
                'Scanning from a screen is harder than scanning from paper because of glare and screen pixel patterns. Test a printed copy before running a full batch.',
              ],
            },
          ]}
          faqs={[
            { q: 'Is this barcode generator free?', a: 'Yes. It is free, needs no signup, and adds no watermark to your downloads.' },
            { q: 'Is my data uploaded anywhere?', a: 'No. Barcodes are generated locally in your browser and nothing is sent to a server.' },
            { q: 'Which barcode format should I use?', a: 'Use Code 128 for general text and internal use. Use EAN-13 (worldwide) or UPC-A (North America) for retail products, ITF-14 for shipping cartons, and Code 39 for older systems that expect it.' },
            { q: 'Why does it say my value is invalid?', a: 'Each format accepts different characters and lengths. EAN-13 needs 12–13 digits, EAN-8 needs 7–8, UPC-A needs 11–12, and Code 39 allows only uppercase letters, digits, and a few symbols. The error message lists what the selected format accepts.' },
            { q: 'Do I need to type the check digit?', a: 'No. For EAN-13, EAN-8, and UPC-A, enter one digit fewer than the full length and the check digit is added. If you enter the full number, it is verified.' },
            { q: 'Can I use these barcodes on real retail products?', a: 'EAN and UPC numbers must be issued through GS1 for a company prefix. This tool draws the barcode for a number you already have; it does not register numbers.' },
            { q: 'PNG or SVG?', a: 'PNG works for documents and web pages. SVG is a vector format, so it stays sharp at any print size.' },
            { q: 'Will my barcode scan?', a: 'Keep strong contrast between bars and background (dark on light is best), leave the margin so the quiet zone stays clear, and avoid scaling the image so small that bars blur. Always test-scan before printing in bulk.' },
          ]}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="rounded-xl p-4 space-y-4" style={cardStyle}>
            <label className="block">
              <span className={labelCls} style={labelColor}>Barcode format</span>
              <select
                value={format}
                onChange={(e) => {
                  const f = FORMATS.find((x) => x.value === e.target.value)
                  setFormat(e.target.value)
                  if (f) setText(f.example)
                }}
                className="w-full rounded-lg px-3 py-2.5 text-base text-white outline-none"
                style={INPUT_STYLE}
                {...focusProps}
              >
                {FORMATS.map((f) => (
                  <option key={f.value} value={f.value} style={{ background: '#111' }}>{f.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelCls} style={labelColor}>Value</span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={current.example}
                className="w-full rounded-lg px-3 py-2.5 text-base font-mono text-white outline-none placeholder:text-white/50"
                style={INPUT_STYLE}
                {...focusProps}
              />
              <span className="block text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{current.hint}</span>
            </label>
          </div>

          <div className="rounded-xl p-4 space-y-4" style={cardStyle}>
            {[
              { label: 'Bar width', value: barWidth, set: setBarWidth, min: 1, max: 6, step: 1, unit: 'px' },
              { label: 'Height', value: height, set: setHeight, min: 30, max: 300, step: 10, unit: 'px' },
              { label: 'Margin', value: margin, set: setMargin, min: 0, max: 40, step: 2, unit: 'px' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={labelColor}>{s.label}</span>
                  <span className="text-base font-mono text-white">{s.value}{s.unit}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="w-full" style={{ accentColor: 'var(--color-generator)' }} />
                {s.label === 'Margin' && margin < barWidth * 10 && (
                  <p className="text-sm mt-1" style={{ color: '#fbbf24' }}>
                    Scanners need a blank margin of about {barWidth * 10}px at this bar width. Increase it for reliable scans.
                  </p>
                )}
              </div>
            ))}

            <label className="flex items-center gap-2 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} className="w-4 h-4" style={{ accentColor: 'var(--color-generator)' }} />
              Show value below barcode
            </label>

            {showText && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={labelColor}>Label size</span>
                  <span className="text-base font-mono text-white">{fontSize}px</span>
                </div>
                <input type="range" min={10} max={40} step={1} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" style={{ accentColor: 'var(--color-generator)' }} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className={labelCls} style={labelColor}>Bars</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} aria-label="Bar color" className="w-11 h-10 rounded cursor-pointer bg-transparent" />
                  <span className="text-base font-mono text-white">{fg}</span>
                </div>
              </div>
              <div>
                <span className={labelCls} style={labelColor}>Background</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background color" className="w-11 h-10 rounded cursor-pointer bg-transparent" />
                  <span className="text-base font-mono text-white">{bg}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 flex flex-col items-center gap-4 self-start" style={cardStyle}>
          <div
            className="w-full rounded-lg flex items-center justify-center overflow-auto p-6 min-h-[200px]"
            style={{ background: valid ? bg : 'rgba(0,0,0,0.3)', border: '2px dashed var(--border-generator-idle)' }}
          >
            <svg ref={svgRef} className="max-w-full h-auto flex-shrink-0" style={{ display: valid ? 'block' : 'none' }} aria-label="Generated barcode" role="img" />
            {!valid && !error && (
              <p className="text-base text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>Your barcode will appear here</p>
            )}
            {!valid && error && (
              <p className="text-base text-center" style={{ color: '#f87171' }}>{error}</p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={downloadPng}
              disabled={!valid}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-generator)', color: '#fff' }}
            >
              <Download size={16} /> PNG
            </button>
            <button
              onClick={downloadSvg}
              disabled={!valid}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-generator)', color: '#fff' }}
            >
              <Download size={16} /> SVG
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
