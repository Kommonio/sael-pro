import localFont from 'next/font/local'
import { IBM_Plex_Mono } from 'next/font/google'

export const boska = localFont({
  src: [
    { path: '../../public/fonts/boska-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/boska-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/boska-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
})

export const satoshi = localFont({
  src: [
    { path: '../../public/fonts/satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/satoshi-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
