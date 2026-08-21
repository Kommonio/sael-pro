import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { chromium, type APIRequestContext, type Browser, type Page } from 'playwright'

type Failure = {
  route: string
  kind: string
  url?: string
  detail: string
}

type BrowserAsset = {
  kind: 'background' | 'image' | 'video'
  source: string
  alt?: string | null
  complete?: boolean
  naturalWidth?: number
  naturalHeight?: number
  renderedWidth?: number
  renderedHeight?: number
  display?: string
  visibility?: string
  opacity?: string
  error?: string | null
}

const baseURL = (process.env.MEDIA_VALIDATION_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const outputFile = path.resolve(process.cwd(), 'tmp/wp-uploads-analysis/public-media-validation.json')
const locales = ['en', 'fr'] as const
const pagePaths = ['', '/work', '/practice', '/lab', '/about', '/contact']
let activeBrowser: Browser | null = null

function absoluteURL(value: string) {
  return new URL(value, baseURL).toString()
}

function isMediaRequest(url: string, resourceType?: string) {
  return (
    resourceType === 'image' ||
    resourceType === 'media' ||
    /\.(?:avif|gif|jpe?g|m4v|mov|mp4|png|svg|webm|webp)(?:\?|$)/i.test(url) ||
    url.includes('/api/media/file/') ||
    url.includes('/_next/image?')
  )
}

async function discoverProjectSlugs(request: APIRequestContext) {
  const response = await request.get(`${baseURL}/api/projects?limit=100&depth=0&locale=en`)
  if (!response.ok()) throw new Error(`Project discovery failed: ${response.status()} ${response.url()}`)
  const body = (await response.json()) as { docs?: { slug?: string | null }[] }
  return Array.from(new Set((body.docs || []).map((doc) => doc.slug).filter(Boolean))) as string[]
}

async function validateURL(
  request: APIRequestContext,
  route: string,
  kind: string,
  url: string,
  failures: Failure[],
) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return null
  const resolved = absoluteURL(url)
  const local = new URL(resolved).origin === new URL(baseURL).origin
  if (!local) return { url: resolved, status: 'external-not-fetched' }

  try {
    const response = await request.get(resolved, {
      failOnStatusCode: false,
      headers: /\.(?:m4v|mov|mp4|webm)(?:\?|$)/i.test(resolved)
        ? { Range: 'bytes=0-1023' }
        : undefined,
      timeout: 30_000,
    })
    const status = response.status()
    const contentType = response.headers()['content-type'] || ''
    if (status < 200 || status >= 400) {
      failures.push({ route, kind, url: resolved, detail: `HTTP ${status}` })
    } else if (!/^(image|video)\//.test(contentType) && kind !== 'metadata') {
      failures.push({ route, kind, url: resolved, detail: `Unexpected content type: ${contentType || 'missing'}` })
    }
    return { url: resolved, status, contentType }
  } catch (error) {
    failures.push({ route, kind, url: resolved, detail: String(error) })
    return { url: resolved, status: 'request-failed' }
  }
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds))
    const step = Math.max(480, Math.floor(window.innerHeight * 0.78))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await pause(90)
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await pause(250)
  })
}

async function collectBrowserAssets(page: Page) {
  return page.evaluate(() => {
    const backgroundURLs = new Set<string>()
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('*'))) {
      const value = getComputedStyle(element).backgroundImage
      for (const match of value.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (match[1]) backgroundURLs.add(match[1])
      }
    }

    const images: BrowserAsset[] = Array.from(document.images).map((image) => {
      const bounds = image.getBoundingClientRect()
      const style = getComputedStyle(image)
      return {
        kind: 'image',
        source: image.currentSrc || image.src,
        alt: image.getAttribute('alt'),
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        renderedWidth: bounds.width,
        renderedHeight: bounds.height,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
      }
    })
    const videos: BrowserAsset[] = Array.from(document.querySelectorAll<HTMLVideoElement>('video')).flatMap(
      (video) => [
        {
          kind: 'video' as const,
          source: video.currentSrc || video.src,
          error: video.error ? `${video.error.code}: ${video.error.message}` : null,
        },
        ...(video.poster
          ? [
              {
                kind: 'image' as const,
                source: video.poster,
                alt: video.getAttribute('aria-label'),
              },
            ]
          : []),
      ],
    )

    return {
      assets: [
        ...images,
        ...videos,
        ...Array.from(backgroundURLs).map((source) => ({ kind: 'background' as const, source })),
      ],
      heroTreatment:
        document.querySelector<HTMLElement>('[data-hero-treatment]')?.dataset.heroTreatment || null,
      title: document.title,
    }
  })
}

