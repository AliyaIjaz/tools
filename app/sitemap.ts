import type { MetadataRoute } from 'next'
import { TOOLS } from '@/lib/tools'

export const dynamic = 'force-static'

const BASE_URL = 'https://freetools.zenveel.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const toolRoutes = TOOLS.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...toolRoutes,
  ]
}
