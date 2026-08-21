'use client'

import { useEffect, useRef } from 'react'

import type { Locale } from '@/i18n/config'
import type { CaseStudyView } from '@/lib/caseStudies'
import { t } from '@/lib/copy'
import type { Cover } from '@/lib/covers'
import { focalPoint, mediaUrl, type MediaDoc } from '@/lib/media'
import type { ProjectVideo } from '@/lib/videoMedia'
import { useThreadGate } from '@/thread/useThreadGate'

import { CaseStudyRail, CaseSystemMap, type CaseStudyRailItem } from './CaseStudyLayers'
import { EssayBody } from './ContentEssay'
import { MediaFigure } from './MediaFigure'
import { ProjectVideoPlayer } from './ProjectVideoPlayer'
import { Still } from './Still'
import { ThreadLink } from './ThreadLink'
import { WorkLink } from './WorkLink'

export type CaseStudyNeighbor = {
  slug: string
  title: string
  year?: string | null
  role: string
  lede: string
}

function ChapterHeading({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <header className="case-chapter-heading">
      <p className="case-chapter-index type-meta">
        <span>{index}</span>
        {eyebrow}
      </p>
      <h2 className="type-title">{title}</h2>
    </header>
  )
}

function CaseMedia({ cover, className, sizes }: { cover: Cover; className: string; sizes: string }) {
  return (
    <figure className={className}>
      <Still src={cover.src} alt={cover.alt} sizes={sizes} className="case-media-image" />
      {cover.credit ? <figcaption className="type-meta">{cover.credit}</figcaption> : null}
    </figure>
  )
}

function CmsCaseMedia({
  media,
  className,
  sizes,
}: {
  media: MediaDoc
  className: string
  sizes: string
}) {
  const src = mediaUrl(media, 'xlarge') || mediaUrl(media)
  if (!src) return null

  return (
    <figure className={className}>
      <Still
        src={src}
        alt={media.alt || ''}
        position={focalPoint(media)}
        sizes={sizes}
        className="case-media-image"
      />
      {media.credit ? <figcaption className="type-meta">{media.credit}</figcaption> : null}
    </figure>
  )
}

function twoDigits(value: number) {
  return String(value).padStart(2, '0')
}

