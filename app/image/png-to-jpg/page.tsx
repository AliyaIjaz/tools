'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function PngToJpgPage() {
  return (
    <ToolLayout
      toolId="image-png-to-jpg"
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG format free, fast, and in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="PNG to JPG Converter Online"
          about={<>
            <p className="text-lg leading-relaxed">Convert PNG images to JPG (JPEG) online for free in just a few clicks. This browser-based PNG to JPG converter quickly changes your image format while reducing file size, making images easier to upload, share, and use on websites.</p>
            <p className="text-lg leading-relaxed">Unlike many online converters, all processing happens locally in your browser using the HTML5 Canvas API. Your images are never uploaded to a server, ensuring complete privacy and fast conversion.</p>
            <p className="text-lg leading-relaxed">PNG files are ideal for graphics and transparent images, while JPG is better suited for photographs and situations where smaller file sizes are important. If your PNG contains transparency, transparent areas are automatically replaced with a white background because JPG does not support transparency.</p>
            <p className="text-lg leading-relaxed">Need to convert between other formats? Try the <Link href="/image/convert" className="underline" style={{ color: 'var(--color-image)' }}>Image Converter</Link> for more options.</p>
          </>}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Reduce image file size',
            'Upload photos to websites that require JPG',
            'Convert screenshots for email sharing',
            'Prepare images for social media',
            'Improve compatibility with older software',
          ]}
          faqs={[
            { q: 'Does PNG to JPG remove transparency?', a: 'Yes. JPG does not support transparent backgrounds. Transparent pixels are replaced with white during conversion.' },
            { q: 'Will converting reduce file size?', a: 'In most cases, yes. JPG uses lossy compression, which typically produces smaller files than PNG.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/jpeg" accept="image/png" hint="PNG only" />
    </ToolLayout>
  )
}
