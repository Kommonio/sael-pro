import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

const WINDOW_MS = 70_000

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { sessionId?: string } | null
  const sessionId = body?.sessionId?.slice(0, 80)
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const now = new Date()
  const existing = await payload.find({
    collection: 'presence',
    where: { sessionId: { equals: sessionId } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'presence',
      id: existing.docs[0].id,
      data: { lastSeen: now.toISOString() },
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'presence',
      data: { sessionId, lastSeen: now.toISOString() },
      overrideAccess: true,
    })
  }

  const cutoff = new Date(Date.now() - WINDOW_MS).toISOString()
  const live = await payload.find({
    collection: 'presence',
    where: { lastSeen: { greater_than: cutoff } },
    limit: 200,
    overrideAccess: true,
  })

  return NextResponse.json({ count: Math.max(1, live.totalDocs) })
}
