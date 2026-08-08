'use client'

import { useState, useCallback } from 'react'
import { ArrowRight } from 'lucide-react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

// ── Math helpers ───────────────────────────────────────────────────────────
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function simplifyRatio(w: number, h: number): [number, number] {
  const d = gcd(Math.round(w), Math.round(h))
  return [Math.round(w) / d, Math.round(h) / d]
}

// ── Preset ratios ─────────────────────────────────────────────────────────
type Preset = { label: string; ratio: string; w: number; h: number; tag?: string }

const PRESETS: Preset[] = [
  // AI image gen
  { label: 'Square',         ratio: '1:1',   w: 1024, h: 1024, tag: 'AI' },
  { label: 'Portrait',       ratio: '2:3',   w: 832,  h: 1216, tag: 'AI' },
  { label: 'Landscape',      ratio: '3:2',   w: 1216, h: 832,  tag: 'AI' },
  { label: 'Wide',           ratio: '16:9',  w: 1344, h: 768,  tag: 'AI' },
  { label: 'Ultrawide',      ratio: '21:9',  w: 1536, h: 640,  tag: 'AI' },
  { label: 'Tall',           ratio: '9:16',  w: 768,  h: 1344, tag: 'AI' },
  // Social
  { label: 'Instagram Post',  ratio: '1:1',   w: 1080, h: 1080, tag: 'Social' },
  { label: 'Instagram Story', ratio: '9:16',  w: 1080, h: 1920, tag: 'Social' },
  { label: 'Twitter Card',    ratio: '16:9',  w: 1200, h: 675,  tag: 'Social' },
  { label: 'OG Image',        ratio: '1.91:1',w: 1200, h: 630,  tag: 'Social' },
  { label: 'LinkedIn Banner', ratio: '4:1',   w: 1584, h: 396,  tag: 'Social' },
  { label: 'YouTube Thumb',   ratio: '16:9',  w: 1280, h: 720,  tag: 'Social' },
  // Video / display
  { label: 'HD 720p',        ratio: '16:9',  w: 1280, h: 720,  tag: 'Video' },
  { label: 'Full HD 1080p',  ratio: '16:9',  w: 1920, h: 1080, tag: 'Video' },
  { label: '4K UHD',         ratio: '16:9',  w: 3840, h: 2160, tag: 'Video' },
  { label: 'Cinema 2.39:1',  ratio: '2.39:1',w: 2390, h: 1000, tag: 'Video' },
  { label: 'iPhone 15 Pro',  ratio: '19.5:9',w: 1179, h: 2556, tag: 'Device' },
  { label: 'iPad Pro 12.9"', ratio: '4:3',   w: 2048, h: 2732, tag: 'Device' },
]

const PRESET_TAGS = ['All', 'AI', 'Social', 'Video', 'Device']

type CalcMode = 'dimensions' | 'ratio'

