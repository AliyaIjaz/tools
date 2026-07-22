'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function JpgToWebpPage() {
  return (
    <ToolLayout
      toolId="image-jpg-to-webp"
      title="JPG to WebP Converter"
      description="Convert JPG images to WebP format free, fast, and in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This JPG to WebP Converter"
          about={<>
            <p className="text-base leading-relaxed">Convert JPG (JPEG) images to WebP online to reduce file size while maintaining excellent image quality. WebP is designed for modern websites and can help improve page loading speed without noticeably affecting image appearance.</p>
            <p className="text-base leading-relaxed">This converter processes every image locally in your browser, keeping your files private and eliminating upload delays.</p>
            <p className="text-base leading-relaxed">Need to convert between other formats? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-image)' }}>Image Converter</Link> for more options.</p>
          </>}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Improve website performance',
            'Optimize blog images',
            'Reduce bandwidth usage',
            'Speed up mobile websites',
            'Convert product photos for e-commerce',
          ]}
          faqs={[
            { q: 'Why is WebP better than JPG?', a: 'WebP often achieves similar visual quality at a smaller file size, making it ideal for websites.' },
            { q: 'Will image quality change?', a: 'Visual quality is usually maintained, although compression settings can influence the final result.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/webp" accept="image/jpeg" hint="JPEG / JPG only" />
    </ToolLayout>
  )
}
