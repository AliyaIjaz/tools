'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import SeoSection from '@/components/ui/SeoSection'

type Platform = {
  id: string
  name: string
  category: string
  limit: number
  note?: string
}

const PLATFORMS: Platform[] = [
  // Social
  { id: 'twitter-post',     name: 'X / Twitter Post',      category: 'Social',  limit: 280 },
  { id: 'twitter-bio',      name: 'X / Twitter Bio',        category: 'Social',  limit: 160 },
  { id: 'linkedin-post',    name: 'LinkedIn Post',          category: 'Social',  limit: 3000 },
  { id: 'linkedin-headline',name: 'LinkedIn Headline',      category: 'Social',  limit: 220 },
  { id: 'linkedin-summary', name: 'LinkedIn Summary',       category: 'Social',  limit: 2600 },
  { id: 'instagram-caption',name: 'Instagram Caption',      category: 'Social',  limit: 2200 },
  { id: 'instagram-bio',    name: 'Instagram Bio',          category: 'Social',  limit: 150 },
  { id: 'tiktok-bio',       name: 'TikTok Bio',             category: 'Social',  limit: 80 },
  { id: 'tiktok-caption',   name: 'TikTok Caption',         category: 'Social',  limit: 2200 },
  { id: 'youtube-title',    name: 'YouTube Title',          category: 'Social',  limit: 100 },
  { id: 'youtube-desc',     name: 'YouTube Description',    category: 'Social',  limit: 5000 },
  { id: 'facebook-post',    name: 'Facebook Post',          category: 'Social',  limit: 63206 },
  // SEO
  { id: 'meta-title',       name: 'Meta Title',             category: 'SEO',     limit: 60,   note: 'Displayed in search results' },
  { id: 'meta-desc',        name: 'Meta Description',       category: 'SEO',     limit: 160,  note: 'Displayed in search results' },
  { id: 'og-title',         name: 'OG Title',               category: 'SEO',     limit: 95,   note: 'Open Graph / social preview' },
  { id: 'og-desc',          name: 'OG Description',         category: 'SEO',     limit: 200,  note: 'Open Graph / social preview' },
  { id: 'url-slug',         name: 'URL Slug',               category: 'SEO',     limit: 75,   note: 'Recommended max' },
  // Email
  { id: 'email-subject',    name: 'Email Subject Line',     category: 'Email',   limit: 60,   note: 'Most clients truncate at 60' },
  { id: 'email-preview',    name: 'Email Preview Text',     category: 'Email',   limit: 90,   note: 'Pre-header / preview snippet' },
  { id: 'gmail-subject',    name: 'Gmail Subject',          category: 'Email',   limit: 70,   note: 'Visible on desktop' },
  // Ads
  { id: 'google-headline',  name: 'Google Ad Headline',     category: 'Ads',     limit: 30,   note: 'Per headline (up to 15)' },
  { id: 'google-desc',      name: 'Google Ad Description',  category: 'Ads',     limit: 90,   note: 'Per description line' },
  { id: 'meta-ad-headline', name: 'Meta Ad Headline',       category: 'Ads',     limit: 40 },
  { id: 'meta-ad-body',     name: 'Meta Ad Body Text',      category: 'Ads',     limit: 125 },
  // Messaging
  { id: 'sms',              name: 'SMS Message',            category: 'Messaging', limit: 160, note: 'Single SMS segment' },
  { id: 'whatsapp',         name: 'WhatsApp Message',       category: 'Messaging', limit: 65536 },
  { id: 'push-title',       name: 'Push Notification Title', category: 'Messaging', limit: 50 },
  { id: 'push-body',        name: 'Push Notification Body',  category: 'Messaging', limit: 100 },
]

const CATEGORIES = ['Social', 'SEO', 'Email', 'Ads', 'Messaging']

type StatusLevel = 'ok' | 'warn' | 'over'

