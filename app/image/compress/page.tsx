'use client'

import { useState, useRef, useEffect } from 'react'
import { Download } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import { formatBytes, downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

export default function ImageCompressPage() {
  const [src, setSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [origSize, setOrigSize] = useState(0)
  const [origMime, setOrigMime] = useState('image/jpeg')
  const [quality, setQuality] = useState(80)
  const [output, setOutput] = useState('')
  const [outputSize, setOutputSize] = useState(0)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const srcRef = useRef('')
  const mimeRef = useRef('image/jpeg')
  const origSizeRef = useRef(0)

  function handleFile(file: File) {
    setFileName(file.name)
    setOrigSize(file.size)
    origSizeRef.current = file.size
    setOutput('')
    const mime = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
    setOrigMime(mime)
    mimeRef.current = mime
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
    const mime = mimeRef.current
    const originalFileSize = origSizeRef.current
    if (!canvas || !s) return
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL(mime, q / 100)
      const encodedSize = Math.round(atob(dataUrl.split(',')[1]).length)
      // If canvas re-encode is larger than original, use original src and report original size
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
    const ext = origMime.split('/')[1].replace('jpeg', 'jpg')
    const base = fileName.replace(/\.[^.]+$/, '')
    const binary = atob(output.split(',')[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: origMime }), `${base}-compressed.${ext}`)
  }

  useEffect(() => {
    if (!src) return
    const id = setTimeout(() => compress(quality), 120)
    return () => clearTimeout(id)
  }, [quality, src])

  const saved = origSize > 0 && outputSize > 0 ? Math.round((1 - outputSize / origSize) * 100) : 0

  return (
    <ToolLayout
      toolId="image-compress"
      title="Image Compressor"
      description="Reduce image file size using Canvas quality compression — no upload needed"
      category="image"
      iconName="Minimize2"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Image Compressor"
          about={`Reduce image file size quickly with our free online Image Compressor. Compress JPG (JPEG), PNG, and WebP images without installing software, making them easier to upload, share, and publish online.\n\nThis browser-based image compressor processes every image locally using the HTML5 Canvas API. Your files are never uploaded to a server, giving you complete privacy while providing fast compression directly on your device.\n\nSmaller image files help websites load faster, improve Core Web Vitals, reduce bandwidth usage, and create a better experience for visitors on desktop and mobile devices.`}
          useCasesTitle="Common Use Cases"
          useCasesIntro="Image compression is useful for many personal and professional tasks."
          useCases={[
            'Optimize product images for online stores',
            'Speed up blogs and websites',
            'Improve Google Core Web Vitals',
            'Reduce email attachment size',
            'Meet upload size restrictions',
            'Save storage space',
            'Share photos more quickly',
            'Optimize landing page hero images',
            'Prepare images for social media',
          ]}
          benefits={{
            title: 'Why Use This Image Compressor?',
            intro: 'Our image compression tool is designed for speed, privacy, and simplicity.',
            items: [
              'Compress JPG, PNG, and WebP images',
              'Reduce image file size without changing dimensions',
              'Adjustable compression quality',
              'Improve website loading speed',
              'Images never leave your device',
              'No registration required',
              'Works on Windows, macOS, Linux, Android, and iPhone',
              'Completely free to use',
            ],
          }}
          extraSections={[
            {
              title: 'Why Compress Images?',
              intro: 'Large image files slow down websites, consume more storage, and take longer to upload or download.\n\nCompressing images helps you:',
              items: [
                'Improve website performance',
                'Reduce bandwidth usage',
                'Increase page loading speed',
                'Improve mobile browsing experience',
                'Meet file size limits',
                'Save storage space',
                'Improve SEO through faster pages',
              ],
              closing: 'Image compression reduces file size while maintaining good visual quality for most everyday uses.',
            },
            {
              title: 'Supported Image Formats',
              intro: 'This image compressor supports the most common image formats.',
              items: ['JPG (JPEG)', 'PNG', 'WebP'],
              closing: 'Choose your preferred compression level and download the optimized image within seconds.',
            },
          ]}
          faqs={[
            { q: 'How does image compression work?', a: 'The tool re-encodes images using the HTML5 Canvas API at your selected quality level. Lower quality settings remove less noticeable image detail, significantly reducing file size while maintaining acceptable visual quality.' },
            { q: 'Will compression change my image dimensions?', a: 'No. Compression only reduces the file size. The image width and height remain exactly the same unless you resize the image separately.' },
            { q: 'Which image format compresses the most?', a: 'WebP generally produces the smallest file sizes while maintaining excellent visual quality. JPEG also compresses photographs efficiently, while PNG is often preferred for graphics and images with transparency.' },
            { q: 'Are my images uploaded to a server?', a: 'No. Every image is compressed locally inside your browser. Your files never leave your device.' },
            { q: 'Is there a file size limit?', a: 'The tool does not enforce a strict file size limit. However, very large images may take longer to process depending on your browser and available device memory.' },
            { q: 'Is this image compressor free?', a: 'Yes. You can compress images online for free without creating an account or installing software.' },
          ]}
          closing={<>Looking for a format-specific compressor? Try <a href="/image/compress-jpg" style={{ color: 'var(--color-image)', textDecoration: 'underline' }}>Compress JPG</a>, <a href="/image/compress-png" style={{ color: 'var(--color-image)', textDecoration: 'underline' }}>Compress PNG</a>, or <a href="/image/compress-webp" style={{ color: 'var(--color-image)', textDecoration: 'underline' }}>Compress WebP</a>.</>}
        />
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-5">
        {!src && <FileDropZone onFile={handleFile} hint="PNG, JPEG, WebP" />}

        {src && (
          <>
            {/* File info */}
            <div className="flex items-center gap-4 rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="source" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" style={{ border: '1px solid var(--border)' }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{fileName}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {dims.w} × {dims.h} px · {formatBytes(origSize)}
                </p>
              </div>
              <button onClick={() => { setSrc(''); setOutput('') }}
                className="ml-auto text-sm font-medium px-4 py-2 rounded-lg flex-shrink-0 transition-all"
                style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}>
                Change image
              </button>
            </div>

            {/* Quality slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Quality</label>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-image)', fontFamily: 'var(--font-geist-mono)' }}>{quality}%</span>
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
                {/* Before / After stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Original', value: formatBytes(origSize), color: 'rgba(255,255,255,0.75)' },
                    { label: 'Compressed', value: formatBytes(outputSize), color: 'var(--color-image)' },
                    { label: 'Saved', value: `${saved}%`, color: saved > 0 ? '#34d399' : '#f87171' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                      <div className="text-xl font-bold mb-0.5" style={{ color, fontFamily: 'var(--font-geist-mono)' }}>{value}</div>
                      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button onClick={downloadOutput}
                    className="flex items-center gap-2 px-10 py-3 rounded-xl text-base font-semibold"
                    style={{ background: 'var(--color-image)', color: '#000' }}>
                    <Download size={16} /> Download compressed
                  </button>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={output} alt="compressed" className="w-full rounded-xl object-contain"
                  style={{ border: '1px solid var(--border)', maxHeight: '320px' }} />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
