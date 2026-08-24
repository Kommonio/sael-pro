/* eslint-disable @next/next/no-img-element -- ImageResponse requires a plain img element. */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'
import React from 'react'
import sharp from 'sharp'

import { OG_HEIGHT, OG_SOURCE_BLOB_URL, OG_WIDTH } from './constants'
import type { OgDescriptor } from './descriptor'

const fonts = Promise.all([
  readFile(path.join(process.cwd(), 'assets', 'fonts', 'boska-500.ttf')),
  readFile(path.join(process.cwd(), 'assets', 'fonts', 'satoshi-400.ttf')),
  readFile(path.join(process.cwd(), 'assets', 'fonts', 'satoshi-500.ttf')),
])

function titleSize(title: string) {
  if (title.length > 30) return 70
  if (title.length > 20) return 82
  if (title.length > 13) return 94
  return 108
}

async function preparedImageUrl(sourceUrl: string) {
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`Unable to fetch OG source image (${response.status})`)
  const source = Buffer.from(await response.arrayBuffer())
  const image = await sharp(source)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
    .toBuffer()
  return `data:image/jpeg;base64,${image.toString('base64')}`
}

function LogoMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 668.05 936.68" width="30" height="42" style={{ color }}>
      <path
        fill="currentColor"
        d="M356.58,627l-.07,308.81C158.53,950.05-7.2,789.2.24,590.46c5.41-144.51,104.58-268.87,241.85-307.61,144.46-40.76,297.23,18.05,375.73,145.51,36.76,59.68,54.37,127.94,49.4,198.5l-310.64.14ZM620.86,580.42c-12.03-135.86-115.86-242.57-246.72-260.84-164.59-22.97-312.86,96.51-327.22,260.93l573.93-.1ZM311.28,626.82l-264.6.25c11.8,140.19,124.5,251.9,264.53,262.14l.07-262.39Z"
      />
      <circle cx="188" cy="77" r="77" fill="#C9A227" />
      <circle cx="481" cy="77" r="77" fill="#C9A227" />
    </svg>
  )
}

export async function renderOgPng(descriptor: OgDescriptor) {
  const [boska, satoshi, satoshiMedium] = await fonts
  let backgroundUrl: string
  try {
    backgroundUrl = await preparedImageUrl(descriptor.imageUrl)
  } catch (error) {
    if (descriptor.imageUrl === OG_SOURCE_BLOB_URL) throw error
    backgroundUrl = await preparedImageUrl(OG_SOURCE_BLOB_URL)
  }
  const isCase = descriptor.kind === 'case-study'
  const ink = isCase ? '#F4EBD9' : '#17150F'
  const muted = isCase ? 'rgba(244,235,217,.72)' : 'rgba(23,21,15,.60)'

  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#15140f',
          color: ink,
          fontFamily: 'Satoshi',
        }}
      >
        <img
          src={backgroundUrl}
          alt=""
          width={OG_WIDTH}
          height={OG_HEIGHT}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            background: isCase
              ? 'linear-gradient(90deg, rgba(8,8,6,.94) 0%, rgba(8,8,6,.78) 44%, rgba(8,8,6,.16) 79%, rgba(8,8,6,.3) 100%)'
              : 'linear-gradient(90deg, rgba(244,237,220,.98) 0%, rgba(244,237,220,.92) 53%, rgba(244,237,220,.12) 100%)',
          }}
        />

        <svg
          viewBox={`0 0 ${OG_WIDTH} ${OG_HEIGHT}`}
          width={OG_WIDTH}
          height={OG_HEIGHT}
          style={{ position: 'absolute', inset: 0 }}
        >
          <path
            d={isCase ? 'M 990 -35 C 935 120, 1090 207, 890 340 C 776 416, 830 545, 704 680' : 'M 1010 -40 C 952 112, 1102 196, 904 328 C 790 404, 847 538, 720 675'}
            fill="none"
            stroke="#C9A227"
            strokeWidth="2.2"
            opacity={isCase ? '.86' : '.94'}
          />
          <circle cx={isCase ? '934' : '952'} cy={isCase ? '286' : '264'} r="8" fill="#C9A227" />
          <circle cx={isCase ? '958' : '976'} cy={isCase ? '282' : '260'} r="8" fill="#C9A227" />
        </svg>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '54px 62px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <LogoMark color={ink} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '0.18em' }}>SAËL SIMARD</span>
                <span style={{ fontSize: 11, color: muted, letterSpacing: '0.22em' }}>SYSTEMS · IMAGES · SPACE</span>
              </div>
            </div>
            <span style={{ fontSize: 14, color: muted, letterSpacing: '0.2em' }}>SAEL.PRO</span>
          </div>

          <div style={{ width: isCase ? '710px' : '750px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ width: '34px', height: '1px', background: '#C9A227' }} />
              <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.18em', color: muted }}>{descriptor.eyebrow}</span>
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Boska',
                fontSize: titleSize(descriptor.title),
                fontWeight: 500,
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                maxWidth: '750px',
              }}
            >
              {descriptor.title}
            </div>
            <div
              style={{
                display: 'flex',
                maxWidth: isCase ? '690px' : '680px',
                marginTop: '22px',
                fontSize: 24,
                lineHeight: 1.33,
                color: muted,
              }}
            >
              {descriptor.description}
            </div>
          </div>

          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {isCase && descriptor.role ? (
                <span style={{ fontSize: 13, color: muted, letterSpacing: '0.15em' }}>{descriptor.role.toUpperCase()}</span>
              ) : null}
              <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.17em' }}>{descriptor.pathLabel}</span>
            </div>
            <span style={{ fontSize: 12, color: muted, letterSpacing: '0.18em' }}>FORM · EXPERIENCE · PURPOSE</span>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: 'Boska', data: boska, weight: 500, style: 'normal' },
        { name: 'Satoshi', data: satoshi, weight: 400, style: 'normal' },
        { name: 'Satoshi', data: satoshiMedium, weight: 500, style: 'normal' },
      ],
    },
  )

  return Buffer.from(await response.arrayBuffer())
}
