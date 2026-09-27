import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { withPayload } from '@payloadcms/next/withPayload'
import withSerwistInit from '@serwist/next'

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() || randomUUID()

const withSerwist = withSerwistInit({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
}

export default withSerwist(withPayload(nextConfig))
