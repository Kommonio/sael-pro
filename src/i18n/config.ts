export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeCookieName = 'NEXT_LOCALE'

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage?.trim()) return defaultLocale

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tagRaw, ...params] = part.trim().split(';')
      const tag = (tagRaw || '').trim().toLowerCase()
      let q = 1
      for (const param of params) {
        const [k, v] = param.trim().split('=')
        if (k === 'q' && v != null) {
          const n = Number(v)
          if (Number.isFinite(n)) q = n
        }
      }
      return { tag, q }
    })
    .filter((item) => item.tag)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of ranked) {
    const primary = tag.split('-')[0]
    if (primary === 'fr') return 'fr'
    if (primary === 'en') return 'en'
  }

  return defaultLocale
}
