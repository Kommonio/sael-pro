# SAEL.PRO Product and UX Decision Log — M0-01

**Created:** 2026-08-20  
**Status:** Operational; engineering defaults are active, owner confirmations remain open  
**Decision owner:** `[UNASSIGNED — Saël/product owner]`  
**Implementation owners:** Product/content, design, frontend, CMS, and operations  
**Related work:** `SAEL_PRO_UX_UI_REMEDIATION_WORK_PLAN_2026-08-20.md`, milestone M0-01  
**Content ledger:** `SAEL_PRO_M0_05_PROJECT_READINESS_LEDGER_2026-08-20.md`

## 1. Purpose

This register lets engineering start without inventing product policy. It distinguishes:

- **Active engineering default:** safe to implement now; remains in force until a recorded decision replaces it.
- **Provisional product recommendation:** structure may be built around it, but public-facing wording still needs owner confirmation.
- **Owner-gated:** use the documented safe fallback until the owner answers; do not infer an answer.
- **Release blocker:** the affected production behavior or content cannot ship without confirmation.

An unanswered question is never permission to publish an availability claim, an unverified project fact, a private URL, an uncleared asset, or an unmonitored contact path.

## 2. Repository facts informing the decisions

These are observations, not new product claims:

- The seed defines ten Project records and two smaller Lab items.
- All ten Projects are seeded with `_status: published` while all ten carry `verification: needs-media`.
- The seed does not attach CMS hero, gallery, video, or diagram records. A separate hardcoded cover map supplies imagery for only Azul Vivo, OnMove, and The Man Who Planted Trees.
- Public project queries currently do not apply a verification/public-readiness predicate.
- The contact endpoint stores a Payload form submission but does not notify a person or mailbox.
- `hello@sael.pro` is displayed as the direct contact address; the repository does not establish who monitors it.
- The About seed states a current Supply + Demand role and an independent Kommon.io practice. It does not establish current availability for new independent work.
- YouSpoty is listed as a Lab destination; the research dossier says the current app is password-protected.

These mismatches are why omission and draft status are the safe defaults where confirmation is missing.

## 3. Active engineering defaults

| ID | Decision | Implementation instruction | State |
|---|---|---|---|
| ED-01 | Semantic portfolio content is primary; the thread is enhancement. | Server-render one semantic content tree. Never make canvas geometry the only source of copy, links, headings, relationships, or navigation. | Active engineering default |
| ED-02 | Responsive mode switches at 1024px. | `<1024px` uses the linear/card presentation; `>=1024px` may enhance that same DOM into the thread presentation. Keep one shared breakpoint source for CSS and JavaScript. | Active engineering default |
| ED-03 | The conversion path is **Work first, Contact second**. | Put a visible Work action in the Home hero and a secondary Contact action beside or immediately after it. Preserve both as ordinary links. | Active engineering default; owner may revise labels |
| ED-04 | Home proves range with three projects. | Build for Azul Vivo (authored immersive), The Man Who Planted Trees (professional systems contribution), and OnMove (software/platform). Production selection remains subject to each record passing the readiness ledger; use deterministic fixtures during implementation. | Active implementation default; content-gated |
| ED-05 | Work hierarchy is explicit. | Present authored/signature work, collaborative work, and professional contributions in clear language. Do not require visitors to decode shape, color, chronology, or motion to understand authorship. | Active engineering default |
| ED-06 | Small utilities belong in Lab. | Keep I Speak It and YouSpoty in Lab. Do not create an Experiments category in Work unless a verified, case-study-grade Project is intentionally assigned to it. | Active engineering default |
| ED-07 | External Lab links behave like normal links. | Open in the same tab by default. Do not force a new tab. If the owner later requires a new tab, visibly and programmatically announce it. | Active engineering default |
| ED-08 | CMS data is authoritative. | Home, Work, and case routes consume one public project view model for localized copy, role, authorship, tier, tags, ordering, context, credits, media, and focal point. Hardcoded maps may exist only as explicit migration fallbacks. | Active engineering default |
| ED-09 | `published` is not equivalent to public-ready. | Public eligibility must require published status, verified facts/copy, required EN/FR fields, approved credits, and an explicit valid hero treatment. Until that gate exists, treat all ten current production records as unready. | Active engineering default |
| ED-10 | Missing media is intentional or unpublished. | Use approved CMS media when available. Otherwise use an explicitly selected compact typographic hero or keep the record out of public queries. Never render an empty full-viewport black hero. | Active engineering default |
| ED-11 | Attribution is visible and conservative. | Show exact role and studio/authorship context above the fold. Prefer an accurate contribution credit over language that could imply sole authorship. | Active engineering default |
| ED-12 | Accessibility and localization are release inputs. | Preserve one heading hierarchy, ordinary links, keyboard behavior, reduced-motion behavior, localized EN/FR structure, and WCAG 2.2 AA from the first implementation slice. | Active engineering default |
| ED-13 | The contact form cannot imply monitored delivery until monitoring exists. | Keep the direct email visible as the dependable fallback. Build notification configuration and failure handling, but do not treat database persistence alone as a completed contact workflow. | Active engineering default; operationally gated |
| ED-14 | Content freezes seven calendar days before the release candidate. | Use `RC - 7 calendar days` as the planning default. The owner must enter the actual RC and freeze dates below before release verification begins. | Active scheduling default; calendar date pending |

