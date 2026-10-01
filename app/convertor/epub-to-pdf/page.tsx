'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, Loader2, RotateCcw, AlertTriangle } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import SeoSection from '@/components/ui/SeoSection'
import { formatBytes, downloadBlob } from '@/lib/utils'
import { epubToPdf, EpubToPdfResult } from '@/lib/convertors/epubToPdf'

export default function EpubToPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<EpubToPdfResult | null>(null)

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
    setProgress(0)
    setStatus('')
  }

  function handleFile(f: File) {
    if (!/\.epub$/i.test(f.name)) {
      setError('Please choose an .epub file.')
      return
    }
    setFile(f)
    setResult(null)
    setError('')
  }

  async function convert() {
    if (!file) return
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const res = await epubToPdf(file, (p, msg) => { setProgress(p); setStatus(msg) })
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. The file may be damaged or DRM-protected.')
    } finally {
      setBusy(false)
    }
  }

  const outName = file ? file.name.replace(/\.epub$/i, '') + '.pdf' : 'book.pdf'

  return (
    <ToolLayout
      toolId="convertor-epub-to-pdf"
      title="EPUB to PDF Converter"
      description="Convert EPUB eBooks to PDF right in your browser. Your file never leaves your device."
      category="convertor"
      iconName="BookOpen"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online EPUB to PDF Converter"
          about={
            <>
              <p className="text-lg leading-relaxed"><strong className="text-white">EPUB to PDF Converter</strong> turns EPUB eBooks into PDF documents you can print, share, or read on any device. It reads the book&apos;s chapters in order and rebuilds them as clean A4 pages with a cover, title page, headings, paragraphs, lists, and images.</p>
              <p className="text-lg leading-relaxed">The whole conversion runs <strong className="text-white">locally in your browser</strong>. Your eBook is <strong className="text-white">never uploaded</strong> to a server, and there is no registration, watermark, or file-size paywall.</p>
              <p className="text-lg leading-relaxed">Need to go the other way? Try the <Link href="/convertor/pdf-to-epub" className="underline" style={{ color: 'var(--color-convertor)' }}>PDF to EPUB converter</Link> to turn a PDF into an eBook for Kindle, Kobo, or Apple Books.</p>
              <p className="text-lg leading-relaxed">PDFs created here use standard Latin fonts, so books in languages such as Chinese, Japanese, Arabic, or Russian will lose characters the PDF fonts cannot display. DRM-protected eBooks (for example from Kindle or Adobe Digital Editions) cannot be converted.</p>
            </>
          }
          useCases={[
            'Print an EPUB as a paper copy.',
            'Share a book with someone whose device has no EPUB reader.',
            'Read eBooks on a device that only opens PDFs.',
            'Archive eBooks in a universally supported format.',
            'Annotate an eBook with PDF markup tools.',
            'Convert textbooks and course readings to PDF for note-taking apps.',
            'Send an eBook by email to a colleague or classmate.',
            'Open an EPUB on a work computer where you cannot install reader software.',
            'Create a PDF copy of your own self-published book for review.',
            'Convert public-domain EPUBs from Project Gutenberg or Standard Ebooks to PDF.',
          ]}
          faqs={[
            { q: 'How do I convert EPUB to PDF online for free?', a: 'Drop your .epub file onto the upload area, click Convert to PDF, and download the result. It is free, needs no account, and adds no watermark.' },
            { q: 'Is my eBook uploaded anywhere?', a: 'No. The EPUB is read and converted entirely inside your browser, so it never leaves your device and no server is involved.' },
            { q: 'Will the PDF look exactly like the EPUB?', a: 'Not exactly. EPUB is reflowable, so the converter lays out text and images on fixed A4 pages using standard fonts. Custom fonts and CSS styling from the EPUB are not carried over.' },
            { q: 'Why are some characters missing?', a: 'Standard PDF fonts cover Latin (Western European) characters only. Other scripts, such as Chinese, Japanese, Arabic, or Cyrillic, are skipped, and the converter tells you how many characters were dropped.' },
            { q: 'Can I convert DRM-protected eBooks?', a: 'No. Encrypted EPUBs, including most purchased Kindle and Adobe Digital Editions books, cannot be read by this tool.' },
            { q: 'Does it work on iPhone and Android?', a: 'Yes. It runs in any modern mobile browser, though very large eBooks convert faster on a computer.' },
            { q: 'Is there a file size limit?', a: 'There is no fixed limit, because everything happens on your device. Very large books with many images depend on your browser memory and can take longer.' },
            { q: 'Can I convert a PDF back into an EPUB?', a: 'Yes, use the PDF to EPUB converter on this site. You can choose reflowable text or page images.' },
          ]}
        />
      }
    >
      {!file ? (
        <FileDropZone
          onFile={handleFile}
          accept=".epub,application/epub+zip"
          label="Drop an EPUB or click to upload"
          hint="EPUB eBooks (.epub)"
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
            <button
              onClick={convert}
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white disabled:opacity-60 transition-opacity"
              style={{ background: 'var(--color-convertor)' }}
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : null}
              {busy ? 'Converting…' : 'Convert to PDF'}
            </button>
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
              <div>
                <p className="text-lg font-semibold text-white">{result.title}</p>
                <p className="text-base mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {result.pages} pages · {result.chapters} sections · {formatBytes(result.blob.size)}
                </p>
              </div>
              {result.droppedChars > 0 && (
                <p className="text-base flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-text-tool)' }} />
                  {result.droppedChars.toLocaleString()} characters outside the Latin character set could not be included in the PDF.
                </p>
              )}
              <button
                onClick={() => downloadBlob(result.blob, outName)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-lg font-semibold text-white"
                style={{ background: 'var(--color-convertor)' }}
              >
                <Download size={18} /> Download PDF
              </button>
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
