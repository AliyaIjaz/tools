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
    border: '1.5px solid var(--border)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.9)',
    padding: '10px 14px',
    fontSize: '15px',
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
          aboutTitle="HTML Meta Tag Generator Online"
          about={<>
            <p className="text-base leading-relaxed">Create complete HTML meta tags for your website in seconds with this free HTML Meta Tag Generator. Generate SEO meta tags, Open Graph (Facebook, LinkedIn, Slack, Discord), Twitter/X Card tags, canonical URLs, robots meta tags, and other essential metadata with a live preview and ready-to-copy HTML.</p>
            <p className="text-base leading-relaxed">Whether you&apos;re building a blog, landing page, ecommerce store, or business website, this tool helps you create search engine and social media metadata that follows modern best practices.</p>
            <p className="text-base leading-relaxed">Everything runs entirely in your browser. No data is uploaded or stored.</p>
          </>}
          extraSections={[
            {
              title: 'What Are HTML Meta Tags?',
              intro: 'HTML meta tags are pieces of information placed inside the <head> section of a webpage. They provide metadata about your page for search engines, browsers, and social media platforms.\n\nWhile most meta tags are not visible to visitors, they play an important role in:',
              items: [
                'Search engine optimization (SEO)',
                'Social media link previews',
                'Website indexing',
                'Page descriptions',
                'Browser behavior',
                'Content sharing',
                'Canonical URL management',
              ],
              closing: 'A properly optimized set of meta tags can improve how your pages appear in search results and when shared across social platforms.',
            },
            {
              title: 'Features',
              items: [
                'Generate SEO meta tags',
                'Generate Open Graph tags',
                'Generate Twitter/X Card tags',
                'Generate canonical URL tags',
                'Generate robots meta tags',
                'Live HTML preview',
                'Ready-to-copy HTML',
                'Clean, standards-compliant markup',
                'Supports Facebook, LinkedIn, X, Slack, Discord, WhatsApp, and more',
                'Beginner-friendly interface',
                'No registration required',
                'Free to use',
                'Works in all modern browsers',
                'Runs entirely in your browser',
              ],
            },
            {
              title: 'Supported Meta Tags',
              items: [
                <div key="title" className="space-y-1.5">
                  <p className="text-base font-medium text-white">{'Page Title (<title>)'}</p>
                  <p className="text-base leading-relaxed">The page title appears in browser tabs and is often used as the clickable headline in search engine results.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{`<title>Free HTML Meta Tag Generator</title>`}</pre>
                  <p className="text-base leading-relaxed font-medium" style={{color:'rgba(255,255,255,0.75)'}}>Best practice:</p>
                  <ul className="space-y-0.5 pl-4 text-base leading-relaxed" style={{listStyleType:'disc'}}>
                    <li>Keep between 50–60 characters.</li>
                    <li>Make each page title unique.</li>
                    <li>Include your primary keyword naturally.</li>
                  </ul>
                </div>,
                <div key="desc" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Meta Description</p>
                  <p className="text-base leading-relaxed">The meta description summarizes your page and is commonly displayed beneath the title in search engine results.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{`<meta\n  name="description"\n  content="Generate SEO, Open Graph, and Twitter meta tags instantly.">`}</pre>
                  <p className="text-base leading-relaxed font-medium" style={{color:'rgba(255,255,255,0.75)'}}>Best practice:</p>
                  <ul className="space-y-0.5 pl-4 text-base leading-relaxed" style={{listStyleType:'disc'}}>
                    <li>Keep between 150–160 characters.</li>
                    <li>Write clear, compelling descriptions.</li>
                    <li>Include relevant keywords naturally.</li>
                  </ul>
                </div>,
                <div key="canonical" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Canonical URL</p>
                  <p className="text-base leading-relaxed">A canonical tag tells search engines which version of a page should be treated as the primary version, helping prevent duplicate content issues.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{`<link\n  rel="canonical"\n  href="https://example.com/page">`}</pre>
                </div>,
                <div key="robots" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Robots Meta Tag</p>
                  <p className="text-base leading-relaxed">Robots tags tell search engines whether a page should be indexed or whether links should be followed.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{`<meta\n  name="robots"\n  content="index,follow">`}</pre>
                  <p className="text-base leading-relaxed">Common values include: <code className="text-sm px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)'}}>index</code>, <code className="text-sm px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)'}}>noindex</code>, <code className="text-sm px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)'}}>follow</code>, <code className="text-sm px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)'}}>nofollow</code>.</p>
                </div>,
                <div key="og" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Open Graph Tags</p>
                  <p className="text-base leading-relaxed">Open Graph metadata controls how your website appears when shared on platforms that support the Open Graph protocol.</p>
                  <p className="text-base leading-relaxed">Supported platforms include: Facebook, LinkedIn, Slack, Discord, WhatsApp, Telegram, Microsoft Teams.</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{`<meta property="og:title" content="My Website">\n<meta property="og:description" content="Example description">\n<meta property="og:image" content="https://example.com/image.jpg">\n<meta property="og:url" content="https://example.com">`}</pre>
                </div>,
                <div key="twitter" className="space-y-1.5">
                  <p className="text-base font-medium text-white">Twitter/X Card Tags</p>
                  <p className="text-base leading-relaxed">Twitter Card tags provide additional control over how your content appears when shared on X (formerly Twitter).</p>
                  <p className="text-sm" style={{color:'rgba(255,255,255,0.5)'}}>Example:</p>
                  <pre className="text-sm font-mono px-3 py-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.8)'}}>{`<meta\n  name="twitter:card"\n  content="summary_large_image">`}</pre>
                  <p className="text-base leading-relaxed">Common card types include: <code className="text-sm px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)'}}>summary</code>, <code className="text-sm px-1.5 py-0.5 rounded" style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.85)'}}>summary_large_image</code>.</p>
                </div>,
              ],
            },
            {
              title: 'How to Use',
              items: [
                'Enter your page title.',
                'Write a meta description.',
                'Add your page URL.',
                'Specify the canonical URL.',
                'Choose robots directives.',
                'Add your Open Graph image and details.',
                'Configure Twitter Card information.',
                'Generate the HTML.',
                'Copy the generated code.',
                'Paste it inside the <head> section of your webpage.',
              ],
              closing: 'No installation or registration is required.',
            },
            {
              title: 'Example Generated HTML',
              intro: '',
              items: [
                <pre key="example" className="text-sm font-mono px-4 py-3 rounded-xl overflow-auto" style={{background:'rgba(255,255,255,0.04)',color:'rgba(255,255,255,0.8)',lineHeight:'1.7'}}>{`<title>My Website</title>\n\n<meta\n  name="description"\n  content="Example website description">\n\n<link\n  rel="canonical"\n  href="https://example.com">\n\n<meta\n  name="robots"\n  content="index,follow">\n\n<meta\n  property="og:title"\n  content="My Website">\n\n<meta\n  property="og:description"\n  content="Example website description">\n\n<meta\n  property="og:image"\n  content="https://example.com/image.jpg">\n\n<meta\n  property="og:url"\n  content="https://example.com">\n\n<meta\n  name="twitter:card"\n  content="summary_large_image">\n\n<meta\n  name="twitter:title"\n  content="My Website">\n\n<meta\n  name="twitter:description"\n  content="Example website description">\n\n<meta\n  name="twitter:image"\n  content="https://example.com/image.jpg">`}</pre>,
              ],
            },
            {
              title: 'SEO Best Practices',
              intro: 'To maximize visibility in search engines:',
              items: [
                'Write unique page titles.',
                'Use descriptive meta descriptions.',
                'Avoid duplicate metadata.',
                'Set canonical URLs correctly.',
                'Use descriptive Open Graph images.',
                'Include meaningful page titles.',
                'Optimize every important page individually.',
                'Keep metadata relevant to page content.',
              ],
            },
            {
              title: 'Open Graph Best Practices',
              intro: 'For better social media previews:',
              items: [
                'Use a high-quality image.',
                'Recommended image size: 1200 × 630 pixels.',
                'Keep titles concise.',
                'Write engaging descriptions.',
                'Use the correct page URL.',
                'Ensure the image is publicly accessible.',
              ],
              closing: 'These practices improve link previews across most social platforms.',
            },
            {
              title: 'Twitter/X Card Best Practices',
              intro: 'Although X can often fall back to Open Graph tags, dedicated Twitter Card tags provide more control over how links appear.\n\nFor most websites, summary_large_image offers the best presentation.',
              items: [],
            },
            {
              title: 'Browser & Platform Compatibility',
              intro: 'The generated metadata follows HTML and Open Graph standards and is compatible with:',
              items: [
                'Google Search',
                'Bing',
                'Facebook',
                'LinkedIn',
                'X (Twitter)',
                'Slack',
                'Discord',
                'WhatsApp',
                'Telegram',
                'Microsoft Teams',
                'Modern web browsers',
              ],
            },
          ]}
          useCasesTitle="Common Use Cases"
          useCases={[
            'Creating SEO metadata for new websites',
            'Optimizing blog posts',
            'Generating landing page metadata',
            'Creating ecommerce product pages',
            'Setting Open Graph previews',
            'Creating Twitter/X Cards',
            'Improving social sharing previews',
            'Creating metadata for portfolio websites',
            'Managing canonical URLs',
            'Creating robots tags',
            'Optimizing marketing pages',
            'Building production-ready HTML',
          ]}
          faqs={[
            { q: 'What is an HTML Meta Tag Generator?', a: 'An HTML Meta Tag Generator is an online tool that creates ready-to-use HTML metadata for search engines and social media platforms. It helps you generate SEO meta tags, Open Graph tags, Twitter Cards, canonical URLs, and robots tags without writing code manually.' },
            { q: 'Do meta tags improve SEO?', a: 'Meta tags do not directly guarantee higher rankings, but they help search engines understand your content and can improve how your pages appear in search results. Well-written titles and descriptions may also increase click-through rates.' },
            { q: 'What is the difference between SEO and Open Graph tags?', a: 'SEO meta tags primarily help search engines understand and display your pages in search results. Open Graph tags control how your content appears when shared on social media and messaging platforms.' },
            { q: 'What image size should I use for Open Graph?', a: 'A size of 1200 × 630 pixels (1.91:1 aspect ratio) is widely recommended because it displays well across Facebook, LinkedIn, X, Slack, Discord, and many other platforms.' },
            { q: 'Are Twitter Card tags required if I already have Open Graph tags?', a: 'X can often use Open Graph metadata if Twitter Card tags are missing, but adding dedicated Twitter Card tags gives you greater control over the appearance of shared links.' },
            { q: 'What is a canonical URL?', a: 'A canonical URL tells search engines which version of a page should be considered the primary version, helping prevent duplicate content issues.' },
            { q: 'What does the robots meta tag do?', a: 'The robots meta tag provides instructions such as whether search engines should index a page or follow its links.' },
            { q: 'Where should I place the generated HTML?', a: 'Paste the generated tags inside the <head> section of your HTML document before the closing </head> tag.' },
            { q: 'Can I edit the generated HTML?', a: 'Yes. The generated code uses standard HTML and can be customized at any time.' },
            { q: 'Is this Meta Tag Generator free?', a: 'Yes. The tool is completely free to use and runs entirely in your browser without requiring registration or downloads.' },
          ]}
        />
      }
      category="web"
      iconName="Tags"
      showAllCategory
      compactRelated
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map(({ label, value, set, placeholder, hint }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</label>
                {hint && <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{hint}</span>}
              </div>
              <input type="text" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={inputStyle} />
              {label === 'Title' && value && (
                <p className="text-sm mt-1.5" style={{ color: value.length > 60 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                  {value.length}/60 chars
                </p>
              )}
              {label === 'Description' && value && (
                <p className="text-sm mt-1.5" style={{ color: value.length > 160 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                  {value.length}/160 chars
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Page type */}
        <div>
          <label className="text-sm font-semibold mb-2.5 block" style={{ color: 'rgba(255,255,255,0.85)' }}>Page type</label>
          <div className="flex gap-2">
            {(['website', 'article'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-4 py-2 rounded-lg text-base font-semibold capitalize transition-all"
                style={{
                  background: type === t ? 'var(--color-web-dim)' : 'var(--surface)',
                  border: `1.5px solid ${type === t ? 'var(--color-web)' : 'var(--border)'}`,
                  color: type === t ? 'var(--color-web)' : 'rgba(255,255,255,0.7)',
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
            <p className="text-sm font-semibold mb-2.5" style={{ color: 'rgba(255,255,255,0.85)' }}>Social preview</p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid var(--border)', maxWidth: '480px' }}>
              {image && (
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
              )}
              <div className="px-4 py-4" style={{ background: '#1a1a1a' }}>
                {url && <p className="text-sm mb-1 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>{url.replace(/^https?:\/\//, '').split('/')[0]}</p>}
                {title && <p className="text-base font-semibold text-white leading-snug">{title}</p>}
                {description && <p className="text-sm mt-1.5 line-clamp-2" style={{ color: 'rgba(255,255,255,0.65)' }}>{description}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Output */}
        {tags && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>Generated tags</label>
              <CopyButton text={tags} label="Copy all" />
            </div>
            <pre
              className="rounded-xl px-5 py-4 text-sm overflow-auto whitespace-pre-wrap"
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-geist-mono), monospace',
                lineHeight: '1.7',
                maxHeight: '360px',
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
