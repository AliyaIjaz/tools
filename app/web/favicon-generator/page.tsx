'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import { downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

const SIZES = [16, 32, 48, 64, 128, 256]

type Preview = { size: number; dataUrl: string }

export default function FaviconGeneratorPage() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        const results: Preview[] = SIZES.map((size) => {
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, size, size)
          return { size, dataUrl: canvas.toDataURL('image/png') }
        })
        setPreviews(results)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function downloadSize(preview: Preview) {
    const byteStr = atob(preview.dataUrl.split(',')[1])
    const arr = new Uint8Array(byteStr.length)
    for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: 'image/png' }), `favicon-${preview.size}x${preview.size}.png`)
  }

  async function downloadAll() {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const p of previews) {
      const byteStr = atob(p.dataUrl.split(',')[1])
      const arr = new Uint8Array(byteStr.length)
      for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i)
      zip.file(`favicon-${p.size}x${p.size}.png`, arr)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, 'favicons.zip')
  }

  return (
    <ToolLayout
      toolId="favicon-generator"
      title="Favicon Generator"
      description="Resize any image into favicon PNGs at multiple sizes"
      seoContent={
        <SeoSection
          about="Upload any image and generate PNG favicon files at all standard sizes: 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256. Download individually or all at once. Processing happens in your browser — no upload required."
          useCases={[
            'Creating a favicon set from a logo or icon for a new website',
            'Generating Apple Touch Icon and large favicon PNGs from a single source image',
            'Resizing a high-resolution logo down to the standard favicon sizes',
            'Creating favicons for a PWA or web app manifest',
            'Updating a site\'s favicon without design software',
          ]}
          faqs={[
            { q: 'Which sizes are generated?', a: 'The tool generates PNGs at 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256 pixels — covering all standard favicon and Apple Touch Icon sizes.' },
            { q: 'What image formats can I upload?', a: 'PNG, JPEG, and WebP are all supported as input. All output files are PNG.' },
            { q: 'Do I need an .ico file?', a: 'Modern browsers support PNG favicons natively. .ico format is only needed for legacy IE compatibility, which is rarely required today.' },
          ]}
        />
      }
      category="web"
      iconName="Star"
    >
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="w-full rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all py-12"
          style={{
            border: `2px dashed ${dragging ? 'var(--color-web)' : 'var(--border)'}`,
            background: dragging ? 'var(--color-web-dim)' : 'var(--surface)',
          }}
        >
          <Upload size={24} style={{ color: dragging ? 'var(--color-web)' : 'rgba(255,255,255,0.3)' }} />
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {fileName || 'Drop an image or click to upload'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              PNG, JPG, SVG, WebP — square images work best
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]) }}
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Generated favicons
              </p>
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'var(--color-web-dim)', border: '1px solid var(--color-web)', color: 'var(--color-web)' }}
              >
                <Download size={13} /> Download all (.zip)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previews.map((p) => (
                <div
                  key={p.size}
                  className="rounded-xl p-4 flex flex-col items-center gap-3"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: Math.min(p.size, 80),
                      height: Math.min(p.size, 80),
                      background: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                      src={p.dataUrl}
                      alt={`${p.size}x${p.size}`}
                      style={{ width: Math.min(p.size, 80), height: Math.min(p.size, 80), imageRendering: p.size <= 32 ? 'pixelated' : 'auto' }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-white">{p.size}×{p.size}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>PNG</p>
                  </div>
                  <button
                    onClick={() => downloadSize(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium w-full justify-center transition-all"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    <Download size={11} /> Download
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
