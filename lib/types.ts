export type Category = 'image' | 'dev' | 'web' | 'text' | 'typing' | 'convertor' | 'generator'

export type ToolDefinition = {
  id: string
  name: string
  description: string
  href: string
  category: Category
  iconName: string
  keywords: string[]
  new?: boolean
}
