import type { Metadata } from 'next'
import { Zap, Shield, Globe, Code2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Zenveel — free, fast, browser-based utility tools for developers and everyday users.',
}

const highlights = [
  {
    icon: Zap,
    color: 'var(--color-dev)',
    title: 'Instant & Free',
    body: 'Every tool loads instantly with no signup, no subscription, and no paywalls. Just open and use.',
  },
  {
    icon: Shield,
    color: 'var(--color-web)',
    title: 'Private by Design',
    body: 'All processing happens in your browser. Your files and data never leave your device or touch our servers.',
  },
  {
    icon: Globe,
    color: 'var(--color-image)',
    title: 'Works Everywhere',
    body: 'No installation needed. Zenveel runs entirely in the browser on any device — desktop, tablet, or mobile.',
  },
  {
    icon: Code2,
    color: 'var(--color-text-tool)',
    title: 'Built for Everyone',
    body: 'From developers formatting JSON to designers converting images, our tools are built to be simple and useful.',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1
        className="text-3xl font-bold mb-4"
        style={{
          background: 'linear-gradient(90deg, var(--color-dev), var(--color-image))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-orbitron)',
        }}
      >
        About Zenveel
      </h1>

      <p className="text-base leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.75)' }}>
        Zenveel is a free collection of browser-based utility tools built for developers, designers, and everyday users.
        Whether you need to format code, convert images, encode text, or generate UUIDs — everything is available
        instantly, right in your browser, with no account required.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
        {highlights.map(({ icon: Icon, color, title, body }) => (
          <div
            key={title}
            className="rounded-xl p-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <h2 className="text-base font-semibold text-white mb-1">{title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {body}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        <h2 className="text-lg font-semibold text-white mb-3">Our Mission</h2>
        <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          The web is full of tools that make you sign up, show you ads before you can do anything, or upload your data
          to a server you don&apos;t control. We think that&apos;s unnecessary for most utility tasks. Zenveel exists
          to offer a fast, clean, and private alternative — tools that respect your time and your data.
        </p>
      </div>

      <div className="mt-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
        <p className="text-sm leading-relaxed">
          Have a suggestion or found a bug? We&apos;d love to hear from you —{' '}
          <a
            href="/contact"
            className="underline"
            style={{ color: 'var(--color-image)' }}
          >
            get in touch
          </a>
          .
        </p>
      </div>
    </div>
  )
}
