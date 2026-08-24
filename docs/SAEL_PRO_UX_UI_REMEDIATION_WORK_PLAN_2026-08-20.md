# sael.pro UX/UI Remediation Work Plan

**Date:** 2026-08-20  
**Status:** In execution — mobile experience redesign implemented locally; visual device review pending
**Scope:** Public English and French portfolio routes  
**Target:** A stable, accessible, media-led release candidate that preserves the thread concept without making it the only usable interface

## 1. Purpose

This plan converts the 2026-08-20 UX/UI audit into an implementation sequence with explicit dependencies, acceptance criteria, verification coverage, and release gates.

The audit found a strong editorial identity and sound positioning, but also four immediate release blockers:

1. thread layouts overlap and enter following content on narrow viewports;
2. the mobile/tablet navigation panel collapses to effectively zero height;
3. seven of ten locally published case studies open with an empty black hero;
4. the Interactive Work filter returns no projects and no empty state.

The wider product issue is that the site brief calls for “complexity underneath, clarity at the interface,” while the current Home and Work experiences expose the system metaphor as the primary interface. This plan corrects that mismatch without discarding the visual idea.

## 2. Outcomes

The completed release should:

- communicate identity and representative work within the first two viewports;
- make every primary route usable with semantic HTML before hydration;
- present a safe linear/card experience on narrow screens;
- retain the thread as a deliberate large-screen enhancement;
- render CMS-authored media and content without hardcoded source drift;
- prevent incomplete research notes and media-empty projects from publishing;
- meet WCAG 2.2 AA for the active public experience;
- provide normal link, keyboard, focus, reduced-motion, and locale behavior;
- eliminate blank filters, black placeholder heroes, content overlap, and major layout shifts;
- pass the complete EN/FR route and viewport verification matrix.

## 3. Non-goals

This is not a wholesale rebrand or a generic portfolio-template replacement. The work should preserve:

- the Boska/Satoshi typography pairing;
- the ink/paper base palette and climate concept;
- the thread as a visual metaphor;
- the current five-item information architecture;
- the Question → Experience → System → What changed → Context → Credits case-study model;
- visible and accurate role attribution;
- the quieter editorial layouts already working on About, Practice, Contact, and media-rich case studies.

Dormant components such as `LandingStage`, `WorkScore`, `WorkRoom`, `LayerToggle`, and `Topology` are outside the release path unless explicitly reintroduced. They should not be remediated speculatively.

## 4. Implementation decisions

These are the recommended defaults. Change them only through an explicit product/design decision recorded in the decision log.

1. **The semantic content model is primary.** The canvas never owns the only copy, links, headings, or relationships.
2. **The thread is progressive enhancement.** Below the agreed large-screen breakpoint—recommended at 1024px—the experience uses a linear/card layout. At larger widths, the same semantic content may be arranged around the thread.
3. **Home is a portfolio landing page.** It leads with identity, concrete positioning, a visible Work action, and three curated projects.
4. **Work uses explicit hierarchy.** Signature work, professional contributions, and experiments are visible concepts; unexplained shape encodings are decorative rather than essential.
5. **CMS data is authoritative.** Project tags, heroes, galleries, videos, diagrams, focal points, featured state, copy, and localization are not shadowed by hardcoded maps.
6. **Missing media is designed, never accidental.** A media-free project receives an intentional compact typographic hero or remains unpublished; it never receives a blank full-viewport black field.
7. **Published means ready.** Verification state, localized copy, exact role, credits, and an approved visual treatment are release requirements.
8. **WCAG 2.2 AA is the baseline.** Accessibility is part of each component’s definition of done, not a cleanup pass at the end.
9. **Responsive modes share one semantic tree.** Linear/card and enhanced-thread presentations must not render duplicate links, headings, IDs, analytics events, or screen-reader content.

## 5. Priority and effort labels

| Label | Meaning |
|---|---|
| P0 | Release blocker; fix before any public release |
| P1 | Major usability, trust, conversion, or accessibility defect |
| P2 | Important polish, resilience, performance, or maintainability work |
| S | Small, isolated change |
| M | Multi-file change with focused QA |
| L | Structural component/data-flow change |

Effort labels are relative sizing, not calendar commitments.

## 6. Delivery sequence

| Milestone | Focus | Exit condition |
|---|---|---|
| M0 | Decisions, fixtures, and regression baselines | Critical behavior can be reproduced deterministically |
| M1 | Release-blocker containment | No mobile overlap, collapsed menu, black placeholder hero, or blank filter |
| M2 | Home and Work structure | Portfolio proof and navigation are clear at every viewport |
| M3 | CMS/media/content integrity | Published content and media are complete, bilingual, and authoritative |
| M4 | Semantics, accessibility, and interaction | Active routes meet the WCAG-oriented acceptance criteria |
| M5 | Case-study conversion and editorial refinement | Cases are scannable and offer a clear next action |
| M6 | Rendering performance and cleanup | Hydration, image, and canvas costs are bounded |
| M7 | Full regression and release | All release gates and route matrices pass |

M1 is the critical path. M2 interface work and M3 CMS/media/content work can proceed in parallel after M0, but M2 cannot reach release acceptance until the M3 public view model and verified content are available.

### 6.1 Start here

The first execution cycle should contain only the following work:

