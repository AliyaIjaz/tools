import { Category } from './types'

export const BASE_URL = 'https://zenveel.com'

export type CategoryMeta = {
  label: string
  description: string
  iconName: string
  color: string
  dimColor: string
  href: string
}

export const CATEGORIES: Record<Category, CategoryMeta> = {
  image: {
    label: 'Image Tools Online',
    description: 'Compress, resize, convert, rotate, and edit images — no server upload, no registration.',
    iconName: 'Image',
    color: 'var(--color-image)',
    dimColor: 'var(--color-image-dim)',
    href: '/image',
  },
  dev: {
    label: 'Developer Tools Online',
    description: 'Format JSON, encode Base64, generate UUIDs, test regex, and more.',
    iconName: 'Code2',
    color: 'var(--color-dev)',
    dimColor: 'var(--color-dev-dim)',
    href: '/dev',
  },
  web: {
    label: 'Web Dev Tools Online',
    description: 'Generate CSS gradients, shadows, color conversions, and meta tags.',
    iconName: 'Globe',
    color: 'var(--color-web)',
    dimColor: 'var(--color-web-dim)',
    href: '/web',
  },
  text: {
    label: 'Text Tools Online',
    description: 'Convert case, count words, preview Markdown, and transform text.',
    iconName: 'Type',
    color: 'var(--color-text-tool)',
    dimColor: 'var(--color-text-tool-dim)',
    href: '/text',
  },
  typing: {
    label: 'Typing Online',
    description: 'Test and improve your typing speed, accuracy, and WPM.',
    iconName: 'Keyboard',
    color: 'var(--color-text-tool)',
    dimColor: 'var(--color-text-tool-dim)',
    href: '/typing',
  },
  convertor: {
    label: 'Converter Tools Online',
    description: 'Convert eBooks and documents between formats — EPUB to PDF, PDF to EPUB, and more. Runs in your browser.',
    iconName: 'ArrowLeftRight',
    color: 'var(--color-convertor)',
    dimColor: 'var(--color-convertor-dim)',
    href: '/convertor',
  },
}

export const CATEGORY_ORDER: Category[] = ['image', 'text', 'web', 'dev', 'convertor', 'typing']
