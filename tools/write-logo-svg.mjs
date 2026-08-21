import { writeFileSync } from 'node:fs'

const S =
  'M64.8 18.6c-12.6 0-21.2 6.4-22 16.4h8.6c.6-5.2 4.8-8.4 13-8.4 7.6 0 12.2 3.4 12.2 8.8 0 5.2-3.4 8-13.6 11.4l-5.2 1.8C45.2 52.4 38 59 38 70.2 38 83.4 48.6 92.6 64 92.6c14.2 0 24-8 24.8-19.8h-8.8c-.8 6.4-6 11.2-15.6 11.2-9.2 0-14.8-4.4-14.8-11.2 0-5.6 3.6-8.8 14-12.4l5.2-1.8c14.2-4.8 21.4-12 21.4-24.2 0-13.2-11.2-21.8-25.4-21.8z'

function ringPath() {
  const cx = 50
  const cy = 50
  const r = 41.8
  const pts = []
  for (let deg = 8; deg <= 304; deg += 1.15) {
    const a = (deg * Math.PI) / 180
    const n = 1 + Math.sin(deg * 0.51) * 0.004 + Math.sin(deg * 1.7) * 0.0025
    pts.push(`${(cx + Math.cos(a) * r * n).toFixed(2)} ${(cy + Math.sin(a) * r * n).toFixed(2)}`)
  }
  return `M${pts.join('L')}`
}

function hatches() {
  const lines = []
  for (let i = -30; i <= 140; i += 2.15) {
    const wobble = Math.sin(i * 0.22) * 0.35
    lines.push(
      `<path d="M${(i + wobble).toFixed(2)} -8 L${(i + 46 + wobble).toFixed(2)} 108" stroke="#1A1610" stroke-width="1.08" stroke-linecap="square"/>`,
    )
  }
  return lines.join('\n      ')
}

const mark = `  <defs>
    <clipPath id="ess">
      <path d="${S}"/>
    </clipPath>
  </defs>
  <path d="${ringPath()}" fill="none" stroke="#1A1610" stroke-width="1.2" stroke-linecap="round"/>
  <g clip-path="url(#ess)">
    ${hatches()}
  </g>
  <path d="${S}" fill="none" stroke="#1A1610" stroke-width="0.45"/>
  <circle cx="86.2" cy="19.4" r="3.2" fill="#C9A227"/>
  <circle cx="88.4" cy="30.8" r="3.2" fill="#C9A227"/>`

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
${mark}
</svg>
`

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#F1E8D4"/>
${mark}
</svg>
`

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F1E8D4"/>
  <circle cx="1040" cy="80" r="220" fill="#C9A227" fill-opacity="0.18"/>
  <g transform="translate(72 95) scale(5.15)">
${mark}
  </g>
  <text x="80" y="520" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="#1A1610">Saël Simard</text>
  <text x="80" y="568" font-family="Georgia, 'Times New Roman', serif" font-size="24" fill="#1A1610">I design the conditions for an experience.</text>
</svg>
`

writeFileSync(new URL('../public/logo.svg', import.meta.url), logo)
writeFileSync(new URL('../public/favicon.svg', import.meta.url), favicon)
writeFileSync(new URL('../public/og.svg', import.meta.url), og)
console.log('wrote logo.svg, favicon.svg, og.svg')
