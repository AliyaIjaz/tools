import JSZip from 'jszip'

export type ConvertProgress = (fraction: number, message: string) => void

export type EpubToPdfResult = {
  blob: Blob
  title: string
  author: string
  pages: number
  chapters: number
  droppedChars: number
}

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'text'; text: string; bullet?: boolean; mono?: boolean }
  | { kind: 'image'; path: string }

type LoadedImage = { dataUrl: string; w: number; h: number }

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
const SKIP_TAGS = new Set(['script', 'style', 'head', 'title', 'meta', 'link'])
const BLOCK_TAGS = new Set([
  'p', 'div', 'section', 'article', 'blockquote', 'ul', 'ol', 'li', 'pre', 'table', 'thead', 'tbody',
  'tr', 'td', 'th', 'figure', 'figcaption', 'header', 'footer', 'aside', 'nav', 'body', 'main', 'dl',
  'dt', 'dd', 'hr', 'html',
])

const WIN_ANSI_UNSUPPORTED =
  /[^\n\t\x20-\x7e\xa1-\xff€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g

function resolvePath(baseFile: string, rel: string): string {
  const parts = baseFile.split('/')
  parts.pop()
  let clean = rel.split('#')[0].split('?')[0]
  try { clean = decodeURIComponent(clean) } catch { /* keep raw */ }
  for (const seg of clean.split('/')) {
    if (seg === '..') parts.pop()
    else if (seg !== '.' && seg !== '') parts.push(seg)
  }
  return parts.join('/')
}

function parseXml(text: string, type: DOMParserSupportedType): Document {
  return new DOMParser().parseFromString(text, type)
}

function parseMarkup(text: string): Document {
  const xml = parseXml(text, 'application/xhtml+xml')
  if (!xml.querySelector('parsererror')) return xml
  return parseXml(text, 'text/html')
}

function textOf(doc: Document, localName: string): string {
  const el = doc.getElementsByTagNameNS('*', localName)[0]
  return el?.textContent?.trim() ?? ''
}

function mimeFor(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'svg': return 'image/svg+xml'
    default: return 'image/jpeg'
  }
}

async function loadImage(zip: JSZip, path: string): Promise<LoadedImage | null> {
  const entry = zip.file(path)
  if (!entry) return null
  const blob = new Blob([await entry.async('arraybuffer')], { type: mimeFor(path) })
  const url = URL.createObjectURL(blob)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    if (!img.naturalWidth || !img.naturalHeight) return null
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight))
    const w = Math.round(img.naturalWidth * scale)
    const h = Math.round(img.naturalHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    return { dataUrl: canvas.toDataURL('image/jpeg', 0.85), w, h }
  } catch {
    return null
  } finally {
    URL.revokeObjectURL(url)
  }
}

function collectBlocks(root: Element, chapterPath: string): Block[] {
  const blocks: Block[] = []

  function walk(el: Element, opts: { bullet?: boolean; mono?: boolean }) {
    let buffer = ''
    let bulletPending = !!opts.bullet

    const flush = () => {
      const text = opts.mono ? buffer.replace(/\s+$/, '') : buffer.replace(/\s+/g, ' ').trim()
      buffer = ''
      if (!text.trim()) return
      blocks.push({ kind: 'text', text, bullet: bulletPending, mono: opts.mono })
      bulletPending = false
    }

    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 3) {
        buffer += node.textContent ?? ''
        continue
      }
      if (node.nodeType !== 1) continue
      const child = node as Element
      const tag = child.localName.toLowerCase()
      if (SKIP_TAGS.has(tag)) continue

      if (tag === 'img' || tag === 'image') {
        flush()
        const src = child.getAttribute('src') ?? child.getAttribute('href') ?? child.getAttribute('xlink:href')
        if (src && !src.startsWith('data:')) blocks.push({ kind: 'image', path: resolvePath(chapterPath, src) })
      } else if (HEADING_TAGS.has(tag)) {
        flush()
        const text = (child.textContent ?? '').replace(/\s+/g, ' ').trim()
        if (text) blocks.push({ kind: 'heading', level: Number(tag[1]), text })
      } else if (tag === 'br') {
        buffer += opts.mono ? '\n' : ' '
      } else if (tag === 'pre') {
        flush()
        walk(child, { mono: true })
      } else if (BLOCK_TAGS.has(tag) || child.querySelector('img, image, p, div, h1, h2, h3, h4, h5, h6, li')) {
        flush()
        walk(child, { bullet: tag === 'li', mono: opts.mono })
      } else {
        buffer += child.textContent ?? ''
      }
    }
    flush()
  }

  walk(root, {})
  return blocks
}

