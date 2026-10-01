'use client'

import { useState, useRef, useCallback } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

type PickedColor = { hex: string; rgb: string; hsl: string; x: number; y: number }
type ImgSize = { w: number; h: number }

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number) {
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
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export default function ColorPickerPage() {
  const [imageSrc, setImageSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [picked, setPicked] = useState<PickedColor | null>(null)
  const [history, setHistory] = useState<PickedColor[]>([])
  const [naturalSize, setNaturalSize] = useState<ImgSize | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      setImageSrc(src)
      setPicked(null)
    }
    reader.readAsDataURL(file)
  }

  const handleImageLoad = useCallback(() => {
    const img = imgRef.current
    if (img) setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
  }, [])

  function pickColor(e: React.MouseEvent<HTMLDivElement>) {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const rect = img.getBoundingClientRect()
    const scaleX = img.naturalWidth / rect.width
    const scaleY = img.naturalHeight / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0)
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data

    const color: PickedColor = {
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: rgbToHsl(r, g, b),
      x, y,
    }
    setPicked(color)
    setHistory((prev) => [color, ...prev.filter((c) => c.hex !== color.hex)].slice(0, 12))
  }

  return (
    <ToolLayout
      toolId="image-color-picker"
      title="Color Picker"
      description="Click any pixel on an image to extract its HEX, RGB, and HSL values"
      category="image"
      iconName="Pipette"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Color Picker"
          about={`Extract colors from any image instantly with our free online Color Picker. Upload an image, click any pixel, and instantly view its exact HEX, RGB, and HSL color values. Whether you're a web developer, graphic designer, digital artist, or marketer, this tool helps you identify precise colors without installing any software.\n\nUnlike many online color tools, all image processing happens directly inside your browser using the HTML5 Canvas API. Your images are never uploaded to a server, ensuring complete privacy while providing fast and accurate color extraction.\n\nEvery selected color is automatically saved to your color history, making it easy to compare shades, build color palettes, and copy color values for later use.`}
          benefits={{
            title: 'Why Use This Color Picker?',
            intro: 'Our browser-based color picker is designed for speed, precision, and simplicity.',
            items: [
              'Pick colors directly from images',
              'Instantly extract HEX, RGB, and HSL values',
              'Exact pixel-level color sampling',
              'Built-in color history',
              'One-click copy to clipboard',
              'Images never leave your device',
              'No software installation required',
              'Works on Windows, macOS, Linux, Android, and iPhone',
            ],
          }}
          useCasesTitle="Common Use Cases"
          useCasesIntro="This image color picker is useful for many creative and technical tasks."
          useCases={[
            'Extract brand colors from logos',
            'Match colors between photographs and website designs',
            'Build custom color palettes',
            'Find exact UI colors from screenshots',
            'Identify CSS colors for web development',
            'Sample background colors for graphic design',
            'Recreate marketing materials with consistent branding',
            'Analyze colors used in illustrations and artwork',
          ]}
          extraSections={[
            {
              title: 'Who Uses This Color Picker?',
              intro: 'This tool is useful for:',
              items: [
                'Web Developers',
                'UI Designers',
                'UX Designers',
                'Graphic Designers',
                'Digital Artists',
                'Brand Designers',
                'Marketing Teams',
                'Students',
                'Front-end Developers',
              ],
            },
            {
              title: 'Supported Color Formats',
              intro: 'Every selected color is displayed in multiple widely used formats.',
              items: [
                <>
                  <span>
                    <strong style={{ color: 'rgba(255,255,255,0.9)' }}>HEX</strong>
                    <br />
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Ideal for websites, CSS, HTML, and graphic design.</span>
                    <br />
                    <code style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono, monospace)' }}>#3B82F6</code>
                  </span>
                </>,
                <>
                  <span>
                    <strong style={{ color: 'rgba(255,255,255,0.9)' }}>RGB</strong>
                    <br />
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Perfect for web development and digital graphics.</span>
                    <br />
                    <code style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono, monospace)' }}>rgb(59, 130, 246)</code>
                  </span>
                </>,
                <>
                  <span>
                    <strong style={{ color: 'rgba(255,255,255,0.9)' }}>HSL</strong>
                    <br />
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Useful when adjusting hue, saturation, and lightness in CSS and design software.</span>
                    <br />
                    <code style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono, monospace)' }}>hsl(217, 91%, 60%)</code>
                  </span>
                </>,
              ],
              closing: 'Having multiple formats makes it easy to use the same color across websites, mobile apps, design tools, and development projects.',
            },
            {
              title: 'Why Use an Image Color Picker?',
              intro: 'Choosing colors by eye often leads to inconsistencies. A color picker identifies the exact color value of any pixel, helping maintain visual consistency across designs.\n\nUsing a color picker helps you:',
              items: [
                'Match branding colors accurately',
                'Create professional color palettes',
                'Build consistent user interfaces',
                'Reproduce colors across projects',
                'Improve web and graphic design workflows',
                'Speed up CSS styling and UI development',
              ],
            },
          ]}
          faqs={[
            { q: 'How accurate is the color picker?', a: 'The tool reads the exact color value of the selected pixel at the image\'s native resolution. No averaging, interpolation, or smoothing is applied, ensuring pixel-perfect color extraction.' },
            { q: 'Which color formats are supported?', a: 'Every selected color is displayed in HEX, RGB, and HSL formats, making it easy to use the color in websites, applications, design software, and digital artwork.' },
            { q: 'Can I copy color values?', a: 'Yes. Simply click the copy button next to any HEX, RGB, or HSL value to copy it instantly to your clipboard.' },
            { q: 'Are my images uploaded to a server?', a: 'No. All image processing happens locally inside your browser using the HTML5 Canvas API. Your files remain completely private.' },
            { q: 'Can I build a color palette?', a: 'Yes. Every selected color is saved in your color history, allowing you to compare colors and create your own palette from a single image.' },
            { q: 'Is this color picker free?', a: 'Yes. You can extract colors from images online for free without creating an account or installing software.' },
          ]}
        />
      }
    >
      <div className="space-y-5">
        {!imageSrc && <FileDropZone onFile={handleFile} />}

        {imageSrc && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>{fileName} · click any pixel</p>
              <button
                onClick={() => { setImageSrc(''); setPicked(null); setHistory([]) }}
                className="text-base font-medium px-4 py-2 rounded-lg transition-all"
                style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
              >
                Change image
              </button>
            </div>

            {/* Canvas for pixel reading (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Clickable image — maxWidth constrains portrait images so painted pixels fill the element exactly */}
            <div
              className="cursor-crosshair"
              style={{
                maxWidth: naturalSize ? `min(100%, calc(70vh * ${naturalSize.w / naturalSize.h}))` : '100%',
                margin: '0 auto',
              }}
              onClick={pickColor}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="pick colors"
                onLoad={handleImageLoad}
                className="w-full block rounded-xl"
                style={{ border: '2px solid var(--border-image-idle)' }}
                draggable={false}
              />
            </div>

            {/* Picked color */}
            {picked && (
              <div className="rounded-xl overflow-hidden" style={{ border: '2px solid var(--border-image-idle)' }}>
                <div className="h-16" style={{ background: picked.hex }} />
                <div className="p-4 space-y-2" style={{ background: 'var(--surface)' }}>
                  <p className="text-base mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Pixel at ({picked.x}, {picked.y})
                  </p>
                  {[
                    { label: 'HEX', value: picked.hex.toUpperCase() },
                    { label: 'RGB', value: picked.rgb },
                    { label: 'HSL', value: picked.hsl },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-base w-10 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                      <code className="text-lg flex-1 mx-3" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono), monospace' }}>{value}</code>
                      <CopyButton text={value} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 1 && (
              <div>
                <p className="text-base font-medium mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Recent picks</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setPicked(c)}
                      title={c.hex}
                      className="w-8 h-8 rounded-lg transition-all"
                      style={{
                        background: c.hex,
                        border: picked?.hex === c.hex ? '2px solid white' : '2px solid transparent',
                        outline: '1px solid rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
