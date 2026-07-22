'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function WebpToJpgPage() {
  return (
    <ToolLayout
      toolId="image-webp-to-jpg"
      title="WebP to JPG Converter"
      description="Convert WebP images to JPG format free, fast, and in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This WebP to JPG Converter"
          about={<>
            <p className="text-base leading-relaxed">Convert WebP images to JPG (JPEG) online for free. This browser-based converter makes it easy to use WebP images with software, websites, and devices that work better with JPEG files.</p>
            <p className="text-base leading-relaxed">Your images are processed entirely within your browser using the HTML5 Canvas API, ensuring complete privacy without uploading files to a server.</p>
            <p className="text-base leading-relaxed">JPG is one of the most widely supported image formats and is ideal for sharing photos, email attachments, and compatibility with older applications.</p>
            <p className="text-base leading-relaxed">Need to convert between other formats? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-image)' }}>Image Converter</Link> for more options.</p>
          </>}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Open WebP images in older software',
            'Share photos by email',
            'Upload images to platforms requiring JPG',
            'Convert downloaded WebP files',
            'Improve compatibility across devices',
          ]}
          faqs={[
            { q: 'Does WebP to JPG remove transparency?', a: 'Yes. JPEG does not support transparency. Transparent areas are replaced with a white background during conversion.' },
            { q: 'Why convert WebP to JPG?', a: 'JPEG offers excellent compatibility with image editors, websites, printers, and older devices that may not fully support WebP.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/jpeg" accept="image/webp" hint="WebP only" />
    </ToolLayout>
  )
}
