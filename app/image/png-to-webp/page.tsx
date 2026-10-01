'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function PngToWebpPage() {
  return (
    <ToolLayout
      toolId="image-png-to-webp"
      title="PNG to WebP Converter"
      description="Convert PNG images to WebP format free, fast, and in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This PNG to WebP Converter"
          about={<>
            <p className="text-lg leading-relaxed">Convert PNG images to WebP online for free. WebP offers excellent image quality with significantly smaller file sizes, making it one of the best formats for modern websites.</p>
            <p className="text-lg leading-relaxed">All conversions happen directly in your browser using the HTML5 Canvas API, so your images remain private and are never uploaded to a server.</p>
            <p className="text-lg leading-relaxed">WebP is widely supported by modern browsers and helps improve website loading speed by reducing image payloads.</p>
            <p className="text-lg leading-relaxed">Need to convert between other formats? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-image)' }}>Image Converter</Link> for more options.</p>
          </>}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Optimize website images',
            'Improve Core Web Vitals',
            'Reduce bandwidth usage',
            'Speed up page loading',
            'Convert transparent PNG graphics to WebP',
          ]}
          faqs={[
            { q: 'Does WebP support transparency?', a: 'Yes. WebP supports transparent backgrounds just like PNG.' },
            { q: 'Why convert PNG to WebP?', a: 'WebP usually delivers much smaller file sizes while maintaining comparable visual quality.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/webp" accept="image/png" hint="PNG only" />
    </ToolLayout>
  )
}
