'use client'

import Link from 'next/link'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'
import ImageConverter from '@/components/ui/ImageConverter'

export default function ImageConvertPage() {
  return (
    <ToolLayout
      toolId="image-convert"
      title="Image Converter"
      description="Convert images between PNG, JPEG, and WebP formats in your browser"
      category="image"
      iconName="RefreshCw"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Image Converter"
          about={`Convert images between PNG, JPEG (JPG), and WebP quickly with our free online image converter. Whether you need to change an image format for a website, reduce file size, preserve transparency, or improve compatibility, this tool makes the process simple and secure.\n\nUnlike many online converters, all image conversion happens directly in your browser using the HTML5 Canvas API. Your images are never uploaded to a server, ensuring complete privacy while providing fast, instant conversions.\n\nConvert PNG to JPG, JPG to PNG, PNG to WebP, WebP to PNG, JPG to WebP, and more with just a few clicks.`}
          useCasesTitle="Common Use Cases"
          useCasesIntro="People convert image formats for many different reasons, including:"
          useCases={[
            'Reducing image file size for websites',
            'Improving website performance with WebP images',
            'Sharing photos with applications that require JPEG',
            'Preserving transparency using PNG',
            'Making WebP images compatible with older software',
            'Uploading images to content management systems (CMS)',
            'Preparing product images for online stores',
            'Optimizing images for email, presentations, and documents',
          ]}
          benefits={{
            title: 'Why Use This Image Converter?',
            intro: 'Our browser-based image converter is designed for speed, privacy, and convenience.',
            items: [
              'Convert PNG, JPEG (JPG), and WebP images',
              'No software installation required',
              'Images never leave your device',
              'Fast browser-based processing',
              'Free to use with no registration',
              'Works on Windows, macOS, Linux, Android, and iPhone',
              'Maintain high image quality during conversion',
              'Perfect for websites, social media, documents, and design projects',
            ],
          }}
          extraSections={[
            {
              title: 'Supported Image Conversions',
              intro: 'This tool supports all common conversions between the most popular image formats, including:',
              items: [
                <Link key="png-to-jpg" href="/image/png-to-jpg" className="underline" style={{ color: 'var(--color-image)' }}>PNG to JPG</Link>,
                <Link key="jpg-to-png" href="/image/jpg-to-png" className="underline" style={{ color: 'var(--color-image)' }}>JPG to PNG</Link>,
                <Link key="png-to-webp" href="/image/png-to-webp" className="underline" style={{ color: 'var(--color-image)' }}>PNG to WebP</Link>,
                <Link key="webp-to-png" href="/image/webp-to-png" className="underline" style={{ color: 'var(--color-image)' }}>WebP to PNG</Link>,
                <Link key="jpg-to-webp" href="/image/jpg-to-webp" className="underline" style={{ color: 'var(--color-image)' }}>JPG to WebP</Link>,
                <Link key="webp-to-jpg" href="/image/webp-to-jpg" className="underline" style={{ color: 'var(--color-image)' }}>WebP to JPG</Link>,
                <Link key="jpeg-to-png" href="/image/jpg-to-png" className="underline" style={{ color: 'var(--color-image)' }}>JPEG to PNG</Link>,
                <Link key="png-to-jpeg" href="/image/png-to-jpg" className="underline" style={{ color: 'var(--color-image)' }}>PNG to JPEG</Link>,
              ],
              closing: 'These conversions cover most everyday needs for web development, graphic design, blogging, e-commerce, and digital publishing.',
            },
            {
              title: 'Understanding Image Formats',
              intro: (
                <div className="space-y-3">
                  <p className="text-lg leading-relaxed">Each image format has its own strengths.</p>
                  <div>
                    <p className="text-lg font-semibold text-white">PNG</p>
                    <p className="text-lg leading-relaxed">Best for graphics, logos, icons, screenshots, and images with transparent backgrounds.</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">JPEG (JPG)</p>
                    <p className="text-lg leading-relaxed">Ideal for photographs and large images where smaller file size is important.</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">WebP</p>
                    <p className="text-lg leading-relaxed">Designed for the modern web, WebP offers excellent image quality with significantly smaller file sizes than JPEG or PNG in many situations, making pages load faster.</p>
                  </div>
                </div>
              ),
              items: [],
            },
          ]}
          faqs={[
            { q: 'Does converting to JPEG remove transparency?', a: 'Yes. JPEG does not support transparent backgrounds. When converting a PNG or WebP image with transparency to JPEG, transparent areas are automatically replaced with a solid background, usually white.' },
            { q: 'Which image format is best for websites?', a: 'WebP is generally the best choice for modern websites because it provides excellent image quality while keeping file sizes smaller than PNG or JPEG, helping pages load faster.' },
            { q: 'Are my images uploaded to a server?', a: 'No. Every conversion takes place locally in your browser using the HTML5 Canvas API. Your images never leave your device, ensuring complete privacy.' },
            { q: 'Will converting reduce image quality?', a: 'Most conversions preserve good visual quality. However, converting to JPEG may introduce some compression because JPEG uses lossy compression. PNG and WebP may retain more detail depending on the source image and settings.' },
            {
              q: 'Which image format should I choose?',
              a: (
                <ul className="space-y-1.5 mt-1">
                  <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />Choose PNG for transparency, logos, and graphics.</li>
                  <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />Choose JPEG for photographs and smaller file sizes.</li>
                  <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />Choose WebP for websites and better overall compression.</li>
                </ul>
              ),
            },
            { q: 'Is this image converter free?', a: 'Yes. You can convert images online for free without creating an account or installing software.' },
          ]}
        />
      }
    >
      <ImageConverter defaultTarget="image/png" />
    </ToolLayout>
  )
}
