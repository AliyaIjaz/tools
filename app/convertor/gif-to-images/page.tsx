'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Download, Loader2, RotateCcw } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import SeoSection from '@/components/ui/SeoSection'
import Tabs from '@/components/ui/Tabs'
import { formatBytes, downloadBlob } from '@/lib/utils'
import { gifToImages, zipFrames, GifToImagesFormat, GifToImagesResult } from '@/lib/convertors/gifToImages'

const FORMAT_LABELS: Record<GifToImagesFormat, string> = { png: 'PNG', jpeg: 'JPG', webp: 'WebP' }
const LABEL_TO_FORMAT: Record<string, GifToImagesFormat> = { PNG: 'png', JPG: 'jpeg', WebP: 'webp' }

export default function GifToImagesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<GifToImagesFormat>('png')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<GifToImagesResult | null>(null)
  const urlsRef = useRef<string[]>([])

  function revoke() {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    urlsRef.current = []
  }
  useEffect(() => revoke, [])

  function reset() {
    revoke()
    setFile(null)
    setResult(null)
    setError('')
    setProgress(0)
  }

  function handleFile(f: File) {
    if (!/\.gif$/i.test(f.name) && f.type !== 'image/gif') {
      setError('Please choose a .gif file.')
      return
    }
    revoke()
    setFile(f)
    setResult(null)
    setError('')
  }

  async function convert() {
    if (!file) return
    revoke()
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const res = await gifToImages(file, {
        format,
        onProgress: (p, msg) => { setProgress(p); setStatus(msg) },
      })
      urlsRef.current = res.frames.map((f) => f.url)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.')
    } finally {
      setBusy(false)
    }
  }

  async function downloadZip() {
    if (!result || !file) return
    const blob = await zipFrames(result.frames)
    downloadBlob(blob, file.name.replace(/\.gif$/i, '') + '-frames.zip')
  }

  const totalSize = result ? result.frames.reduce((n, f) => n + f.blob.size, 0) : 0

  return (
    <ToolLayout
      toolId="convertor-gif-to-images"
      title="GIF to Images Converter"
      description="Extract every frame of an animated GIF as PNG, JPG, or WebP right in your browser. Your file never leaves your device."
      category="convertor"
      iconName="Film"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online GIF to Images Converter"
          about={
            <>
              <p className="text-lg leading-relaxed"><strong className="text-white">GIF to Images Converter</strong> splits an animated GIF into its individual frames. Choose PNG, JPG, or WebP, download single frames, or grab them all in one ZIP file.</p>
              <p className="text-lg leading-relaxed">Frames are fully composited, so GIFs that only store the changed part of each frame still come out as complete pictures. PNG and WebP keep transparency; JPG has no transparency, so transparent areas become white.</p>
              <p className="text-lg leading-relaxed">Works as a GIF to PNG, GIF to JPG, and GIF frame extractor. Need a different format or size afterwards? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-convertor)' }}>image converter</Link> or <Link href="/image/resize" className="underline" style={{ color: 'var(--color-convertor)' }}>image resizer</Link>. Want to build a GIF instead? Use the <Link href="/convertor/images-to-gif" className="underline" style={{ color: 'var(--color-convertor)' }}>Images to GIF converter</Link>.</p>
              <p className="text-lg leading-relaxed">Everything runs <strong className="text-white">locally in your browser</strong>. Your GIF is <strong className="text-white">never uploaded</strong>, and there is no registration or watermark.</p>
            </>
          }
          useCases={[
            'Pull a single frame out of a GIF to use as a still image.',
            'Edit an animation frame by frame in an image editor.',
            'Create sprite sheets or assets from an animated GIF.',
            'Pick the best frame for a thumbnail or preview.',
            'Convert an animated meme into a series of pictures.',
            'Inspect how an animation was built.',
            'Re-time an animation by extracting and re-assembling frames.',
          ]}
          faqs={[
            { q: 'How do I extract frames from a GIF online for free?', a: 'Drop your GIF onto the upload area, choose PNG, JPG, or WebP, click Extract frames, then download individual frames or the full ZIP. It is free and needs no account.' },
            { q: 'How do I convert a GIF to PNG?', a: 'Upload the GIF, choose PNG, and click Extract frames. Every frame is saved as a PNG, and a single-frame GIF gives you exactly one PNG.' },
            { q: 'Does it keep transparency?', a: 'PNG and WebP keep transparent areas. JPG does not support transparency, so those areas are filled with white.' },
            { q: 'Why are some frames identical?', a: 'Many GIFs repeat frames to control timing, and each stored frame is exported as-is.' },
            { q: 'Is my GIF uploaded anywhere?', a: 'No. The GIF is decoded entirely inside your browser, so it never leaves your device.' },
            { q: 'Can I turn the frames back into a GIF?', a: 'Yes, use the Images to GIF converter on this site.' },
            { q: 'Is there a limit on GIF size?', a: 'There is no fixed limit, but very large or long GIFs use a lot of memory in the browser and may be slow.' },
          ]}
        />
      }
    >
      <p className="text-base mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
        Split a GIF into frames in three steps: <strong className="text-white">upload → choose PNG, JPG, or WebP → download</strong>.
      </p>
      {!file ? (
        <FileDropZone
          onFile={handleFile}
          accept=".gif,image/gif"
          label="Drop a GIF or click to upload"
          hint="GIF files (.gif)"
          color="var(--color-convertor)"
          dimColor="var(--color-convertor-dim)"
        />
      ) : (
        <div className="space-y-5">
          <div
            className="rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-convertor-idle)' }}
          >
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white truncate">{file.name}</p>
              <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={reset}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-base disabled:opacity-50"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              <RotateCcw size={14} /> Change file
            </button>
          </div>

          {!result && (
            <>
              <div className="space-y-2">
                <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Output format</p>
                <Tabs
                  tabs={Object.values(FORMAT_LABELS)}
                  value={FORMAT_LABELS[format]}
                  onChange={(label) => setFormat(LABEL_TO_FORMAT[label])}
                />
              </div>
              <button
                onClick={convert}
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white disabled:opacity-60 transition-opacity"
                style={{ background: 'var(--color-convertor)' }}
              >
                {busy ? <Loader2 size={18} className="animate-spin" /> : null}
                {busy ? 'Extracting…' : 'Extract frames'}
              </button>
            </>
          )}

          {busy && (
            <div className="space-y-2">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-convertor-dim)' }}>
                <div className="h-full transition-all" style={{ width: `${Math.round(progress * 100)}%`, background: 'var(--color-convertor)' }} />
              </div>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>{status}</p>
            </div>
          )}

          {result && (
            <div className="rounded-xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '2px solid var(--border-convertor)' }}>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {result.frames.length} {result.frames.length === 1 ? 'frame' : 'frames'} · {result.width}×{result.height} · {formatBytes(totalSize)} · {FORMAT_LABELS[format]}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadZip}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white"
                  style={{ background: 'var(--color-convertor)' }}
                >
                  <Download size={18} /> Download all (ZIP)
                </button>
                <button onClick={() => setResult(null)} className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Extract again with a different format
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {result.frames.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => downloadBlob(f.blob, f.name)}
                    title={`Download ${f.name}`}
                    className="rounded-lg overflow-hidden text-left"
                    style={{ border: '2px solid var(--border-convertor-idle)', background: 'rgba(255,255,255,0.06)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.url} alt={`Frame ${i + 1}`} className="w-full aspect-square object-contain" />
                    <p className="text-sm px-2 py-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Frame {i + 1} · {formatBytes(f.blob.size)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-base mt-4" style={{ color: '#f87171' }}>{error}</p>}
    </ToolLayout>
  )
}
