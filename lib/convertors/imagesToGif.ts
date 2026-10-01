import JSZip from 'jszip'

const IMAGE_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  avif: 'image/avif',
}

export function isZip(file: File) {
  return /\.zip$/i.test(file.name) || file.type === 'application/zip' || file.type === 'application/x-zip-compressed'
}

/** Replaces any .zip in the list with the images inside it (natural filename order); other files pass through. */
export async function expandZips(files: File[]): Promise<File[]> {
  const out: File[] = []
  for (const file of files) {
    if (!isZip(file)) { out.push(file); continue }
    let zip: JSZip
    try {
      zip = await JSZip.loadAsync(file)
    } catch {
      throw new Error(`Could not open "${file.name}". The ZIP may be damaged.`)
    }
    const entries = Object.values(zip.files)
      .filter((e) => {
        if (e.dir || e.name.startsWith('__MACOSX/')) return false
        const base = e.name.split('/').pop() ?? ''
        return !base.startsWith('.') && !!IMAGE_MIME[base.split('.').pop()!.toLowerCase()]
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    for (const e of entries) {
      const base = e.name.split('/').pop()!
      const blob = await e.async('blob')
      out.push(new File([blob], base, { type: IMAGE_MIME[base.split('.').pop()!.toLowerCase()] }))
    }
  }
  return out
}
export type ImagesToGifOptions = {
  delayMs: number
  width: number
  height: number
  loop: boolean
  onProgress?: (fraction: number, message: string) => void
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Could not read "${file.name}" as an image.`)) }
    img.src = url
  })
}

export async function getImageSize(file: File) {
  const img = await loadImage(file)
  return { width: img.naturalWidth, height: img.naturalHeight }
}

export async function imagesToGif(files: File[], opts: ImagesToGifOptions): Promise<Blob> {
  const { GIFEncoder, quantize, applyPalette } = await import('gifenc')
  const { width, height } = opts
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const gif = GIFEncoder()
  for (let i = 0; i < files.length; i++) {
    opts.onProgress?.(i / files.length, `Encoding frame ${i + 1} of ${files.length}…`)
    const img = await loadImage(files[i])
    ctx.clearRect(0, 0, width, height)
    // Flatten onto white so transparent areas don't turn black, then fit (contain) into the frame.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
    const { data } = ctx.getImageData(0, 0, width, height)
    const palette = quantize(data, 256)
    const index = applyPalette(data, palette)
    gif.writeFrame(index, width, height, { palette, delay: opts.delayMs, repeat: opts.loop ? 0 : -1 })
    await new Promise((r) => setTimeout(r, 0))
  }
  gif.finish()
  opts.onProgress?.(1, 'Done')
  return new Blob([gif.bytes() as BlobPart], { type: 'image/gif' })
}