1. record the M0-01 product decisions that affect implementation;
2. create deterministic route/content fixtures and capture failing baselines;
3. ship the navigation geometry/night-color fix;
4. correct Work filter data and add the empty state;
5. replace accidental black case heroes with a safe fallback;
6. begin the shared semantic card/node foundation used by responsive Home and Work.

Do not start canvas optimization, animation polish, or dormant-component cleanup until these items pass their acceptance criteria.

## 7. Milestone M0 — Decisions and regression foundation

### M0-01 — Confirm product priorities

**Priority / effort:** P1 / S  
**Owner:** Product/content owner

Record the answers to:

- Which audience is primary: cultural institutions/commissioners, immersive studios, hiring teams, or independent clients?
- Is the primary conversion “view representative work” followed by “make contact”?
- Is independent availability offered alongside the current Supply + Demand role, and how should it be phrased?
- Is the recommended 1024px threshold for thread enhancement accepted?
- Should external Lab items open in the same tab or a clearly announced new tab?
- Who monitors contact submissions, and through which notification path?
- Which project outcomes, visitor-scale facts, locations, partners, and media may be published?

**Acceptance criteria**

- Answers are written into a short decision log in this document or a linked issue.
- Engineering can implement Home, Work, external links, and Contact without inventing product policy.

### M0-02 — Add deterministic fixtures

**Priority / effort:** P0 / M  
**Owner:** Frontend/CMS

Create stable EN/FR fixtures that include:

- all ten current projects;
- projects with and without hero media;
- all filter tags, including Interactive;
- a long French title and lede;
- localized About phases and education;
- informative media with EN/FR alt text, decorative media, and invalid missing-alt media;
- Contact success, HTTP error, and network-error states;
- a verified and an intentionally unready project.

**Acceptance criteria**

- Local and automated tests do not depend on mutable personal CMS data.
- The fixtures reproduce every current P0 failure.

### M0-03 — Capture baselines and geometry assertions

**Priority / effort:** P0 / M  
**Owner:** Frontend/QA

Install the Playwright and `@axe-core/playwright` harness before feature remediation. Capture Home, Work, Lab, Contact, one media-rich case, and one media-free case at 320px, 390px, 768px, 1023px, 1024px, 1025px, and 1440px in EN/FR and normal/reduced motion.

Add layout checks that fail when:

- an expanded node exceeds its track;
- an expanded node intersects another node or following content;
- the footer or Contact form begins before graph content ends;
- the document gains unintended horizontal overflow;
- a menu panel has zero or near-zero dimensions.

Define the production performance profile used by every later metric: production build, test device/CPU profile, viewport, network, warm/cold cache state, dataset, run count, and measurement method.

Add initial automated checks for:

- server-rendered language, heading, landmark, and primary-link presence;
- semantic link/button contracts;
- opacity-hidden focus stops;
- the mobile menu focus lifecycle;
- applicable axe violations;
- reduced-motion and Contact state fixtures.

**Acceptance criteria**

- Current failures are reproducible before remediation.
- New changes receive visual diffs instead of relying on memory.
- Accessibility regressions are enforced from PR 1 onward rather than introduced at final QA.
- The performance profile is written down and reproducible.

### M0-04 — Define the public CMS/view-model contract

**Priority / effort:** P1 / M  
**Owner:** Frontend/CMS/content owner

Settle these contracts before Home, Work, or media components are rebuilt:

- `_status` remains the editorial draft/published workflow;
- `verification` records factual/content verification;
- a required hero treatment explicitly chooses `media` or `typographic`;
- public readiness is derived and enforced server-side from published status, verified content, complete required locales/credits, and a valid hero treatment;
- public queries return only public-ready records;
- editors receive actionable validation errors rather than silent frontend omission;
- media fields distinguish informative from decorative assets and require localized alt text for informative media;
- one public project view model supplies tags, tier, authorship, featured order, media, focal point, credits, and localized content to every route;
- Work and Lab taxonomy is explicit: small utilities live in Lab; an Experiments Work category exists only if verified case-study-grade Projects intentionally belong there.

**Acceptance criteria**

- The state model distinguishes intentional typographic treatment from accidentally missing media.
- Public eligibility is enforced in a server query/hook and covered by fixtures.
- Home, Work, and case pages consume one documented project view model.
- Work/Lab fixtures and editor labels encode the same taxonomy.

### M0-05 — Start the content and media production ledger

**Priority / effort:** P1 / M  
**Owner:** Content owner/producer

Create one row per project with:

- DRI and target approval date;
- verification/public-readiness state;
- EN/FR copy status;
- exact role, authorship, tier, context, credits, and outcomes/facts status;
- hero treatment and required gallery/video/diagram assets;
- media source, rights, photographer/creator credit, and focal point;
- internal-note removal and final approval;
- migration/backfill status.

Set a content freeze date for release-candidate verification. Begin asset recovery and rights approval immediately because these lead times can block engineering acceptance.

**Acceptance criteria**

- Every current project has a DRI, next action, and readiness status.
- Missing media/copy is production work with an owner, not an implicit engineering placeholder.
- The release candidate can be audited from the ledger without opening every CMS record.

## 8. Milestone M1 — Release-blocker containment

### M1-01 — Replace narrow-screen thread geometry

