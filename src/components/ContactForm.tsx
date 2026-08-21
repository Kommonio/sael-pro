'use client'

import { useState } from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/lib/copy'

export function ContactForm({ locale, submitLabel, successMessage }: { locale: Locale; submitLabel?: string | null; successMessage?: string | null }) {
  const labels = t(locale)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    const form = new FormData(event.currentTarget)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
          locale,
        }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p className="type-lede" role="status" aria-live="polite">{successMessage || labels.sent}</p>
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-6" aria-busy={status === 'sending'}>
      <label className="grid gap-2">
        <span className="type-meta text-muted">{labels.name}</span>
        <input
          required
          name="name"
          autoComplete="name"
          className="border-b border-ink/25 bg-transparent py-2 outline-none focus:border-ochre"
        />
      </label>
      <label className="grid gap-2">
        <span className="type-meta text-muted">{labels.email}</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          className="border-b border-ink/25 bg-transparent py-2 outline-none focus:border-ochre"
        />
      </label>
      <label className="grid gap-2">
        <span className="type-meta text-muted">{labels.message}</span>
        <textarea
          required
          name="message"
          autoComplete="off"
          rows={6}
          className="border-b border-ink/25 bg-transparent py-2 outline-none focus:border-ochre"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="type-meta min-h-11 w-fit border border-ink/30 px-5 py-3 hover:border-ink disabled:cursor-wait disabled:opacity-60"
      >
        {status === 'sending' ? labels.sending : submitLabel || labels.send}
      </button>
      {status === 'error' ? <p className="text-clay" role="alert">{labels.sendError}</p> : null}
    </form>
  )
}
