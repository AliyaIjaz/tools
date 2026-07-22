'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function WebpToPngPage() {
  return (
    <ToolLayout
      toolId="image-webp-to-png"
      title="WebP to PNG Converter"
      description="Convert WebP images to PNG format free, fast, and in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This WebP to PNG Converter"
          about={<>
            <p className="text-base leading-relaxed">Convert WebP images to PNG online quickly and securely. This free tool is perfect for opening WebP images in software that doesn&apos;t fully support the format or when you need a lossless PNG file.</p>
            <p className="text-base leading-relaxed">Everything happens locally inside your browser, ensuring your images remain private throughout the conversion process.</p>
            <p className="text-base leading-relaxed">PNG is widely supported across image editors, design software, and operating systems.</p>
            <p className="text-base leading-relaxed">Need to convert between other formats? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-image)' }}>Image Converter</Link> for more options.</p>
          </>}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Edit WebP images in Photoshop or other editors',
            'Share images with older applications',
            'Preserve transparency',
            'Create graphics for presentations',
            'Convert downloaded WebP images',
          ]}
          faqs={[
            { q: 'Will transparency be preserved?', a: 'Yes. PNG fully supports transparency, so transparent WebP images remain transparent after conversion.' },
            { q: 'Why convert WebP to PNG?', a: 'PNG provides broad compatibility and is ideal when editing images or working with software that doesn\'t fully support WebP.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/png" accept="image/webp" hint="WebP only" />
    </ToolLayout>
  )
}
