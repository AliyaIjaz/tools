import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Converter Online — Uppercase, Lowercase, Title Case & More',
  description:
    'Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, or path/case instantly. Free, browser-based.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
