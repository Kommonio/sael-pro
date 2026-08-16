import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Attend } from '@/condition/Attend'
import { LayerToggle } from '@/components/LayerToggle'
import { MediaFigure } from '@/components/MediaFigure'
import { isLocale, type Locale } from '@/i18n/config'
import { t } from '@/lib/copy'
import type { MediaDoc } from '@/lib/media'
import { getProject, getProjects } from '@/lib/payload'
import { lexicalText, RichText } from '@/lib/richText'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const { docs } = await getProjects('en')
    return ['en', 'fr'].flatMap((locale) => docs.map((doc) => ({ locale, slug: doc.slug })))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await getProject(slug, locale)
  if (!project) return {}
  return {
    title: project.title,
    description: project.lede,
    alternates: {
      canonical: `${getServerSideURL()}/${locale}/work/${slug}`,
      languages: {
        en: `${getServerSideURL()}/en/work/${slug}`,
        fr: `${getServerSideURL()}/fr/work/${slug}`,
      },
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale
  const project = await getProject(slug, locale)
  if (!project) notFound()
  const labels = t(locale)
  const hero = typeof project.hero === 'object' ? (project.hero as MediaDoc) : null

  return (
    <article>
      <Attend
        slug={project.slug}
        title={project.title}
        authorship={project.authorship}
        climateHint={project.climateHint || 'earth'}
      />
      <header className="site-shell pt-12 md:pt-20">
        <p className="type-meta text-ink/50">
          {project.studio ? `${project.studio} · ` : ''}
          {project.year}
          {project.location ? ` · ${project.location}` : ''}
        </p>
        <h1 className="type-display mt-4">{project.title}</h1>
        <p className="mt-6 type-meta">{labels.role}</p>
        <p className="type-title mt-2 max-w-3xl">{project.role}</p>
        <p className="mt-8 max-w-2xl type-lede text-ink/75">{project.lede}</p>
      </header>

      <div className="relative mt-12 min-h-[70vw] md:min-h-[82vh]">
        <MediaFigure
          media={hero}
          title={project.title}
          climate={project.climateHint || 'earth'}
          className="absolute inset-0"
          priority
          sizes="100vw"
        />
      </div>

      <div className="site-shell grid gap-16 py-16 md:grid-cols-12 md:py-24">
        <aside className="md:col-span-4">
          <p className="type-meta text-ink/50">{labels.context}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/75">
            {project.client ? <li>{project.client}</li> : null}
            {project.studio ? <li>{project.studio}</li> : null}
            {project.location ? <li>{project.location}</li> : null}
            {project.externalUrl ? (
              <li>
                <a href={project.externalUrl} className="underline">
                  {project.externalUrl.replace(/^https?:\/\//, '')}
                </a>
              </li>
            ) : null}
          </ul>
          {project.question ? (
            <div className="mt-10">
              <p className="type-meta text-ink/50">{labels.question}</p>
              <p className="mt-3 font-display text-2xl leading-tight">{project.question}</p>
            </div>
          ) : null}
        </aside>
        <div className="md:col-span-8">
          <LayerToggle
            locale={locale}
            experience={<RichText data={project.experience} />}
            system={
              <div>
                <RichText data={project.system} />
                {project.technologies?.length ? (
                  <p className="mt-8 font-mono text-xs tracking-wide text-ink/55">
                    {project.technologies.join(' · ')}
                  </p>
                ) : null}
              </div>
            }
          />
          {lexicalText(project.whatChanged) ? (
            <div className="mt-16 border-t border-ink/10 pt-10">
              <p className="type-meta text-ink/50">{labels.whatChanged}</p>
              <div className="mt-4">
                <RichText data={project.whatChanged} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {project.credits?.length ? (
        <section className="site-shell border-t border-ink/10 py-16">
          <p className="type-meta text-ink/50">{labels.credits}</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {project.credits.map((credit) => (
              <li key={`${credit.name}-${credit.role}`}>
                <span className="font-display text-xl">{credit.name}</span>
                <span className="ml-3 text-sm text-ink/60">{credit.role}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
