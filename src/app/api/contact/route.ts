import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string
    email?: string
    message?: string
    locale?: string
  } | null

  if (!body?.name || !body.email || !body.message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const forms = await payload.find({
    collection: 'forms',
    limit: 1,
    where: { title: { equals: 'Contact' } },
    overrideAccess: true,
  })

  const form = forms.docs[0]
  if (!form) {
    return NextResponse.json({ error: 'Contact form is not seeded yet' }, { status: 500 })
  }

  await payload.create({
    collection: 'form-submissions',
    data: {
      form: form.id,
      submissionData: [
        { field: 'name', value: body.name },
        { field: 'email', value: body.email },
        { field: 'message', value: body.message },
        { field: 'locale', value: body.locale || 'en' },
      ],
    },
    overrideAccess: true,
  })

  return NextResponse.json({ ok: true })
}