export default function AspectRatioPage() {
  // Mode 1: enter W+H → get ratio + scaled sizes
  const [width, setWidth]   = useState('')
  const [height, setHeight] = useState('')

  // Mode 2: enter ratio + one dimension → get the other
  const [ratioW, setRatioW]   = useState('16')
  const [ratioH, setRatioH]   = useState('9')
  const [knownDim, setKnownDim] = useState<'w' | 'h'>('w')
  const [knownVal, setKnownVal] = useState('')

  const [activeTag, setActiveTag] = useState('All')
  const [mode, setMode] = useState<CalcMode>('dimensions')

  // ── Mode 1: dimensions → ratio ────────────────────────────────────────
  const w = parseFloat(width)
  const h = parseFloat(height)
  const dimValid = !isNaN(w) && !isNaN(h) && w > 0 && h > 0

  const [sw, sh] = dimValid ? simplifyRatio(w, h) : [0, 0]
  const ratioStr = dimValid ? `${sw}:${sh}` : '—'
  const decimalRatio = dimValid ? w / h : 0
  const decimalStr = dimValid ? decimalRatio.toFixed(4) : '—'

  // Common scaled sizes preserving ratio
  const scaledSizes = dimValid
    ? [320, 640, 800, 1024, 1280, 1920, 2560, 3840]
        .map((targetW) => ({ tw: targetW, th: Math.round(targetW / decimalRatio) }))
        .filter(({ tw, th }) => tw !== Math.round(w) && th > 0 && th <= 4320)
    : []

  // ── Mode 2: ratio + one dim → other dim ──────────────────────────────
  const rW = parseFloat(ratioW)
  const rH = parseFloat(ratioH)
  const kv = parseFloat(knownVal)
  const ratioCalcValid = !isNaN(rW) && !isNaN(rH) && rW > 0 && rH > 0 && !isNaN(kv) && kv > 0

  const calcResult = ratioCalcValid
    ? knownDim === 'w'
      ? { resultDim: 'h' as const, resultVal: Math.round(kv * (rH / rW)) }
      : { resultDim: 'w' as const, resultVal: Math.round(kv * (rW / rH)) }
    : null

  // ── Load preset ───────────────────────────────────────────────────────
  const loadPreset = useCallback((p: Preset) => {
    setMode('dimensions')
    setWidth(String(p.w))
    setHeight(String(p.h))
  }, [])

  const filteredPresets = activeTag === 'All' ? PRESETS : PRESETS.filter((p) => p.tag === activeTag)

  const btnGhost = { background: 'rgba(255,255,255,0.07)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.65)' }
  const onHover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.07)'
    e.currentTarget.style.color = enter ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)'
  }

  return (
    <ToolLayout
      toolId="aspect-ratio"
      title="Aspect Ratio Calculator"
      description="Calculate aspect ratios and scale dimensions for images and video"
      category="image"
      iconName="RectangleHorizontal"
      showAllCategory
      compactRelated
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>Aspect Ratio Calculator Online</strong> is a free browser-based tool for working with image and video dimensions. Enter a width and height to instantly get the simplified aspect ratio, decimal ratio, and a full table of scaled sizes. Or enter a ratio and one known dimension to calculate the other — perfect for resizing images while keeping them proportional.</p>
            <p className="text-base leading-relaxed">The tool includes presets for all major AI image generation formats (Midjourney, DALL-E, Stable Diffusion), social media platforms (Instagram, Twitter, YouTube, LinkedIn, OG image), video resolutions (720p, 1080p, 4K, cinema), and devices (iPhone, iPad). Click any preset to load its dimensions instantly.</p>
            <p className="text-base leading-relaxed">All calculations run in your browser — no server, no upload, no signup.</p>
          </>}
          useCases={[
            'Find the correct aspect ratio for Midjourney --ar flag before generating images.',
            'Calculate scaled dimensions when resizing images for different screen sizes.',
            'Get the exact height for a given width while maintaining a 16:9 ratio.',
            'Check what aspect ratio a photo has before uploading to social media.',
            'Find dimensions for Instagram posts, stories, YouTube thumbnails, and OG images.',
            'Scale video frames up or down while maintaining the original ratio.',
            'Calculate canvas dimensions for AI image generators like DALL-E and Stable Diffusion.',
            'Generate a full set of responsive image sizes from a single source dimension.',
            'Verify that cropped images maintain the intended aspect ratio.',
          ]}
          faqs={[
            { q: 'What is an aspect ratio?', a: 'An aspect ratio is the proportional relationship between an image\'s width and height, expressed as two numbers separated by a colon — like 16:9 or 4:3. The same ratio can describe images of any size: 1920×1080, 1280×720, and 640×360 are all 16:9.' },
            { q: 'How do I use the Midjourney --ar flag?', a: 'The --ar flag accepts a ratio like --ar 16:9 or --ar 2:3. Use the Dimensions tab to enter your target dimensions and read the simplified ratio, or pick from the AI presets. Then add that ratio string to your Midjourney prompt.' },
            { q: 'How do I calculate height from a ratio and width?', a: 'Switch to the Ratio tab, enter your ratio (e.g. 16 and 9), select Width as your known dimension, enter the width value, and the tool instantly shows the correct height.' },
            { q: 'What is a 1.91:1 ratio?', a: '1.91:1 is the Open Graph (OG) image ratio used by Facebook, LinkedIn, and Twitter for link preview cards. The standard size is 1200×630 pixels.' },
            { q: 'What does the decimal ratio mean?', a: 'The decimal ratio is the width divided by the height (e.g. 16/9 = 1.7778). It is useful for CSS aspect-ratio properties and for comparing different ratios numerically.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Mode tabs */}
        <div className="flex gap-2">
          {(['dimensions', 'ratio'] as CalcMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
              style={mode === m
                ? { background: 'var(--color-image)', color: '#fff' }
                : btnGhost}
              onMouseEnter={(e) => { if (mode !== m) onHover(e, true) }}
              onMouseLeave={(e) => { if (mode !== m) onHover(e, false) }}
            >
              {m === 'dimensions' ? 'Dimensions → Ratio' : 'Ratio → Dimensions'}
            </button>
          ))}
        </div>

        {/* ── Mode 1: Dimensions → Ratio ── */}
        {mode === 'dimensions' && (
          <div
            className="rounded-xl p-4 space-y-4"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}
          >
            <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Enter Dimensions</label>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Width (px)</span>
                <input
                  type="number" min={1} value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="1920"
                  className="w-32 rounded-lg px-3 py-2.5 text-sm outline-none font-mono placeholder:text-white/50 transition-all"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.92)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-image)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-image-idle)' }}
                />
              </div>
              <span className="mt-5 text-lg" style={{ color: 'rgba(255,255,255,0.3)' }}>×</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Height (px)</span>
                <input
                  type="number" min={1} value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="1080"
                  className="w-32 rounded-lg px-3 py-2.5 text-sm outline-none font-mono placeholder:text-white/50 transition-all"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.92)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-image)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-image-idle)' }}
                />
              </div>
              <ArrowRight size={16} className="mt-5" style={{ color: 'rgba(255,255,255,0.25)' }} />
              {/* Result */}
              <div className="flex flex-col gap-1 mt-5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-2xl font-bold font-mono"
                    style={{ color: dimValid ? 'var(--color-image)' : 'rgba(255,255,255,0.2)' }}
                  >
                    {ratioStr}
                  </span>
                  {dimValid && <CopyButton text={ratioStr} />}
                </div>
                {dimValid && (
                  <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    decimal: {decimalStr}
                  </span>
                )}
              </div>
            </div>

            {/* Visual preview */}
            {dimValid && (
              <div className="flex items-center gap-4 pt-2">
                <div
                  className="rounded-lg flex items-center justify-center text-xs font-mono flex-shrink-0"
                  style={{
                    width: decimalRatio >= 1 ? '120px' : `${Math.round(120 * decimalRatio)}px`,
                    height: decimalRatio >= 1 ? `${Math.round(120 / decimalRatio)}px` : '120px',
                    maxWidth: '160px',
                    maxHeight: '120px',
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    color: 'var(--color-image)',
                  }}
                >
                  {sw}:{sh}
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {width} × {height} px · ratio {ratioStr} · {decimalStr}:1
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Mode 2: Ratio → Dimensions ── */}
        {mode === 'ratio' && (
          <div
            className="rounded-xl p-4 space-y-4"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}
          >
            <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Enter Ratio &amp; Known Dimension</label>
            <div className="flex items-end gap-3 flex-wrap">
              {/* Ratio inputs */}
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Ratio W</span>
                <input
                  type="number" min={1} value={ratioW}
                  onChange={(e) => setRatioW(e.target.value)}
                  className="w-20 rounded-lg px-3 py-2.5 text-sm outline-none font-mono placeholder:text-white/50 transition-all"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.92)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-image)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-image-idle)' }}
                />
              </div>
              <span className="pb-2.5 text-lg font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>:</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Ratio H</span>
                <input
                  type="number" min={1} value={ratioH}
                  onChange={(e) => setRatioH(e.target.value)}
                  className="w-20 rounded-lg px-3 py-2.5 text-sm outline-none font-mono placeholder:text-white/50 transition-all"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.92)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-image)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-image-idle)' }}
                />
              </div>

              <span className="pb-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>

              {/* Known dim toggle */}
              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>I know the</span>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '2px solid var(--border-image)' }}>
                  {(['w', 'h'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setKnownDim(d)}
                      className="px-4 py-2.5 text-sm font-medium transition-all"
                      style={knownDim === d
                        ? { background: 'var(--color-image)', color: '#fff' }
                        : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={(e) => { if (knownDim !== d) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' } }}
                      onMouseLeave={(e) => { if (knownDim !== d) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
                    >
                      {d === 'w' ? 'Width' : 'Height'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{knownDim === 'w' ? 'Width' : 'Height'} (px)</span>
                <input
                  type="number" min={1} value={knownVal}
                  onChange={(e) => setKnownVal(e.target.value)}
                  placeholder="1920"
                  className="w-32 rounded-lg px-3 py-2.5 text-sm outline-none font-mono placeholder:text-white/50 transition-all"
                  style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid var(--border-image)', color: 'rgba(255,255,255,0.92)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-image)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-image-idle)' }}
                />
              </div>
            </div>

            {calcResult && (
              <div
                className="rounded-lg px-4 py-3 flex items-center gap-4"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
              >
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {knownDim === 'w' ? `Width ${knownVal}px` : `Height ${knownVal}px`} at {ratioW}:{ratioH}
                </span>
                <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                <span className="text-xl font-bold font-mono" style={{ color: 'var(--color-image)' }}>
                  {calcResult.resultDim === 'h' ? `Height: ${calcResult.resultVal}px` : `Width: ${calcResult.resultVal}px`}
                </span>
                <CopyButton text={String(calcResult.resultVal)} />
              </div>
            )}
          </div>
        )}

        {/* Scaled sizes table */}
        {mode === 'dimensions' && dimValid && scaledSizes.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Scaled Sizes at {ratioStr}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {scaledSizes.map(({ tw, th }) => (
                <div
                  key={tw}
                  className="flex items-center justify-between px-3 py-2.5 transition-all"
                  style={{ background: 'var(--surface)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)' }}
                >
                  <span className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {tw} × {th}
                  </span>
                  <CopyButton text={`${tw}x${th}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presets */}
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--surface)', border: '2px solid var(--border-image-idle)' }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Common Presets</span>
            <div className="flex rounded-lg overflow-hidden" style={{ border: '2px solid var(--border-image-idle)' }}>
              {PRESET_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={activeTag === tag
                    ? { background: 'var(--color-image)', color: '#fff' }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={(e) => { if (activeTag !== tag) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' } }}
                  onMouseLeave={(e) => { if (activeTag !== tag) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredPresets.map((p) => (
              <button
                key={`${p.label}-${p.ratio}`}
                onClick={() => loadPreset(p)}
                className="rounded-lg px-3 py-2.5 text-left transition-all space-y-0.5"
                style={{ background: 'rgba(0,0,0,0.25)', border: '2px solid var(--border-image-idle)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>{p.label}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--color-image)' }}>{p.ratio}</p>
                <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.w} × {p.h}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </ToolLayout>
  )
}
