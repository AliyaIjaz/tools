import JSZip from 'jszip'
import type { ConvertProgress } from './epubToPdf'

export type PdfToEpubMode = 'text' | 'images'

export type PdfToEpubOptions = {
  mode: PdfToEpubMode
  title: string
  author: string
  onProgress?: ConvertProgress
}

export type PdfToEpubResult = {
  blob: Blob
  pages: number
  chapters: number
  emptyTextPages: number
}

type Line = { text: string; x: number; y: number; size: number }
type TextBlock = { kind: 'h1' | 'h2' | 'p'; text: string }
type Chapter = { title: string; body: string }

const CSS = `body { font-family: serif; line-height: 1.5; margin: 5%; }
h1, h2 { font-family: sans-serif; line-height: 1.25; }
p { margin: 0 0 0.9em 0; text-align: justify; }
.page { text-align: center; margin: 0; page-break-after: always; }
.page img { max-width: 100%; height: auto; }
`

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function xhtml(title: string, body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="utf-8"/><title>${esc(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
${body}
</body>
</html>`
}

type PdfTextItem = { str: string; width: number; transform: number[] }

function pageLines(items: unknown[]): Line[] {
  const textItems = items.filter(
    (it): it is PdfTextItem => typeof it === 'object' && it !== null && 'str' in it && 'transform' in it,
  )
  const sorted = textItems
    .filter((it) => it.str.length > 0)
    .map((it) => ({
      str: it.str,
      x: it.transform[4],
      y: it.transform[5],
      width: it.width,
      size: Math.hypot(it.transform[0], it.transform[1]) || 1,
    }))
    .sort((a, b) => b.y - a.y || a.x - b.x)

  const lines: Line[] = []
  let current: typeof sorted = []
  const commit = () => {
    if (current.length === 0) return
    current.sort((a, b) => a.x - b.x)
    let text = ''
    let prevEnd = 0
    current.forEach((it, idx) => {
      const gap = it.x - prevEnd
      if (idx > 0 && gap > it.size * 0.2 && !text.endsWith(' ') && !it.str.startsWith(' ')) text += ' '
      text += it.str
      prevEnd = it.x + it.width
    })
    text = text.replace(/\s+/g, ' ').trim()
    if (text) {
      lines.push({ text, x: current[0].x, y: current[0].y, size: Math.max(...current.map((c) => c.size)) })
    }
    current = []
  }

  for (const it of sorted) {
    if (current.length > 0 && Math.abs(it.y - current[0].y) > Math.max(2, it.size * 0.4)) commit()
    current.push(it)
  }
  commit()
  return lines
}

function buildBlocks(pages: Line[][], bodySize: number, medianGap: number): TextBlock[][] {
  return pages.map((lines) => {
    const blocks: TextBlock[] = []
    const leftMargin = lines.length ? Math.min(...lines.map((l) => l.x)) : 0
    let para: string[] = []
    const flushPara = () => {
      if (para.length === 0) return
      let text = ''
      for (const line of para) {
        if (!text) text = line
        else if (/[a-z]-$/.test(text) && /^[a-z]/.test(line)) text = text.slice(0, -1) + line
        else text += ' ' + line
      }
      blocks.push({ kind: 'p', text })
      para = []
    }

    let prev: Line | null = null
    for (const line of lines) {
      const isH1 = line.size >= bodySize * 1.6
      const isH2 = !isH1 && line.size >= bodySize * 1.25 && line.text.length < 120
      if (isH1 || isH2) {
        flushPara()
        const kind = isH1 ? 'h1' : 'h2'
        const last = blocks[blocks.length - 1]
        if (last && last.kind === kind && prev && prev.size === line.size) last.text += ' ' + line.text
        else blocks.push({ kind, text: line.text })
      } else {
        const gap = prev ? prev.y - line.y : 0
        const indented = line.x - leftMargin > bodySize * 0.8
        if (para.length > 0 && (gap > medianGap * 1.5 || indented)) flushPara()
        para.push(line.text)
      }
      prev = line
    }
    flushPara()
    return blocks
  })
}

function renderBlocks(blocks: TextBlock[]): string {
  return blocks
    .map((b) => (b.kind === 'p' ? `<p>${esc(b.text)}</p>` : `<${b.kind}>${esc(b.text)}</${b.kind}>`))
    .join('\n')
}

export async function pdfToEpub(file: File, opts: PdfToEpubOptions): Promise<PdfToEpubResult> {
  const { mode, title, author, onProgress } = opts
  onProgress?.(0, 'Loading PDF…')

  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjs.getDocument({ data }).promise
  const total = pdf.numPages

  const chapters: Chapter[] = []
  const images: { name: string; data: ArrayBuffer }[] = []
  let emptyTextPages = 0

  if (mode === 'images') {
    for (let n = 1; n <= total; n++) {
      onProgress?.((n - 1) / total * 0.9, `Rendering page ${n} of ${total}…`)
      const page = await pdf.getPage(n)
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas is not available in this browser.')
      await page.render({ canvas, canvasContext: ctx, viewport }).promise
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.8))
      if (!blob) throw new Error(`Could not render page ${n}.`)
      const name = `page-${n}.jpg`
      images.push({ name, data: await blob.arrayBuffer() })
      chapters.push({
        title: `Page ${n}`,
        body: `<div class="page"><img src="images/${name}" alt="Page ${n}"/></div>`,
      })
      page.cleanup()
    }
  } else {
    const pageLinesAll: Line[][] = []
    for (let n = 1; n <= total; n++) {
      onProgress?.((n - 1) / total * 0.8, `Extracting text from page ${n} of ${total}…`)
      const page = await pdf.getPage(n)
      const content = await page.getTextContent()
      const lines = pageLines(content.items)
      if (lines.length === 0) emptyTextPages++
      pageLinesAll.push(lines)
      page.cleanup()
    }

    const allLines = pageLinesAll.flat()
    if (allLines.length === 0) {
      throw new Error('No selectable text found. This PDF looks scanned — try "Page images" mode instead.')
    }

    // Body size: the most common font size, weighted by characters.
    const weights = new Map<number, number>()
    for (const l of allLines) {
      const key = Math.round(l.size * 2) / 2
      weights.set(key, (weights.get(key) ?? 0) + l.text.length)
    }
    const bodySize = [...weights.entries()].sort((a, b) => b[1] - a[1])[0][0]
    const gaps: number[] = []
    for (const lines of pageLinesAll) {
      for (let i = 1; i < lines.length; i++) {
        const g = lines[i - 1].y - lines[i].y
        if (g > 0 && g < bodySize * 3 && Math.abs(lines[i].size - bodySize) < 1) gaps.push(g)
      }
    }
    const medianGap = median(gaps) || bodySize * 1.3

    const pageBlocks = buildBlocks(pageLinesAll, bodySize, medianGap)

    // Merge a paragraph that runs across a page break.
    for (let i = 1; i < pageBlocks.length; i++) {
      const prevLast = pageBlocks[i - 1][pageBlocks[i - 1].length - 1]
      const first = pageBlocks[i][0]
      if (prevLast?.kind === 'p' && first?.kind === 'p' && !/[.!?:"'”’)]$/.test(prevLast.text) && /^[a-z]/.test(first.text)) {
        prevLast.text = /[a-z]-$/.test(prevLast.text) ? prevLast.text.slice(0, -1) + first.text : `${prevLast.text} ${first.text}`
        pageBlocks[i].shift()
      }
    }

    // Chapters: split at top-level headings, or fall back to fixed-size page groups.
    const flat: { page: number; block: TextBlock }[] = pageBlocks.flatMap((blocks, i) => blocks.map((block) => ({ page: i + 1, block })))
    const h1Count = flat.filter((f) => f.block.kind === 'h1').length
    if (h1Count >= 2) {
      let current: { title: string; blocks: TextBlock[] } | null = null
      const done: { title: string; blocks: TextBlock[] }[] = []
      for (const { block } of flat) {
        if (block.kind === 'h1' && (!current || current.blocks.some((b) => b.kind === 'p'))) {
          current = { title: block.text, blocks: [] }
          done.push(current)
        } else if (!current) {
          current = { title: 'Front matter', blocks: [] }
          done.push(current)
        }
        current.blocks.push(block)
      }
      for (const c of done) chapters.push({ title: c.title, body: renderBlocks(c.blocks) })
    } else {
      const perChapter = 10
      for (let start = 0; start < total; start += perChapter) {
        const end = Math.min(start + perChapter, total)
        const blocks = pageBlocks.slice(start, end).flat()
        if (blocks.length === 0) continue
        const heading = blocks.find((b) => b.kind === 'h1' || b.kind === 'h2')
        chapters.push({
          title: heading && start === 0 ? heading.text : `Pages ${start + 1}–${end}`,
          body: renderBlocks(blocks),
        })
      }
    }
  }

  onProgress?.(0.92, 'Building EPUB…')
  const id = `urn:uuid:${crypto.randomUUID()}`
  const zip = new JSZip()
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })
  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`,
  )

  const oebps = zip.folder('OEBPS')!
  oebps.file('style.css', CSS)
  chapters.forEach((c, i) => {
    const heading = mode === 'text' && !/^<h[12]>/.test(c.body) ? `<h1>${esc(c.title)}</h1>\n` : ''
    oebps.file(`chapter-${i + 1}.xhtml`, xhtml(c.title, heading + c.body))
  })
  images.forEach((img) => oebps.file(`images/${img.name}`, img.data))

  oebps.file(
    'nav.xhtml',
    xhtml(
      'Contents',
      `<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>\n${chapters
        .map((c, i) => `<li><a href="chapter-${i + 1}.xhtml">${esc(c.title)}</a></li>`)
        .join('\n')}\n</ol></nav>`,
    ),
  )
  oebps.file(
    'toc.ncx',
    `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="${id}"/></head>
<docTitle><text>${esc(title)}</text></docTitle>
<navMap>
${chapters
  .map(
    (c, i) =>
      `<navPoint id="np${i + 1}" playOrder="${i + 1}"><navLabel><text>${esc(c.title)}</text></navLabel><content src="chapter-${i + 1}.xhtml"/></navPoint>`,
  )
  .join('\n')}
</navMap>
</ncx>`,
  )

  const manifest = [
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
    `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
    `<item id="css" href="style.css" media-type="text/css"/>`,
    ...chapters.map((_, i) => `<item id="ch${i + 1}" href="chapter-${i + 1}.xhtml" media-type="application/xhtml+xml"/>`),
    ...images.map((img, i) => `<item id="img${i + 1}" href="images/${img.name}" media-type="image/jpeg"${i === 0 ? ' properties="cover-image"' : ''}/>`),
  ]
  oebps.file(
    'content.opf',
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:identifier id="bookid">${id}</dc:identifier>
  <dc:title>${esc(title)}</dc:title>
  ${author ? `<dc:creator>${esc(author)}</dc:creator>` : ''}
  <dc:language>en</dc:language>
  <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
</metadata>
<manifest>
${manifest.join('\n')}
</manifest>
<spine toc="ncx">
${chapters.map((_, i) => `<itemref idref="ch${i + 1}"/>`).join('\n')}
</spine>
</package>`,
  )

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' })
  onProgress?.(1, 'Done')
  return { blob, pages: total, chapters: chapters.length, emptyTextPages }
}
