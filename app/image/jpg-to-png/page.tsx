'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function JpgToPngPage() {
  return (
    <ToolLayout
      toolId="image-jpg-to-png"
      title="JPG to PNG Converter"
      description="Convert JPG images to PNG format free, fast, and in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This JPG to PNG Converter"
          about={<>
            <p className="text-lg leading-relaxed">Convert JPG (JPEG) images to PNG online without installing any software. This free browser-based converter lets you change image formats instantly while keeping your files private because everything happens on your device.</p>
            <p className="text-lg leading-relaxed">PNG is commonly used for graphics, logos, illustrations, screenshots, and images that benefit from lossless quality. While converting a JPG to PNG does not restore lost image quality, it allows future editing without introducing additional JPEG compression.</p>
            <p className="text-lg leading-relaxed">Need to convert between other formats? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-image)' }}>Image Converter</Link> for more options.</p>
          </>}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Convert photos to PNG',
            'Edit images without repeated JPEG compression',
            'Prepare graphics for design software',
            'Create images for presentations',
            'Improve compatibility with applications that prefer PNG',
          ]}
          faqs={[
            { q: 'Will JPG to PNG improve image quality?', a: 'No. Converting to PNG cannot recover details already lost through JPEG compression, but it prevents further quality loss when saving future edits.' },
            { q: 'Does PNG support transparency?', a: 'Yes. However, converting a JPG does not automatically create a transparent background.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/png" accept="image/jpeg" hint="JPEG / JPG only" />
    </ToolLayout>
  )
}
