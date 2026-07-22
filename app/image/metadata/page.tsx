'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import FileDropZone from '@/components/ui/FileDropZone'
import CopyButton from '@/components/ui/CopyButton'
import { formatBytes } from '@/lib/utils'
import SeoSection from '@/components/ui/SeoSection'

type MetaEntry = { label: string; value: string }
type MetaGroup = { title: string; entries: MetaEntry[] }

function gcd(w: number, h: number): string {
  let a = w, b = h
  while (b) { const t = b; b = a % b; a = t }
  return `${w / a}:${h / a}`
}

function formatGps(lat: number, lon: number) {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lonDir = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lon).toFixed(6)}° ${lonDir}`
}

function formatExposure(val: number) {
  if (val >= 1) return `${val}s`
  return `1/${Math.round(1 / val)}s`
}

export default function ImageMetadataPage() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [groups, setGroups] = useState<MetaGroup[]>([])
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | null>(null)

  async function handleFile(file: File) {
    setFileName(file.name)
    setGpsCoords(null)
    setGroups([])

    // Read data URL for preview + get image dimensions
    const src = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
    setPreview(src)

    const imgDims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new window.Image()
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
      img.src = src
    })

    const basic: MetaEntry[] = [
      { label: 'File name', value: file.name },
      { label: 'File size', value: formatBytes(file.size) },
      { label: 'MIME type', value: file.type || 'Unknown' },
      { label: 'Last modified', value: new Date(file.lastModified).toLocaleString() },
    ]

    const dimensions: MetaEntry[] = [
      { label: 'Width', value: `${imgDims.w} px` },
      { label: 'Height', value: `${imgDims.h} px` },
      { label: 'Aspect ratio', value: gcd(imgDims.w, imgDims.h) },
      { label: 'Megapixels', value: `${(imgDims.w * imgDims.h / 1_000_000).toFixed(2)} MP` },
    ]

    const newGroups: MetaGroup[] = [
      { title: 'File Info', entries: basic },
      { title: 'Image Properties', entries: dimensions },
    ]

    // Parse EXIF directly from the File object (no FileReader dependency)
    try {
      const exifr = (await import('exifr')).default
      const exif = await exifr.parse(file, {
        tiff: true, exif: true, gps: true, iptc: false, xmp: false,
        translateKeys: true, translateValues: true, reviveValues: true,
      })

      if (exif) {
        const camera: MetaEntry[] = []
        if (exif.Make) camera.push({ label: 'Camera make', value: String(exif.Make) })
        if (exif.Model) camera.push({ label: 'Camera model', value: String(exif.Model) })
        if (exif.LensMake) camera.push({ label: 'Lens make', value: String(exif.LensMake) })
        if (exif.LensModel) camera.push({ label: 'Lens model', value: String(exif.LensModel) })
        if (exif.Software) camera.push({ label: 'Software', value: String(exif.Software) })
        if (camera.length) newGroups.push({ title: 'Camera Information', entries: camera })

        const capture: MetaEntry[] = []
        if (exif.DateTimeOriginal) capture.push({ label: 'Date taken', value: new Date(exif.DateTimeOriginal).toLocaleString() })
        if (exif.ExposureTime != null) capture.push({ label: 'Exposure time', value: formatExposure(exif.ExposureTime) })
        if (exif.FNumber != null) capture.push({ label: 'Aperture', value: `f/${exif.FNumber}` })
        if (exif.ISO != null) capture.push({ label: 'ISO', value: String(exif.ISO) })
        if (exif.FocalLength != null) capture.push({ label: 'Focal length', value: `${exif.FocalLength} mm` })
        if (exif.FocalLengthIn35mmFormat != null) capture.push({ label: 'Focal length (35mm)', value: `${exif.FocalLengthIn35mmFormat} mm` })
        if (exif.ExposureProgram) capture.push({ label: 'Exposure program', value: String(exif.ExposureProgram) })
        if (exif.MeteringMode) capture.push({ label: 'Metering mode', value: String(exif.MeteringMode) })
        if (exif.WhiteBalance != null) capture.push({ label: 'White balance', value: exif.WhiteBalance === 0 ? 'Auto' : 'Manual' })
        if (exif.Flash != null) capture.push({ label: 'Flash', value: String(exif.Flash) })
        if (exif.Orientation) capture.push({ label: 'Orientation', value: String(exif.Orientation) })
        if (capture.length) newGroups.push({ title: 'Photo Metadata', entries: capture })

        const gps: MetaEntry[] = []
        if (exif.latitude != null && exif.longitude != null) {
          setGpsCoords({ lat: exif.latitude, lon: exif.longitude })
          gps.push({ label: 'Coordinates', value: formatGps(exif.latitude, exif.longitude) })
        }
        if (exif.GPSAltitude != null) gps.push({ label: 'Altitude', value: `${Math.round(exif.GPSAltitude)} m` })
        if (exif.GPSSpeed != null) gps.push({ label: 'GPS speed', value: `${exif.GPSSpeed} km/h` })
        if (exif.GPSImgDirection != null) gps.push({ label: 'Direction', value: `${Math.round(exif.GPSImgDirection)}°` })
        if (gps.length) newGroups.push({ title: 'GPS Metadata', entries: gps })
      }
    } catch {
      // EXIF not present or not parseable for this file type
    }

    setGroups(newGroups)
  }

  const allText = groups.map(g =>
    `${g.title}\n${g.entries.map(e => `  ${e.label}: ${e.value}`).join('\n')}`
  ).join('\n\n')

  return (
    <ToolLayout
      toolId="image-metadata"
      title="Image Metadata Viewer"
      description="View EXIF data, camera info, GPS metadata, and image properties — all in your browser"
      category="image"
      iconName="Info"
      showAllCategory
      seoContent={
        <SeoSection
          aboutTitle="About This Image Metadata Viewer"
          about={`View complete image metadata instantly with our free online EXIF viewer. Upload any JPEG, PNG, TIFF, or HEIC file to see file properties, pixel dimensions, embedded EXIF data, camera information, photo metadata, and GPS coordinates — all processed locally in your browser.\n\nThis tool reads the full EXIF metadata embedded by cameras and smartphones, including camera make and model, lens information, shutter speed, aperture, ISO, focal length, and the exact date and time the photo was taken. For geotagged photos, GPS metadata is extracted and displayed with a direct link to view the location on a map.\n\nIn addition to EXIF metadata, the tool also displays important image properties such as file size, image dimensions, aspect ratio, megapixels, and file format.\n\nAll processing happens entirely inside your browser using the HTML5 File API. Your images are never uploaded to any server, ensuring complete privacy.`}
          benefits={{
            title: 'Who Uses This Tool?',
            intro: 'This image metadata viewer is useful for:',
            items: [
              'Photographers checking EXIF data and camera settings',
              'Web developers auditing image assets',
              'Journalists and researchers verifying photo authenticity',
              'Privacy-conscious users checking for GPS data before sharing',
              'Designers confirming image dimensions and format',
              'Forensic analysts examining image properties',
              'Content creators and marketing teams',
              'Students learning about digital photography',
            ],
          }}
          useCasesTitle="Common Use Cases"
          useCasesIntro="This EXIF viewer and image metadata tool is useful for many tasks."
          useCases={[
            'View camera make, model, and lens information from a photo',
            'Check GPS metadata and location embedded in geotagged images',
            'Find the exact date and time a photo was taken',
            'Verify shutter speed, aperture, and ISO from a JPEG file',
            'Audit image dimensions and file size before uploading',
            'Strip or confirm privacy-sensitive GPS data before sharing',
            'Check image orientation and megapixel count',
            'Identify the software used to edit or export an image',
          ]}
          extraSections={[
            {
              title: 'What EXIF Data Is Shown?',
              intro: 'This tool reads and displays all major EXIF metadata fields embedded in your image:',
              items: [
                'Camera make and model (e.g. Apple iPhone 15 Pro, Canon EOS R5)',
                'Lens make and model',
                'Shutter speed / exposure time',
                'Aperture (f-number)',
                'ISO sensitivity',
                'Focal length (actual and 35mm equivalent)',
                'Exposure program and metering mode',
                'White balance and flash status',
                'Date and time the photo was taken',
                'GPS coordinates, altitude, and direction',
                'Image orientation',
                'Software used to process or export the image',
              ],
            },
          ]}
          faqs={[
            { q: 'What is EXIF data?', a: 'EXIF (Exchangeable Image File Format) is metadata automatically embedded in photos by cameras and smartphones. It records camera settings, lens details, date/time, and sometimes GPS location at the moment the photo was taken.' },
            { q: 'Which file formats support EXIF?', a: 'EXIF is most commonly found in JPEG and TIFF files. HEIC files from iPhones also contain EXIF data. PNG files generally do not carry EXIF metadata.' },
            { q: 'Why is no EXIF data shown for my image?', a: 'Some images have had their EXIF metadata removed — this is common with images downloaded from social media platforms, which strip metadata for privacy. PNG files also typically contain no EXIF.' },
            { q: 'Does the image get uploaded anywhere?', a: 'No. The browser reads the file locally using the File API and the exifr library. Nothing is sent to any server.' },
            { q: 'Can I see the GPS location on a map?', a: 'Yes. If the image contains GPS metadata, a link to view the coordinates on Google Maps is displayed alongside the latitude and longitude.' },
            { q: 'Does viewing EXIF metadata change my image?', a: 'No. The tool only reads metadata stored inside the image file. It never modifies the image or its metadata.' },
            { q: 'Is this tool free?', a: 'Yes. There are no limits, no account required, and no software to install.' },
          ]}
        />
      }
    >
      <div className="space-y-5">
        {!preview && <FileDropZone onFile={handleFile} />}

        {preview && (
          <>
            <div className="flex items-start gap-4 rounded-xl p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" style={{ border: '1px solid var(--border)' }} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-white truncate">{fileName}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {groups[0]?.entries.find(e => e.label === 'File size')?.value}
                  {' · '}
                  {groups[0]?.entries.find(e => e.label === 'MIME type')?.value}
                </p>
              </div>
              <button
                onClick={() => { setPreview(''); setGroups([]); setFileName(''); setGpsCoords(null) }}
                className="ml-auto text-sm font-medium px-4 py-2 rounded-lg flex-shrink-0 transition-all"
                style={{ background: 'var(--color-image-dim)', border: '1px solid var(--color-image)', color: 'var(--color-image)' }}
              >
                Change image
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {groups.length} section{groups.length !== 1 ? 's' : ''} · {groups.reduce((n, g) => n + g.entries.length, 0)} fields
              </span>
              <CopyButton text={allText} label="Copy all" />
            </div>

            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.title} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="px-4 py-2.5" style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{group.title}</p>
                  </div>
                  {group.entries.map(({ label, value }, i) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3 gap-4"
                      style={{
                        background: i % 2 === 0 ? 'var(--surface)' : 'rgba(255,255,255,0.02)',
                        borderBottom: i < group.entries.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <span className="text-sm flex-shrink-0" style={{ color: 'rgba(255,255,255,0.65)', minWidth: '150px' }}>{label}</span>
                      <div className="flex items-center gap-2 ml-auto min-w-0">
                        {label === 'Coordinates' && gpsCoords ? (
                          <a
                            href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-right underline underline-offset-2"
                            style={{ color: 'var(--color-image)' }}
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-sm font-mono text-white text-right truncate">{value}</span>
                        )}
                        <CopyButton text={value} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
