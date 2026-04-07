import { headers } from 'next/headers'

function siteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return null
  try {
    return new URL(raw.replace(/\/$/, '')).origin
  } catch {
    return null
  }
}

function requestHost(headersList: Headers): string | null {
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host')
  return host?.trim().toLowerCase() || null
}

function sameHostAsRequest(urlLike: string, headersList: Headers): boolean {
  const host = requestHost(headersList)
  if (!host) return false
  try {
    return new URL(urlLike).host.toLowerCase() === host
  } catch {
    return false
  }
}

function sameHostAsExpected(expectedOrigin: string, headersList: Headers): boolean {
  const host = requestHost(headersList)
  if (!host) return false
  try {
    return host.toLowerCase() === new URL(expectedOrigin).host.toLowerCase()
  } catch {
    return false
  }
}

/**
 * Restrict public POSTs to same-site origins. Allows missing Origin when
 * Referer matches or Sec-Fetch-Site is same-origin (typical for same-origin fetch).
 */
export async function validateOrigin(): Promise<boolean> {
  const expected = siteOrigin()
  if (!expected) return true

  const headersList = await headers()
  const origin = headersList.get('origin')
  if (origin) {
    try {
      const parsed = new URL(origin)
      if (parsed.origin === expected) return true
      // If the request is same-host as the current request (common in local dev),
      // treat it as same-site even if NEXT_PUBLIC_SITE_URL points elsewhere.
      if (sameHostAsRequest(origin, headersList)) return true
      return false
    } catch {
      return false
    }
  }

  const referer = headersList.get('referer')
  if (referer) {
    try {
      const parsed = new URL(referer)
      if (parsed.origin === expected) return true
      if (sameHostAsRequest(referer, headersList)) return true
      return false
    } catch {
      return false
    }
  }

  if (headersList.get('sec-fetch-site') === 'same-origin') return true
  if (sameHostAsExpected(expected, headersList)) return true

  return process.env.NODE_ENV !== 'production'
}