**Priority / effort:** P0 / L  
**Primary files:** `ThreadCanvas.tsx`, `ThreadNode.tsx`, `thread/graph.ts`, `thread/inspect.ts`, `thread/recipes.ts`

Implement the semantic linear/card layout below the agreed breakpoint. The recommended inclusive contract is `<1024px = linear` and `≥1024px = enhanced thread`; CSS and JavaScript must read this from one shared breakpoint source. The large-screen thread reuses the same semantic node data and DOM rather than rendering a duplicate content tree.

For the enhanced graph:

- separate horizontal scaling from vertical rhythm;
- correct remaining-space calculations, including `bottomRoom`;
- define identity, section, project, and experiment node variants;
- calculate track height from complete rendered bounds plus bottom clearance;
- preserve the focused/expanded node across resize and orientation change;
- ensure the first scroll position does not draw or expand most of the graph.

**Acceptance criteria**

- At 320, 390, 768, and 1023px, cards remain in normal flow with no absolute graph geometry, duplicate focus targets, or following-content overlap.
- At 1024, 1025, and 1440px, expanded node bounds remain inside the calculated track and end at least 48px before following content.
- Crossing 1023/1024/1025 does not duplicate headings, links, IDs, analytics events, or accessibility content.
- Every project remains reachable in meaningful document order.
- French and English wrap without clipping.
- There is no unintended horizontal document scrollbar.
- Reduced-motion mode exposes the complete readable state without requiring animation.

### M1-02 — Rebuild mobile/tablet navigation overlay

**Priority / effort:** P0 / M  
**Primary files:** `SiteHeader.tsx`, `globals.css`, `Mark.tsx`, `LocaleSwitcher.tsx`

- Render the overlay outside the header’s `backdrop-filter` containing block.
- Give the panel, links, logo, chip, and locale controls explicit light/dark color contracts.
- Make the Mark inherit `currentColor`.
- Keep active/inactive locale states distinguishable without opacity alone.
- Move focus into the menu, contain focus, support Escape, restore focus, and make background content inert.
- Clear scroll lock safely on close, route change, unmount, breakpoint change, and orientation change.
- Keep primary wayfinding available on Home.

**Acceptance criteria**

- At 390 and 768px, the open panel fills the intended viewport region and every link is readable.
- Night and paper header states pass contrast checks.
- Tab and Shift+Tab remain inside the open menu.
- Escape closes the panel and returns focus to the trigger.
- Resizing while open never leaves `body` scroll-locked.

### M1-03 — Repair Work filters

**Priority / effort:** P0 / M  
**Primary files:** `WorkThread.tsx`, `components/score/shared.ts`, `lib/payload.ts`, project fixtures

- Use the CMS `tags`/authorship data instead of `FILTER_TAGS`.
- Remove or hide filters with no meaningful results.
- Show result counts.
- Add a visible, resettable empty state as defensive fallback.
- Prevent the native horizontal scrollbar from becoming part of the visual design while preserving keyboard scrolling.

**Acceptance criteria**

- Interactive returns the expected projects.
- No enabled filter produces an unexplained blank canvas.
- The active state is visible and programmatic.
- Result count and empty state are announced.
- Every localized chip is fully reachable at 390 and 768px.

### M1-04 — Eliminate black placeholder heroes

**Priority / effort:** P0 / M  
**Primary files:** `CaseStudy.tsx`, project route, `lib/covers.ts`, media adapters

- When approved hero media exists, render it.
- When it does not, render an intentional compact typographic/system hero on paper or keep the project unpublished.
- Never reserve a full black viewport with no visual content.
- Keep role, year, and project title visible above the fold.
- Let the copy stack grow safely instead of depending on a fixed-height absolute overlay.
- Include left, right, and bottom safe-area padding in the hero treatment.

**Acceptance criteria**

- All ten fixture cases have an intentional first viewport.
- Zero cases display an accidental black field.
- Long French titles and ledes fit at 390 portrait and short landscape heights.
- Header contrast remains readable for every treatment.

### M1-05 — Establish accessible visual tokens

**Priority / effort:** P0 / M  
**Primary files:** `globals.css`, shared controls, thread metadata, filters, forms, footer

- Introduce an accessible muted-text token.
- Retain ochre as a decorative accent; introduce a darker accent for text and focus.
- Replace the 1px ochre focus ring with a visible 2px-or-stronger treatment.
- Give text inputs and textareas a complete focus state, not only a faint underline.
- Use shape, border, weight, or marker changes in addition to opacity for selected states.

**Acceptance criteria**

- Small text reaches at least 4.5:1.
- Large text reaches at least 3:1.
- Meaningful graphical objects and UI/focus indicators reach at least 3:1.
- Focus remains visible over paper, every climate, and hero imagery.

### M1-06 — Build the semantic SSR foundation

**Priority / effort:** P0 / L  
**Primary files:** route pages, shared project/node view model, `ThreadCanvas.tsx`, `ThreadNode.tsx`, header/navigation

- Server-render headings, project/item copy, links, and primary actions from the shared view model.
- Use one semantic DOM for linear and enhanced-thread presentations.
- Apply thread positioning/animation as enhancement rather than creating the content in `useEffect`.
- Remove the empty `120svh` primary-content placeholder.
- Make navigation visible and usable before client effects run.
- Reserve a responsive initial layout close enough to the enhanced result to avoid a large shift.

**Acceptance criteria**

