'use client'

import { useState } from 'react'
import ToolLayout from '@/components/ui/ToolLayout'
import CopyButton from '@/components/ui/CopyButton'
import SeoSection from '@/components/ui/SeoSection'
import Textarea from '@/components/ui/Textarea'

const GENERAL_CASES = [
  { label: 'UPPER CASE', fn: (s: string) => s.toUpperCase() },
  { label: 'lower case', fn: (s: string) => s.toLowerCase() },
  {
    label: 'Title Case',
    fn: (s: string) =>
      s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    label: 'Sentence case',
    fn: (s: string) =>
      s.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()).replace(/(?<![.!?])\s+(\w)/g, (_, c) => ' ' + c.toLowerCase()),
  },
]

const DEV_CASES = [
  {
    label: 'camelCase',
    fn: (s: string) =>
      s
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (c) => c.toLowerCase()),
  },
  {
    label: 'PascalCase',
    fn: (s: string) =>
      s
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (c) => c.toUpperCase()),
  },
  {
    label: 'snake_case',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_'),
  },
  {
    label: 'kebab-case',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
  },
  {
    label: 'CONSTANT_CASE',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_'),
  },
  {
    label: 'dot.case',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '.'),
  },
  {
    label: 'path/case',
    fn: (s: string) =>
      s
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '/'),
  },
]

