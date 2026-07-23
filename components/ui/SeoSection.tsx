import React from 'react'

type Faq = { q: string; a: string | React.ReactNode }

type ContentSection = {
  title: string
  intro?: string | React.ReactNode
  items: (string | React.ReactNode)[]
  closing?: string | React.ReactNode
}

type Props = {
  about: string | React.ReactNode
  aboutTitle?: string
  useCasesTitle?: string
  useCasesIntro?: string
  useCases: string[]
  benefits?: ContentSection
  extraSections?: ContentSection[]
  faqs: Faq[]
  closing?: string | React.ReactNode
}

export default function SeoSection({ about, aboutTitle = 'About this tool', useCasesTitle = 'Common use cases', useCasesIntro, useCases, benefits, extraSections, faqs, closing }: Props) {
  const aboutContent = typeof about === 'string'
    ? about.split('\n\n').map((para, i) => (
        <p key={i} className="text-base leading-relaxed">{para}</p>
      ))
    : about

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">{aboutTitle}</h2>
        <div className="space-y-3">{aboutContent}</div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">{useCasesTitle}</h2>
        {useCasesIntro && <p className="text-base leading-relaxed mb-3">{useCasesIntro}</p>}
        <ul className="space-y-1.5">
          {useCases.map((u) => (
            <li key={u} className="text-base flex items-start gap-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
              {u}
            </li>
          ))}
        </ul>
      </div>

      {benefits && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">{benefits.title}</h2>
          <div className="space-y-3">
            {benefits.intro && (typeof benefits.intro === 'string'
              ? benefits.intro.split('\n\n').map((para, i) => <p key={i} className="text-base leading-relaxed">{para}</p>)
              : benefits.intro)}
            <ul className="space-y-1.5">
              {benefits.items.map((item) => (
                <li key={item} className="text-base flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
                  {item}
                </li>
              ))}
            </ul>
            {benefits.closing && <p className="text-base leading-relaxed">{benefits.closing}</p>}
          </div>
        </div>
      )}

      {extraSections && extraSections.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-semibold text-white mb-2">{section.title}</h2>
          <div className="space-y-3">
            {section.intro && (typeof section.intro === 'string'
              ? section.intro.split('\n\n').map((para, i) => <p key={i} className="text-base leading-relaxed">{para}</p>)
              : section.intro)}
            {section.items.length > 0 && (
              <ul className="space-y-1.5">
                {section.items.map((item, i) => (
                  <li key={i} className="text-base flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.closing && <p className="text-base leading-relaxed">{section.closing}</p>}
          </div>
        </div>
      ))}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <div key={faq.q}>
            <p className="text-base font-medium text-white mb-1">{faq.q}</p>
            {typeof faq.a === 'string'
              ? <p className="text-base leading-relaxed">{faq.a}</p>
              : <div className="text-base leading-relaxed">{faq.a}</div>}
          </div>
        ))}
      </div>

      {closing && <p className="text-base leading-relaxed">{closing}</p>}
    </>
  )
}