- View-source/SSR output contains the primary heading, links, and project/item content for Home, Work, Lab, and Contact.
- Disabling or delaying JavaScript leaves a complete readable and navigable page.
- Linear and enhanced modes contain no duplicate semantic content or focus targets.
- Primary navigation is not effect-dependent.
- Initial-to-enhanced CLS is measured from this milestone onward and remains at or below 0.1.

## 9. Milestone M2 — Home and Work information architecture

M2 depends on the M0-04 public view-model contract and M1-06 SSR foundation. It may be built against deterministic fixtures while M3 content/media production proceeds, but it cannot pass release acceptance using incomplete production records.

### M2-01 — Rebuild Home around portfolio proof

**Priority / effort:** P1 / L  
**Primary files:** Home page/global, `HomeThread.tsx`, a shared project-card component

Required order:

1. identity, location/current positioning, and concise thesis;
2. visible primary Work action and secondary Contact action;
3. three CMS-curated projects spanning authored immersive work, professional systems contribution, and software/platform work;
4. short Practice model;
5. selected contributions and Lab;
6. About/Contact close.

The thread may connect or reveal these sections on large screens, but it cannot replace project names, media, or links.

**Acceptance criteria**

- A Work action is visible without scrolling at 390 and 1440px.
- Three real projects appear within the first two viewports.
- Project selection comes from CMS featured/order fields.
- Primary navigation is discoverable and keyboard available on Home.
- The page has one meaningful `h1` and server-rendered primary content.

### M2-02 — Rebuild Work around explicit hierarchy

**Priority / effort:** P1 / L  
**Primary files:** Work page, `WorkThread.tsx`, project-card/list components

- Expose Signature work, Professional contributions, and Experiments as visible categories or sections.
- Display title, year, exact role, authorship/studio context, lede, and approved media.
- Treat chronology as secondary to portfolio identity.
- Use normal semantic links for every project.
- Keep the thread as an optional large-screen visual arrangement or view, not the only index.

**Acceptance criteria**

- All published projects are scannable without interpreting disc/ring/night encodings.
- Authored and employment work are clearly distinguishable.
- Cmd/Ctrl-click, copy-link, open-in-new-tab, URL preview, and keyboard activation work normally.
- No project depends on hover to expose its title or role.

### M2-03 — Clarify Lab and Contact entry points

**Priority / effort:** P1 / M  

- Present Lab items as explicit external or internal links with action labels such as “Open YouSpoty ↗”.
- Give Lab a concise visible page introduction.
- Keep Contact’s direct email and form, but remove the ambiguous graph `mailto:` interaction.
- Use the CMS-configured email everywhere.
- Apply the same `<1024px` normal-flow and `≥1024px` enhanced-presentation contract used by Home and Work.

**Acceptance criteria**

- External Lab destinations are visually and programmatically identifiable.
- Contact contains one clear primary invitation and a dependable fallback.
- No non-HTTP protocol enters custom thread navigation state.

## 10. Milestone M3 — CMS, media, and content integrity

### M3-01 — Make project media fields authoritative

**Priority / effort:** P1 / L  
**Primary files:** `Projects.ts`, payload adapters, media helpers, Work cards, `CaseStudy.tsx`

- Prefer CMS hero media over hardcoded fallback covers.
- Pass gallery, video, diagram, focal point, alt text, and credits through the view model.
- Implement the M0-04 informative/decorative media contract and localized-alt validation in the shared media component.
- Render visible credits outside image semantics and associate them programmatically.
- Render responsive images/video with intrinsic dimensions, `sizes`, lazy loading, and deliberate above-fold priority.
- Retain hardcoded covers only as explicit fallback content.
- Replace or upgrade the 640×480 OnMove full-screen source.

**Acceptance criteria**

- Changing a CMS hero updates Work and the case study without a code change.
- Gallery, video, and diagram uploads render.
- Focal-point tests produce the expected crop.
- Mobile does not download an unnecessarily large desktop source.
- Credits remain visible, localized where needed, and unclipped.

### M3-02 — Add a publishing-readiness gate

**Priority / effort:** P1 / M  

A public project must have:

- verified/public-ready status;
- EN/FR title and lede;
- exact role, authorship, tier, year, and context;
- approved credits;
- approved hero media or an intentional non-image treatment;
- a declared informative/decorative media state and required localized alt text for informative assets;
- no internal research or archive-recovery language;
- rights/credit confirmation for displayed media.

**Acceptance criteria**

- Unready records stay draft or are excluded from public queries.
- Fixture tests reject incomplete public records.
- Public routes never expose “pending archive recovery,” “remaining for confirmation,” or equivalent internal notes.
- Public readiness is derived and enforced server-side; clients do not independently reinterpret it.

### M3-03 — Restore bilingual parity

**Priority / effort:** P1 / M  

- Restore the missing English About phases and education details.
- Preserve paragraph boundaries when converting rich text.
- Unify French naming for Lab/Labo/Laboratoire.
- Localize 404, navigation labels, form errors, image alternatives, and external-link announcements.
- Make unprefixed routes honor saved locale preference.
- Fix the duplicated Home browser title and localize page titles where needed.
- Verify canonical and alternate-language metadata for every public route.

**Acceptance criteria**

