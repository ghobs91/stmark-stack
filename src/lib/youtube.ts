const API_BASE = 'https://www.googleapis.com/youtube/v3'
const LIVE_REVALIDATE_SECONDS = 60
const META_REVALIDATE_SECONDS = 3600

export type LiveStatus = {
  isLive: boolean
  videoId: string | null
  title: string | null
  channelTitle: string | null
  thumbnail: string | null
}

export type ArchivedVideo = {
  videoId: string
  title: string
  thumbnail: string
  publishedAt: string
}

const EMPTY_LIVE_STATUS: LiveStatus = {
  isLive: false,
  videoId: null,
  title: null,
  channelTitle: null,
  thumbnail: null,
}

const getApiKey = () => process.env.YOUTUBE_API_KEY || ''

const isChannelId = (value: string) => /^UC[\w-]{20,}$/.test(value)

async function resolveChannelId(handleOrId: string): Promise<string | null> {
  const apiKey = getApiKey()
  const value = handleOrId.trim()
  if (!apiKey || !value) return null
  if (isChannelId(value)) return value

  const forHandle = value.startsWith('@') ? value.slice(1) : value
  try {
    const url = `${API_BASE}/channels?part=id&forHandle=${encodeURIComponent(forHandle)}&key=${apiKey}`
    const res = await fetch(url, { next: { revalidate: META_REVALIDATE_SECONDS } })
    if (!res.ok) return null
    const data = (await res.json()) as { items?: Array<{ id?: string }> }
    return data.items?.[0]?.id ?? null
  } catch {
    return null
  }
}

/**
 * Returns the first configured channel that is currently broadcasting live,
 * or an "offline" status. Cached in the Next.js Data Cache for 60 seconds.
 */
export async function getLiveStatus(channels: string[]): Promise<LiveStatus> {
  const apiKey = getApiKey()
  if (!apiKey || channels.length === 0) return EMPTY_LIVE_STATUS

  for (const channel of channels) {
    const channelId = await resolveChannelId(channel)
    if (!channelId) continue

    try {
      const url =
        `${API_BASE}/search?part=snippet&channelId=${channelId}` +
        `&eventType=live&type=video&maxResults=1&key=${apiKey}`
      const res = await fetch(url, { next: { revalidate: LIVE_REVALIDATE_SECONDS } })
      if (!res.ok) continue

      const data = (await res.json()) as {
        items?: Array<{
          id?: { videoId?: string }
          snippet?: {
            title?: string
            channelTitle?: string
            thumbnails?: { high?: { url?: string }; medium?: { url?: string } }
          }
        }>
      }

      const item = data.items?.[0]
      const videoId = item?.id?.videoId
      if (item && videoId) {
        return {
          isLive: true,
          videoId,
          title: item.snippet?.title ?? null,
          channelTitle: item.snippet?.channelTitle ?? null,
          thumbnail:
            item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.medium?.url ?? null,
        }
      }
    } catch {
      // Ignore a single channel failure and try the next one.
    }
  }

  return EMPTY_LIVE_STATUS
}

/** Latest uploads across the configured channels, used when nothing is live. */
export async function getRecentVideos(channels: string[], max = 8): Promise<ArchivedVideo[]> {
  const apiKey = getApiKey()
  if (!apiKey || channels.length === 0) return []

  const results: ArchivedVideo[] = []

  for (const channel of channels) {
    if (results.length >= max) break
    const channelId = await resolveChannelId(channel)
    if (!channelId) continue

    try {
      const url =
        `${API_BASE}/search?part=snippet&channelId=${channelId}` +
        `&order=date&type=video&maxResults=${max}&key=${apiKey}`
      const res = await fetch(url, { next: { revalidate: LIVE_REVALIDATE_SECONDS } })
      if (!res.ok) continue

      const data = (await res.json()) as {
        items?: Array<{
          id?: { videoId?: string }
          snippet?: {
            title?: string
            publishedAt?: string
            thumbnails?: { medium?: { url?: string }; high?: { url?: string } }
          }
        }>
      }

      for (const item of data.items ?? []) {
        const videoId = item.id?.videoId
        if (!videoId) continue
        results.push({
          videoId,
          title: item.snippet?.title ?? 'Untitled',
          thumbnail:
            item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.high?.url ?? '',
          publishedAt: item.snippet?.publishedAt ?? '',
        })
        if (results.length >= max) break
      }
    } catch {
      // Ignore and continue with the remaining channels.
    }
  }

  return results
}

export const youtubeEmbedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`

export const youtubeWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`
