'use client'

import { useState, useRef, useEffect } from 'react'
import { Download } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import { formatBytes, downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

export default function CompressJpgPage() {
  const [src, setSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [origSize, setOrigSize] = useState(0)
  const [quality, setQuality] = useState(80)
  const [output, setOutput] = useState('')
  const [outputSize, setOutputSize] = useState(0)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const srcRef = useRef('')
  const origSizeRef = useRef(0)

  function handleFile(file: File) {
    setFileName(file.name)
    setOrigSize(file.size)
    origSizeRef.current = file.size
    setOutput('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const s = e.target?.result as string
      srcRef.current = s
      setSrc(s)
      const img = new window.Image()
      img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = s
    }
    reader.readAsDataURL(file)
  }

  function compress(q: number) {
    const canvas = canvasRef.current
    const s = srcRef.current
    const originalFileSize = origSizeRef.current
    if (!canvas || !s) return
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', q / 100)
      const encodedSize = Math.round(atob(dataUrl.split(',')[1]).length)
      if (encodedSize >= originalFileSize) {
        setOutput(s)
        setOutputSize(originalFileSize)
      } else {
        setOutput(dataUrl)
        setOutputSize(encodedSize)
      }
    }
    img.src = s
  }

  function downloadOutput() {
    if (!output) return
    const base = fileName.replace(/\.[^.]+$/, '')
    const binary = atob(output.split(',')[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: 'image/jpeg' }), `${base}-compressed.jpg`)
  }

  useEffect(() => {
    if (!src) return
    const id = setTimeout(() => compress(quality), 120)
    return () => clearTimeout(id)
  }, [quality, src])

  const saved = origSize > 0 && outputSize > 0 ? Math.round((1 - outputSize / origSize) * 100) : 0

  return (
    <ToolLayout
      toolId="image-compress-jpg"
      title="Compress JPG Online"
      description="Reduce JPG file size in your browser — no upload needed"
      category="image"
      iconName="Minimize2"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free JPG Compressor"
          about={`Reduce JPG file size instantly with our free online JPG compressor. Upload your JPEG image, adjust the quality slider, and download a smaller file — all inside your browser without installing any software.\n\nEvery image is processed locally using the HTML5 Canvas API. Your JPG files are never sent to a server, so your photos stay completely private.\n\nSmaller JPG files load faster on websites, reduce bandwidth usage, and make sharing and uploading easier.`}
          useCasesTitle="Common Use Cases"
          useCasesIntro="JPG compression is useful across many everyday tasks."
          useCases={[
            'Reduce photo file size before emailing or sharing',
            'Optimize product photos for online stores',
            'Speed up blog posts and news articles with smaller images',
            'Meet upload size limits on forms and platforms',
            'Improve Google Core Web Vitals on image-heavy pages',
            'Save storage space on devices and cloud services',
            'Prepare photos for social media uploads',
          ]}
          benefits={{
            title: 'Why Use This JPG Compressor?',
            intro: 'Built for speed, privacy, and simplicity.',
            items: [
              'Compress JPG and JPEG images instantly',
              'Adjustable quality slider for fine control',
              'File size never changes dimensions',
              'Images processed entirely in your browser',
              'No account or registration required',
              'Works on Windows, macOS, Linux, Android, and iPhone',
              'Completely free to use',
            ],
          }}
          extraSections={[
            {
              title: 'Why Compress JPG Images?',
              intro: 'JPG is the most widely used image format for photos, but uncompressed or lightly compressed JPGs can be very large.\n\nCompressing your JPGs helps you:',
              items: [
                'Reduce page load times',
                'Lower bandwidth usage',
                'Improve mobile browsing experience',
                'Meet file size upload limits',
                'Save storage on your device or server',
                'Improve SEO scores through faster pages',
              ],
              closing: 'JPEG compression is lossy, meaning some fine detail is removed — but at quality levels of 70–85%, the difference is barely visible to the human eye.',
            },
          ]}
          faqs={[
            { q: 'What is the difference between JPG and JPEG?', a: 'JPG and JPEG refer to the same image format. JPG became common because early Windows file systems required 3-character extensions. They are identical in every other way.' },
            { q: 'Will compressing a JPG reduce its quality?', a: 'JPEG uses lossy compression, so lowering quality does remove some image detail. At settings of 70–85%, the difference is typically not noticeable for photos and everyday images.' },
            { q: 'Will compression change my image dimensions?', a: 'No. Compression only reduces the file size. The pixel width and height stay exactly the same.' },
            { q: 'Are my JPG files uploaded to a server?', a: 'No. Every image is compressed locally inside your browser using the HTML5 Canvas API. Your files never leave your device.' },
            { q: 'Is there a file size limit?', a: 'There is no strict limit. Very large images may take longer to process depending on your device memory and browser.' },
            { q: 'Is this tool free?', a: 'Yes. You can compress JPG images online for free without signing up or installing anything.' },
          ]}
          closing={<>Need to compress PNG or WebP too? Use the <a href="/image/compress" style={{ color: 'var(--color-image)', textDecoration: 'underline' }}>Image Compressor</a> to handle all formats in one place.</>}
        />
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-5">
        {!src && <FileDropZone onFile={handleFile} hint="JPG / JPEG" accept="image/jpeg" />}

        {src && (
          <>
            <div className="flex items-center gap-4 rounded-xl p-3" style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="source" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" style={{ border: '2px solid var(--border-image-idle)' }} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-white truncate">{fileName}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {dims.w} × {dims.h} px · {formatBytes(origSize)}
                </p>
              </div>
              <button onClick={() => { setSrc(''); setOutput('') }}
                className="ml-auto text-sm px-4 py-2 rounded-lg flex-shrink-0 transition-all"
                style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'rgba(255,255,255,0.65)' }}>
                Change image
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Quality</label>
                <span className="text-base font-mono font-semibold" style={{ color: 'var(--color-image)' }}>{quality}%</span>
              </div>
              <input type="range" min={10} max={100} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-white" />
              <div className="flex justify-between mt-1">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Smaller file</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Higher quality</span>
              </div>
            </div>

            {output && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Original', value: formatBytes(origSize), color: 'rgba(255,255,255,0.75)' },
                    { label: 'Compressed', value: formatBytes(outputSize), color: 'var(--color-image)' },
                    { label: 'Saved', value: `${saved}%`, color: saved > 0 ? '#34d399' : '#f87171' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}>
                      <div className="text-xl font-bold mb-0.5 font-mono" style={{ color }}>{value}</div>
                      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button onClick={downloadOutput}
                    className="flex items-center gap-2 px-10 py-3 rounded-xl text-base font-semibold"
                    style={{ background: 'var(--color-image)', color: '#000' }}>
                    <Download size={16} /> Download compressed JPG
                  </button>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={output} alt="compressed" className="w-full rounded-xl object-contain"
                  style={{ border: '2px solid var(--border-image-idle)', maxHeight: '320px' }} />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