- EN and FR contain equivalent section structure and complete required fields.
- `/work` follows the saved locale.
- Generic and project-not-found routes keep site chrome and localized recovery actions.
- Every route has one correct, nonduplicated title and the expected EN/FR alternate URLs.

### M3-04 — Wire or remove dormant editorial controls

**Priority / effort:** P2 / M  

Decide and document the frontend contract for:

- Home featured projects and close line;
- Site socials/CV links;
- About portrait;
- Header configuration;
- project gallery/video/diagram;
- contact notification configuration.

**Acceptance criteria**

- Editors are not offered fields the public frontend silently ignores.
- Every retained CMS field has a documented rendering destination.

### M3-05 — Migrate and validate production data

**Priority / effort:** P1 / L  
**Owner:** CMS/content owner

- Back up the production database and media inventory before schema or readiness changes.
- Write repeatable migration/backfill scripts for readiness, hero treatment, taxonomy, localization, alt/decorative state, and media metadata.
- Run the migration against staging first.
- Produce before/after record counts, readiness counts, missing-field reports, and media-transfer checksums or equivalent verification.
- Reconcile the production report against the M0-05 content ledger.
- Document rollback for data and media references.
- Set and observe the release-candidate content freeze.

**Acceptance criteria**

- The staging dry run is repeatable and produces no unexplained record loss.
- Every public production record passes readiness validation after backfill.
- Media references resolve and approved credits/rights metadata remain intact.
- A tested rollback procedure exists before production migration.

## 11. Milestone M4 — Semantics, accessibility, and interaction

### M4-01 — Refactor thread semantics

**Priority / effort:** P1 / L  

- Render destinations as anchors and disclosure-only nodes as buttons.
- Structure collections as labeled navigation/list or section/list content.
- Associate visible metadata and details with accessible names/descriptions.
- Truly hide collapsed detail from layout and accessibility APIs.
- Remove misleading `aria-expanded` from navigation links.
- Mark the drawing canvas decorative.
- Bypass custom routing for external URLs, `mailto:`, downloads, and other protocols.

**Acceptance criteria**

- All destination nodes announce as links and support native link behaviors.
- Disclosure buttons expose valid `aria-expanded` and `aria-controls`.
- Collapsed content is absent from the accessibility tree.
- Keyboard order matches meaningful visual/document order.

### M4-02 — Establish page and navigation landmarks

**Priority / effort:** P1 / M  

- Server-render the correct document language.
- Add a skip link and focusable main target.
- Give every route exactly one meaningful `h1`.
- Correct Practice heading order.
- Add current-page state to primary navigation.
- Give locale links descriptive “English”/“Français” accessible names, current state, and native destination behavior.
- Move focus predictably after route changes.
- Remove opacity-hidden controls from sequential focus.
- Make main and footer inert during route transitions instead of disabling pointer input only.
- Ensure transition selectors target the actual footer element/class.
- Clear focus locks, `inert`, `aria-busy`, scroll locks, and `data-thread-moving` on success, failure, cancellation, Back navigation, locale switching, and unmount.

**Acceptance criteria**

- `/fr/**` returns `lang="fr"` before JavaScript.
- Every public route has one `h1`.
- Keyboard users encounter no invisible focus stops.
- Route changes are announced once and focus lands on main/title.
- Rapid/double navigation, Back, aborted navigation, and locale switching mid-transition never leave the interface locked.

### M4-03 — Make filters and form status accessible

**Priority / effort:** P1 / M  

- Label the filter group and expose selected state.
- Announce result count and empty results.
- Add Contact `autocomplete`, `aria-busy`, sending disablement, duplicate-submit prevention, `try/catch`, localized errors, and live success/error status.
- Move focus to or explicitly announce submission results.
- Ensure interactive targets satisfy WCAG 2.5.8 minimum size/spacing; retain the existing 44px target for primary controls.

**Acceptance criteria**

- Assistive technology identifies the active filter and updated result count.
- Contact success, HTTP failure, and network rejection all produce localized, announced outcomes.
- Double submission is impossible.
- Name and email expose the correct input-purpose tokens.
- Small controls meet the 24×24 CSS-pixel minimum or an applicable spacing exception.

### M4-04 — Complete motion and media accessibility

**Priority / effort:** P1 / M  

- React immediately when Reduce Motion changes while the page is open.
- Keep credits outside `role="img"` and associate them programmatically.
- Require localized alternative text for informative CMS images or an explicit decorative setting.
- Verify no active feature depends on pointer-only long press or captures global navigation keys.

**Acceptance criteria**

- Enabling Reduce Motion immediately disables smooth scrolling and route-travel animation.
- Informative images cannot publish without appropriate alt text.
- Visible credits are exposed to screen readers.

## 12. Milestone M5 — Case studies and conversion

### M5-01 — Make context scannable

**Priority / effort:** P1 / M  

Replace concatenated Context prose with a labeled definition list containing applicable fields:

- authorship;
- exact role;
- studio;
- client/commissioner;
- year;
- location;
- collaborators.

**Acceptance criteria**

- Context is understandable at a glance and by assistive technology.
- Exact role remains above the fold and is not replaced by a studio name.

### M5-02 — Add evidence and traversal

**Priority / effort:** P1 / M  

- Add publishable evidence of scale, constraints, outcome, or operational consequence where available.
- End every case with Back to Work and a next/related project.
- Give external project links specific destination labels.

**Acceptance criteria**