## 4. Owner confirmations and safe fallbacks

| ID | Owner decision required | Recommended default while pending | Engineering boundary | Release effect |
|---|---|---|---|---|
| OD-01 | Rank the primary audience: cultural institutions/commissioners, immersive studios, hiring teams, or independent clients. | Design first for **cultural institutions/commissioners and immersive studios**; treat hiring teams as an important secondary audience and independent clients as tertiary. Keep the core copy proof-led and broad enough to serve all three. | Engineering may build the information hierarchy. Do not add audience-specific promises or campaign copy without approval. | Not a blocker for component work; owner confirmation required before final Home copy approval. |
| OD-02 | Confirm Work → Contact as the primary conversion. | Use **View selected work** as the primary action and **Start a conversation** / localized equivalent as secondary. | CTA placement and semantics may ship to staging. Labels remain content-reviewable. | Confirmation required before production copy freeze, not before implementation. |
| OD-03 | Decide whether Saël is currently available for independent commissions alongside Supply + Demand. | State the current role and independent practice history accurately; **omit any “available for work,” capacity, start-date, or exclusivity claim**. Keep Contact invitation neutral: collaborations, systems, and installations. | Do not infer availability from the existence of Kommon.io or a Contact form. | Explicit availability language is blocked until owner confirmation. Neutral Contact may ship. |
| OD-04 | Confirm the 1024px enhancement threshold. | Use the ED-02 contract now. | One shared token/constant must make a later threshold change low-risk. | Not a release blocker unless owner rejects it during review. |
| OD-05 | Decide whether any external Lab destination must force a new tab. | Use same-tab normal links. Also decide whether password-protected YouSpoty is a meaningful public destination. | Do not expose a password or private access instruction. An unavailable destination should be withheld or clearly described, not silently fail. | YouSpoty publication is blocked until public accessibility is confirmed. |
| OD-06 | Name the person who monitors contact submissions and approve the notification path. | Proposed recipient: `hello@sael.pro`; proposed path: email notification plus retained Payload submission. Both are **unconfirmed**. | Build recipient/channel as configuration, include delivery-error logging, spam protection, and a visible direct-email fallback. Do not hardcode a personal recipient that has not been approved. | Form launch is blocked until a named DRI completes an end-to-end production delivery test. |
| OD-07 | Approve which project roles, partners, locations, outcomes, visitor-scale facts, technologies, and media may be public. | Publish no quantitative outcome or private/proprietary detail. Use conservative role attribution. Keep each project non-public until its row in the readiness ledger passes. | Engineering builds fields, validation, preview, and the readiness predicate. It does not convert dossier research into verified public fact. | Each project is independently blocked until its ledger row is approved. |
| OD-08 | Set the release-candidate date and content-freeze date. | Freeze at `RC - 7 calendar days`. | Engineering can implement against fixtures before the freeze. After freeze, production content changes require the change-control entry below and re-verification. | Actual dates are required before the final route matrix is run. |

