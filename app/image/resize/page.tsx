'use client'

import { useState, useRef } from 'react'
import { Download, Trash2, Plus } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import { formatBytes, downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

interface ImageEntry {
  id: number
  src: string
  fileName: string
  origW: number
  origH: number
  origSize: number
}

interface Preset {
  label: string
  w: number
  h: number
}

const PRESETS: { group: string; items: Preset[] }[] = [
  {
    group: 'Facebook',
    items: [
      { label: 'Post', w: 1200, h: 630 },
      { label: 'Story', w: 1080, h: 1920 },
      { label: 'Cover', w: 851, h: 315 },
    ],
  },
  {
    group: 'Instagram',
    items: [
      { label: 'Square Post', w: 1080, h: 1080 },
      { label: 'Portrait Post', w: 1080, h: 1350 },
      { label: 'Story', w: 1080, h: 1920 },
    ],
  },
  {
    group: 'TikTok',
    items: [
      { label: 'Video Cover', w: 1080, h: 1920 },
      { label: 'Profile Photo', w: 200, h: 200 },
    ],
  },
  {
    group: 'LinkedIn',
    items: [
      { label: 'Post', w: 1200, h: 627 },
      { label: 'Cover', w: 1584, h: 396 },
      { label: 'Profile Photo', w: 400, h: 400 },
    ],
  },
  {
    group: 'X',
    items: [
      { label: 'Post', w: 1600, h: 900 },
      { label: 'Header', w: 1500, h: 500 },
      { label: 'Profile Photo', w: 400, h: 400 },
    ],
  },
]

let nextId = 1

export default function ImageResizePage() {
  const MAX_IMAGES = 10
  const [images, setImages] = useState<ImageEntry[]>([])
  const [scale, setScale] = useState(80)
  const [quality, setQuality] = useState(60)
  const [limitWarning, setLimitWarning] = useState('')
  const [activePreset, setActivePreset] = useState<Preset | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const addMoreRef = useRef<HTMLInputElement>(null)

  function loadFiles(files: FileList | null) {
    if (!files) return
    setLimitWarning('')
    setImages((prev) => {
      const slots = MAX_IMAGES - prev.length
      if (slots <= 0) {
        setLimitWarning(`Maximum ${MAX_IMAGES} images allowed.`)
        return prev
      }
      const toLoad = Array.from(files).slice(0, slots)
      if (files.length > slots) {
        setLimitWarning(`Only ${slots} image${slots > 1 ? 's' : ''} added — limit of ${MAX_IMAGES} reached.`)
      }
      toLoad.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const s = e.target?.result as string
          const img = new window.Image()
          img.onload = () => {
            setImages((p) => p.length < MAX_IMAGES ? [...p, {
              id: nextId++,
              src: s,
              fileName: file.name,
              origW: img.naturalWidth,
              origH: img.naturalHeight,
              origSize: file.size,
            }] : p)
          }
          img.src = s
        }
        reader.readAsDataURL(file)
      })
      return prev
    })
  }

  function deleteImage(id: number) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  function getOutputDims(entry: ImageEntry): { w: number; h: number } {
    if (activePreset) {
      return { w: activePreset.w, h: activePreset.h }
    }
    return {
      w: Math.round(entry.origW * scale / 100),
      h: Math.round(entry.origH * scale / 100),
    }
  }

  function resizeOne(entry: ImageEntry): Promise<{ dataUrl: string; mime: string }> {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!
      const img = new window.Image()
      img.onload = () => {
        const { w, h } = getOutputDims(entry)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const ext = entry.fileName.split('.').pop()?.toLowerCase() ?? 'png'
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png'
        resolve({ dataUrl: canvas.toDataURL(mime, quality / 100), mime })
      }
      img.src = entry.src
    })
  }

  async function downloadOne(entry: ImageEntry) {
    const { dataUrl, mime } = await resizeOne(entry)
    const { w, h } = getOutputDims(entry)
    const base = entry.fileName.replace(/\.[^.]+$/, '')
    const ext = entry.fileName.split('.').pop() ?? 'png'
    const binary = atob(dataUrl.split(',')[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: mime }), `${base}-${w}x${h}.${ext}`)
  }

  async function downloadAll() {
    for (const entry of images) {
      await downloadOne(entry)
    }
  }

  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    loadFiles(e.dataTransfer.files)
  }

  const sliderStyle: React.CSSProperties = {
    width: '50%',
    accentColor: 'var(--color-image)',
    cursor: 'pointer',
  }

  return (
    <ToolLayout
      toolId="image-resize"
      title="Image Resizer"
      description="Resize images to exact pixel dimensions with aspect-ratio preserved"
      category="image"
      iconName="Maximize"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Image Resizer"
          about="Resize images online quickly and securely with our free image resizer. Change the width and height of your photos while preserving the original aspect ratio to prevent distortion. Whether you're preparing images for a website, social media, presentations, or e-commerce, this tool makes resizing fast and simple.\n\nAll image processing happens directly in your browser using the HTML5 Canvas API. Your images are never uploaded to a server, giving you complete privacy and keeping your files on your device.\n\nThe tool supports popular image formats including PNG, JPEG, and WebP, and allows you to resize up to 10 images at once, making it ideal for both individual users and batch workflows."
          useCasesTitle="Common Use Cases"
          useCasesIntro="People resize images for many different reasons, including:"
          useCases={[
            'Preparing images for websites and blogs',
            'Uploading photos to Instagram, Facebook, LinkedIn, or X',
            'Creating thumbnails for YouTube videos',
            'Optimizing product images for online stores',
            'Reducing image dimensions before sharing by email',
            'Preparing screenshots for presentations or documents',
            'Standardizing image sizes across multiple files',
            'Creating profile pictures and avatars',
          ]}
          benefits={{
            title: 'Why Use This Image Resizer?',
            intro: 'Our online image resizer is designed to be fast, private, and easy to use.',
            items: [
              'Resize images without installing software',
              'Keep the original aspect ratio to avoid stretched images',
              'Resize PNG, JPEG, and WebP files',
              'Batch resize up to 10 images',
              'Process images entirely in your browser',
              'No registration or account required',
              'Works on Windows, macOS, Linux, Android, and iPhone',
              'Completely free to use',
            ],
          }}
          extraSections={[
            {
              title: 'Why Resize Images?',
              intro: "Resizing changes an image's dimensions, making it larger or smaller while maintaining visual quality whenever possible.\n\nSmaller image dimensions can:",
              items: [
                'Improve website loading speed',
                'Reduce storage space',
                'Meet upload size requirements',
                'Create consistent image layouts',
                'Improve user experience on mobile devices',
              ],
              closing: 'Keeping images at the correct dimensions also helps websites load faster and display more consistently across different screen sizes.',
            },
            {
              title: 'Supported Image Formats',
              intro: 'This tool supports the most common image formats:',
              items: [
                'PNG',
                'JPEG (JPG)',
                'WebP',
              ],
              closing: 'Simply upload your image, choose the new dimensions, and download the resized version in your preferred supported format.',
            },
          ]}
          faqs={[
            { q: 'Does the aspect ratio stay locked?', a: 'Yes. By default, the tool maintains the original aspect ratio, ensuring your images remain proportional and never appear stretched or squashed.' },
            { q: 'What image formats are supported?', a: 'You can resize PNG, JPEG (JPG), and WebP images. These formats are supported for both uploading and downloading.' },
            { q: 'Are my images uploaded anywhere?', a: 'No. Every image is processed locally inside your browser using the HTML5 Canvas API. Your files never leave your device, making the tool private and secure.' },
            { q: 'Can I resize multiple images at once?', a: 'Yes. You can resize up to 10 images during a single session. Each resized image is downloaded separately with its updated dimensions included in the filename.' },
            { q: 'Does resizing reduce file size?', a: 'Resizing usually reduces file size because the image contains fewer pixels. However, the exact reduction depends on the image format, compression settings, and the new dimensions.' },
            { q: 'Will resizing reduce image quality?', a: 'Reducing image dimensions generally preserves good visual quality for most uses. Enlarging an image beyond its original size may reduce sharpness because new pixel information must be estimated.' },
            { q: 'Is this image resizer free?', a: 'Yes. You can resize images online for free without creating an account or installing any software.' },
          ]}
        />
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { loadFiles(e.target.files); e.target.value = '' }} />
      <input ref={addMoreRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { loadFiles(e.target.files); e.target.value = '' }} />

      <div className="space-y-5">
        {images.length === 0 ? (
          <div className="flex justify-center">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className="rounded-2xl flex flex-col items-center justify-center gap-5 cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragging ? 'var(--color-image)' : 'var(--color-image)'}`,
                background: dragging ? 'var(--color-image-dim)' : 'var(--surface)',
                aspectRatio: '4 / 3',
                width: '50%',
              }}
            >
              <div className="flex items-center justify-center rounded-2xl w-16 h-16"
                style={{ background: dragging ? 'var(--color-image-dim)' : 'rgba(34,197,94,0.08)', border: `1px solid ${dragging ? 'var(--color-image)' : 'rgba(34,197,94,0.3)'}` }}>
                <Plus size={32} style={{ color: dragging ? 'var(--color-image)' : 'rgb(34,197,94)' }} />
              </div>
              <div className="text-center px-6">
                <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {dragging ? 'Drop to upload' : 'Click or drag images here'}
                </p>
                <p className="text-lg mt-1.5" style={{ color: 'var(--color-image)' }}>
                  PNG, JPG, WebP · up to 10 images
                </p>
              </div>
              <p className="text-base px-6 py-2 rounded-full text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid var(--border-image-idle)', color: 'var(--color-image)' }}>
                Your images never leave your browser — 100% private
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Limit warning */}
            {limitWarning && (
              <p className="text-base font-medium px-4 py-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgb(239,68,68)' }}>
                {limitWarning}
              </p>
            )}

            {/* Image list */}
            <div className="space-y-2">
              {images.map((entry) => {
                const { w, h } = getOutputDims(entry)
                return (
                  <div key={entry.id} className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={entry.src} alt="source" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" style={{ border: '2px solid var(--border-image-idle)' }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-white truncate">{entry.fileName}</p>
                      <p className="text-lg mt-1">
                        <span style={{ color: 'rgba(255,255,255,0.9)' }}>{entry.origW} × {entry.origH} px · {formatBytes(entry.origSize)}</span>
                        <span style={{ color: 'rgba(255,255,255,0.65)' }}> → </span>
                        <span className="font-semibold text-white">{w} × {h} px</span>
                        <span style={{ color: 'rgba(255,255,255,0.65)' }}> · </span>
                        <span className="font-semibold" style={{ color: quality < 40 ? 'rgb(239,68,68)' : quality < 75 ? 'rgb(234,179,8)' : 'rgb(34,197,94)' }}>{quality}% quality</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => downloadOne(entry)}
                        className="download-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
                        style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}>
                        <Download size={18} />
                      </button>
                      <button onClick={() => deleteImage(entry.id)}
                        className="delete-btn flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: 'rgb(239,68,68)' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add more */}
            {images.length < MAX_IMAGES && (
              <button onClick={() => addMoreRef.current?.click()}
                className="add-more-btn flex items-center gap-2 text-lg font-semibold px-5 py-2.5 rounded-xl transition-all"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.85)' }}>
                <Plus size={16} /> Add more images
              </button>
            )}

            {/* Presets */}
            <style>{`
              .preset-btn:hover { background: var(--color-image-dim) !important; border-color: var(--color-image) !important; color: var(--color-image) !important; }
              .preset-btn:hover .preset-dims { color: var(--color-image) !important; }
              .preset-clear:hover { color: rgba(255,255,255,0.85) !important; }
              .download-btn:hover { opacity: 0.8; }
              .delete-btn:hover { background: rgba(239,68,68,0.2) !important; }
              .add-more-btn:hover { border-color: var(--border-hover) !important; color: rgba(255,255,255,1) !important; background: var(--surface-hover) !important; }
              .download-all-btn:hover { opacity: 0.8; }
            `}</style>
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center justify-between w-1/2">
                <span className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Social Media Presets</span>
                {activePreset && (
                  <button onClick={() => setActivePreset(null)} className="preset-clear text-base transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2" style={{ width: '50%' }}>
                {PRESETS.map((group) => (
                  <div key={group.group} className="flex items-center gap-2 overflow-x-auto" style={{ flexWrap: 'nowrap' }}>
                    <span className="text-base font-medium flex-shrink-0" style={{ color: 'rgb(96,165,250)', width: '72px' }}>{group.group}</span>
                    {group.items.map((preset) => {
                      const isActive = activePreset?.label === preset.label && activePreset?.w === preset.w && activePreset?.h === preset.h
                      return (
                        <button
                          key={preset.label}
                          onClick={() => setActivePreset(isActive ? null : preset)}
                          className="preset-btn flex-shrink-0 text-base px-3 py-1.5 rounded-lg transition-all"
                          style={{
                            background: isActive ? 'var(--color-image-dim)' : 'var(--surface)',
                            border: `1px solid ${isActive ? 'var(--color-image)' : 'var(--border)'}`,
                            color: isActive ? 'var(--color-image)' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {preset.label}
                          <span className="preset-dims ml-1.5 font-mono text-sm" style={{ color: isActive ? 'var(--color-image)' : 'rgba(255,255,255,0.4)' }}>
                            {preset.w}×{preset.h}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Sliders — hidden when a preset is active */}
            {!activePreset && (
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="flex items-center justify-between w-1/2">
                    <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Dimensions</label>
                    <span className="text-base font-mono font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>{scale}%</span>
                  </div>
                  <input type="range" min={1} max={100} value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    style={sliderStyle} />
                </div>
              </div>
            )}

            {/* Quality slider — always visible */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center justify-between w-1/2">
                <label className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Quality</label>
                <span className="text-base font-mono font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>{quality}%</span>
              </div>
              <input type="range" min={1} max={100} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                style={sliderStyle} />
              <p className="text-base font-medium" style={{ color: quality < 40 ? 'rgb(239,68,68)' : quality < 75 ? 'rgb(234,179,8)' : 'rgb(34,197,94)' }}>
                {quality < 40 ? 'Low' : quality < 75 ? 'Medium' : 'High'}
              </p>
            </div>

            {/* Download */}
            <div className="flex justify-end">
              <button onClick={downloadAll}
                className="download-all-btn flex items-center gap-2 px-6 py-2.5 rounded-xl text-lg font-semibold transition-all"
                style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}>
                <Download size={18} /> {images.length > 1 ? 'Download All' : 'Download'}
              </button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
