import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://novathreads.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/cart/', '/api/', '/(payload)/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