export async function epubToPdf(file: File, onProgress?: ConvertProgress): Promise<EpubToPdfResult> {
  onProgress?.(0, 'Reading EPUB…')
  const zip = await JSZip.loadAsync(file)

  const containerFile = zip.file('META-INF/container.xml')
  if (!containerFile) throw new Error('Not a valid EPUB: META-INF/container.xml is missing.')
  const container = parseXml(await containerFile.async('string'), 'application/xml')
  const opfPath = container.getElementsByTagNameNS('*', 'rootfile')[0]?.getAttribute('full-path')
  if (!opfPath) throw new Error('Not a valid EPUB: package document not found.')
  const opfFile = zip.file(opfPath)
  if (!opfFile) throw new Error('Not a valid EPUB: package document is missing.')

  const opf = parseXml(await opfFile.async('string'), 'application/xml')
  const title = textOf(opf, 'title') || file.name.replace(/\.epub$/i, '')
  const author = textOf(opf, 'creator')

  const manifest = new Map<string, { href: string; properties: string }>()
  for (const item of Array.from(opf.getElementsByTagNameNS('*', 'item'))) {
    const id = item.getAttribute('id')
    const href = item.getAttribute('href')
    if (id && href) manifest.set(id, { href: resolvePath(opfPath, href), properties: item.getAttribute('properties') ?? '' })
  }

  let coverPath: string | null = null
  const coverMeta = Array.from(opf.getElementsByTagNameNS('*', 'meta')).find((m) => m.getAttribute('name') === 'cover')
  const coverId = coverMeta?.getAttribute('content')
  if (coverId && manifest.has(coverId)) coverPath = manifest.get(coverId)!.href
  if (!coverPath) {
    for (const item of manifest.values()) {
      if (item.properties.split(/\s+/).includes('cover-image')) { coverPath = item.href; break }
    }
  }

  const spine = Array.from(opf.getElementsByTagNameNS('*', 'itemref'))
    .map((ref) => manifest.get(ref.getAttribute('idref') ?? '')?.href)
    .filter((href): href is string => !!href)
  if (spine.length === 0) throw new Error('This EPUB has no readable content.')

  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 56
  const contentW = pageW - margin * 2
  const bottom = pageH - margin

  let droppedChars = 0
  const sanitize = (raw: string) => {
    const text = raw
      .replace(/[  - ]/g, ' ')
      .replace(/[‐-‒−]/g, '-')
      .replace(/[­​-‏﻿]/g, '')
    const matches = text.match(WIN_ANSI_UNSUPPORTED)
    if (matches) droppedChars += matches.length
    return text.replace(WIN_ANSI_UNSUPPORTED, '')
  }

  let y = margin
  let pageHasContent = false
  const newPage = () => { doc.addPage(); y = margin; pageHasContent = false }
  const ensureSpace = (h: number) => { if (y + h > bottom) newPage() }

  const imageCache = new Map<string, LoadedImage | null>()
  const getImage = async (path: string) => {
    if (!imageCache.has(path)) imageCache.set(path, await loadImage(zip, path))
    return imageCache.get(path) ?? null
  }

  function drawImage(img: LoadedImage) {
    const maxH = (bottom - margin) * 0.85
    const scale = Math.min(contentW / img.w, maxH / img.h, 1)
    const w = img.w * scale
    const h = img.h * scale
    ensureSpace(h + 8)
    doc.addImage(img.dataUrl, 'JPEG', margin + (contentW - w) / 2, y, w, h)
    y += h + 10
    pageHasContent = true
  }

  // Cover page
  if (coverPath) {
    const cover = await getImage(coverPath)
    if (cover) {
      const scale = Math.min((pageW - margin) / cover.w, (pageH - margin) / cover.h)
      const w = cover.w * scale
      const h = cover.h * scale
      doc.addImage(cover.dataUrl, 'JPEG', (pageW - w) / 2, (pageH - h) / 2, w, h)
      doc.addPage()
    }
  }

  // Title page
  doc.setFont('times', 'bold').setFontSize(26)
  const titleLines = doc.splitTextToSize(sanitize(title), contentW) as string[]
  let ty = pageH / 3
  for (const line of titleLines) {
    doc.text(line, pageW / 2, ty, { align: 'center' })
    ty += 34
  }
  if (author) {
    doc.setFont('times', 'italic').setFontSize(14)
    doc.text(sanitize(author), pageW / 2, ty + 12, { align: 'center' })
  }
  doc.addPage()
  y = margin

  let chapters = 0
  for (let i = 0; i < spine.length; i++) {
    const chapterPath = spine[i]
    onProgress?.(0.05 + (i / spine.length) * 0.9, `Converting section ${i + 1} of ${spine.length}…`)
    await new Promise((r) => setTimeout(r, 0))

    const entry = zip.file(chapterPath)
    if (!entry) continue
    const markup = parseMarkup(await entry.async('string'))
    const body = markup.getElementsByTagNameNS('*', 'body')[0] ?? markup.documentElement
    const blocks = collectBlocks(body, chapterPath).filter((b) => !(b.kind === 'image' && b.path === coverPath))
    if (blocks.length === 0) continue

    chapters++
    if (pageHasContent) newPage()

    for (const block of blocks) {
      if (block.kind === 'image') {
        const img = await getImage(block.path)
        if (img) drawImage(img)
        continue
      }

      if (block.kind === 'heading') {
        const size = [22, 18, 15, 13, 12, 11][block.level - 1] ?? 12
        doc.setFont('helvetica', 'bold').setFontSize(size)
        const lines = doc.splitTextToSize(sanitize(block.text), contentW) as string[]
        const lineH = size * 1.25
        ensureSpace(lineH * lines.length + lineH * 2)
        if (pageHasContent) y += 8
        for (const line of lines) {
          doc.text(line, margin, y + size)
          y += lineH
        }
        y += 6
        pageHasContent = true
        continue
      }

      const size = block.mono ? 9 : 11
      doc.setFont(block.mono ? 'courier' : 'times', 'normal').setFontSize(size)
      const indent = block.bullet ? 14 : 0
      const raw = sanitize(block.text)
      const lines = block.mono
        ? raw.split('\n').flatMap((l) => doc.splitTextToSize(l || ' ', contentW) as string[])
        : (doc.splitTextToSize(raw, contentW - indent) as string[])
      const lineH = size * 1.4
      lines.forEach((line, idx) => {
        ensureSpace(lineH)
        if (block.bullet && idx === 0) doc.text('•', margin + 2, y + size)
        doc.text(line, margin + indent, y + size)
        y += lineH
      })
      y += block.mono ? 4 : 6
      pageHasContent = true
    }
  }

  if (chapters === 0) throw new Error('No readable text or images were found in this EPUB.')

  onProgress?.(0.97, 'Finalizing PDF…')
  const pages = doc.getNumberOfPages()
  doc.setProperties({ title, author })
  const blob = doc.output('blob')
  onProgress?.(1, 'Done')
  return { blob, title, author, pages, chapters, droppedChars }
}
