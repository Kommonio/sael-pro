import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/ContactForm'
import { ContactThread } from '@/components/PageThread'
import { isLocale, type Locale } from '@/i18n/config'
import { socialMetadata } from '@/lib/og/metadata'
import { getGlobal } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const description =
    locale === 'fr'
      ? 'Pour des collaborations, des systèmes, des installations et un travail qui doit tenir dans le réel.'
      : 'For collaborations, systems, installations and work that has to hold in the real.'
  return {
    title: 'Contact',
    ...socialMetadata({ locale, path: ['contact'], title: 'Contact', description }),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const contact = await getGlobal<{
    title?: string
    intro?: string
    email?: string
    availability?: string
    submitLabel?: string
    successMessage?: string
  }>('contact', locale)

  const title = contact.title || (locale === 'fr' ? 'Écrivez-moi.' : 'Write me.')

  return (
    <>
      <h1 className="sr-only">{title}</h1>
      <ContactThread
        locale={locale}
        title={title}
        after={
          <div className="site-shell grid gap-14 pb-24 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="type-lede text-ink/75">
                {contact.intro ||
                  (locale === 'fr'
                    ? 'Pour des collaborations, des systèmes, des installations, et un travail qui doit tenir dans le réel.'
                    : 'For collaborations, systems, installations, and work that has to hold in the real.')}
              </p>
              <a href={`mailto:${contact.email || 'hello@sael.pro'}`} className="mt-6 block font-display text-2xl">
                {contact.email || 'hello@sael.pro'}
              </a>
              <p className="mt-6 text-sm text-muted">
                {contact.availability || (locale === 'fr' ? 'Montréal. Je lis tout.' : 'Montréal. I read everything.')}
              </p>
            </div>
            <div className="md:col-span-6">
              <ContactForm locale={locale} submitLabel={contact.submitLabel} successMessage={contact.successMessage} />
            </div>
          </div>
        }
      />
    </>
  )
}
