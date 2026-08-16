import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Attend } from '@/condition/Attend'
import { HeroReveal } from '@/components/HeroReveal'
import { ProjectCard, type ProjectCardData } from '@/components/ProjectCard'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import { getGlobal, getLabItems, getProjects } from '@/lib/payload'
import { RichText } from '@/lib/richText'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const site = await getGlobal<{ seoTitle?: string; seoDescription?: string; thesis?: string }>('site', raw).catch(
    () => ({}),
  )
  return {
    title: site.seoTitle || 'Saël Simard',
    description: site.seoDescription || site.thesis,
    alternates: {
      canonical: `${getServerSideURL()}/${raw}`,
      languages: { en: `${getServerSideURL()}/en`, fr: `${getServerSideURL()}/fr` },
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const labels = t(locale)

  const [home, projects, lab] = await Promise.all([
    getGlobal<{
      heroLine?: string
      heroName?: string
      featured?: ProjectCardData[]
      practiceTitle?: string
      practiceBody?: never
      practiceSteps?: { label?: string; text?: string }[]
      contributionsTitle?: string
      contributionsIntro?: string
      labTitle?: string
      closeLine?: string
    }>('home', locale).catch(() => ({})),
    getProjects(locale).catch(() => ({ docs: [] })),
    getLabItems(locale).catch(() => ({ docs: [] })),
  ])

  const featured = (
    Array.isArray(home.featured) && home.featured.length
      ? home.featured
      : projects.docs
          .filter((doc) => doc.featured)
          .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
  ).filter((project): project is ProjectCardData => Boolean(project && typeof project === 'object' && project.slug))
  const contributions = projects.docs.filter((doc) => doc.authorship === 'contribution')

  return (
    <div>
      <HeroReveal>
        <section className="site-shell relative pb-24 pt-16 md:pb-36 md:pt-28">
          <p className="type-meta text-ink/50" data-reveal>
            Montréal
          </p>
          <h1 className="type-hero mt-6" data-reveal>
            {home.heroName || 'Saël Simard'}
          </h1>
          <p className="mt-10 max-w-2xl type-lede text-ink/75" data-reveal>
            {home.heroLine ||
              (locale === 'fr'
                ? 'Je conçois les conditions d’une expérience — images, logiciels, systèmes et espaces, comme une seule rencontre.'
                : 'I design the conditions for an experience — images, software, systems and space, as one encounter.')}
          </p>
        </section>
      </HeroReveal>

      <section className="site-shell grid gap-20">
        {featured.map((project, i) => (
          <div key={project.slug}>
            <Attend
              slug={project.slug}
              title={project.title}
              authorship={project.authorship}
              climateHint={(project.climateHint as 'earth') || 'earth'}
            />
            <ProjectCard project={project} locale={locale} size={i === 0 ? 'xl' : i % 3 === 2 ? 'compact' : 'regular'} />
          </div>
        ))}
      </section>

      <section className="site-shell mt-28 border-t border-ink/10 pt-16">
        <p className="type-meta text-ink/50">{home.practiceTitle || labels.practice}</p>
        <div className="mt-8 grid gap-10 md:grid-cols-4">
          {(home.practiceSteps || []).map((step) => (
            <div key={step.label} className="border-t border-ochre/50 pt-5">
              <h2 className="type-title">{step.label}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <RichText data={home.practiceBody} />
        </div>
      </section>

      {contributions.length ? (
        <section className="site-shell mt-28">
          <p className="type-meta text-ink/50">{home.contributionsTitle || labels.contributions}</p>
          <p className="mt-5 max-w-2xl type-lede text-ink/70">{home.contributionsIntro}</p>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            {contributions.slice(0, 4).map((project) => (
              <ProjectCard key={project.slug} project={project as ProjectCardData} locale={locale} size="compact" />
            ))}
          </div>
        </section>
      ) : null}

      {lab.docs.length ? (
        <section className="site-shell mt-28 mb-10">
          <div className="flex items-end justify-between">
            <p className="type-meta text-ink/50">{home.labTitle || labels.lab}</p>
            <Link href={`/${locale}/lab`} className="type-meta text-ink/50">
              {labels.lab}
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {lab.docs.slice(0, 2).map((item) => (
              <article key={item.slug} className="border-t border-ink/15 pt-5">
                <p className="type-meta text-ink/45">{item.year}</p>
                <h2 className="type-title mt-2">{item.title}</h2>
                <p className="mt-3 text-ink/70">{item.lede}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="site-shell py-24">
        <p className="type-display max-w-4xl">
          {home.closeLine ||
            (locale === 'fr'
              ? 'Si vous voulez construire une expérience qui doit vraiment tenir — écrivez-moi.'
              : 'If you want to build an experience that has to actually hold — write me.')}
        </p>
        <Link href={`/${locale}/contact`} className="mt-8 inline-block type-meta">
          {labels.contact}
        </Link>
      </section>
    </div>
  )
}
