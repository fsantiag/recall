import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recall — Medical Billing Tracker',
    short_name: 'Recall',
    description: 'Track medical procedures and pending insurance claims',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfcfd',
    theme_color: '#005860',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png',          sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png',          sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