function CaseGrid({ cases, input }: { cases: typeof GENERAL_CASES; input: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cases.map(({ label, fn }) => {
        const result = input ? fn(input) : ''
        return (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '2px solid var(--border-text-idle)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {label}
              </span>
              <CopyButton text={result} />
            </div>
            <p
              className="text-base leading-relaxed break-all min-h-[1.5rem]"
              style={{ color: result ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' }}
            >
              {result || 'Output will appear here'}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default function CaseConverterPage() {
  const [input, setInput] = useState('')

  return (
    <ToolLayout
      toolId="case-converter"
      title="Convert Text to Uppercase, Lowercase, Title Case & camelCase"
      description="Convert text between upper, lower, title, camel, snake, kebab, and more"
      seoContent={
        <SeoSection
          aboutTitle="About This Free Online Case Converter"
          about={<>
            <p className="text-lg leading-relaxed">Convert text instantly with our free online Case Converter. Change text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, or path/case in a single click.</p>
            <p className="text-lg leading-relaxed">Whether you&apos;re formatting documents, editing blog posts, renaming programming variables, or preparing text for databases and APIs, this tool makes text conversion fast and effortless. Everything runs locally in your browser, so your text is never uploaded to a server, ensuring complete privacy.</p>
            <p className="text-lg leading-relaxed">Designed for both everyday users and developers, this case converter helps standardize text formatting, improve consistency, and eliminate manual editing.</p>
          </>}
          benefits={{
            title: 'Why Use This Case Converter?',
            intro: 'Our browser-based text case converter is fast, accurate, and easy to use.',
            items: [
              'Convert text between multiple case styles instantly',
              'Supports both writing and programming naming conventions',
              'Preserve numbers, punctuation, and special characters where appropriate',
              'One-click copy to clipboard',
              'No registration or software installation required',
              'Works on Windows, macOS, Linux, Android, and iPhone',
              'Text never leaves your device',
            ],
          }}
          extraSections={[
            {
              title: 'Supported Case Styles',
              intro: 'This tool supports the most commonly used text and programming naming conventions.',
              items: [
                <div key="upper" className="space-y-1">
                  <p className="text-lg font-medium text-white">UPPERCASE</p>
                  <p className="text-lg leading-relaxed">Converts every letter to uppercase.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>HELLO WORLD</code>
                </div>,
                <div key="lower" className="space-y-1">
                  <p className="text-lg font-medium text-white">lowercase</p>
                  <p className="text-lg leading-relaxed">Converts every letter to lowercase.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>hello world</code>
                </div>,
                <div key="title" className="space-y-1">
                  <p className="text-lg font-medium text-white">Title Case</p>
                  <p className="text-lg leading-relaxed">Capitalizes the first letter of every word.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>Hello World</code>
                </div>,
                <div key="sentence" className="space-y-1">
                  <p className="text-lg font-medium text-white">Sentence case</p>
                  <p className="text-lg leading-relaxed">Capitalizes only the first letter of each sentence.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>Hello world. This is an example.</code>
                </div>,
                <div key="camel" className="space-y-1">
                  <p className="text-lg font-medium text-white">camelCase</p>
                  <p className="text-lg leading-relaxed">The first word begins with a lowercase letter, and each following word begins with an uppercase letter.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>myVariableName</code>
                  <p className="text-lg leading-relaxed">Commonly used in JavaScript, Java, and many programming languages.</p>
                </div>,
                <div key="pascal" className="space-y-1">
                  <p className="text-lg font-medium text-white">PascalCase</p>
                  <p className="text-lg leading-relaxed">Every word begins with an uppercase letter.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>MyComponentName</code>
                  <p className="text-lg leading-relaxed">Frequently used for class names, components, and constructors.</p>
                </div>,
                <div key="snake" className="space-y-1">
                  <p className="text-lg font-medium text-white">snake_case</p>
                  <p className="text-lg leading-relaxed">Words are separated using underscores.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>my_variable_name</code>
                  <p className="text-lg leading-relaxed">Commonly used in Python, databases, and configuration files.</p>
                </div>,
                <div key="kebab" className="space-y-1">
                  <p className="text-lg font-medium text-white">kebab-case</p>
                  <p className="text-lg leading-relaxed">Words are separated using hyphens.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>my-variable-name</code>
                  <p className="text-lg leading-relaxed">Widely used in URLs, CSS classes, and file names.</p>
                </div>,
                <div key="constant" className="space-y-1">
                  <p className="text-lg font-medium text-white">CONSTANT_CASE</p>
                  <p className="text-lg leading-relaxed">Words are uppercase and separated with underscores.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>MAX_FILE_SIZE</code>
                  <p className="text-lg leading-relaxed">Often used for constants, environment variables, and configuration keys.</p>
                </div>,
                <div key="dot" className="space-y-1">
                  <p className="text-lg font-medium text-white">dot.case</p>
                  <p className="text-lg leading-relaxed">Words are separated using periods.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>my.variable.name</code>
                  <p className="text-lg leading-relaxed">Commonly found in configuration files, localization keys, logging systems, and object paths.</p>
                </div>,
                <div key="path" className="space-y-1">
                  <p className="text-lg font-medium text-white">path/case</p>
                  <p className="text-lg leading-relaxed">Words are separated using forward slashes.</p>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>Example:</p>
                  <code className="text-base font-mono" style={{ color: 'rgba(255,255,255,0.85)' }}>my/path/name</code>
                  <p className="text-lg leading-relaxed">Useful for file paths, URL paths, routing systems, and hierarchical identifiers.</p>
                </div>,
              ],
            },
            {
              title: 'Who Uses This Tool?',
              intro: 'This text case converter is useful for professionals and students alike.',
              items: [
                'Writers', 'Bloggers', 'Editors', 'Students', 'Teachers',
                'Web Developers', 'Software Engineers', 'Mobile App Developers',
                'Database Administrators', 'DevOps Engineers', 'Technical Writers',
                'SEO Specialists', 'Content Creators', 'Digital Marketers',
              ],
            },
            {
              title: 'How Word Detection Works',
              intro: 'The converter automatically detects word boundaries by splitting text on:',
              items: [
                'Spaces',
                'Underscores (_)',
                'Hyphens (-)',
                'Periods (.)',
                'Forward slashes (/)',
                'Transitions between lowercase and uppercase letters',
              ],
              closing: 'For example, all of the following are interpreted correctly: myVariableName, my-variable-name, my_variable_name, my.variable.name, my/path/name — allowing accurate conversion between naming conventions without manual editing.',
            },
          ]}
          useCasesTitle="Common Use Cases"
          useCasesIntro="This online case converter is useful for many writing and development tasks."
          useCases={[
            'Convert text to UPPERCASE or lowercase',
            'Format blog titles using Title Case',
            'Correct Sentence case in documents',
            'Rename JavaScript variables to camelCase',
            'Convert class names to PascalCase',
            'Convert database fields to snake_case',
            'Create CSS class names using kebab-case',
            'Generate CONSTANT_CASE for constants and environment variables',
            'Create dot.case keys for configuration files',
            'Generate path/case strings for URLs and routing',
            'Standardize naming conventions across projects',
            'Clean up copied text before publishing',
          ]}
          faqs={[
            {
              q: 'What is the difference between camelCase and PascalCase?',
              a: <><p className="text-lg leading-relaxed mb-1">camelCase starts with a lowercase letter, while PascalCase starts with an uppercase letter.</p><p className="text-lg leading-relaxed mb-1">Examples:</p><p className="text-lg leading-relaxed">camelCase: <code className="font-mono">myVariableName</code> — PascalCase: <code className="font-mono">MyVariableName</code></p><p className="text-lg leading-relaxed">Both capitalize the first letter of each subsequent word.</p></>,
            },
            {
              q: 'What is snake_case?',
              a: <>snake_case separates words using underscores. Example: <code className="font-mono">my_variable_name</code>. Commonly used in Python programming, SQL databases, and configuration files.</>,
            },
            {
              q: 'What is kebab-case?',
              a: <>kebab-case separates words using hyphens. Example: <code className="font-mono">my-variable-name</code>. Widely used in URLs, CSS class names, and file names.</>,
            },
            {
              q: 'What is CONSTANT_CASE?',
              a: <>CONSTANT_CASE converts every letter to uppercase while separating words with underscores. Example: <code className="font-mono">MAX_UPLOAD_SIZE</code>. Commonly used for constants, environment variables, and configuration settings.</>,
            },
            {
              q: 'What is dot.case?',
              a: <>dot.case separates words using periods. Example: <code className="font-mono">user.profile.name</code>. Commonly used for localization keys, configuration systems, and object paths.</>,
            },
            {
              q: 'What is path/case?',
              a: <>path/case separates words using forward slashes. Example: <code className="font-mono">user/profile/settings</code>. Useful for URL routing, API endpoints, and file system paths.</>,
            },
            {
              q: 'Does the converter preserve punctuation?',
              a: 'Yes. The converter preserves punctuation, numbers, and most special characters whenever possible while changing only the text casing.',
            },
            {
              q: 'Can I convert multiple paragraphs?',
              a: 'Yes. You can paste single words, sentences, paragraphs, or large documents into the converter.',
            },
            {
              q: 'Does it support Unicode characters?',
              a: "Yes. The converter uses JavaScript's built-in Unicode-aware case conversion functions, which correctly handle most accented Latin characters and many other Unicode scripts supported by modern browsers.",
            },
            {
              q: 'Is my text uploaded anywhere?',
              a: 'No. All processing happens locally inside your browser. Your text is never uploaded or stored on any server.',
            },
            {
              q: 'Is this Case Converter free?',
              a: 'Yes. The tool is completely free to use with no registration, no limits, and no software installation required.',
            },
          ]}
        />
      }
      category="text"
      iconName="CaseSensitive"
      showAllCategory
      compactRelated
    >
      <div className="space-y-8">
        <Textarea
          label="Input text"
          value={input}
          onChange={setInput}
          placeholder="Type or paste your text here…"
          rows={5}
          showCount
        />

        <div className="space-y-3">
          <h2 className="text-base font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            General
          </h2>
          <CaseGrid cases={GENERAL_CASES} input={input} />
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Developer
          </h2>
          <CaseGrid cases={DEV_CASES} input={input} />
        </div>
      </div>
    </ToolLayout>
  )
}
