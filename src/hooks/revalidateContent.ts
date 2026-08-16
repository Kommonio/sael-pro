import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

function safeRevalidate(run: () => void) {
  try {
    run()
  } catch {
    /* seed / CLI has no Next.js cache */
  }
}

export const revalidateProject: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate(() => {
    revalidateTag('projects')
    revalidatePath('/en')
    revalidatePath('/fr')
    revalidatePath('/en/work')
    revalidatePath('/fr/work')
    if (doc?.slug) {
      revalidatePath(`/en/work/${doc.slug}`)
      revalidatePath(`/fr/work/${doc.slug}`)
    }
  })
  return doc
}

export const revalidateLab: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate(() => {
    revalidateTag('lab')
    revalidatePath('/en/lab')
    revalidatePath('/fr/lab')
    revalidatePath('/en')
    revalidatePath('/fr')
  })
  return doc
}

export const revalidatePage: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate(() => {
    if (doc?.slug) {
      revalidatePath(`/en/${doc.slug}`)
      revalidatePath(`/fr/${doc.slug}`)
    }
  })
  return doc
}

export const revalidateGlobals: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidate(() => {
    revalidateTag('globals')
    revalidatePath('/en')
    revalidatePath('/fr')
    revalidatePath('/en/practice')
    revalidatePath('/fr/practice')
    revalidatePath('/en/about')
    revalidatePath('/fr/about')
    revalidatePath('/en/contact')
    revalidatePath('/fr/contact')
  })
  return doc
}