- Every case offers a clear next action.
- No case terminates directly into the generic footer.
- New-window behavior, if retained, is announced.

### M5-03 — Shorten the first-pass Practice journey

**Priority / effort:** P2 / M  

- Lead with three to five core principles.
- Add anchor navigation and links to supporting case studies.
- Retain the complete manifesto as deeper reading.
- End with a restrained collaboration/contact action.

**Acceptance criteria**

- A first-time visitor can understand the operating model without reading the full essay.
- Deeper content remains available without duplicating principles excessively.

### M5-04 — Verify the contact operating model

**Priority / effort:** P1 / M  

- Configure an actively monitored notification path for Payload submissions.
- Confirm response/availability copy with the product owner.
- Test direct email and form submission end to end.

**Acceptance criteria**

- A real test submission reaches the monitored destination.
- Success copy does not promise an unsupported response behavior.

## 13. Milestone M6 — Rendering performance and cleanup

### M6-01 — Optimize hydration and layout stability

**Priority / effort:** P1 / M  

This task optimizes the M1-06 server-rendered foundation; it does not introduce SSR after the interface is built.

- Measure server-to-enhanced geometry under CPU/network throttling.
- Reserve the enhanced visual layer without shifting semantic cards, headings, or following content.
- Prevent late font/media/enhancement work from collapsing the primary layout.
- Verify navigation visibility and interaction remain stable throughout hydration.

**Acceptance criteria**

- No blank primary region under throttled hydration.
- CLS is at or below 0.1 on Home, Work, Lab, and Contact.
- Navigation and primary links work before enhancement initializes.
- Hydration does not replace or duplicate the semantic content tree.

### M6-02 — Bound canvas work

**Priority / effort:** P2 / L  

- Paint only when scroll, graph, climate, or transition state changes.
- Remove the permanent GSAP ticker while idle or offscreen.
- Prefer a viewport-bounded surface over a document-height backing buffer.
- Debounce resize and avoid repeated large allocations.

**Acceptance criteria**

- No active paint listener remains while the page is idle.
- Backing pixels do not exceed CSS viewport area × capped DPR².
- Canvas paint time is at or below 8ms at p95 during the scripted 1440px/DPR-2 scroll run.
- The scripted scroll sustains at least 55fps on the agreed performance profile and produces no canvas long task above 50ms.

### M6-03 — Complete responsive shell behavior

**Priority / effort:** P2 / M  

- Add left/right safe-area support to the shell.
- Keep filters scrollable until measured content fits.
- Align canvas, shell, header, and footer intentionally at wide widths.
- Update or deliberately lock browser theme color when the climate/header mode changes.

**Acceptance criteria**

- No notch or home-indicator collision in portrait or landscape.
- Filters remain fully reachable at 768px.
- Shell, header, footer, and enhanced canvas share an intentional wide-screen alignment.

### M6-04 — Remove obsolete visual systems

**Priority / effort:** P2 / M  

Only after active routes pass regression:

- remove or archive unused Home/Work visual systems;
- remove obsolete score CSS and dead selectors;
- remove hardcoded tag and media maps that no longer serve as explicit fallbacks;
- fix lint warnings/errors in touched areas.

**Acceptance criteria**

- Route entry points have one clear implementation path.
- No removed component is referenced by production or tests.
- Lint, type checking, and production build pass.

## 14. Milestone M7 — Verification and release

### 14.1 Viewport matrix

| Viewport | Required checks |
|---|---|
| 320px | Minimum reflow, form clearance, link wrapping, no horizontal clipping |
| 390px | Home progression, Work cards/filters, Lab, Contact, menu, case hero, French wrapping |
| 768px | Tablet menu, filter overflow, card/grid transition, case hero copy, safe spacing |
| 1023px | Final linear-mode layout, no thread-only controls or duplicated semantic tree |
| 1024px | First enhanced-thread layout, desktop navigation transition, no layout discontinuity |
| 1025px | Enhanced-mode stability immediately above the boundary |
| 1440px | Full thread enhancement, shell alignment, media quality, final-node clearance, canvas behavior |

Run each required viewport in:

- English and French;
- normal and reduced motion;
- keyboard-only navigation;
- representative paper and night header states.

### 14.2 Route matrix

Verify:

- Home;
- Work with every enabled filter;
- Practice;
- About;
- Lab;
- Contact;
- all published case studies;
- generic 404;
- missing-project 404;
- Contact success, server failure, and network failure;
- external links, `mailto:`, locale switching, direct deep links, and unprefixed routes.

### 14.3 Automated regression suite

Run and extend the M0 Playwright and `@axe-core/playwright` harness for:

- SSR `lang` and server-rendered primary content;
- one `h1` per route and a working skip link;
- zero unresolved applicable axe violations on active routes;
- mobile menu focus containment, Escape, restoration, and resize behavior;
- semantic anchors for destination nodes;
- no opacity-hidden focus stops;
- native external and `mailto:` behavior;
- filter selected/count/empty states;
- Contact success/error/network/duplicate-submit behavior;
- reduced-motion initial and live preference changes;
- graph/card bounds and following-content clearance;
- rapid/double navigation, Back, aborted navigation, and locale switching mid-transition;
- WCAG 2.5.8 target-size/spacing checks for compact controls.

### 14.4 Manual accessibility and visual checks

