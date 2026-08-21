# UX regression harness

This suite is the deterministic M0 foundation for the UX/UI remediation plan. It keeps test-owned EN/FR content and state fixtures separate from mutable local Payload data, while browser specifications exercise the real Next.js routes.

## Commands

```bash
npm run test:e2e:list
npm run test:e2e
npm run test:e2e:headed
npm run test:ux:baseline
```

Install Chromium once on a new machine with `npx playwright install chromium`.

`npm run test:ux:baseline` is intentionally opt-in because it captures 168 full-page evidence images: Home, Work, Lab, Contact, a media-rich case, and a media-free case at 320, 390, 768, 1023, 1024, 1025, and 1440 pixels, in EN/FR and normal/reduced motion. The evidence is written to the gitignored `test-results/` directory.

Known audit failures use Playwright's expected-failure contract and carry a `known-ux-debt` annotation. They still execute and must fail for the documented reason. When remediation makes one pass, Playwright reports an unexpected pass so the annotation can be removed and the assertion becomes a permanent release gate. No axe rule is waived by these annotations.

## Deterministic fixture contract

`fixtures/audit-content.ts` owns a versioned dataset with:

- the ten audited projects and all six Work filter tags;
- media and typographic hero treatments;
- localized informative alt text, decorative media, and invalid missing-alt media;
- long French title/lede stress content;
- bilingual About phases and education;
- verified and intentionally unready publishing states;
- Contact success, HTTP-error, and network-error responses.

Future CMS/view-model tests should adapt these fixtures at the server boundary instead of changing their semantic meaning.

## Reproducible production performance profile

Performance gates added after M0 use this fixed profile unless a replacement is recorded in the remediation plan:

- production build: `npm run build`, then `npm run start`;
- browser: the Chromium revision pinned by the installed `@playwright/test` lockfile;
- URL: set `PLAYWRIGHT_SKIP_WEBSERVER=1` and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000` when testing the production server;
- dataset: `AUDIT_FIXTURE_VERSION` from `fixtures/audit-content.ts` (ten projects, two Lab items, bilingual global copy);
- viewport: 1440 × 900 for the desktop performance gate and 390 × 844 for the mobile media gate;
- CPU: Chrome DevTools Protocol 4× slowdown;
- network: 10 Mbps download, 2 Mbps upload, 100 ms round-trip latency;
- cold cache: a fresh browser context for each run; warm cache: the second navigation in the same context;
- sample size: three cold runs and five warm runs; record each run, the median, and p95;
- metrics: LCP, CLS, long tasks, transferred image bytes, canvas paint duration, and idle canvas callbacks;
- pass criteria: use the current remediation-plan release gates; never discard a run without recording the reason.

The test report, trace, screenshots, axe JSON, dataset version, commit SHA, Node version, OS, and browser revision are the evidence bundle for each measured release candidate.
