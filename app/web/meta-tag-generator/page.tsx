'use client'

import { useState, useMemo } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'

export default function MetaTagGeneratorPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [siteName, setSiteName] = useState('')
  const [twitterHandle, setTwitterHandle] = useState('')
  const [type, setType] = useState<'website' | 'article'>('website')

  const tags = useMemo(() => {
    const lines: string[] = []
    if (title) {
      lines.push(`<title>${title}</title>`)
      lines.push(`<meta property="og:title" content="${title}" />`)
      lines.push(`<meta name="twitter:title" content="${title}" />`)
    }
    if (description) {
      lines.push(`<meta name="description" content="${description}" />`)
      lines.push(`<meta property="og:description" content="${description}" />`)
      lines.push(`<meta name="twitter:description" content="${description}" />`)
    }
    if (url) {
      lines.push(`<meta property="og:url" content="${url}" />`)
      lines.push(`<link rel="canonical" href="${url}" />`)
    }
    if (image) {
      lines.push(`<meta property="og:image" content="${image}" />`)
      lines.push(`<meta name="twitter:image" content="${image}" />`)
      lines.push(`<meta name="twitter:card" content="summary_large_image" />`)
    } else {
      lines.push(`<meta name="twitter:card" content="summary" />`)
    }
    if (siteName) lines.push(`<meta property="og:site_name" content="${siteName}" />`)
    lines.push(`<meta property="og:type" content="${type}" />`)
    if (twitterHandle) lines.push(`<meta name="twitter:site" content="@${twitterHandle.replace('@', '')}" />`)
    return lines.join('\n')
  }, [title, description, url, image, siteName, twitterHandle, type])

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.85)',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  }

  const fields = [
    { label: 'Title', value: title, set: setTitle, placeholder: 'My Awesome Page', hint: '50–60 chars recommended' },
    { label: 'Description', value: description, set: setDescription, placeholder: 'A short description of the page content.', hint: '150–160 chars recommended' },
    { label: 'Canonical URL', value: url, set: setUrl, placeholder: 'https://example.com/page', hint: '' },
    { label: 'OG Image URL', value: image, set: setImage, placeholder: 'https://example.com/og.png', hint: '1200×630px recommended' },
    { label: 'Site name', value: siteName, set: setSiteName, placeholder: 'My Site', hint: '' },
    { label: 'Twitter handle', value: twitterHandle, set: setTwitterHandle, placeholder: 'username', hint: 'Without @' },
  ]

  return (
    <ToolLayout
      toolId="meta-tag-generator"
      title="Meta Tag Generator"
      description="Generate HTML meta tags for SEO, Open Graph, and Twitter Cards"
      seoContent={
        <SeoSection
          about="Generate ready-to-paste HTML meta tags for SEO, Open Graph (Facebook, LinkedIn), and Twitter Cards. Fill in your page details and copy the complete tag block. Correct meta tags improve how your pages appear in search results and on social media."
          useCases={[
            'Adding SEO meta tags to a new webpage or blog post',
            'Generating Open Graph tags so links preview correctly on social media',
            'Setting up Twitter Card tags for better link previews on Twitter/X',
            'Creating a complete meta tag block for a landing page or product page',
            'Checking which meta tag fields are required for proper indexing',
          ]}
          faqs={[
            { q: 'What is the difference between SEO and Open Graph tags?', a: 'SEO meta tags like title and description influence how your page appears in search engine results. Open Graph tags control how your page appears when shared as a link on social media platforms like Facebook, LinkedIn, and Slack.' },
            { q: 'What image size should I use for Open Graph?', a: 'The recommended size is 1200×630 pixels (1.91:1 aspect ratio), which displays well across Facebook, Twitter, LinkedIn, and most messaging apps.' },
            { q: 'Are Twitter Card tags required if I already have Open Graph?', a: 'Twitter falls back to Open Graph tags if Twitter Card tags are absent, but setting dedicated Twitter Card tags gives you more control over the preview.' },
          ]}
        />
      }
      category="web"
      iconName="Tags"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value, set, placeholder, hint }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
                {hint && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{hint}</span>}
              </div>
              <input type="text" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={inputStyle} />
              {label === 'Title' && value && (
                <p className="text-xs mt-1" style={{ color: value.length > 60 ? '#f87171' : 'rgba(255,255,255,0.25)' }}>
                  {value.length}/60 chars
                </p>
              )}
              {label === 'Description' && value && (
                <p className="text-xs mt-1" style={{ color: value.length > 160 ? '#f87171' : 'rgba(255,255,255,0.25)' }}>
                  {value.length}/160 chars
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Page type */}
        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: 'rgba(255,255,255,0.45)' }}>Page type</label>
          <div className="flex gap-2">
            {(['website', 'article'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: type === t ? 'var(--color-web-dim)' : 'var(--surface)',
                  border: `1px solid ${type === t ? 'var(--color-web)' : 'var(--border)'}`,
                  color: type === t ? 'var(--color-web)' : 'rgba(255,255,255,0.5)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* OG Preview card */}
        {(title || description || image) && (
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Social preview</p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', maxWidth: '480px' }}>
              {image && (
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${image})`, background: image ? undefined : 'rgba(255,255,255,0.04)' }}>
                  {!image && <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>No image</div>}
                </div>
              )}
              <div className="px-4 py-3" style={{ background: '#1a1a1a' }}>
                {url && <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>{url.replace(/^https?:\/\//, '').split('/')[0]}</p>}
                {title && <p className="text-sm font-semibold text-white leading-snug">{title}</p>}
                {description && <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{description}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        {tags && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Generated tags</label>
              <CopyButton text={tags} label="Copy all" />
            </div>
            <pre
              className="rounded-xl px-4 py-3 text-xs overflow-auto whitespace-pre-wrap"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.7',
                maxHeight: '320px',
              }}
            >
              {tags}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
