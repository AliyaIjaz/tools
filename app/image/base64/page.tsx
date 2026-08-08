'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import FileDropZone from '@/components/ui/FileDropZone'
import Tabs from '@/components/ui/Tabs'
import { formatBytes, downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

export default function ImageBase64Page() {
  const [tab, setTab] = useState('Encode')

  // Encode state
  const [imgSrc, setImgSrc] = useState('')
  const [dataUrl, setDataUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)

  // Decode state
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeError, setDecodeError] = useState('')
  const [decodedSrc, setDecodedSrc] = useState('')

  function handleFile(file: File) {
    setFileName(file.name)
    setFileSize(file.size)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      // Strip any whitespace from the base64 portion to ensure a valid data URL
      const [prefix, b64] = result.split(',')
      const clean = `${prefix},${b64.replace(/\s/g, '')}`
      setImgSrc(clean)
      setDataUrl(clean)
    }
    reader.readAsDataURL(file)
  }

  function handleDecode() {
    setDecodeError('')
    const val = decodeInput.trim()
    if (!val) return
    try {
      // Accept raw base64 or full data URL
      const src = val.startsWith('data:') ? val : `data:image/png;base64,${val}`
      // Validate it's actually an image
      const img = new window.Image()
      img.onload = () => setDecodedSrc(src)
      img.onerror = () => setDecodeError('Invalid Base64 image data')
      img.src = src
    } catch {
      setDecodeError('Invalid Base64 string')
    }
  }

  function downloadDecoded() {
    if (!decodedSrc) return
    const parts = decodedSrc.split(',')
    const mime = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png'
    const ext = mime.split('/')[1] ?? 'png'
    const binary = atob(parts[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: mime }), `decoded-image.${ext}`)
  }

  return (
    <ToolLayout
      toolId="image-base64"
      title="Image → Base64"
      description="Convert images to Base64 data URLs, or decode Base64 back to an image"
      category="image"
      iconName="ImageIcon"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Image to Base64 Converter"
          about={`Convert images to Base64 strings or decode Base64 back into images instantly with our free online Image to Base64 Converter. Upload an image to generate a Base64-encoded data URL, or paste an existing Base64 string to preview and decode the original image—all directly in your browser.

Unlike many online converters, this tool processes everything locally using the HTML5 File API. Your images and Base64 data are never uploaded to a server, ensuring complete privacy while providing fast, secure conversion.

The tool supports popular image formats including PNG, JPG (JPEG), WebP, GIF, BMP, TIFF, AVIF, HEIC, HEIF, ICO, and SVG (if supported by your browser). Whether you're embedding images into HTML, CSS, JSON, or sending them through APIs, this tool makes Base64 encoding and decoding simple.`}
          useCasesTitle="Why Use This Image to Base64 Converter?"
          useCasesIntro="Our browser-based Base64 converter is designed for developers, designers, and anyone who needs to quickly encode or decode image data."
          useCases={[
            'Convert images to Base64 instantly',
            'Decode Base64 strings back into images',
            'Generate complete Base64 Data URLs',
            'Copy Base64 strings with one click',
            'Preview decoded images before downloading',
            'Images never leave your device',
            'No registration or software installation required',
            'Works on Windows, macOS, Linux, Android, and iPhone',
          ]}
          extraSections={[
            {
              title: 'Common Use Cases',
              intro: 'This Base64 image converter is useful in many web development and software projects.',
              items: [
                'Embed icons directly into CSS using Data URLs',
                'Inline images inside HTML documents',
                'Include images inside JSON configuration files',
                'Send images through REST or GraphQL APIs',
                'Store images in databases as Base64 strings',
                'Verify Base64 image data received from APIs',
                'Decode Base64 images for debugging',
                'Create self-contained HTML email templates',
                'Embed small assets into JavaScript applications',
                'Eliminate additional HTTP requests for small images',
              ],
            },
            {
              title: 'Supported Image Formats',
              intro: 'You can convert and preview many commonly used image formats.',
              items: ['PNG', 'JPG (JPEG)', 'WebP', 'GIF', 'BMP', 'TIFF', 'AVIF', 'HEIC / HEIF', 'ICO', 'SVG (browser support may vary)'],
              closing: 'Output is generated as a valid Base64 Data URL that can be used directly in HTML, CSS, JavaScript, or APIs.',
            },
            {
              title: 'What Is Base64 Encoding?',
              intro: `Base64 is a method of converting binary data, such as an image, into plain text. Instead of storing image bytes directly, Base64 represents the image using letters, numbers, and symbols that can safely be transmitted through text-based systems.

A Base64 image is commonly stored as a Data URL, which includes both the image type and the encoded image data.

Example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...

Modern web browsers can display this string directly without requiring a separate image file.`,
              items: [],
            },
            {
              title: 'Why Use Base64 Images?',
              intro: 'Base64 images are commonly used when developers need to embed images directly into source code or transmit them through text-based systems.',
              items: [
                'Reduce HTTP requests for small images',
                'Create self-contained HTML files',
                'Embed images inside CSS stylesheets',
                'Send images through APIs',
                'Store images in JSON documents',
                'Simplify email template development',
                'Improve portability of small assets',
              ],
              closing: 'For small icons and logos, Base64 encoding can simplify deployment because no separate image files are required.',
            },
            {
              title: 'Base64 vs Image Files',
              intro: 'Both approaches have advantages depending on your project.',
              items: [
                'Use Base64 when: Embedding small icons, creating HTML email templates, sending images through APIs, packaging assets into a single file, eliminating additional HTTP requests',
                'Use Regular Image Files when: Working with large photographs, optimizing website performance, caching images in browsers, improving maintainability, sharing downloadable image files',
              ],
              closing: 'Large images are generally better served as separate image files because Base64 encoding increases the overall data size.',
            },
            {
              title: 'Does Base64 Increase File Size?',
              intro: 'Yes. Base64 encoding increases the size of the original binary data by approximately 33%. Although the encoded string is larger, Base64 can still improve performance in certain situations by eliminating additional HTTP requests for very small images.',
              items: [],
              closing: 'For large images, using standard image files is usually the better option.',
            },
            {
              title: 'Who Uses This Tool?',
              intro: 'This Image to Base64 Converter is useful for many professionals.',
              items: [
                'Front-end Developers',
                'Full-stack Developers',
                'Web Designers',
                'Software Engineers',
                'Mobile App Developers',
                'API Developers',
                'DevOps Engineers',
                'UI/UX Designers',
                'Email Template Developers',
                'Students learning web development',
              ],
            },
          ]}
          faqs={[
            { q: 'What is a Base64 Data URL?', a: 'A Base64 Data URL combines an image\'s MIME type with its Base64-encoded content into a single string. Browsers can display Data URLs directly without downloading a separate image file. Example: data:image/png;base64,...' },
            { q: 'Which image formats are supported?', a: 'This tool supports PNG, JPG (JPEG), WebP, GIF, BMP, TIFF, AVIF, HEIC, HEIF, ICO, and SVG, depending on browser capabilities.' },
            { q: 'Can I convert Base64 back into an image?', a: 'Yes. Simply paste a Base64 string into the decoder to instantly preview the decoded image. You can then download it if your tool supports exporting.' },
            { q: 'Does Base64 reduce image quality?', a: 'No. Base64 encoding changes only how the image is represented as text. The image quality remains exactly the same because no visual information is lost during encoding or decoding.' },
            { q: 'Will Base64 increase image size?', a: 'Yes. The encoded string is approximately 33% larger than the original binary image. Base64 is most suitable for small images where reducing HTTP requests provides a greater benefit than the increase in size.' },
            { q: 'Are my images uploaded anywhere?', a: 'No. All encoding and decoding happens locally inside your browser using the HTML5 File API. Your images and Base64 strings never leave your device.' },
            { q: 'Can browsers display Base64 images?', a: 'Yes. Modern browsers fully support Base64 Data URLs inside HTML, CSS, and JavaScript. Example uses include <img src="data:image/png;base64,...">, CSS background-image, inline SVG, and HTML email templates.' },
            { q: 'Is this Image to Base64 Converter free?', a: 'Yes. The tool is completely free to use. There are no upload limits, no account required, and no software to install.' },
          ]}
        />
      }
    >
      <div className="space-y-5">
        <Tabs tabs={['Encode', 'Decode']} value={tab} onChange={(t) => { setTab(t) }} />

        {tab === 'Encode' && (
          <>
            {!dataUrl && <FileDropZone onFile={handleFile} />}
            {dataUrl && (
              <>
                <div className="flex items-center gap-4 rounded-xl p-3" style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSrc} alt="preview" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" style={{ border: '2px solid var(--border-image-idle)' }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fileName}</p>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{formatBytes(fileSize)}</p>
                  </div>
                  <button
                    onClick={() => { setDataUrl(''); setImgSrc(''); setFileName('') }}
                    className="ml-auto text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
                  >
                    Change image
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Data URL <span style={{ color: 'rgba(255,255,255,0.6)' }}>({formatBytes(dataUrl.length)} string)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadBlob(new Blob([dataUrl], { type: 'text/plain' }), `${fileName}.txt`)}
                        className="text-sm font-medium px-3 py-1.5 rounded-md transition-all"
                        style={{ background: 'var(--surface-hover)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.75)' }}
                      >
                        Download .txt
                      </button>
                      <CopyButton text={dataUrl} />
                    </div>
                  </div>
                  <textarea
                    readOnly
                    value={dataUrl}
                    rows={5}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-y outline-none"
                    style={{
                      background: 'var(--surface)',
                      border: '2px solid var(--border-image-idle)',
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      lineHeight: '1.6',
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Raw Base64 only
                    </label>
                    <CopyButton text={dataUrl.split(',')[1] ?? ''} />
                  </div>
                  <textarea
                    readOnly
                    value={dataUrl.split(',')[1] ?? ''}
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-y outline-none"
                    style={{
                      background: 'var(--surface)',
                      border: '2px solid var(--border-image-idle)',
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      lineHeight: '1.6',
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}

        {tab === 'Decode' && (
          <>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Paste Base64 or data URL
              </label>
              <textarea
                value={decodeInput}
                onChange={(e) => { setDecodeInput(e.target.value); setDecodeError(''); setDecodedSrc('') }}
                rows={5}
                placeholder="data:image/png;base64,iVBORw0KGgo… or raw base64"
                className="w-full rounded-xl px-4 py-3 text-sm resize-y outline-none placeholder:text-white/50"
                style={{
                  background: 'var(--surface)',
                  border: '2px solid var(--border-image-idle)',
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  lineHeight: '1.6',
                }}
              />
            </div>

            <button
              onClick={handleDecode}
              disabled={!decodeInput.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
              style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
            >
              Decode
            </button>

            {decodeError && (
              <p className="text-sm" style={{ color: '#f87171' }}>{decodeError}</p>
            )}

            {decodedSrc && (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={decodedSrc} alt="decoded" className="max-w-full rounded-xl" style={{ border: '2px solid var(--border-image-idle)', maxHeight: '320px', objectFit: 'contain' }} />
                <button
                  onClick={downloadDecoded}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
                >
                  <Download size={13} /> Download image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
