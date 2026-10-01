'use client'

import { useState, useRef } from 'react'
import { Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import { formatBytes, downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

export default function ImageRotatePage() {
  const [src, setSrc] = useState('')
  const [fileName, setFileName] = useState('')
  const [origSize, setOrigSize] = useState(0)
  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [output, setOutput] = useState('')
  const [outputSize, setOutputSize] = useState(0)
  const [hoveredBtn, setHoveredBtn] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function handleFile(file: File) {
    setFileName(file.name)
    setOrigSize(file.size)
    setOutput('')
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
    const reader = new FileReader()
    reader.onload = (e) => {
      const s = e.target?.result as string
      setSrc(s)
      const img = new window.Image()
      img.onload = () => {
        setNaturalW(img.naturalWidth)
        setNaturalH(img.naturalHeight)
      }
      img.src = s
    }
    reader.readAsDataURL(file)
  }

  function rotate(deg: number) {
    setOutput('')
    setRotation((prev) => (prev + deg + 360) % 360)
  }

  function toggleFlipH() {
    setOutput('')
    setFlipH((v) => !v)
  }

  function toggleFlipV() {
    setOutput('')
    setFlipV((v) => !v)
  }

  function applyTransform() {
    const canvas = canvasRef.current
    if (!canvas || !src) return
    const img = new window.Image()
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180
      const cos = Math.abs(Math.cos(rad))
      const sin = Math.abs(Math.sin(rad))
      const outW = Math.round(img.naturalWidth * cos + img.naturalHeight * sin)
      const outH = Math.round(img.naturalWidth * sin + img.naturalHeight * cos)
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')!
      ctx.translate(outW / 2, outH / 2)
      ctx.rotate(rad)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
      const ext = fileName.split('.').pop()?.toLowerCase() ?? 'png'
      const mime =
        ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png'
      const dataUrl = canvas.toDataURL(mime, 0.95)
      setOutput(dataUrl)
      setOutputSize(Math.round(atob(dataUrl.split(',')[1]).length))
      const base = fileName.replace(/\.[^.]+$/, '')
      const binary = atob(dataUrl.split(',')[1])
      const arr = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
      downloadBlob(new Blob([arr], { type: mime }), `${base}-rotated.${ext}`)
    }
    img.src = src
  }

  function downloadOutput() {
    if (!output) return
    const ext = fileName.split('.').pop() ?? 'png'
    const base = fileName.replace(/\.[^.]+$/, '')
    const binary = atob(output.split(',')[1])
    const arr = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
    const mime = output.split(';')[0].split(':')[1]
    downloadBlob(new Blob([arr], { type: mime }), `${base}-rotated.${ext}`)
  }

  const isRotated = rotation % 180 !== 0
  const outW = isRotated ? naturalH : naturalW
  const outH = isRotated ? naturalW : naturalH

  const hasChanges = rotation !== 0 || flipH || flipV

  return (
    <ToolLayout
      toolId="image-rotate"
      title="Image Rotator"
      description="Rotate and flip images instantly — no server upload, no registration"
      category="image"
      iconName="RotateCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Image Rotator"
          about={
            <>
              <p className="text-lg leading-relaxed"><strong className="text-white">Image Rotator Online</strong> is a free, browser-based tool that lets you <strong className="text-white">rotate, flip, and mirror images</strong> in seconds without installing any software. Whether you need to rotate a photo by <strong className="text-white">90°, 180°, or 270°</strong>, flip an image horizontally or vertically, or fix the orientation of a picture taken on your phone, this tool provides a fast and secure solution.</p>
              <p className="text-lg leading-relaxed">Many photos captured on smartphones and digital cameras rely on <strong className="text-white">EXIF orientation metadata</strong> to display correctly. However, some websites, applications, or devices ignore this metadata, causing images to appear sideways or upside down. This Image Rotator permanently rotates the image pixels so your photos display correctly everywhere.</p>
              <p className="text-lg leading-relaxed">Our online image rotator supports popular image formats including <strong className="text-white">PNG, JPG (JPEG), and WebP</strong>, making it ideal for photographers, designers, students, businesses, and everyday users. Whether you&apos;re preparing images for social media, e-commerce, websites, presentations, or printed documents, you can quickly rotate or flip your images while maintaining excellent visual quality.</p>
              <p className="text-lg leading-relaxed">Unlike many online image editing tools, <strong className="text-white">all image processing happens locally inside your browser</strong> using the HTML5 Canvas API. Your images are <strong className="text-white">never uploaded to a server</strong>, ensuring complete privacy and security. No registration, software installation, or watermark is required—simply upload your image, rotate or flip it, and download the result instantly.</p>
            </>
          }
          useCasesTitle="Common Use Cases"
          useCases={[
            'Rotate photos taken sideways on smartphones.',
            'Fix upside-down images from digital cameras.',
            'Correct the orientation of scanned documents.',
            'Rotate receipts, invoices, and forms for easier reading.',
            'Flip images horizontally to create mirror effects.',
            'Flip images vertically for design or creative projects.',
            'Prepare product photos for Amazon, Shopify, Etsy, and other e-commerce platforms.',
            'Rotate profile pictures before uploading to social media.',
            'Adjust photos for Instagram, Facebook, LinkedIn, X (Twitter), Pinterest, and TikTok.',
            'Rotate screenshots before sharing them with teammates.',
            'Correct image orientation for websites and blogs.',
            'Prepare graphics for presentations and marketing materials.',
            'Rotate school assignments and educational documents.',
            'Create mirrored logos or artwork for printing.',
            'Rotate images before converting them to another format.',
            'Fix photos that display incorrectly because of EXIF orientation.',
            'Prepare images for email attachments and online forms.',
            'Edit images on desktop, tablet, or mobile devices without installing software.',
          ]}
          benefits={{
            title: 'Why Use This Image Rotator?',
            intro: 'Our Image Rotator is designed to be simple, fast, and reliable.',
            items: [
              <span key="1">Rotate images by <strong className="text-white">90°, 180°, or 270°</strong></span>,
              'Flip images horizontally or vertically',
              'Fix sideways and upside-down photos',
              'Preserve excellent image quality',
              'Browser-based processing with no uploads',
              'Works completely offline after the page loads',
              'No registration or account required',
              'No watermarks added to your images',
              'Supports PNG, JPG (JPEG), and WebP',
              'Fast processing using the HTML5 Canvas API',
              'Easy-to-use interface for beginners and professionals',
              'Compatible with Windows, macOS, Linux, Chromebook, Android, iPhone, and iPad',
            ],
          }}
          extraSections={[
            {
              title: 'Supported Image Formats',
              intro: 'This Image Rotator supports the most widely used image formats for web, business, and personal use.',
              items: [
                <span key="png"><strong className="text-white">PNG</strong> — Rotate PNG images while preserving transparency, making them ideal for logos, icons, graphics, and UI elements.</span>,
                <span key="jpg"><strong className="text-white">JPG (JPEG)</strong> — Rotate digital photos and camera images quickly while maintaining excellent visual quality.</span>,
                <span key="webp"><strong className="text-white">WebP</strong> — Rotate modern WebP images used on websites and applications for improved performance and smaller file sizes.</span>,
              ],
              closing: 'Simply upload your image, choose the desired rotation or flip option, preview the result, and download the rotated image in the supported output format.',
            },
          ]}
          faqs={[
            {
              q: 'What is an Image Rotator?',
              a: 'An Image Rotator is an online tool that changes the orientation of an image by rotating it clockwise or counterclockwise. Many tools also allow you to flip images horizontally or vertically to create mirrored versions.',
            },
            {
              q: 'How do I rotate an image online?',
              a: 'Upload your image, choose a rotation angle such as 90°, 180°, or 270°, or select a horizontal or vertical flip. Apply the changes and download the rotated image instantly.',
            },
            {
              q: 'Which image formats are supported?',
              a: 'This tool supports PNG, JPG (JPEG), and WebP images.',
            },
            {
              q: 'Can I rotate JPG images?',
              a: 'Yes. You can rotate JPG and JPEG images by 90°, 180°, or 270° while preserving excellent image quality.',
            },
            {
              q: 'Can I rotate PNG images?',
              a: 'Yes. PNG images can be rotated while preserving transparency, making them ideal for logos, graphics, and icons.',
            },
            {
              q: 'Can I rotate WebP images?',
              a: 'Yes. WebP images are fully supported and can be rotated or flipped without installing additional software.',
            },
            {
              q: 'What is the difference between rotating and flipping an image?',
              a: 'Rotating changes the orientation of an image by turning it clockwise or counterclockwise. Flipping creates a mirror image by reversing it horizontally or vertically.',
            },
            {
              q: 'Why are some photos displayed sideways?',
              a: 'Many smartphones save orientation information as EXIF metadata instead of physically rotating the image. Some websites and applications ignore this metadata, causing photos to appear sideways or upside down. Rotating the image permanently corrects the orientation.',
            },
            {
              q: 'Does rotating reduce image quality?',
              a: 'Rotating by 90°, 180°, or 270° rearranges the image pixels. If you save the image in a lossy format such as JPEG, repeated re-saving may slightly reduce quality due to compression. Formats like PNG use lossless compression and avoid these compression artifacts.',
            },
            {
              q: 'Is image transparency preserved?',
              a: 'Yes. PNG transparency is preserved when rotating or flipping supported PNG images.',
            },
            {
              q: 'Are my images uploaded to a server?',
              a: 'No. All image editing happens locally inside your browser using the HTML5 Canvas API. Your images never leave your device, ensuring complete privacy.',
            },
            {
              q: 'Can I use this tool on my phone?',
              a: 'Yes. The Image Rotator works in modern browsers on Android, iPhone, and iPad, as well as on desktop devices running Windows, macOS, Linux, and ChromeOS.',
            },
            {
              q: 'Can I use this tool offline?',
              a: 'Yes. After the webpage has loaded, image rotation and flipping are processed locally in your browser without requiring an active internet connection.',
            },
            {
              q: 'Do I need to install software?',
              a: 'No. This is a browser-based Image Rotator. There is nothing to install, and no account is required.',
            },
            {
              q: 'Is this Image Rotator free?',
              a: 'Yes. You can rotate and flip images online for free without registration, subscriptions, or hidden fees.',
            },
            {
              q: 'Why should I use this Image Rotator?',
              a: 'This Image Rotator offers a fast, secure, and convenient way to fix image orientation, rotate photos, flip graphics, and prepare pictures for websites, social media, e-commerce, school projects, and professional work. Because everything is processed locally in your browser, your images remain private while you enjoy quick, high-quality results.',
            },
          ]}
        />
      }
    >
      <canvas ref={canvasRef} className="hidden" />
      <div className="space-y-5">
        {!src && <FileDropZone onFile={handleFile} />}

        {src && (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <span className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Output:{' '}
                <span className="text-white font-mono">
                  {outW} × {outH} px
                </span>
              </span>
              <div className="flex gap-2">
                {/* Reset */}
                <button
                  onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); setOutput('') }}
                  onMouseEnter={() => setHoveredBtn('reset')}
                  onMouseLeave={() => setHoveredBtn('')}
                  className="flex items-center gap-1.5 text-base font-medium px-4 py-2 rounded-lg transition-all active:scale-95"
                  style={{
                    background: hoveredBtn === 'reset' ? 'rgba(255,255,255,0.15)' : 'var(--surface-hover)',
                    border: '2px solid var(--border-image)',
                    color: '#fff',
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
                {/* Change image */}
                <button
                  onClick={() => { setSrc(''); setOutput('') }}
                  onMouseEnter={() => setHoveredBtn('change')}
                  onMouseLeave={() => setHoveredBtn('')}
                  className="text-base font-medium px-4 py-2 rounded-lg transition-all active:scale-95"
                  style={{
                    background: hoveredBtn === 'change' ? 'var(--color-image)' : 'var(--color-image-dim)',
                    border: '1px solid var(--color-image)',
                    color: hoveredBtn === 'change' ? '#000' : 'var(--color-image)',
                  }}
                >
                  Change image
                </button>
              </div>
            </div>

            {/* Preview */}
            <div
              className="flex items-center justify-center rounded-xl overflow-hidden"
              style={{ border: '2px solid var(--border-image-idle)', background: 'var(--surface)', minHeight: '240px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="preview"
                className="object-contain transition-transform duration-300"
                style={{
                  maxHeight: '380px',
                  maxWidth: '100%',
                  transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                }}
                draggable={false}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => rotate(-90)}
                onMouseEnter={() => setHoveredBtn('rotL')}
                onMouseLeave={() => setHoveredBtn('')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all active:scale-95"
                style={{
                  background: hoveredBtn === 'rotL' ? 'var(--surface-hover)' : 'var(--surface)',
                  border: `1px solid ${hoveredBtn === 'rotL' ? 'var(--color-image)' : 'var(--border-hover)'}`,
                  color: hoveredBtn === 'rotL' ? '#fff' : 'rgba(255,255,255,0.9)',
                }}
              >
                <RotateCcw size={16} /> Rotate 90° Left
              </button>
              <button
                onClick={() => rotate(90)}
                onMouseEnter={() => setHoveredBtn('rotR')}
                onMouseLeave={() => setHoveredBtn('')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all active:scale-95"
                style={{
                  background: hoveredBtn === 'rotR' ? 'var(--surface-hover)' : 'var(--surface)',
                  border: `1px solid ${hoveredBtn === 'rotR' ? 'var(--color-image)' : 'var(--border-hover)'}`,
                  color: hoveredBtn === 'rotR' ? '#fff' : 'rgba(255,255,255,0.9)',
                }}
              >
                <RotateCw size={16} /> Rotate 90° Right
              </button>
              <button
                onClick={() => rotate(180)}
                onMouseEnter={() => setHoveredBtn('rot180')}
                onMouseLeave={() => setHoveredBtn('')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all active:scale-95"
                style={{
                  background: hoveredBtn === 'rot180' ? 'var(--surface-hover)' : 'var(--surface)',
                  border: `1px solid ${hoveredBtn === 'rot180' ? 'var(--color-image)' : 'var(--border-hover)'}`,
                  color: hoveredBtn === 'rot180' ? '#fff' : 'rgba(255,255,255,0.9)',
                }}
              >
                <RotateCw size={16} /> Rotate 180°
              </button>
              <button
                onClick={toggleFlipH}
                onMouseEnter={() => setHoveredBtn('flipH')}
                onMouseLeave={() => setHoveredBtn('')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all active:scale-95"
                style={{
                  background: flipH ? 'var(--color-image-dim)' : hoveredBtn === 'flipH' ? 'var(--surface-hover)' : 'var(--surface)',
                  border: `1px solid ${flipH || hoveredBtn === 'flipH' ? 'var(--color-image)' : 'var(--border-hover)'}`,
                  color: flipH ? 'var(--color-image)' : hoveredBtn === 'flipH' ? '#fff' : 'rgba(255,255,255,0.9)',
                }}
              >
                <FlipHorizontal size={16} /> Flip Horizontal
              </button>
              <button
                onClick={toggleFlipV}
                onMouseEnter={() => setHoveredBtn('flipV')}
                onMouseLeave={() => setHoveredBtn('')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all active:scale-95"
                style={{
                  background: flipV ? 'var(--color-image-dim)' : hoveredBtn === 'flipV' ? 'var(--surface-hover)' : 'var(--surface)',
                  border: `1px solid ${flipV || hoveredBtn === 'flipV' ? 'var(--color-image)' : 'var(--border-hover)'}`,
                  color: flipV ? 'var(--color-image)' : hoveredBtn === 'flipV' ? '#fff' : 'rgba(255,255,255,0.9)',
                }}
              >
                <FlipVertical size={16} /> Flip Vertical
              </button>
            </div>

            {/* Apply & Download button */}
            <div className="flex justify-center">
              <button
                onClick={applyTransform}
                disabled={!hasChanges}
                onMouseEnter={() => hasChanges && setHoveredBtn('apply')}
                onMouseLeave={() => setHoveredBtn('')}
                className="px-10 py-3 rounded-xl text-lg font-semibold transition-all active:scale-95"
                style={{
                  background: hasChanges
                    ? hoveredBtn === 'apply' ? 'color-mix(in srgb, var(--color-image) 85%, #fff)' : 'var(--color-image)'
                    : 'var(--surface)',
                  color: hasChanges ? '#000' : 'rgba(255,255,255,0.3)',
                  border: hasChanges ? 'none' : '1px solid var(--border)',
                  cursor: hasChanges ? 'pointer' : 'not-allowed',
                }}
              >
                Apply &amp; Download
              </button>
            </div>

            {/* Output */}
            {output && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {outW} × {outH} px ·{' '}
                    <span className="text-white">{formatBytes(outputSize)}</span>
                    <span className="ml-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      (original: {formatBytes(origSize)})
                    </span>
                  </span>
                  <button
                    onClick={downloadOutput}
                    onMouseEnter={() => setHoveredBtn('dl')}
                    onMouseLeave={() => setHoveredBtn('')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-lg font-semibold transition-all active:scale-95"
                    style={{
                      background: hoveredBtn === 'dl' ? 'color-mix(in srgb, var(--color-image) 85%, #fff)' : 'var(--color-image)',
                      color: '#000',
                    }}
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={output}
                  alt="rotated"
                  className="w-full rounded-xl object-contain"
                  style={{ border: '2px solid var(--border-image-idle)', maxHeight: '320px' }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  )
}