async function collectMetadataURLs(page: Page) {
  return page.evaluate(() =>
    Array.from(
      document.querySelectorAll<HTMLLinkElement | HTMLMetaElement>(
        'link[rel~="icon"], link[rel="apple-touch-icon"], meta[property="og:image"], meta[name="twitter:image"]',
      ),
    )
      .map((element) =>
        element instanceof HTMLLinkElement ? element.href : element.getAttribute('content') || '',
      )
      .filter(Boolean),
  )
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  activeBrowser = browser
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  await page.addInitScript({ content: 'globalThis.__name = (target) => target' })
  const failures: Failure[] = []
  const projectSlugs = await discoverProjectSlugs(context.request)
  const routes = locales.flatMap((locale) => [
    ...pagePaths.map((pagePath) => `/${locale}${pagePath}`),
    ...projectSlugs.map((slug) => `/${locale}/work/${slug}`),
  ])
  const routeReports: Record<string, unknown>[] = []

  for (const route of routes) {
    const responseStatuses = new Map<string, number>()
    const requestFailures: { url: string; error: string; resourceType: string }[] = []
    const consoleErrors: string[] = []
    const onResponse = (response: { url(): string; status(): number; request(): { resourceType(): string } }) => {
      if (isMediaRequest(response.url(), response.request().resourceType())) {
        responseStatuses.set(response.url(), response.status())
      }
    }
    const onRequestFailed = (request: { url(): string; resourceType(): string; failure(): { errorText: string } | null }) => {
      if (isMediaRequest(request.url(), request.resourceType())) {
        requestFailures.push({
          url: request.url(),
          error: request.failure()?.errorText || 'request failed',
          resourceType: request.resourceType(),
        })
      }
    }
    const onConsole = (message: { type(): string; text(): string }) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    }

    page.on('response', onResponse)
    page.on('requestfailed', onRequestFailed)
    page.on('console', onConsole)
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
    await page.waitForTimeout(500)
    await scrollThrough(page)
    await page.waitForTimeout(500)
    const { assets, heroTreatment, title } = await collectBrowserAssets(page)
    const metadataURLs = await collectMetadataURLs(page)

    if (!response || response.status() >= 400) {
      failures.push({ route, kind: 'document', detail: `HTTP ${response?.status() || 'no response'}` })
    }
    for (const asset of assets) {
      if (!asset.source) {
        failures.push({ route, kind: asset.kind, detail: 'Empty media source' })
        continue
      }
      if (asset.kind === 'image' && asset.complete === true && asset.naturalWidth === 0) {
        failures.push({ route, kind: asset.kind, url: asset.source, detail: 'Loaded image has naturalWidth 0' })
      }
      if (
        asset.kind === 'image' &&
        (asset.naturalWidth || 0) > 0 &&
        asset.display !== 'none' &&
        asset.visibility !== 'hidden' &&
        Number(asset.opacity) > 0 &&
        ((asset.renderedWidth || 0) < 1 || (asset.renderedHeight || 0) < 1)
      ) {
        failures.push({ route, kind: asset.kind, url: asset.source, detail: 'Image loads but has zero rendered area' })
      }
      if (asset.kind === 'video' && asset.error) {
        failures.push({ route, kind: asset.kind, url: asset.source, detail: asset.error })
      }
      const status = responseStatuses.get(asset.source)
      if (status && (status < 200 || status >= 400)) {
        failures.push({ route, kind: asset.kind, url: asset.source, detail: `Browser HTTP ${status}` })
      }
    }
    for (const failed of requestFailures) {
      if (failed.resourceType === 'media' && failed.error === 'net::ERR_ABORTED') continue
      failures.push({ route, kind: 'browser-request', url: failed.url, detail: failed.error })
    }
    for (const metadataURL of metadataURLs) {
      await validateURL(context.request, route, 'metadata', metadataURL, failures)
    }

    routeReports.push({
      route,
      status: response?.status() || null,
      title,
      heroTreatment,
      assets,
      mediaResponses: Array.from(responseStatuses, ([url, status]) => ({ url, status })),
      consoleErrors,
    })
    page.off('response', onResponse)
    page.off('requestfailed', onRequestFailed)
    page.off('console', onConsole)
  }

  const mediaResponse = await context.request.get(`${baseURL}/api/media?limit=100&depth=1&locale=en`)
  const mediaBody = mediaResponse.ok()
    ? ((await mediaResponse.json()) as {
        docs?: {
          filename?: string | null
          url?: string | null
          sizes?: Record<string, { url?: string | null } | null> | null
        }[]
      })
    : { docs: [] }
  const cmsAssets = []
  for (const media of mediaBody.docs || []) {
    const urls = [media.url, ...Object.values(media.sizes || {}).map((size) => size?.url)].filter(Boolean) as string[]
    for (const url of urls) {
      cmsAssets.push({
        filename: media.filename,
        ...(await validateURL(context.request, '/api/media', 'cms-media', url, failures)),
      })
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseURL,
    routeCount: routes.length,
    projectSlugs,
    cmsAssetCount: cmsAssets.length,
    failures,
    cmsAssets,
    routes: routeReports,
  }
  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(outputFile, JSON.stringify(report, null, 2))
  await browser.close()
  activeBrowser = null

  console.log(
    JSON.stringify(
      {
        routes: routes.length,
        projects: projectSlugs.length,
        cmsAssets: cmsAssets.length,
        failures: failures.length,
        typographicHeroes: routeReports
          .filter((route) => route.heroTreatment === 'typographic')
          .map((route) => route.route),
        report: outputFile,
      },
      null,
      2,
    ),
  )
  if (failures.length) process.exitCode = 1
}

main().catch(async (error) => {
  console.error(error)
  await activeBrowser?.close()
  process.exitCode = 1
})
