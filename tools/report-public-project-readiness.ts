import 'dotenv/config'

import { getProjectReadinessReport } from '../src/lib/payload'

const report = await getProjectReadinessReport()
const publicCount = report.filter((project) => project.isPublic).length
const blocked = report.filter((project) => !project.isPublic)

console.log(`Public project readiness: ${publicCount}/${report.length} ready`)
if (!report.length) {
  console.error('No projects were returned. Check the database connection before treating this report as successful.')
}
for (const project of blocked) {
  console.log(`\n${project.slug} — ${project.title || '(untitled)'}`)
  for (const issue of project.issues) {
    const locale = issue.locale ? ` [${issue.locale.toUpperCase()}]` : ''
    console.log(`  - ${issue.path}${locale}: ${issue.message}`)
  }
}

process.exit(!report.length || blocked.length ? 1 : 0)