## 5. Owner response block

Complete this block in a follow-up revision; do not replace unknowns with assumptions.

- [ ] **Decision owner / approver:** `[NAME]`
- [ ] **OD-01 primary audience order:** `[FIRST] > [SECOND] > [THIRD] > [FOURTH]`
- [ ] **OD-02 conversion approved:** `[YES / REVISED TO …]`
- [ ] **OD-03 independent availability:** `[NOT OFFERED / OFFERED — APPROVED EN COPY / APPROVED FR COPY]`
- [ ] **OD-04 breakpoint approved:** `[1024PX / REVISED TO …]`
- [ ] **OD-05 Lab link policy:** `[SAME TAB / EXCEPTIONS WITH REASON]`
- [ ] **YouSpoty public-access decision:** `[PUBLIC AND TESTED / WITHHOLD]`
- [ ] **OD-06 submission monitor:** `[NAME / ROLE]`
- [ ] **OD-06 notification destination and channel:** `[VALUE]`
- [ ] **Direct email monitoring confirmed:** `[YES / NO]`
- [ ] **Production contact delivery test owner/date/result:** `[OWNER] / [YYYY-MM-DD] / [PASS|FAIL]`
- [ ] **OD-07 project approvals:** complete the linked readiness ledger
- [ ] **Release-candidate date:** `[YYYY-MM-DD]`
- [ ] **Content-freeze date:** `[YYYY-MM-DD; default RC-7]`

## 6. What engineering may start now

- Build Home and Work semantics and component hierarchy against deterministic EN/FR fixtures.
- Implement the shared `<1024px` linear and `>=1024px` enhanced responsive contract.
- Implement normal same-tab Lab links and a clear external-link treatment.
- Add the public-readiness predicate and explicit `media | typographic` hero treatment.
- Move media, credits, localized alt text, and focal-point data into the CMS view model.
- Make direct email visible and add configurable notification infrastructure and failure states for Contact.
- Keep all mutable project facts and assets gated by the readiness ledger.

Engineering must not wait for owner input to build safe structure. It must wait before publishing owner-gated claims, destinations, delivery behavior, or project records.

## 7. Release blockers created by unanswered decisions

- [ ] Home final audience-specific copy is approved.
- [ ] Any independent-availability statement is approved in EN and FR, or explicitly omitted.
- [ ] YouSpoty is either publicly reachable or withheld.
- [ ] A named person owns Contact monitoring and an end-to-end notification test passes.
- [ ] Every public project passes the content/media readiness ledger.
- [ ] Actual RC and content-freeze dates are recorded.

## 8. Change control

Record changes rather than silently rewriting earlier decisions.

| Date | Decision ID | Previous state | New decision | Reason | Approved by | Engineering notified |
|---|---|---|---|---|---|---|
| `[YYYY-MM-DD]` | `[ED/OD-##]` | `[VALUE]` | `[VALUE]` | `[REASON]` | `[NAME]` | `[YES/NO]` |

## 9. Completion criteria for M0-01

M0-01 is operationally usable now because engineering has explicit fallbacks. It is fully closed only when:

- the owner response block is complete;
- no public behavior depends on an inferred policy;
- OD-06 has a named monitor and tested delivery path;
- OD-07 is evidenced project by project in the readiness ledger; and
- any changed default is recorded in the change-control table.
