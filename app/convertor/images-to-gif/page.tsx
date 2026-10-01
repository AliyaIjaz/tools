'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, Loader2, RotateCcw, ArrowUp, ArrowDown, X } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import SeoSection from '@/components/ui/SeoSection'
import { formatBytes, downloadBlob } from '@/lib/utils'
import { imagesToGif, getImageSize, expandZips } from '@/lib/convertors/imagesToGif'

const inputClass = 'w-full rounded-lg px-3 py-2 text-lg text-white bg-transparent outline-none placeholder:text-white/50'
const MAX_FRAMES = 200

type Item = { id: number; file: File; url: string }
let nextId = 1

export default function ImagesToGifPage() {
  const [items, setItems] = useState<Item[]>([])
  const [delay, setDelay] = useState(500)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [loop, setLoop] = useState(true)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null)

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url) }, [result])

  function reset() {
    items.forEach((i) => URL.revokeObjectURL(i.url))
    setItems([])
    setResult(null)
    setError('')
    setProgress(0)
    setWidth(0)
    setHeight(0)
  }

  async function addFiles(picked: File[]) {
    let files: File[]
    try {
      files = await expandZips(picked)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read the ZIP file.')
      return
    }
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (!images.length) { setError('No images found. Choose image files (PNG, JPG, WebP, …) or a ZIP containing them.'); return }
    const room = MAX_FRAMES - items.length
    const accepted = images.slice(0, room)
    setError(images.length > room ? `Limited to ${MAX_FRAMES} images; extra files were skipped.` : '')
    const added = accepted.map((file) => ({ id: nextId++, file, url: URL.createObjectURL(file) }))
    if (!items.length && added.length) {
      try {
        const size = await getImageSize(added[0].file)
        const s = Math.min(1, 800 / Math.max(size.width, size.height))
        setWidth(Math.round(size.width * s))
        setHeight(Math.round(size.height * s))
      } catch {
        setError(`Could not read "${added[0].file.name}" as an image.`)
        added.forEach((i) => URL.revokeObjectURL(i.url))
        return
      }
    }
    setItems((prev) => [...prev, ...added])
    setResult(null)
  }

  function remove(id: number) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((i) => i.id !== id)
    })
    setResult(null)
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const j = index + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
    setResult(null)
  }

  async function convert() {
    if (!items.length || width < 1 || height < 1) return
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const blob = await imagesToGif(items.map((i) => i.file), {
        delayMs: delay,
        width,
        height,
        loop,
        onProgress: (p, msg) => { setProgress(p); setStatus(msg) },
      })
      setResult({ blob, url: URL.createObjectURL(blob) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.')
    } finally {
      setBusy(false)
    }
  }

  function numberField(label: string, value: number, set: (n: number) => void, min: number, max: number, suffix: string) {
    return (
      <label className="block space-y-2">
        <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={min}
            max={max}
            value={value || ''}
            onChange={(e) => set(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
            className={inputClass}
            style={{ border: '2px solid var(--border-convertor)' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-convertor)')}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-convertor-idle)'; if (value < min) set(min) }}
          />
          <span className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>{suffix}</span>
        </div>
      </label>
    )
  }

  return (
    <ToolLayout
      toolId="convertor-images-to-gif"
      title="Images to GIF Converter"
      description="Combine multiple images into an animated GIF right in your browser. Your files never leave your device."
      category="convertor"
      iconName="Images"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Images to GIF Converter"
          about={
            <>
              <p className="text-lg leading-relaxed"><strong className="text-white">Images to GIF Converter</strong> turns a set of PNG, JPG, or WebP pictures into one animated GIF. Add your images (or a ZIP file containing them), put them in the order you want, choose how long each frame is shown, and download the result.</p>
              <p className="text-lg leading-relaxed">Images with a different size from the GIF are scaled to fit inside it without stretching, and transparent areas are filled with white. You can set the output width and height and decide whether the animation loops forever or plays once.</p>
              <p className="text-lg leading-relaxed">Works as a PNG to GIF and JPG to GIF maker. Need to shrink the source pictures first? Try the <Link href="/image/resize" className="underline" style={{ color: 'var(--color-convertor)' }}>image resizer</Link> or <Link href="/image/compress" className="underline" style={{ color: 'var(--color-convertor)' }}>image compressor</Link>. Want the frames back out? Use the <Link href="/convertor/gif-to-images" className="underline" style={{ color: 'var(--color-convertor)' }}>GIF to Images converter</Link>.</p>
              <p className="text-lg leading-relaxed">Everything runs <strong className="text-white">locally in your browser</strong>. Your images are <strong className="text-white">never uploaded</strong>, and there is no registration or watermark.</p>
            </>
          }
          useCases={[
            'Make a quick animation from screenshots or photos.',
            'Create a product demo or step-by-step tutorial GIF.',
            'Turn a burst of photos into a looping clip.',
            'Build simple stop-motion animations.',
            'Make animated reactions or stickers for chat.',
            'Show before and after images in a single file.',
            'Create lightweight animated banners for email.',
            'Animate sprite or icon frames for a prototype.',
          ]}
          faqs={[
            { q: 'How do I make a GIF from images online for free?', a: 'Drop your images onto the upload area, reorder them, set the frame delay and size, click Create GIF, and download the file. It is free and needs no account.' },
            { q: 'What image formats can I use?', a: 'Any format your browser can display, including PNG, JPG, WebP, and static GIF files.' },
            { q: 'Can I make a GIF from PNG or JPG files?', a: 'Yes. This works as a PNG to GIF and JPG to GIF converter. Mix formats freely and each image becomes one frame.' },
            { q: 'Can I upload a ZIP file of images?', a: 'Yes. Drop a .zip and every image inside is added as a frame, sorted by filename (so frame2 comes before frame10). You can still reorder or remove frames afterwards.' },
            { q: 'How do I change the order of the frames?', a: 'Use the up and down arrows beside each image. Frames play from the top of the list to the bottom.' },
            { q: 'Why does my GIF look grainy?', a: 'GIF supports only 256 colors per frame, so photos and gradients can show banding. This is a limit of the GIF format.' },
            { q: 'Are my images uploaded anywhere?', a: 'No. Encoding happens entirely inside your browser, so your images never leave your device.' },
            { q: 'Can I extract frames from a GIF?', a: 'Yes, use the GIF to Images converter on this site.' },
          ]}
        />
      }
    >
      <p className="text-base mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
        Make a GIF from PNG, JPG, or WebP images in four steps: <strong className="text-white">upload → reorder → set speed and size → download</strong>.
      </p>
      {!items.length ? (
        <FileDropZone
          onFile={(f) => addFiles([f])}
          onFiles={addFiles}
          multiple
          accept="image/*,.zip,application/zip"
          label="Drop images or a ZIP file, or click to upload"
          hint="PNG, JPG, WebP, or a .zip of images"
          color="var(--color-convertor)"
          dimColor="var(--color-convertor-dim)"
        />
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-lg font-semibold text-white">{items.length} {items.length === 1 ? 'image' : 'images'}</p>
            <button
              onClick={reset}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-base disabled:opacity-50"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              <RotateCcw size={14} /> Start over
            </button>
          </div>

          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="rounded-xl p-3 flex items-center gap-4"
                style={{ background: 'var(--surface)', border: '2px solid var(--border-convertor-idle)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-white truncate">{i + 1}. {item.file.name}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{formatBytes(item.file.size)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <button onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move up" className="p-1.5 disabled:opacity-30"><ArrowUp size={18} /></button>
                  <button onClick={() => move(i, 1)} disabled={busy || i === items.length - 1} aria-label="Move down" className="p-1.5 disabled:opacity-30"><ArrowDown size={18} /></button>
                  <button onClick={() => remove(item.id)} disabled={busy} aria-label="Remove" className="p-1.5 disabled:opacity-30"><X size={18} /></button>
                </div>
              </li>
            ))}
          </ul>

          <label className="inline-block text-base cursor-pointer" style={{ color: 'var(--color-convertor)' }}>
            + Add more images or a ZIP
            <input
              type="file"
              accept="image/*,.zip,application/zip"
              multiple
              className="hidden"
              onChange={(e) => { addFiles(Array.from(e.target.files ?? [])); e.target.value = '' }}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {numberField('Frame delay', delay, setDelay, 20, 10000, 'ms')}
            {numberField('Width', width, setWidth, 1, 4000, 'px')}
            {numberField('Height', height, setHeight, 1, 4000, 'px')}
          </div>

          <label className="inline-flex items-center gap-2 text-base" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            Loop forever
          </label>

          <div>
            <button
              onClick={convert}
              disabled={busy || width < 1 || height < 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white disabled:opacity-60 transition-opacity"
              style={{ background: 'var(--color-convertor)' }}
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : null}
              {busy ? 'Creating…' : 'Create GIF'}
            </button>
          </div>

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Generated GIF preview" className="max-w-full max-h-96 rounded-lg mx-auto" />
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {width}×{height} · {items.length} frames · {formatBytes(result.blob.size)}
              </p>
              <button
                onClick={() => downloadBlob(result.blob, 'animation.gif')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white"
                style={{ background: 'var(--color-convertor)' }}
              >
                <Download size={18} /> Download GIF
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-base mt-4" style={{ color: '#f87171' }}>{error}</p>}
    </ToolLayout>
  )
}