function getStatus(chars: number, limit: number): StatusLevel {
  const pct = chars / limit
  if (chars > limit) return 'over'
  if (pct >= 0.9) return 'warn'
  return 'ok'
}

function statusColor(s: StatusLevel): string {
  if (s === 'over') return '#f87171'
  if (s === 'warn') return '#fb923c'
  return '#34d399'
}

function statusBg(s: StatusLevel): string {
  if (s === 'over') return 'rgba(248,113,113,0.1)'
  if (s === 'warn') return 'rgba(251,146,60,0.08)'
  return 'rgba(52,211,153,0.08)'
}

function statusBorder(s: StatusLevel): string {
  if (s === 'over') return 'rgba(248,113,113,0.3)'
  if (s === 'warn') return 'rgba(251,146,60,0.25)'
  return 'rgba(52,211,153,0.2)'
}

export default function CharacterLimitPage() {
  const [text, setText] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [customLimit, setCustomLimit] = useState('')

  const chars = text.length
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length

  const filtered = activeCategory === 'All'
    ? PLATFORMS
    : PLATFORMS.filter((p) => p.category === activeCategory)

  const customLimitNum = parseInt(customLimit)
  const hasCustom = !isNaN(customLimitNum) && customLimitNum > 0

  return (
    <ToolLayout
      toolId="character-limit"
      title="Character Limit Checker"
      description="Check your text against Twitter, LinkedIn, meta tag, and other platform limits"
      category="text"
      iconName="TextCursorInput"
      showAllCategory
      compactRelated
      seoContent={
        <SeoSection
          about={<>
            <p className="text-base leading-relaxed"><strong>Character Limit Checker Online</strong> is a free browser-based tool that checks your text against the character limits of 28 platforms — including X (Twitter), LinkedIn, Instagram, TikTok, YouTube, Google Ads, Meta Ads, email subject lines, SMS, push notifications, and SEO meta tags. As you type, every platform shows your remaining characters, a color-coded status bar, and a clear over/under indicator.</p>
            <p className="text-base leading-relaxed">Writers using AI to generate social posts, ad copy, or meta descriptions frequently overshoot platform limits. This tool makes it instant to check all limits at once, so you can trim and publish with confidence. You can also set a custom character limit for any specific use case.</p>
            <p className="text-base leading-relaxed">All processing runs in your browser — your text is never sent to any server.</p>
          </>}
          useCases={[
            'Check that AI-generated tweets and LinkedIn posts fit within platform limits.',
            'Verify meta title and description lengths before publishing SEO content.',
            'Trim Google Ads and Meta Ads copy to fit within character constraints.',
            'Check email subject lines and preview text before sending campaigns.',
            'Ensure SMS messages stay within a single 160-character segment.',
            'Verify push notification title and body length before scheduling.',
            'Check Instagram captions and bios before posting.',
            'Validate YouTube titles and descriptions for completeness.',
            'Set a custom character limit for any internal platform or use case.',
          ]}
          faqs={[
            { q: 'Why do character limits matter?', a: 'Platforms truncate text that exceeds their limit — sometimes silently, sometimes with an error. For SEO, Google typically displays only 60 characters of a meta title and 160 of a description. For ads, going over the limit prevents the ad from running. This tool helps you catch overruns before they become problems.' },
            { q: 'Does Twitter count characters differently?', a: 'X (Twitter) counts most characters as 1, but URLs are always counted as 23 characters regardless of their actual length. This tool counts raw characters — for URL-heavy tweets, the actual Twitter count may differ slightly.' },
            { q: 'What does the warning color mean?', a: 'Orange means you are within 10% of the limit (approaching). Red means you have exceeded the limit. Green means you are comfortably within the limit.' },
            { q: 'Can I set a custom limit?', a: 'Yes. Type any number in the Custom Limit field and your text will be checked against that limit as well, shown at the top of the results.' },
            { q: 'Is my text sent to a server?', a: 'No. All character counting runs locally in your browser. Nothing is uploaded or stored.' },
          ]}
        />
      }
    >
      <div className="space-y-5">

        {/* Input */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Your Text</label>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {chars.toLocaleString()} chars · {words.toLocaleString()} words
              </span>
              {text && (
                <button
                  onClick={() => setText('')}
                  className="text-sm px-3 py-1 rounded-lg transition-all"
                  style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here to check it against all platform limits…"
            rows={6}
            className="w-full resize-y rounded-lg px-3 py-3 text-sm outline-none transition-all duration-150 placeholder:text-white/20"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: '1.7',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          />
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category filter */}
          <div className="flex rounded-lg overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-2 text-sm font-medium transition-all"
                style={activeCategory === cat
                  ? { background: 'var(--color-text-tool)', color: '#000' }
                  : { background: 'transparent', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { if (activeCategory !== cat) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' } }}
                onMouseLeave={(e) => { if (activeCategory !== cat) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Custom limit */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Custom limit</label>
            <input
              type="number"
              min={1}
              value={customLimit}
              onChange={(e) => setCustomLimit(e.target.value)}
              placeholder="e.g. 500"
              className="w-28 rounded-lg px-3 py-2 text-sm outline-none transition-all font-mono placeholder:text-white/20"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.85)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-tool)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        {/* Platform cards */}
        <div className="space-y-3">
          {/* Custom limit card */}
          {hasCustom && (() => {
            const status = getStatus(chars, customLimitNum)
            const remaining = customLimitNum - chars
            const pct = Math.min((chars / customLimitNum) * 100, 100)
            return (
              <div
                className="rounded-xl p-4"
                style={{ background: statusBg(status), border: `1px solid ${statusBorder(status)}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Custom Limit</span>
                    <span className="ml-2 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{customLimitNum} chars</span>
                  </div>
                  <span className="text-sm font-semibold font-mono" style={{ color: statusColor(status) }}>
                    {status === 'over' ? `${Math.abs(remaining)} over` : `${remaining} left`}
                  </span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, background: statusColor(status) }}
                  />
                </div>
              </div>
            )
          })()}

          {/* Platform rows grouped by category */}
          {(activeCategory === 'All' ? CATEGORIES : [activeCategory]).map((cat) => {
            const platforms = filtered.filter((p) => p.category === cat)
            if (platforms.length === 0) return null
            return (
              <div key={cat}>
                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{cat}</p>
                <div className="space-y-2">
                  {platforms.map((platform) => {
                    const status = getStatus(chars, platform.limit)
                    const remaining = platform.limit - chars
                    const pct = Math.min((chars / platform.limit) * 100, 100)
                    return (
                      <div
                        key={platform.id}
                        className="rounded-xl px-4 py-3 transition-all"
                        style={{
                          background: chars > 0 ? statusBg(status) : 'var(--surface)',
                          border: `1px solid ${chars > 0 ? statusBorder(status) : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.88)' }}>{platform.name}</span>
                            {platform.note && (
                              <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{platform.note}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
                              {chars.toLocaleString()} / {platform.limit.toLocaleString()}
                            </span>
                            {chars > 0 && (
                              <span
                                className="text-sm font-semibold font-mono w-20 text-right"
                                style={{ color: statusColor(status) }}
                              >
                                {status === 'over'
                                  ? `${Math.abs(remaining).toLocaleString()} over`
                                  : `${remaining.toLocaleString()} left`}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full rounded-full overflow-hidden" style={{ height: '3px', background: 'rgba(255,255,255,0.07)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${pct}%`,
                              background: chars > 0 ? statusColor(status) : 'rgba(255,255,255,0.15)',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 flex-wrap">
          {[
            { color: '#34d399', label: 'Within limit' },
            { color: '#fb923c', label: 'Within 10% of limit' },
            { color: '#f87171', label: 'Over limit' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
