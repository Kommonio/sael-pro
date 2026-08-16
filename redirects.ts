import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  return [
    {
      source: '/work/:path*',
      destination: '/en/work/:path*',
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
