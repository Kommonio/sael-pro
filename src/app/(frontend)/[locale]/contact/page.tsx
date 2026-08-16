import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/ContactForm'
import { isLocale, type Locale } from '@/i18n/config'
import { getGlobal } from '@/lib/payload'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Contact',
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/contact`,
      languages: { en: `${getServerSideURL()}/en/contact`, fr: `${getServerSideURL()}/fr/contact` },
    },
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

  return (
    <div className="site-shell grid gap-14 py-16 md:grid-cols-12 md:py-24">
      <div className="md:col-span-6">
        <p className="type-meta text-ink/50">Contact</p>
        <h1 className="type-display mt-4">{contact.title}</h1>
        <p className="mt-8 type-lede text-ink/75">{contact.intro}</p>
        {contact.email ? (
          <a href={`mailto:${contact.email}`} className="mt-6 block font-display text-2xl">
            {contact.email}
          </a>
        ) : null}
        {contact.availability ? <p className="mt-6 text-sm text-ink/60">{contact.availability}</p> : null}
      </div>
      <div className="md:col-span-6">
        <ContactForm locale={locale} submitLabel={contact.submitLabel} successMessage={contact.successMessage} />
      </div>
    </div>
  )
}
