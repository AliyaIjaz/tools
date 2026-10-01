'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Loader2, RotateCcw, AlertTriangle } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import SeoSection from '@/components/ui/SeoSection'
import Tabs from '@/components/ui/Tabs'
import { formatBytes, downloadBlob } from '@/lib/utils'
import { pdfToEpub, PdfToEpubMode, PdfToEpubResult } from '@/lib/convertors/pdfToEpub'

const MODE_LABELS: Record<PdfToEpubMode, string> = { text: 'Reflowable text', images: 'Page images' }
const LABEL_TO_MODE: Record<string, PdfToEpubMode> = { 'Reflowable text': 'text', 'Page images': 'images' }

const inputClass = 'w-full rounded-lg px-3 py-2 text-lg text-white bg-transparent outline-none placeholder:text-white/50'

export default function PdfToEpubPage() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<PdfToEpubMode>('text')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<(PdfToEpubResult & { mode: PdfToEpubMode }) | null>(null)

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
    setProgress(0)
    setStatus('')
    setTitle('')
    setAuthor('')
  }

  function handleFile(f: File) {
    if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') {
      setError('Please choose a .pdf file.')
      return
    }
    setFile(f)
    setTitle(f.name.replace(/\.pdf$/i, ''))
    setResult(null)
    setError('')
  }

  async function convert() {
    if (!file) return
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const res = await pdfToEpub(file, {
        mode,
        title: title.trim() || file.name.replace(/\.pdf$/i, ''),
        author: author.trim(),
        onProgress: (p, msg) => { setProgress(p); setStatus(msg) },
      })
      setResult({ ...res, mode })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. The PDF may be damaged or password-protected.')
    } finally {
      setBusy(false)
    }
  }

  const outName = file ? file.name.replace(/\.pdf$/i, '') + '.epub' : 'book.epub'

  return (
    <ToolLayout
      toolId="convertor-pdf-to-epub"
      title="PDF to EPUB Converter"
      description="Convert PDF files into EPUB eBooks right in your browser. Your file never leaves your device."
      category="convertor"
      iconName="BookText"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online PDF to EPUB Converter"
          about={
            <>
              <p className="text-lg leading-relaxed"><strong className="text-white">PDF to EPUB Converter</strong> turns a PDF into an EPUB eBook that opens in Apple Books, Kobo, Calibre, and most other eBook readers. Choose <strong className="text-white">Reflowable text</strong> to get an eBook whose text resizes to fit your screen, or <strong className="text-white">Page images</strong> to keep every page looking exactly like the original.</p>
              <p className="text-lg leading-relaxed">Reflowable mode extracts the text, detects headings and paragraphs, joins hyphenated line breaks, and splits the book into chapters with a table of contents. Page-image mode renders each page as a picture, which preserves layout, figures, and scanned documents but is not reflowable.</p>
              <p className="text-lg leading-relaxed">Want a PDF from an eBook instead? Use the <Link href="/convertor/epub-to-pdf" className="underline" style={{ color: 'var(--color-convertor)' }}>EPUB to PDF converter</Link>.</p>
              <p className="text-lg leading-relaxed">Everything runs <strong className="text-white">locally in your browser</strong>. Your PDF is <strong className="text-white">never uploaded</strong>, and there is no registration or watermark.</p>
            </>
          }
          useCases={[
            'Read a PDF on an eBook reader with adjustable font size.',
            'Convert a scanned PDF into an EPUB using page images.',
            'Turn a long report or paper into a chaptered eBook.',
            'Build an EPUB for a reader that does not support PDF.',
            'Archive a PDF with a table of contents and metadata.',
            'Read research papers and articles comfortably on a phone.',
            'Turn lecture notes or course packs into an eBook for Kobo, Apple Books, or Kindle apps.',
            'Convert your own manuscript or draft PDF into an EPUB for proofreading on a reader.',
            'Make a PDF manual easier to read with resizable text.',
            'Convert comics or slide decks to EPUB with page images mode.',
          ]}
          faqs={[
            { q: 'How do I convert PDF to EPUB online for free?', a: 'Drop your PDF onto the upload area, choose Reflowable text or Page images, set a title and author, click Convert to EPUB, and download the file. It is free and needs no account.' },
            { q: 'Which mode should I choose?', a: 'Use Reflowable text for text-heavy PDFs such as novels and articles. Use Page images for scanned PDFs, comics, slides, or layouts with many figures.' },
            { q: 'Why did reflowable mode say no text was found?', a: 'The PDF is probably a scan made of images. This tool does not perform OCR, so use Page images mode instead.' },
            { q: 'Is my PDF uploaded anywhere?', a: 'No. The PDF is processed entirely inside your browser, so it never leaves your device and no server is involved.' },
            { q: 'Does it work with multi-column PDFs?', a: 'Reflowable mode reads text line by line, so multi-column layouts and tables may come out in the wrong order. Page images mode keeps the layout intact.' },
            { q: 'Will the EPUB work on Kindle?', a: 'Modern Kindle devices and the Kindle app accept EPUB through Send to Kindle. Kobo, Apple Books, and most other eBook readers open EPUB directly.' },
            { q: 'Can I convert a password-protected PDF?', a: 'No. Remove the password first, then convert the unlocked PDF.' },
            { q: 'Can I convert an EPUB back to a PDF?', a: 'Yes, use the EPUB to PDF converter on this site.' },
          ]}
        />
      }
    >
      {!file ? (
        <FileDropZone
          onFile={handleFile}
          accept=".pdf,application/pdf"
          label="Drop a PDF or click to upload"
          hint="PDF files (.pdf)"
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
                <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Conversion mode</p>
                <Tabs
                  tabs={Object.values(MODE_LABELS)}
                  value={MODE_LABELS[mode]}
                  onChange={(label) => setMode(LABEL_TO_MODE[label])}
                />
                <p className="text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {mode === 'text'
                    ? 'Extracts text into chapters. Best for novels and articles; scanned PDFs have no text to extract.'
                    : 'Embeds each page as an image. Keeps the exact layout, but text is not reflowable and files are larger.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Title</span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Book title"
                    className={inputClass}
                    style={{ border: '2px solid var(--border-convertor)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-convertor)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-convertor-idle)')}
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Author (optional)</span>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className={inputClass}
                    style={{ border: '2px solid var(--border-convertor)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-convertor)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-convertor-idle)')}
                  />
                </label>
              </div>

              <button
                onClick={convert}
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white disabled:opacity-60 transition-opacity"
                style={{ background: 'var(--color-convertor)' }}
              >
                {busy ? <Loader2 size={18} className="animate-spin" /> : null}
                {busy ? 'Converting…' : 'Convert to EPUB'}
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
            <div
              className="rounded-xl p-5 space-y-4"
              style={{ background: 'var(--surface)', border: '2px solid var(--border-convertor)' }}
            >
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {result.pages} PDF pages → {result.chapters} {result.chapters === 1 ? 'chapter' : 'chapters'} · {formatBytes(result.blob.size)} · {MODE_LABELS[result.mode]}
              </p>
              {result.mode === 'text' && result.emptyTextPages > 0 && (
                <p className="text-base flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-text-tool)' }} />
                  {result.emptyTextPages} {result.emptyTextPages === 1 ? 'page has' : 'pages have'} no selectable text (images or scans) and will be blank. Use Page images mode to keep them.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => downloadBlob(result.blob, outName)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white"
                  style={{ background: 'var(--color-convertor)' }}
                >
                  <Download size={18} /> Download EPUB
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="text-base"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Convert again with different settings
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-base mt-4" style={{ color: '#f87171' }}>{error}</p>
      )}
    </ToolLayout>
  )
}
