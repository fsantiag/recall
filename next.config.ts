import type { NextConfig } from 'next'
import path from 'path'
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: path.resolve('app/sw.ts'),
  swDest: path.resolve('public/sw.js'),
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
  },
}

export default withSerwist(nextConfig)
