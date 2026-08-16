/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'https://sael.pro',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/api/*', '/next/*'],
  alternateRefs: [
    { href: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://sael.pro'}/en`, hreflang: 'en' },
    { href: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://sael.pro'}/fr`, hreflang: 'fr' },
  ],
}
