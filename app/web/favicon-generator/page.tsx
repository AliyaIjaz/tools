'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import { downloadBlob } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

const SIZES = [16, 32, 48, 64, 128, 256]

type Preview = { size: number; dataUrl: string }

export default function FaviconGeneratorPage() {
  const [previews, setPreviews] = useState<Preview[]>([])
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        const results: Preview[] = SIZES.map((size) => {
          const canvas = document.createElement('canvas')
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, size, size)
          return { size, dataUrl: canvas.toDataURL('image/png') }
        })
        setPreviews(results)
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function downloadSize(preview: Preview) {
    const byteStr = atob(preview.dataUrl.split(',')[1])
    const arr = new Uint8Array(byteStr.length)
    for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i)
    downloadBlob(new Blob([arr], { type: 'image/png' }), `favicon-${preview.size}x${preview.size}.png`)
  }

  async function downloadAll() {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const p of previews) {
      const byteStr = atob(p.dataUrl.split(',')[1])
      const arr = new Uint8Array(byteStr.length)
      for (let i = 0; i < byteStr.length; i++) arr[i] = byteStr.charCodeAt(i)
      zip.file(`favicon-${p.size}x${p.size}.png`, arr)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, 'favicons.zip')
  }

  return (
    <ToolLayout
      toolId="favicon-generator"
      title="Favicon Generator"
      description="Resize any image into favicon PNGs at multiple sizes"
      seoContent={
        <SeoSection
          aboutTitle="Favicon Generator Online"
          about={<>
            <p className="text-base leading-relaxed">Create high-quality website favicons from any image with this free Favicon Generator. Upload a PNG, JPEG, or WebP image and instantly generate favicon PNG files in all standard sizes, including 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256 pixels. Download each favicon individually or save the complete favicon set in one click.</p>
            <p className="text-base leading-relaxed">Everything is processed locally in your browser. Your images are never uploaded, making the tool fast, private, and secure.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-1">What Is a Favicon?</h3>
            <p className="text-base leading-relaxed">A favicon (short for favorite icon) is the small icon that represents a website in browser tabs, bookmarks, browser history, address bars, and shortcuts. It helps users quickly recognize your website and strengthens your brand identity.</p>
            <p className="text-base leading-relaxed">Favicons are an essential part of every modern website. They improve the user experience by making your site easier to identify when multiple browser tabs are open and provide icons for mobile devices, Progressive Web Apps (PWAs), and pinned shortcuts.</p>
            <p className="text-base leading-relaxed">Instead of creating multiple favicon sizes manually in image editing software, this online Favicon Generator automatically creates all commonly used PNG favicon sizes from a single source image.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Generated Favicon Sizes</h3>
            <p className="text-base leading-relaxed mb-2">The tool creates favicon PNG files in the following standard sizes:</p>
            <table className="w-full text-sm border-collapse" style={{ borderColor: 'var(--border)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-1.5 pr-4 font-medium text-white">Size</th>
                  <th className="text-left py-1.5 font-medium text-white">Common Use</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(255,255,255,0.75)' }}>
                {[
                  ['16 × 16', 'Browser tabs and bookmarks'],
                  ['32 × 32', 'Browser shortcuts and desktop bookmarks'],
                  ['48 × 48', 'Windows shortcuts and application icons'],
                  ['64 × 64', 'High-DPI displays and larger browser icons'],
                  ['128 × 128', 'Progressive Web Apps and desktop applications'],
                  ['256 × 256', 'High-resolution icons and web app assets'],
                ].map(([size, use]) => (
                  <tr key={size} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-1.5 pr-4 font-mono">{size}</td>
                    <td className="py-1.5">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Supported Image Formats</h3>
            <p className="text-base leading-relaxed"><strong className="text-white">PNG</strong> — Recommended because it supports transparent backgrounds and produces the highest-quality favicon images.</p>
            <p className="text-base leading-relaxed"><strong className="text-white">JPEG</strong> — Fully supported, making it easy to convert existing logos or photographs into favicon PNG files.</p>
            <p className="text-base leading-relaxed"><strong className="text-white">WebP</strong> — Modern WebP images can also be uploaded and are automatically converted into PNG favicon files.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">How to Use</h3>
            <ol className="space-y-1.5 list-decimal list-inside" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <li className="text-base">Upload a PNG, JPEG, or WebP image.</li>
              <li className="text-base">Preview the source image.</li>
              <li className="text-base">The tool automatically generates all standard favicon sizes.</li>
              <li className="text-base">Download individual PNG files or the complete favicon set.</li>
              <li className="text-base">Add the generated files to your website.</li>
            </ol>
            <p className="text-base leading-relaxed mt-2">No installation or registration is required.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">How to Add a Favicon to Your Website</h3>
            <p className="text-base leading-relaxed">After generating your favicon, upload it to your website and reference it in the <code className="text-sm font-mono px-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>&lt;head&gt;</code> section of your HTML document.</p>
            <pre className="text-sm rounded-lg p-3 mt-2 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '2px solid var(--border-web-idle)' }}>{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`}</pre>
            <p className="text-base leading-relaxed mt-2">For Apple devices:</p>
            <pre className="text-sm rounded-lg p-3 mt-2 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '2px solid var(--border-web-idle)' }}>{`<link rel="apple-touch-icon" href="/apple-touch-icon.png">`}</pre>
            <p className="text-base leading-relaxed mt-2">If your site uses a Web App Manifest:</p>
            <pre className="text-sm rounded-lg p-3 mt-2 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '2px solid var(--border-web-idle)' }}>{`{
  "icons": [
    {
      "src": "/favicon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}`}</pre>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Why Use a Favicon Generator?</h3>
            <p className="text-base leading-relaxed">Creating favicon images manually often requires multiple exports and image editing software. This tool automatically generates all commonly used favicon sizes from one source image, saving time while ensuring consistent quality.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Browser Compatibility</h3>
            <p className="text-base leading-relaxed">PNG favicons are supported by all modern browsers, including Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, and Opera. Modern browsers no longer require .ico files for favicon support. PNG favicons are sufficient for nearly all current websites. Only very old versions of Internet Explorer rely on the .ico format.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Apple Touch Icons &amp; Progressive Web Apps</h3>
            <p className="text-base leading-relaxed">In addition to browser favicons, websites often use larger icons for mobile devices and installed web apps. Apple Touch Icons are displayed when users add a website to the iPhone or iPad home screen. Progressive Web Apps (PWAs) use application icons in their web app manifest to provide a native app-like experience. Generating multiple favicon sizes helps prepare assets for these modern web platforms.</p>
            <h3 className="text-base font-semibold text-white mt-4 mb-2">Tips for Better Favicons</h3>
          </>}
          useCasesTitle="Features"
          useCases={[
            'Generate favicon PNG files instantly',
            'Supports PNG, JPEG, and WebP input',
            'Creates multiple favicon sizes automatically',
            'Download individual sizes or the complete set',
            'High-quality image scaling',
            'Preserves image transparency (PNG input)',
            'Perfect for websites, blogs, and web apps',
            'Great for Progressive Web Apps (PWAs)',
            'Supports Apple Touch Icons',
            'No registration required',
            'Free to use',
            'Works in all modern browsers',
            'Runs entirely in your browser',
          ]}
          benefits={{
            title: 'Tips for Better Favicons',
            items: [
              'Start with a high-resolution source image.',
              'Use simple shapes and bold designs.',
              'Avoid small text that becomes unreadable at 16×16 pixels.',
              'Use transparent backgrounds when appropriate.',
              'Keep the design recognizable at small sizes.',
              'Test your favicon in multiple browsers.',
            ],
          }}
          extraSections={[
            {
              title: 'Common Use Cases',
              items: [
                'Creating a favicon for a new website',
                'Converting a company logo into favicon files',
                'Building icons for Progressive Web Apps',
                'Creating Apple Touch Icons',
                'Updating an existing website favicon',
                'Creating icons for web applications',
                'Preparing website branding assets',
                'Creating browser tab icons',
                'Building portfolio websites',
                'Creating ecommerce store icons',
                'Creating blog favicons',
                'Preparing icons for startup websites',
              ],
            },
            {
              title: 'Benefits',
              intro: 'Creating favicon images manually often requires multiple exports and image editing software. This tool automatically generates all commonly used favicon sizes from one source image, saving time while ensuring consistent quality.',
              items: [
                'Faster website setup',
                'Consistent icon quality',
                'Multiple sizes generated automatically',
                'Better branding',
                'Improved browser compatibility',
                'No image editing software required',
                'Privacy-focused browser processing',
              ],
            },
          ]}
          faqs={[
            { q: 'What is a favicon?', a: 'A favicon is a small website icon displayed in browser tabs, bookmarks, browser history, and shortcuts. It helps visitors quickly recognize your website.' },
            { q: 'Which favicon sizes are generated?', a: 'The tool generates PNG favicon files at 16×16, 32×32, 48×48, 64×64, 128×128, and 256×256 pixels. These sizes cover most modern browser and web application requirements.' },
            { q: 'What image formats can I upload?', a: 'You can upload PNG, JPEG, or WebP images. All generated favicon files are exported as PNG images.' },
            { q: 'Does the tool preserve transparency?', a: 'Yes. PNG images with transparent backgrounds retain their transparency in the generated favicon files.' },
            { q: 'Do I need an ICO file?', a: 'Most modern browsers support PNG favicons directly, so an .ico file is usually unnecessary. The .ico format is mainly relevant for legacy versions of Internet Explorer.' },
            { q: 'Can I use these icons for Progressive Web Apps?', a: 'Yes. The generated PNG files can be used as part of a PWA icon set. Depending on your application\'s requirements, you may also need additional larger icon sizes (such as 192×192 or 512×512) for your web app manifest.' },
            { q: 'Can I use the generated favicon on WordPress?', a: 'Yes. The generated PNG files can be uploaded to WordPress, Joomla, Drupal, Shopify, Wix, Squarespace, and virtually any other website platform.' },
            { q: 'How do I add a favicon to HTML?', a: 'Upload the generated PNG file to your website and reference it with a <link rel="icon"> tag inside the <head> section of your HTML document.' },
            { q: 'Is this Favicon Generator free?', a: 'Yes. The tool is completely free to use and works entirely in your browser without registration or downloads.' },
          ]}
        />
      }
      category="web"
      iconName="Star"
      showAllCategory
    >
      <div className="space-y-6">
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="w-full rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all py-14"
          style={{
            border: `2px dashed ${dragging ? 'var(--color-web)' : 'var(--color-web)'}`,
            background: dragging ? 'var(--color-web-dim)' : 'rgba(16,185,129,0.04)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-full p-3"
            style={{ background: 'var(--color-web-dim)', border: '1px solid var(--color-web)' }}
          >
            <Upload size={22} style={{ color: 'var(--color-web)' }} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-white">
              {fileName || 'Drop an image or click to upload'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              PNG, JPEG, WebP — square images work best
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]) }}
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Generated favicons</p>
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: 'var(--color-web)', color: '#000' }}
              >
                <Download size={14} /> Download all (.zip)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((p) => (
                <div
                  key={p.size}
                  className="rounded-xl p-4 flex flex-col items-center gap-3"
                  style={{ background: 'var(--surface)', border: '2px solid var(--border-web)' }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: 80,
                      height: 80,
                      background: 'rgba(255,255,255,0.08)',
                      border: '2px solid var(--border-web-idle)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.dataUrl}
                      alt={`${p.size}x${p.size}`}
                      style={{ width: Math.min(p.size, 72), height: Math.min(p.size, 72), imageRendering: p.size <= 32 ? 'pixelated' : 'auto' }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">{p.size}×{p.size}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>PNG</p>
                  </div>
                  <button
                    onClick={() => downloadSize(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium w-full justify-center transition-all"
                    style={{ background: 'var(--color-web-dim)', border: '1px solid var(--color-web)', color: 'var(--color-web)' }}
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
