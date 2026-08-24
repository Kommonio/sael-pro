import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

import {
  about,
  contact,
  footer,
  header,
  home,
  labItems,
  practice,
  projects,
  site,
  textToLexical,
} from './content'

async function upsertGlobal(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  locale: 'en' | 'fr',
  data: Record<string, unknown>,
) {
  await payload.updateGlobal({
    slug: slug as 'site',
    locale,
    data,
    overrideAccess: true,
  })
}

async function run() {
  const payload = await getPayload({ config })

  const email = process.env.SEED_ADMIN_EMAIL || 'sael@sael.pro'
  const password = process.env.SEED_ADMIN_PASSWORD || 'saelpro-dev-admin'
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  if (!existing.totalDocs) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Saël Simard' },
      overrideAccess: true,
    })
    payload.logger.info(`Created admin ${email}`)
  }

  for (const locale of ['en', 'fr'] as const) {
    await upsertGlobal(payload, 'site', locale, {
      name: site.name,
      email: site.email,
      locationLine: site.locationLine[locale],
      thesis: site.thesis[locale],
      seoTitle: site.seoTitle[locale],
      seoDescription: site.seoDescription[locale],
    })

    await upsertGlobal(payload, 'home', locale, {
      heroName: home.heroName,
      heroLine: home.heroLine[locale],
      practiceTitle: home.practiceTitle[locale],
      practiceSteps: home.practiceSteps.map((step) => ({
        label: step.label[locale],
        text: step.text[locale],
      })),
      contributionsTitle: home.contributionsTitle[locale],
      contributionsIntro: home.contributionsIntro[locale],
      labTitle: home.labTitle[locale],
      closeLine: home.closeLine[locale],
    })

    await upsertGlobal(payload, 'practice', locale, {
      title: practice.title[locale],
      intro: practice.intro[locale],
      sections: practice.sections.map((section) => ({
        title: section.title[locale],
        body: textToLexical(section.body[locale]),
      })),
    })

    await upsertGlobal(payload, 'about', locale, {
      title: about.title[locale],
      currentRole: about.currentRole[locale],
      bio: textToLexical(about.bio[locale]),
      phases: about.phases.map((phase) => ({
        title: phase.title[locale],
        body: phase.body[locale],
      })),
      capabilities: about.capabilities.map((cap) => ({
        domain: cap.domain[locale],
        note: cap.note[locale],
      })),
      education: about.education.map((item) => ({
        place: item.place,
        detail: item.detail[locale],
        years: item.years,
      })),
    })

    await upsertGlobal(payload, 'header', locale, {
      topologyLabel: header.topologyLabel[locale],
      nav: header.nav.map((item) => ({ href: item.href, label: item.label[locale] })),
    })

    await upsertGlobal(payload, 'footer', locale, {
      note: footer.note[locale],
      contactLabel: footer.contactLabel[locale],
    })

    await upsertGlobal(payload, 'contact', locale, {
      title: contact.title[locale],
      intro: contact.intro[locale],
      email: contact.email,
      availability: contact.availability[locale],
      submitLabel: contact.submitLabel[locale],
      successMessage: contact.successMessage[locale],
    })
  }

  const idsBySlug = new Map<string, number>()

  for (const project of projects) {
    const existingProject = await payload.find({
      collection: 'projects',
      where: { slug: { equals: project.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const shared = {
      slug: project.slug,
      year: project.year,
      featured: project.featured,
      featuredOrder: project.featuredOrder,
      landingPosition: 'landingPosition' in project ? project.landingPosition : undefined,
      authorship: project.authorship,
      tier: project.tier,
      verification: project.verification,
      heroTreatment: 'heroTreatment' in project ? project.heroTreatment : undefined,
      climateHint: project.climateHint,
      tags: project.tags,
      studio: 'studio' in project ? project.studio : undefined,
      externalUrl: 'externalUrl' in project ? project.externalUrl : undefined,
      technologies: project.technologies,
      _status: 'published' as const,
    }

    let id = existingProject.docs[0]?.id
    if (!id) {
      const created = await payload.create({
        collection: 'projects',
        locale: 'en',
        data: {
          ...shared,
          title: project.title.en,
          role: project.role.en,
          client: 'client' in project ? project.client?.en : undefined,
          location: 'location' in project ? project.location?.en : undefined,
          lede: project.lede.en,
          question: project.question.en,
          experience: textToLexical(project.experience.en),
          system: textToLexical(project.system.en),
          whatChanged: textToLexical(project.whatChanged?.en || ''),
          credits: project.credits.map((credit) => ({
            name: credit.name,
            role: credit.role.en,
          })),
        },
        overrideAccess: true,
      })
      id = created.id
    } else {
      await payload.update({
        collection: 'projects',
        id,
        locale: 'en',
        data: {
          ...shared,
          title: project.title.en,
          role: project.role.en,
          client: 'client' in project ? project.client?.en : undefined,
          location: 'location' in project ? project.location?.en : undefined,
          lede: project.lede.en,
          question: project.question.en,
          experience: textToLexical(project.experience.en),
          system: textToLexical(project.system.en),
          whatChanged: textToLexical(project.whatChanged?.en || ''),
          credits: project.credits.map((credit) => ({
            name: credit.name,
            role: credit.role.en,
          })),
        },
        overrideAccess: true,
      })
    }

    await payload.update({
      collection: 'projects',
      id,
      locale: 'fr',
      data: {
        title: project.title.fr,
        role: project.role.fr,
        client: 'client' in project ? project.client?.fr : undefined,
        location: 'location' in project ? project.location?.fr : undefined,
        lede: project.lede.fr,
        question: project.question.fr,
        experience: textToLexical(project.experience.fr),
        system: textToLexical(project.system.fr),
        whatChanged: textToLexical(project.whatChanged?.fr || ''),
        credits: project.credits.map((credit) => ({
          name: credit.name,
          role: credit.role.fr,
        })),
      },
      overrideAccess: true,
    })

    idsBySlug.set(project.slug, typeof id === 'number' ? id : Number(id))
  }

  const orderedFeatured = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .map((project) => idsBySlug.get(project.slug))
    .filter((id): id is number => typeof id === 'number')

  for (const locale of ['en', 'fr'] as const) {
    await payload.updateGlobal({
      slug: 'home',
      locale,
      data: {
        featured: orderedFeatured,
        practiceSteps: home.practiceSteps.map((step) => ({
          label: step.label[locale],
          text: step.text[locale],
        })),
      },
      overrideAccess: true,
    })
  }

  for (const item of labItems) {
    const existingLab = await payload.find({
      collection: 'lab-items',
      where: { slug: { equals: item.slug } },
      limit: 1,
      overrideAccess: true,
    })
    const dataEn = {
      slug: item.slug,
      year: item.year,
      url: item.url,
      title: item.title.en,
      lede: item.lede.en,
    }
    const id = existingLab.docs[0]?.id
      ? (
          await payload.update({
            collection: 'lab-items',
            id: existingLab.docs[0].id,
            locale: 'en',
            data: dataEn,
            overrideAccess: true,
          })
        ).id
      : (
          await payload.create({
            collection: 'lab-items',
            locale: 'en',
            data: dataEn,
            overrideAccess: true,
          })
        ).id

    await payload.update({
      collection: 'lab-items',
      id,
      locale: 'fr',
      data: { title: item.title.fr, lede: item.lede.fr },
      overrideAccess: true,
    })
  }

  const forms = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Contact' } },
    limit: 1,
    overrideAccess: true,
  })
  if (!forms.totalDocs) {
    await payload.create({
      collection: 'forms',
      data: {
        title: 'Contact',
        submitButtonLabel: 'Send',
        confirmationType: 'message',
        confirmationMessage: textToLexical('Received. I will write back.'),
        fields: [
          { blockType: 'text', name: 'name', label: 'Name', required: true },
          { blockType: 'email', name: 'email', label: 'Email', required: true },
          { blockType: 'textarea', name: 'message', label: 'Message', required: true },
        ],
      },
      overrideAccess: true,
    })
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
