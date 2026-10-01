'use client'

import { useState, useRef } from 'react'
import { Download } from 'lucide-react'
import FileDropZone from '@/components/ui/FileDropZone'
import { formatBytes, downloadBlob } from '@/lib/utils'

export type Format = 'image/png' | 'image/jpeg' | 'image/webp'

const FORMATS: { label: string; mime: Format; ext: string }[] = [
  { label: 'PNG', mime: 'image/png', ext: 'png' },
  { label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', mime: 'image/webp', ext: 'webp' },
]

export default function ImageConverter({ defaultTarget, accept, hint }: { defaultTarget: Format; accept?: string; hint?: string }) {
  const [src, setSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [origSize, setOrigSize] = useState(0)
  const [origMime, setOrigMime] = useState('')
  const [targetFormat, setTargetFormat] = useState<Format>(defaultTarget)
  const [quality, setQuality] = useState(92)
  const [output, setOutput] = useState('')
  const [outputSize, setOutputSize] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    setOrigSize(file.size)
    setOrigMime(file.type)
    setOutput('')
    const reader = new FileReader()
    reader.onload = (e) => setSrc(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function convert() {
    const canvas = canvasRef.current
    if (!canvas || !src) return
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      const q = targetFormat === 'image/png' ? undefined : quality / 100
      const dataUrl = canvas.toDataURL(targetFormat, q)
      setOutput(dataUrl)
      const base64 = dataUrl.split(',')[1]
      setOutputSize(Math.round(base64.length * 0.75))
    }
    img.src = src
  }

  function downloadOutput() {
    if (!output) return
    const ext = FORMATS.find((f) => f.mime === targetFormat)?.ext ?? 'png'
    const baseName = fileName.replace(/\.[^.]+$/, '')
    const binary = atob(output.split(',')[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: targetFormat }), `${baseName}.${ext}`)
  }

  const currentFmt = FORMATS.find((f) => f.mime === origMime)

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-5">
        {!src && <FileDropZone onFile={handleFile} accept={accept} hint={hint ?? 'PNG, JPEG, WebP, GIF, BMP'} />}

        {src && (
          <>
            <div className="flex items-center gap-4 rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="source" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" style={{ border: '1px solid var(--border)' }} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-white truncate">{fileName}</p>
                <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {formatBytes(origSize)} · {currentFmt?.label ?? origMime}
                </p>
              </div>
              <button onClick={() => { setSrc(''); setOutput('') }}
                className="ml-auto text-sm px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:text-white"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.65)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-hover)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}>
                Change
              </button>
            </div>

            <div>
              <label className="text-base font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.7)' }}>Convert to</label>
              <div className="flex gap-2">
                {FORMATS.map(({ label, mime }) => (
                  <button key={mime} onClick={() => { setTargetFormat(mime); setOutput('') }}
                    className="flex-1 py-2 rounded-lg text-base font-medium transition-all"
                    style={{
                      background: targetFormat === mime ? 'var(--color-image-dim)' : 'var(--surface)',
                      border: `1px solid ${targetFormat === mime ? 'var(--color-image)' : 'var(--border)'}`,
                      color: targetFormat === mime ? 'var(--color-image)' : 'rgba(255,255,255,0.75)',
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {targetFormat !== 'image/png' && (
              <div className="flex items-center gap-3">
                <label className="text-base flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }}>Quality</label>
                <input type="range" min={10} max={100} value={quality}
                  onChange={(e) => { setQuality(Number(e.target.value)); setOutput('') }}
                  className="flex-1 accent-white" />
                <span className="text-base w-8 text-right" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-geist-mono)' }}>{quality}%</span>
              </div>
            )}

            <button onClick={convert}
              className="px-10 py-3 rounded-lg text-lg font-semibold transition-all"
              style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-image)'; (e.currentTarget as HTMLButtonElement).style.color = '#000' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-image-dim)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-image)' }}>
              Convert
            </button>

            {output && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <span className="text-white">{formatBytes(outputSize)}</span>
                    {origSize > 0 && (
                      <span className="ml-2" style={{ color: outputSize < origSize ? '#34d399' : '#f87171' }}>
                        ({outputSize < origSize ? '−' : '+'}{Math.abs(Math.round((1 - outputSize / origSize) * 100))}%)
                      </span>
                    )}
                  </div>
                  <button onClick={downloadOutput}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-base font-medium transition-all"
                    style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-image)'; (e.currentTarget as HTMLButtonElement).style.color = '#000' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-image-dim)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-image)' }}>
                    <Download size={13} /> Download
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={output} alt="converted" className="w-full rounded-xl object-contain"
                  style={{ border: '1px solid var(--border)', maxHeight: '320px' }} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
