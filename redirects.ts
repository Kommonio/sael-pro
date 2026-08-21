import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  return [
    {
      source: '/work',
      destination: '/en/work',
      permanent: false,
    },
    {
      source: '/work/:slug([^/.]+)',
      destination: '/en/work/:slug',
      permanent: false,
    },
    {
      source: '/about',
      destination: '/en/about',
      permanent: false,
    },
    {
      source: '/contact',
      destination: '/en/contact',
      permanent: false,
    },
    {
      source: '/practice',
      destination: '/en/practice',
      permanent: false,
    },
    {
      source: '/lab',
      destination: '/en/lab',
      permanent: false,
    },
  ]
}
