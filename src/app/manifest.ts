import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NOVA THREADS',
    short_name: 'NOVA',
    description: 'Premium Fashion for Everyone',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F2ED',
    theme_color: '#111110',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