export function CaseStudy({
  locale,
  project,
  stills,
  hero,
  galleryMedia = [],
  diagram,
  videos,
  climate,
  nextProject,
}: {
  locale: Locale
  project: CaseStudyView
  stills: Cover[]
  hero?: MediaDoc | null
  galleryMedia?: MediaDoc[]
  diagram?: MediaDoc | null
  videos?: ProjectVideo[]
  climate: string
  nextProject?: CaseStudyNeighbor | null
}) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const labels = t(locale)
  const cover = hero ? undefined : stills[0]
  const experienceStill = stills[1]
  const systemStill = stills[2]
  const experienceGalleryMedia = experienceStill ? null : galleryMedia[0] || null
  const experienceMedia = experienceGalleryMedia || (experienceStill ? null : hero) || null
  const gallery = stills.slice(3)
  const cmsGallery = galleryMedia.slice(experienceGalleryMedia ? 1 : 0)
  const hasHeroMedia = Boolean(cover || hero)

  const authorship =
    project.authorship === 'authored'
      ? labels.authoredWork
      : project.authorship === 'collaborative'
        ? labels.collaborativeWork
        : project.authorship === 'experiment'
          ? labels.experimentalWork
          : labels.contributionWork

  const collaborators = (project.credits || [])
    .map((credit) => credit.name)
    .filter((name) => !/^sa[eë]l simard$/i.test(name.trim()))
    .filter((name, index, names) => names.indexOf(name) === index)
    .join(', ')

  const facts = [
    { label: labels.authorship, value: authorship },
    { label: labels.role, value: project.role },
    { label: labels.studio, value: project.studio },
    { label: labels.client, value: project.client },
    { label: labels.year, value: project.year },
    { label: labels.location, value: project.location },
    { label: labels.collaborators, value: collaborators },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value))

  const railItems: CaseStudyRailItem[] = []
  const addRailItem = (id: string, label: string) => {
    railItems.push({ id, label, index: twoDigits(railItems.length + 1) })
  }
  if (project.question) addRailItem('case-question', labels.question)
  if (project.experience) addRailItem('case-experience', labels.experience)
  if (project.system) addRailItem('case-system', labels.system)
  if (project.whatChanged) addRailItem('case-consequence', labels.whatChanged)
  if (videos?.length) addRailItem('case-media', labels.media)
  if (facts.length) addRailItem('case-context', labels.context)
  if (project.credits?.length) addRailItem('case-credits', labels.credits)

  const chapterIndex = (id: string) => railItems.find((item) => item.id === id)?.index || '—'
  const firstSectionId = railItems[0]?.id || 'case-context'
  const systemContext = project.studio || project.client || authorship

  useThreadGate(titleRef)

  useEffect(() => {
    const heroElement = heroRef.current
    if (!heroElement || !hasHeroMedia) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.dataset.header = entry.isIntersecting ? 'over-night' : 'paper'
      },
      { threshold: 0.28 },
    )
    observer.observe(heroElement)
    return () => {
      observer.disconnect()
      document.documentElement.dataset.header = 'paper'
    }
  }, [hasHeroMedia])

  return (
    <>
      <div
        ref={heroRef}
        className={`case-hero ${hasHeroMedia ? 'case-hero--media' : 'case-hero--typographic'}`}
        data-project-slug={project.slug}
        data-hero-treatment={hasHeroMedia ? 'media' : 'typographic'}
        data-hero-kind={cover ? 'image' : typeof hero === 'object' ? hero?.kind || 'image' : undefined}
      >
        {cover ? (
          <Still
            src={cover.src}
            alt={cover.alt || project.title}
            position={project.slug === 'azul-vivo' ? 'center top' : 'center'}
            transitionName={`still-${project.slug}`}
            sizes="100vw"
            priority
            className="absolute inset-0"
          />
        ) : (
          <MediaFigure
            media={hero}
            slug={project.slug}
            title=""
            overlay={false}
            climate={climate}
            className="absolute inset-0"
            priority
            sizes="100vw"
          />
        )}

        <div className="case-hero-overlay" />
        <div className="case-hero-content site-shell">
          <div className="case-hero-register">
            <p className="type-meta">{labels.caseStudy}</p>
            <p className="type-meta">{authorship}</p>
          </div>
          <div className="case-hero-title">
            <p className="type-meta">
              {project.year}
              {project.location ? ` · ${project.location}` : ''}
            </p>
            <h1 ref={titleRef}>{project.title}</h1>
            <p className="case-hero-role type-meta">{project.role}</p>
            <p className="case-hero-lede">{project.lede}</p>
          </div>
          <a href={`#${firstSectionId}`} className="case-hero-thread" aria-label={railItems[0]?.label || labels.context}>
            <span aria-hidden="true" />
            <span className="type-meta">{twoDigits(railItems.length)}</span>
          </a>
        </div>
      </div>

      <div className="case-layout site-shell">
        <CaseStudyRail label={labels.caseStudy} items={railItems} />

        <div className="case-story">
          {project.question ? (
            <section id="case-question" className="case-chapter case-chapter--question">
              <ChapterHeading index={chapterIndex('case-question')} eyebrow={labels.premise} title={labels.question} />
              <p className="case-question-copy">{project.question}</p>
            </section>
          ) : null}

          {project.experience ? (
            <section id="case-experience" className="case-chapter case-chapter--experience">
              <ChapterHeading
                index={chapterIndex('case-experience')}
                eyebrow={labels.encounter}
                title={labels.experience}
              />
              <div className="case-experience-grid">
                {experienceStill ? (
                  <CaseMedia
                    cover={experienceStill}
                    className="case-media case-media--experience"
                    sizes="(min-width: 1280px) 56rem, (min-width: 768px) 64vw, 100vw"
                  />
                ) : experienceMedia ? (
                  <CmsCaseMedia
                    media={experienceMedia}
                    className="case-media case-media--experience"
                    sizes="(min-width: 1280px) 56rem, (min-width: 768px) 64vw, 100vw"
                  />
                ) : (
                  <div className="case-experience-field" aria-hidden="true">
                    <div className="case-experience-field-register">
                      <p className="type-meta">{project.year}</p>
                      <p className="case-experience-field-title">{project.title}</p>
                      <p className="case-experience-field-role type-meta">{project.role}</p>
                    </div>
                    {project.technologies?.length ? (
                      <ul className="case-experience-field-tags type-meta">
                        {project.technologies.slice(0, 4).map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )}
                <div className="case-experience-copy">
                  <EssayBody text={project.experience} />
                </div>
              </div>
            </section>
          ) : null}

          {project.system ? (
            <section id="case-system" className="case-chapter case-chapter--system">
              <ChapterHeading index={chapterIndex('case-system')} eyebrow={labels.architecture} title={labels.system} />
              <CaseSystemMap
                title={project.title}
                context={systemContext}
                role={project.role}
                technologies={project.technologies || []}
                still={systemStill}
                labels={labels}
              />
              {diagram ? (
                <CmsCaseMedia
                  media={diagram}
                  className="case-media case-media--diagram"
                  sizes="(min-width: 1280px) 66rem, 82vw"
                />
              ) : null}
              <div className="case-system-copy">
                <EssayBody text={project.system} />
              </div>
            </section>
          ) : null}

          {project.whatChanged ? (
            <section id="case-consequence" className="case-chapter case-chapter--consequence">
              <ChapterHeading
                index={chapterIndex('case-consequence')}
                eyebrow={labels.consequence}
                title={labels.whatChanged}
              />
              <div className="case-consequence-copy">
                <EssayBody text={project.whatChanged} />
              </div>
            </section>
          ) : null}

          {videos?.length ? (
            <section id="case-media" className="case-chapter case-chapter--media">
              <ChapterHeading
                index={chapterIndex('case-media')}
                eyebrow={labels.movingImage}
                title={labels.media}
              />
              <div className="case-video-gallery">
                {videos.map((video, index) => (
                  <ProjectVideoPlayer
                    key={`${video.id || video.url || video.title}-${index}`}
                    video={video}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {gallery.length || cmsGallery.length ? (
            <div className="case-gallery" role="group" aria-label={`${project.title} — ${labels.experience}`}>
              {gallery.map((still, index) => (
                <CaseMedia
                  key={still.src}
                  cover={still}
                  className={`case-media case-media--gallery case-media--gallery-${index + 1}`}
                  sizes="(min-width: 1280px) 42rem, (min-width: 768px) 48vw, 100vw"
                />
              ))}
              {cmsGallery.map((media, index) => (
                <CmsCaseMedia
                  key={String(media.id || media.url || index)}
                  media={media}
                  className={`case-media case-media--gallery case-media--gallery-${gallery.length + index + 1}`}
                  sizes="(min-width: 1280px) 42rem, (min-width: 768px) 48vw, 100vw"
                />
              ))}
            </div>
          ) : null}

          {facts.length ? (
            <section id="case-context" className="case-chapter case-chapter--context">
              <ChapterHeading
                index={chapterIndex('case-context')}
                eyebrow={labels.projectFacts}
                title={labels.context}
              />
              <dl className="case-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="type-meta">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              {project.externalUrl ? (
                <a href={project.externalUrl} className="case-external-link">
                  <span className="type-meta">{labels.visitProject}</span>
                  <span>{project.title}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </section>
          ) : null}

          {project.credits?.length ? (
            <section id="case-credits" className="case-chapter case-chapter--credits">
              <ChapterHeading
                index={chapterIndex('case-credits')}
                eyebrow={labels.attribution}
                title={labels.credits}
              />
              <ul className="case-credits-list">
                {project.credits.map((credit) => (
                  <li key={`${credit.name}-${credit.role}`}>
                    <span>{credit.name}</span>
                    <span>{credit.role}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <div className="case-traversal site-shell">
        <ThreadLink href={`/${locale}/work`} id="work" className="case-back-link">
          <span aria-hidden="true">←</span>
          <span>{labels.backToWork}</span>
        </ThreadLink>

        {nextProject ? (
          <WorkLink href={`/${locale}/work/${nextProject.slug}`} className="case-next-link">
            <span className="type-meta">{labels.nextCase}</span>
            <strong>{nextProject.title}</strong>
            <span className="case-next-role">{nextProject.role}</span>
            <span className="case-next-action">
              {labels.viewNextCase} <span aria-hidden="true">→</span>
            </span>
          </WorkLink>
        ) : null}
      </div>
    </>
  )
}
