'use client'

import { useState, useRef, useCallback } from 'react'
import { Download, RotateCcw } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import { formatBytes, downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

type Rect = { x: number; y: number; w: number; h: number }
type DragState = { startX: number; startY: number; startRect: Rect } | null

const ASPECT_RATIOS = [
  { label: '1:1', desc: 'Profile', w: 1, h: 1 },
  { label: '4:5', desc: 'Instagram Portrait', w: 4, h: 5 },
  { label: '16:9', desc: 'YouTube', w: 16, h: 9 },
  { label: '9:16', desc: 'Stories', w: 9, h: 16 },
  { label: '3:2', desc: 'Photography', w: 3, h: 2 },
  { label: '2:3', desc: 'Prints', w: 2, h: 3 },
] as const

export default function ImageCropPage() {
  const [src, setSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)
  const [rect, setRect] = useState<Rect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }) // normalized 0-1
  const [output, setOutput] = useState('')
  const [outputSize, setOutputSize] = useState(0)
  const [dragging, setDragging] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null)
  const [dragState, setDragState] = useState<DragState>(null)
  const [activeRatio, setActiveRatio] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    setOutput('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const s = e.target?.result as string
      setSrc(s)
      const img = new window.Image()
      img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight) }
      img.src = s
    }
    reader.readAsDataURL(file)
  }

  function getContainerRect() {
    return containerRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 1, height: 1 }
  }

  function toNorm(clientX: number, clientY: number) {
    const r = getContainerRect()
    return { nx: (clientX - r.left) / r.width, ny: (clientY - r.top) / r.height }
  }

  function clamp(v: number, min = 0, max = 1) { return Math.max(min, Math.min(max, v)) }

  function applyRatio(rw: number, rh: number, label: string) {
    if (!naturalW || !naturalH) return
    const imgAspect = naturalW / naturalH
    const targetAspect = rw / rh
    // Fit the target ratio inside 90% of the image, constrained by whichever axis is tighter
    let w: number, h: number
    if (targetAspect > imgAspect) {
      // wider than image — width-constrained
      w = 0.9
      h = (0.9 / targetAspect) * imgAspect
    } else {
      // taller than image — height-constrained
      h = 0.9
      w = 0.9 * targetAspect / imgAspect
    }
    setRect({ x: (1 - w) / 2, y: (1 - h) / 2, w, h })
    setActiveRatio(label)
  }

  const onMouseDown = useCallback((e: React.MouseEvent, handle: typeof dragging) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(handle)
    setDragState({ startX: e.clientX, startY: e.clientY, startRect: { ...rect } })
    setActiveRatio(null)
  }, [rect])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragState) return
    const { nx, ny } = toNorm(e.clientX, e.clientY)
    const { nx: sx, ny: sy } = toNorm(dragState.startX, dragState.startY)
    const dx = nx - sx, dy = ny - sy
    const r = dragState.startRect

    setRect(() => {
      let { x, y, w, h } = r
      if (dragging === 'move') {
        x = clamp(r.x + dx, 0, 1 - r.w)
        y = clamp(r.y + dy, 0, 1 - r.h)
      } else if (dragging === 'se') {
        w = clamp(r.w + dx, 0.05, 1 - r.x)
        h = clamp(r.h + dy, 0.05, 1 - r.y)
      } else if (dragging === 'sw') {
        const nx2 = clamp(r.x + dx, 0, r.x + r.w - 0.05)
        w = r.x + r.w - nx2; x = nx2
        h = clamp(r.h + dy, 0.05, 1 - r.y)
      } else if (dragging === 'ne') {
        w = clamp(r.w + dx, 0.05, 1 - r.x)
        const ny2 = clamp(r.y + dy, 0, r.y + r.h - 0.05)
        h = r.y + r.h - ny2; y = ny2
      } else if (dragging === 'nw') {
        const nx2 = clamp(r.x + dx, 0, r.x + r.w - 0.05)
        w = r.x + r.w - nx2; x = nx2
        const ny2 = clamp(r.y + dy, 0, r.y + r.h - 0.05)
        h = r.y + r.h - ny2; y = ny2
      }
      return { x, y, w, h }
    })
  }, [dragging, dragState]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMouseUp = useCallback(() => { setDragging(null); setDragState(null) }, [])

  function crop() {
    const canvas = canvasRef.current
    if (!canvas || !src) return
    const img = new window.Image()
    img.onload = () => {
      const px = Math.round(rect.x * img.naturalWidth)
      const py = Math.round(rect.y * img.naturalHeight)
      const pw = Math.round(rect.w * img.naturalWidth)
      const ph = Math.round(rect.h * img.naturalHeight)
      canvas.width = pw
      canvas.height = ph
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, px, py, pw, ph, 0, 0, pw, ph)
      const ext = fileName.split('.').pop()?.toLowerCase() ?? 'png'
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png'
      const dataUrl = canvas.toDataURL(mime, 0.95)
      setOutput(dataUrl)
      setOutputSize(Math.round(atob(dataUrl.split(',')[1]).length))
    }
    img.src = src
  }

  function downloadOutput() {
    if (!output) return
    const ext = fileName.split('.').pop() ?? 'png'
    const base = fileName.replace(/\.[^.]+$/, '')
    const binary = atob(output.split(',')[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    const mime = output.split(';')[0].split(':')[1]
    downloadBlob(new Blob([arr], { type: mime }), `${base}-cropped.${ext}`)
  }

  // Pixel dimensions of selection
  const selPxW = Math.round(rect.w * naturalW)
  const selPxH = Math.round(rect.h * naturalH)

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`

  return (
    <ToolLayout
      toolId="image-crop"
      title="Image Cropper"
      description="Drag to select a crop region, then download the result"
      category="image"
      iconName="Crop"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Image Cropper"
          about={`Crop images online quickly and securely with our free Image Cropper. Remove unwanted areas, focus on the most important part of your photo, or resize your image to fit social media, websites, presentations, and documents—all without installing software.\n\nUnlike many online image editors, this tool works entirely inside your browser using the HTML5 Canvas API. Your images are never uploaded to a server, ensuring complete privacy while providing fast and secure image cropping.\n\nWhether you're cropping a profile picture, preparing product images for an online store, or creating social media content, this browser-based image cropper makes the process simple and efficient.`}
          benefits={{
            title: 'Why Use This Image Cropper?',
            intro: 'Our image cropping tool is designed to be fast, accurate, and easy to use.',
            items: [
              'Crop images online for free',
              'No software installation required',
              'Images never leave your device',
              'Supports PNG, JPG (JPEG), and WebP',
              'Maintain high image quality after cropping',
              'Easy drag-and-select cropping area',
              'Works on Windows, macOS, Linux, Android, and iPhone',
              'No registration required',
            ],
          }}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Remove unwanted backgrounds or objects',
            'Create profile pictures and avatars',
            'Crop images for Instagram, Facebook, LinkedIn, and X',
            'Prepare YouTube thumbnails',
            'Edit product photos for e-commerce',
            'Resize screenshots before sharing',
            'Create presentation graphics',
            'Prepare passport or ID photos',
            'Focus attention on the main subject of a photo',
          ]}
          extraSections={[
            {
              title: 'Supported Image Formats',
              intro: 'This image cropper supports the most common image formats.',
              items: ['PNG', 'JPG (JPEG)', 'WebP'],
              closing: 'Simply upload your image, select the area you want to keep, crop it, and download the result in your preferred supported format.',
            },
            {
              title: 'Why Crop Images?',
              intro: 'Cropping removes unwanted portions of an image while keeping the area you want to highlight. Unlike resizing, cropping changes the visible portion of the image instead of scaling the entire picture.\n\nCropping images can help you:',
              items: [
                'Improve photo composition',
                'Remove distractions',
                'Highlight important subjects',
                'Create consistent image sizes',
                'Prepare images for social media',
                'Fit platform-specific aspect ratios',
                'Improve the overall appearance of photos',
              ],
            },
          ]}
          faqs={[
            { q: 'Does cropping reduce image quality?', a: 'Cropping itself does not significantly reduce image quality because it simply removes unwanted areas. The remaining portion of the image keeps its original resolution, although the overall image dimensions become smaller.' },
            { q: 'Are my images uploaded to a server?', a: 'No. All image cropping is performed locally inside your browser using the HTML5 Canvas API. Your images never leave your device, ensuring complete privacy.' },
            { q: 'Which image formats are supported?', a: 'You can crop PNG, JPG (JPEG), and WebP images. After cropping, you can download the image in any supported output format offered by the tool.' },
            { q: 'Can I crop images on my phone?', a: 'Yes. The image cropper works in modern mobile browsers, making it easy to crop photos on Android and iPhone without installing an app.' },
            { q: "What's the difference between cropping and resizing?", a: 'Cropping removes unwanted parts of an image, while resizing changes the overall dimensions of the entire image. Many users crop first to improve composition and then resize the image for its final destination.' },
            { q: 'Is this image cropper free?', a: 'Yes. You can crop images online for free without creating an account or installing any software.' },
          ]}
        />
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-5">
        {!src && <FileDropZone onFile={handleFile} />}

        {src && (
          <>
            <div className="flex items-center justify-between">
              <div className="w-28" />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Selection: <span className="text-white">{selPxW} × {selPxH} px</span>
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setRect({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }); setActiveRatio(null) }}
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                  style={{ background: 'var(--surface-hover)', border: '1px solid var(--border-hover)', color: 'rgba(255,255,255,0.9)' }}>
                  <RotateCcw size={13} /> Reset
                </button>
                <button onClick={() => { setSrc(''); setOutput('') }}
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                  style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}>
                  Change image
                </button>
              </div>
            </div>

            {/* Aspect ratio presets */}
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map(({ label, desc, w, h }) => {
                const active = activeRatio === label
                return (
                  <button
                    key={label}
                    onClick={() => applyRatio(w, h, label)}
                    className="flex flex-col items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: active ? 'var(--color-image-dim)' : 'var(--surface-hover)',
                      border: `1px solid ${active ? 'var(--color-image)' : 'var(--border-hover)'}`,
                      color: active ? 'var(--color-image)' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    <span className="font-semibold leading-tight">{label}</span>
                    <span className="text-xs leading-tight" style={{ opacity: 0.7 }}>{desc}</span>
                  </button>
                )
              })}
            </div>

            {/* Interactive crop area — constrained so the image is never taller than 70vh */}
            <div
              ref={containerRef}
              className="relative select-none rounded-xl overflow-hidden"
              style={{
                border: '1px solid var(--border)',
                cursor: dragging === 'move' ? 'grabbing' : 'default',
                maxWidth: naturalH > 0 ? `min(100%, calc(70vh * ${naturalW / naturalH}))` : '100%',
                margin: '0 auto',
              }}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="crop source" className="w-full block" draggable={false} />

              {/* Dark overlay outside crop */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.55)' }} />

              {/* Crop window — cut out of overlay using clip */}
              <div
                className="absolute"
                style={{
                  left: pct(rect.x), top: pct(rect.y),
                  width: pct(rect.w), height: pct(rect.h),
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                  border: '2px solid rgba(255,255,255,0.8)',
                  cursor: 'move',
                }}
                onMouseDown={(e) => onMouseDown(e, 'move')}
              >
                {/* Rule-of-thirds grid */}
                {['33.3%', '66.6%'].map((p) => (
                  <div key={`h${p}`} className="absolute w-full" style={{ top: p, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                ))}
                {['33.3%', '66.6%'].map((p) => (
                  <div key={`v${p}`} className="absolute h-full" style={{ left: p, width: '1px', background: 'rgba(255,255,255,0.2)' }} />
                ))}

                {/* Resize handles */}
                {([['nw', 'top-0 left-0', '-translate-x-1/2 -translate-y-1/2'],
                   ['ne', 'top-0 right-0', 'translate-x-1/2 -translate-y-1/2'],
                   ['sw', 'bottom-0 left-0', '-translate-x-1/2 translate-y-1/2'],
                   ['se', 'bottom-0 right-0', 'translate-x-1/2 translate-y-1/2']] as const).map(([corner, pos]) => (
                  <div key={corner}
                    className={`absolute ${pos} w-3 h-3 rounded-sm bg-white cursor-nwse-resize`}
                    style={{ transform: corner === 'ne' || corner === 'sw' ? 'translate(50%,-50%)' : undefined }}
                    onMouseDown={(e) => onMouseDown(e, corner)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={crop}
                className="px-10 py-3 rounded-xl text-base font-semibold transition-all"
                style={{ background: 'var(--color-image)', color: '#000' }}>
                Crop image
              </button>
            </div>

            {output && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {selPxW} × {selPxH} px · <span className="text-white">{formatBytes(outputSize)}</span>
                  </span>
                  <button onClick={downloadOutput}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-base font-semibold"
                    style={{ background: 'var(--color-image)', color: '#000' }}>
                    <Download size={16} /> Download
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={output} alt="cropped" className="w-full rounded-xl object-contain"
                  style={{ border: '1px solid var(--border)', maxHeight: '320px' }} />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