- Complete keyboard traversal at desktop and mobile widths.
- 200% and 400% zoom/reflow.
- Windows forced-colors/high-contrast mode.
- iOS Safari portrait and landscape safe areas.
- Chrome/Edge and Firefox desktop passes.
- Header contrast over every approved hero.
- NVDA + Chrome on Windows for navigation, route focus/announcement, filters, Contact status, image credits, and case context.
- VoiceOver + Safari on iOS for the mobile menu, locale switching, project links, filters, form status, and image alternatives.
- Verify locks and announcements during rapid navigation, Back, cancellation, and locale switching mid-transition.

### 14.5 Performance checks

- CLS ≤ 0.1 on primary routes.
- LCP target ≤ 2.5s under the agreed production test profile.
- No permanent canvas repaint while idle.
- No unnecessary desktop-sized image download at mobile width.
- No console errors, hydration warnings, or failed media requests.

### 14.6 Canonical WCAG 2.2 AA scope

Automated and manual review must cover every applicable criterion, including:

- 1.1.1 Non-text Content;
- 1.3.1 Info and Relationships;
- 1.3.2 Meaningful Sequence;
- 1.3.5 Identify Input Purpose;
- 1.4.3 Contrast (Minimum);
- 1.4.10 Reflow;
- 1.4.11 Non-text Contrast;
- 1.4.12 Text Spacing;
- 2.1.1 Keyboard and 2.1.2 No Keyboard Trap;
- 2.2.2 Pause, Stop, Hide and 2.3.3 Animation from Interactions;
- 2.4.1 Bypass Blocks, 2.4.3 Focus Order, 2.4.4 Link Purpose, 2.4.6 Headings and Labels, 2.4.7 Focus Visible, and 2.4.11 Focus Not Obscured;
- 2.5.3 Label in Name and 2.5.8 Target Size (Minimum);
- 3.1.1 Language of Page and 3.1.2 Language of Parts;
- 3.2.2 On Input and 3.2.3 Consistent Navigation;
- 3.3.1 Error Identification and 3.3.2 Labels or Instructions;
- 4.1.2 Name, Role, Value and 4.1.3 Status Messages.

The gate is zero unresolved applicable automated violations and zero known manual A/AA failures. A tool false positive requires a written rationale; any real exception requires an explicit owner-approved waiver.

## 15. Release gates

The release is blocked unless all statements are true.

### Visual and responsive

- No node/card copy overlaps other content at any required viewport.
- Mobile/tablet navigation is visible and operable in paper and night states.
- No case displays an accidental black placeholder hero.
- No enabled filter produces a blank unexplained state.
- Header controls remain readable over every approved hero.

### Content and CMS

- Every public project passes publishing readiness.
- No visible draft, research, archive-recovery, or confirmation language remains.
- English and French required content have structural parity.
- Every public project has approved media or an intentional media-free treatment.
- Contact notification has been tested end to end.
- Production migration/backfill passed staging dry run, reconciliation, and rollback checks.

### Accessibility and interaction

- Active public routes meet the listed WCAG 2.2 AA criteria.
- Every route has one meaningful heading and correct server-rendered language.
- All destinations use native links.
- Menu, filters, forms, and route focus behave correctly by keyboard.
- Text, focus, and meaningful UI contrast pass.
- There are zero unresolved applicable axe violations and zero known unwaived manual WCAG A/AA failures.

### Engineering

- Automated route, accessibility, geometry, and state tests pass.
- Lint, type checking, and production build pass.
- No console errors or hydration warnings occur in the release matrix.
- Performance targets pass in the agreed test environment.

## 16. Recommended pull-request sequence

Keep changes reviewable and avoid a single high-risk rewrite.

1. **PR 1 — Fixtures, contracts, and regression harness**  
   M0-01 through M0-04. Start the M0-05 content/media ledger as a parallel operational lane.
2. **PR 2 — Navigation and accessible visual-token hotfixes**  
   M1-02 and M1-05.
3. **PR 3 — Filter correctness and safe case-hero fallback**  
   M1-03 and M1-04.
4. **PR 4 — Semantic SSR node/card foundation**  
   M1-01, M1-06, and M4-01. This establishes the single semantic DOM and breakpoint contract before route redesign.
5. **PR 5 — CMS media pipeline and publishing gate**  
   M3-01 and M3-02.
6. **PR 6 — Responsive Home and Work compositions**  
   M2-01 and M2-02 against the shared view model. This can be developed in parallel with PR 5 but cannot be release-accepted before it.
7. **PR 7 — Responsive Lab and Contact compositions**  
   M2-03, including the same linear/enhanced presentation contract.
8. **PR 8 — Localization, content cleanup, and editorial parity**  
   M3-03 and M3-04.
9. **PR 9 — Production migration and readiness backfill**  
   M3-05 migration scripts, staging report, reconciliation, and rollback assets.
10. **PR 10 — Accessibility shell and route focus**  
    M4-02, including interrupted-transition regressions.
11. **PR 11 — Filters, forms, motion, and media accessibility**  
    M4-03 and M4-04.
12. **PR 12 — Case context, traversal, and Practice editing**  
    M5-01 through M5-03.
13. **PR 13 — Contact delivery and operating verification**  
    M5-04; keep external notification/operations changes isolated from presentation changes.
