import JSZip from 'jszip'

export type GifToImagesFormat = 'png' | 'jpeg' | 'webp'

export type GifFrame = { blob: Blob; url: string; name: string; delay: number }

export type GifToImagesResult = { width: number; height: number; frames: GifFrame[] }

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode frame.'))), type, quality)
  )
}

export async function gifToImages(
  file: File,
  opts: { format: GifToImagesFormat; onProgress?: (fraction: number, message: string) => void }
): Promise<GifToImagesResult> {
  const { parseGIF, decompressFrames } = await import('gifuct-js')
  const buffer = await file.arrayBuffer()
  let parsed
  let rawFrames
  try {
    parsed = parseGIF(buffer)
    rawFrames = decompressFrames(parsed, true)
  } catch {
    throw new Error('Could not read this GIF. The file may be damaged.')
  }
  if (!rawFrames.length) throw new Error('No frames found in this GIF.')

  const width = parsed.lsd.width
  const height = parsed.lsd.height
  const mime = `image/${opts.format}`
  const ext = opts.format === 'jpeg' ? 'jpg' : opts.format
  const base = file.name.replace(/\.gif$/i, '')
  const pad = String(rawFrames.length).length

  // Full-size canvas accumulates composited frames, honouring GIF disposal rules.
  const full = document.createElement('canvas')
  full.width = width
  full.height = height
  const fullCtx = full.getContext('2d', { willReadFrequently: true })!
  const patch = document.createElement('canvas')
  const patchCtx = patch.getContext('2d')!
  // JPEG has no alpha; flatten onto white.
  const out = document.createElement('canvas')
  out.width = width
  out.height = height
  const outCtx = out.getContext('2d')!

  const frames: GifFrame[] = []
  let restore: ImageData | null = null
  for (let i = 0; i < rawFrames.length; i++) {
    opts.onProgress?.(i / rawFrames.length, `Extracting frame ${i + 1} of ${rawFrames.length}…`)
    const f = rawFrames[i]
    const { left, top, width: fw, height: fh } = f.dims

    if (f.disposalType === 3) restore = fullCtx.getImageData(0, 0, width, height)

    patch.width = fw
    patch.height = fh
    patchCtx.putImageData(new ImageData(new Uint8ClampedArray(f.patch), fw, fh), 0, 0)
    fullCtx.drawImage(patch, left, top)

    outCtx.clearRect(0, 0, width, height)
    if (opts.format === 'jpeg') {
      outCtx.fillStyle = '#ffffff'
      outCtx.fillRect(0, 0, width, height)
    }
    outCtx.drawImage(full, 0, 0)
    const blob = await canvasToBlob(out, mime, 0.92)
    frames.push({
      blob,
      url: URL.createObjectURL(blob),
      name: `${base}-${String(i + 1).padStart(pad, '0')}.${ext}`,
      delay: f.delay || 100,
    })

    if (f.disposalType === 2) fullCtx.clearRect(left, top, fw, fh)
    else if (f.disposalType === 3 && restore) fullCtx.putImageData(restore, 0, 0)
    await new Promise((r) => setTimeout(r, 0))
  }
  opts.onProgress?.(1, 'Done')
  return { width, height, frames }
}

export async function zipFrames(frames: GifFrame[]): Promise<Blob> {
  const zip = new JSZip()
  for (const f of frames) zip.file(f.name, f.blob)
  return zip.generateAsync({ type: 'blob' })
}