14. **PR 14 — Hydration, canvas, and responsive shell optimization**  
   M6-01 through M6-03.
15. **PR 15 — Obsolete-system cleanup and final release matrix**  
    M6-04 and M7.

PR 5 owns responsive media rendering completely. PR 14 optimizes hydration, canvas, and shell behavior; it must not introduce a second image pipeline.

Each PR should include its own before/after screenshots, affected acceptance criteria, EN/FR checks, and a note identifying intentionally deferred work.

## 17. Definition of done for every work item

A work item is complete only when:

- implementation and error/empty/loading states are present;
- semantic and keyboard behavior are verified;
- English and French are checked;
- reduced-motion behavior is checked;
- required viewport screenshots or tests pass;
- no new console, lint, type, or hydration issue is introduced;
- CMS/editor behavior is documented when applicable;
- the relevant release-gate evidence is attached to the PR or issue.

## 18. Deferred backlog

These should not delay release unless product scope changes:

- reintroducing Topology or a system/experience layer toggle;
- richer personalized climate/remembered-work behavior;
- Notes/blog;
- additional experimental scroll capture;
- new WebGL or particle effects;
- redesigning Payload admin beyond readiness validation;
- animation polish that does not communicate structure or state.

The release should first prove that the portfolio is clear, credible, navigable, responsive, and complete.

## 19. Mobile experience redesign addendum — 2026-08-23

### 19.1 Decision

The earlier narrow-screen direction—“safe linear/card experience”—solved overlap but reduced the thread concept to a vertical list. That is no longer the target for phones. Below 768px, Home and Work now have independent authored compositions that share content and destinations with larger layouts without copying the desktop canvas geometry.

The mobile product principles are:

1. **Identity, proof, depth.** The opening glance establishes Saël, the role, and the thesis; project evidence follows immediately; Practice, Lab, About, and Contact become deeper paths.
2. **Natural scroll is the primary gesture.** No essential content depends on swiping, dragging, long press, or motion support.
3. **The thread orients rather than decorates.** It appears as progress, chapter continuity, and surface transitions instead of connecting a stack of thumbnails.
4. **The lower thumb zone owns decisions.** Work and Menu remain in a fixed command bar through 1023px. Project and contact actions sit low in their chambers and retain large targets.
5. **Motion creates anticipation.** Sticky chambers, next-content peeks, changing crops, and scroll-linked breathing reveal depth. They do not map every finger movement to an arbitrary visual response.
6. **Stillness is complete.** Reduced-motion users receive the same content, hierarchy, destinations, and surface changes without scroll-linked transforms.
7. **Contrast follows the surface.** Header, locale, Menu, and command bar automatically switch between paper and night treatments as the underlying chapter changes.

### 19.2 Implemented route model

| Route | Phone treatment | Tablet / desktop treatment |
|---|---|---|
| Home | Identity chamber, three immersive project chambers, Practice/Lab depth field, conversion close | Existing thread composition from 768px; enhanced canvas from 1024px |
| Work | Large editorial opening, persistent filter capsules, asymmetrical media field | Compact thread through 1023px; enhanced canvas from 1024px |
| Lab | Media-led opening and asymmetric experiment plates | Existing Lab thread |
| Contact | Correspondence opening, dark high-focus message field | Existing Contact thread and form |
| About / Practice | Media-led editorial landing, threaded sections, tactile principle plates | Existing long-form editorial layout |
| Case studies | Existing chapter narrative with corrected mobile rail containment and command-bar clearance | Existing chapter rail and media/system layouts |

### 19.3 Interaction and engineering constraints

- Phone-specific compositions are CSS-hidden at wider widths; source destinations remain native anchors.
- `IntersectionObserver` changes only chapter/surface state. There is no per-scroll React render loop.
- Scroll-linked image and aperture motion uses progressive CSS support and is removed under `prefers-reduced-motion`.
- Mobile media uses responsive `sizes`; approved CMS/blob media and existing real project archive imagery remain authoritative.
- The 768–1023 range keeps the thumb command bar so it never falls into a navigation dead zone before desktop navigation appears.
- The mobile menu is a bounded bottom sheet with focus containment, Escape restoration, inert background content, and safe-area clearance.

### 19.4 Verification evidence

Completed locally on 2026-08-23:

- TypeScript: pass (`npx tsc --noEmit`).
- Touched-source ESLint: pass.
- Production build and sitemap generation: pass; sandbox-only Postgres connection warnings fall back without failing the build.
- 57-test geometry/integration/SSR run: 56 passed initially; the sole 768px navigation-gap regression was corrected and its focused retest passes.
- Accessibility and Contact suite: 12/12 passed, including applicable WCAG A/AA axe rules, reduced motion, localized success/error/network states, and duplicate-submit prevention.
- Expanded phone overflow matrix covers Home, Work, About, Practice, Lab, Contact, and a media-rich case at 320px and 390px.
- Automatic paper/night control switching is asserted on Work and case studies.

### 19.5 Remaining release review

- Perform the visual device pass in iOS Safari and Android Chrome once the preview browser can access the local or deployed build.
- Review crop focal points for every selected project at 320×700, 390×844, and short landscape heights.
- Confirm the first three mobile Home projects and their ordering with the portfolio owner/CMS featured order.
- Capture EN/FR before/after baselines after visual approval; do not treat the previous vertical-node baseline as the desired state.
