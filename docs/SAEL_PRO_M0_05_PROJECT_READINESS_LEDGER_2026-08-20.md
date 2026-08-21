# SAEL.PRO Project Content and Media Readiness Ledger — M0-05

> **Execution update — 2026-08-21:** the local Payload environment is now 10/10 public-ready after the evidence-led archive import and bilingual content reconciliation. The detailed `BLOCKED` entries below are retained as the pre-remediation decision record, not as a description of the current local build. Production remains unchanged and still requires an explicit, reviewed migration.

**Created:** 2026-08-20  
**Status:** Active production ledger; all ten current Projects are blocked from public-ready status  
**Ledger owner:** `[UNASSIGNED — content producer]`  
**Final approver:** `[UNASSIGNED — Saël/product owner]`  
**Release candidate:** `[YYYY-MM-DD]`  
**Content freeze:** `[YYYY-MM-DD — default is RC minus 7 calendar days]`  
**Related decisions:** `SAEL_PRO_M0_01_PRODUCT_DECISION_LOG_2026-08-20.md`  
**Related plan:** `SAEL_PRO_UX_UI_REMEDIATION_WORK_PLAN_2026-08-20.md`, milestone M0-05

## 1. Scope and evidence boundary

This ledger covers the ten records in `src/seed/content.ts`. It inventories what the repository currently says; it does not certify those statements as true or approved for publication.

Evidence reviewed:

- current project seed and seeding behavior;
- current Payload Projects and Media schemas;
- hardcoded cover/gallery data and local still inventory;
- the rebuild research dossier;
- the UX/UI remediation audit and work plan.

The mutable production CMS database and private project archives were not inspected. “Present in seed” therefore means only that draft copy exists in code. Unknown rights, facts, credits, outcomes, focal points, and approvals remain explicitly unknown.

## 2. Status legend

| Status | Meaning |
|---|---|
| **BLOCKED** | Must not be returned by the future public-ready query. |
| **DRAFT PRESENT** | EN/FR text exists in seed but has not received documented owner approval. |
| **SOURCE SUPPORT** | A research source supports the item; owner/studio approval may still be required. |
| **UNKNOWN** | No reliable value was found. Do not infer one. |
| **PROVISIONAL** | A safe production recommendation, not a verified project fact. |
| **NOT STARTED** | No migration/backfill evidence exists. |
| **N/A** | Not required for the selected treatment. |

## 3. Public-ready gate

A project may be marked **READY** only when every applicable control is checked:

- [ ] A named DRI and target approval date are recorded.
- [ ] `_status` is intentionally `published`; it is not merely published by the seed script.
- [ ] `verification` is `verified` after factual and editorial review.
- [ ] Required EN and FR fields have structural parity and final approval.
- [ ] Exact role, authorship, tier, studio/client/location context, and credits are approved.
- [ ] Every outcome, scale, partner, location, technology, and date claim has a source or owner attestation.
- [ ] `heroTreatment` is explicitly `media` or `typographic`.
- [ ] Every informative asset has a source, reuse-rights record, visible credit where required, localized EN/FR alt text, and an approved focal point.
- [ ] Required gallery, video, diagram, poster, caption, and credit fields are populated or explicitly N/A.
- [ ] Internal archive instructions, research gaps, placeholders, and private/proprietary details are removed from public copy.
- [ ] The M3 migration/backfill report reconciles the production record to this ledger.
- [ ] The final approver signs off after previewing EN and FR at mobile and desktop widths.

No current project passes this gate.

## 4. Portfolio-wide baseline

| Control | Current repository state | Operational conclusion |
|---|---|---|
| Project count | 10 seeded Projects | This ledger has exactly 10 project rows. I Speak It and YouSpoty remain Lab items and are outside this ledger. |
| Editorial status | Seed script writes `_status: published` for all 10 | Published status is not evidence of readiness. Move/reseed as draft or enforce the future readiness predicate before public release. |
| Verification | All 10 use `needs-media` | 0 of 10 are factually/editorially `verified`. |
| Public query | Current query has no verification/readiness condition | Until M0-04/M3-02 is implemented, all 10 should be treated as publicly unsafe even if routes resolve. |
| CMS project media | Seed attaches no hero, gallery, video, or diagram | CMS media migration has not started. A mutable database may differ and must be reconciled during migration. |
| Hardcoded media | Covers for Azul Vivo, OnMove, and The Man Who Planted Trees; Azul Vivo also has four additional gallery stills | 3 of 10 receive a fallback cover; 7 of 10 can open on an empty black hero in the audited build. |
| Localized copy | All 10 contain EN/FR title, role, lede, question, experience, and system drafts | Presence is not approval. Villa Hublot, Sensory Odyssey, and Le Repaire have no `whatChanged` draft. |
| Media accessibility | Hardcoded cover alt is English only; CMS Media supports localized alt but no assets are seeded | Every informative production asset needs an explicit informative/decorative decision and EN/FR alt review. |
| Rights records | Credit strings exist for some assets; no explicit license/permission record is seeded | Credit is not permission. Rights approval remains open for every media treatment. |
| Focal points | Supported by Payload uploads; none recorded in seed | Every selected media hero needs a crop review and focal point. |
| Outcomes | No structured outcomes/scale field exists | Do not publish attendance, player count, visitor scale, throughput, impact, or performance without project-level verification. |
| DRIs and dates | None recorded | Assign a human DRI and target date to every row before content production is considered staffed. |

## 5. Master production queue

| Project | DRI | Target approval | EN/FR copy | Proposed hero | Rights | Internal-note cleanup | Migration | Final approval | Public readiness | Immediate next action |
|---|---|---|---|---|---|---|---|---|---|---|
| Azul Vivo | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT | Media | UNKNOWN | Review | NOT STARTED | PENDING | **BLOCKED** | Confirm ownership/reuse of the five local stills and approve one hero crop. |
| OnMove | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT | Media | UNKNOWN | Review | NOT STARTED | PENDING | **BLOCKED** | Capture a current, high-resolution product/field image and verify all architecture claims. |
| Echoes | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; IP review | Typographic provisional | N/A unless diagram added | Required | NOT STARTED | PENDING | **BLOCKED** | Define what may be disclosed after the technology transfer; withhold private IP. |
| The Man Who Planted Trees | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT | Media if authorized; typographic fallback | Studio approval required | Review | NOT STARTED | PENDING | **BLOCKED** | Request an authorized high-resolution hero and written reuse/credit terms from Supply + Demand. |
| Viventi Mori | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; role/year review | Media if authorized; typographic fallback | UNKNOWN | Review | NOT STARTED | PENDING | **BLOCKED** | Confirm exact year and artistic credit, then request collaborator-approved media. |
| Omega Protocol | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; research notes embedded | Typographic until archive recovery | UNKNOWN | Required | NOT STARTED | PENDING | **BLOCKED** | Confirm company/partner credit and recover gameplay, arena, and system records. |
| Versus | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; research notes embedded | Typographic until archive recovery | UNKNOWN | Required | NOT STARTED | PENDING | **BLOCKED** | Recover exact gameplay, hardware, player count, partners, and approved media. |
| Villa Hublot | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; `whatChanged` absent | Typographic until authorized media | Studio/client approval required | Review | NOT STARTED | PENDING | **BLOCKED** | Confirm full credit chain and request Bakuza-authorized project media. |
| Sensory Odyssey / Vivid | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; `whatChanged` absent | Typographic until authorized media | Studio approval required | Required | NOT STARTED | PENDING | **BLOCKED** | Confirm cities/system scope and request authorized Supply + Demand imagery. |
| Le Repaire (secret secret) | `[ASSIGN]` | `[SCHEDULE]` | DRAFT PRESENT; `whatChanged` absent | Typographic until authorized media | Studio/photographer approval required | Review | NOT STARTED | PENDING | **BLOCKED** | Confirm individual role wording and obtain Supply + Demand/photographer media terms. |

## 6. Project records

### 6.1 Azul Vivo

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign a content/media owner and approval date. |
| Current state | `_status: published`; `verification: needs-media`; featured order 1 | **BLOCKED.** Do not treat the seed’s published status as approval. |
| EN/FR copy | Title, role, lede, question, experience, system, and what-changed drafts exist in both locales | **DRAFT PRESENT.** Editorial and factual approval are unrecorded. |
| Exact role | EN: “Creator & Director”<br>FR: “Créateur et directeur” | Owner must confirm exact capitalization and whether the role covers Azul Vivo generally or the first work, Presence. |
| Authorship / tier | `authored` / `A — Signature` | Plausible seed classification; owner approval required. |
| Context | `2026–`; Seaflower Biosphere Reserve, Colombia; external site `azulvivo.com` | Confirm year/status, exact location wording, and that the external site is ready to receive portfolio traffic. |
| Credits | Saël Simard — Creator & Director | Confirm whether field, sound, postproduction, institutional, or other collaborators must be credited. Do not assume sole execution from the role. |
| Outcomes / facts | Seed describes Presence, underwater 360°, spatial sound, institutional VR, and fulldome; no measured outcome or audience scale is stored | Verify public technical claims. No attendance, reach, institution, conservation-impact, or performance claim may be added without evidence. |
| Hero treatment | **PROVISIONAL: `media`** | Use only after an asset, rights, localized alt, credit, and focal point are approved. Otherwise use intentional typographic treatment. |
| Available assets | `/stills/azul-vivo.jpg`, `azul-vivo-2.jpg`, `azul-vivo-3.jpg`, `azul-vivo-4.jpg`, `azul-vivo-vr.jpg`; hardcoded credits identify Saël/Presence | Select one hero and decide whether the other four form the release gallery. No release video or diagram is required unless the owner adds one. |
| Source / rights / credit | Source appears to be Saël’s Presence material; explicit rights approval is not recorded | **UNKNOWN.** Record ownership/reuse approval and final visible credit. A credit string alone is insufficient. |
| Alt / focal point | English-only hardcoded alt exists; CMS-localized alt and focal point are absent | Write EN/FR informative alt for each selected asset and approve crops at required aspect ratios. |
| Internal-note removal | No obvious archive instruction in seed copy | Review for unapproved conservation, location, and institutional implications before approval. |
| Final approval | `[PENDING — OWNER / DATE]` | Record approval only after EN/FR and responsive preview. |
| Migration | Content is code-seeded; CMS media relationships and `heroTreatment` are not populated | **NOT STARTED.** Attach approved Media records, backfill treatment/alt/credit/focal point, preview both locales, then reconcile. |

- [ ] Assign DRI and date.
- [ ] Confirm exact role/scope and collaborator credits.
- [ ] Approve facts and EN/FR copy.
- [ ] Approve hero/gallery selection, rights, credits, alt, and focal points.
- [ ] Complete migration and final EN/FR preview.

### 6.2 OnMove

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign a product-aware content owner and approval date. |
| Current state | `_status: published`; `verification: needs-media`; featured order 3 | **BLOCKED.** |
| EN/FR copy | All core case fields and what-changed exist in both locales | **DRAFT PRESENT.** Technical breadth and current product wording need verification. |
| Exact role | EN: “Creator / Application & Platform Architect”<br>FR: “Créateur / architecte de la plateforme” | Confirm preferred punctuation and whether product ownership or collaborators require qualification. |
| Authorship / tier | `authored` / `A — Signature` | Owner approval required. |
| Context | `2022–`; external site `onmove.app`; no studio/client/location stored | Confirm active status, public site readiness, and whether a company, client, or deployment context must be named. |
| Credits | Saël Simard — Creator / architect | Confirm design, engineering, content, and deployment collaborators before implying sole delivery. |
| Outcomes / facts | Seed lists React, Node.js, PWA, MQTT, BLE, GPS and a broad platform architecture; no adoption, visitor, deployment, or reliability outcome is stored | Verify which capabilities shipped versus were explored. Publish no customer, usage, location, or scale claim without evidence. |
| Hero treatment | **PROVISIONAL: `media`** | Replace the current low-resolution full-screen fallback with a current, approved product or in-context image. Typographic treatment is the safe fallback. |
| Required assets | Release: one high-resolution hero. Optional after verification: 2–4 product/workflow views or one non-sensitive system diagram. No video required. | Current `/stills/onmove.jpg` is identified in the plan as an inadequate 640×480 full-screen source. |
| Source / rights / credit | Current cover is labeled “OnMove field recon — Montréal”; ownership/reuse record absent | **UNKNOWN.** Record creator/owner and whether product screenshots expose private customer or account data. |
| Alt / focal point | English-only hardcoded alt; no CMS focal point | Write localized alt describing the actual approved image, not the product’s entire feature set. Set focal point after responsive crop testing. |
| Internal-note removal | No explicit archive instruction in seed | Remove or qualify any architecture item that was prototype-only, private, discontinued, or client-confidential. |
| Final approval | `[PENDING — OWNER / DATE]` | Record approval only after current-product, EN/FR, privacy, and responsive preview. |
| Migration | Code seed and hardcoded cover; no CMS media | **NOT STARTED.** Capture/export, sanitize, ingest, localize, set treatment/focal point, and reconcile. |

- [ ] Assign DRI and date.
- [ ] Verify shipped/current capabilities and exact authorship.
- [ ] Capture a clean current hero with no private data.
- [ ] Record rights, credit, EN/FR alt, and focal point.
- [ ] Complete migration and final EN/FR preview.

### 6.3 Echoes

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign an owner who can review transferred-IP boundaries. |
| Current state | `_status: published`; `verification: needs-media`; not featured | **BLOCKED.** |
| EN/FR copy | All core fields and what-changed exist in both locales | **DRAFT PRESENT; IP REVIEW REQUIRED.** |
| Exact role | EN: “Creator / System Architect”<br>FR: “Créateur / architecte de système” | Confirm the role and its relationship to Kommon.io and the later technology transfer. |
| Authorship / tier | `authored` / `A — Signature` | Confirm this remains accurate after the transfer and does not imply current ownership of transferred assets. |
| Context | `2023–2024`; studio `Kommon.io`; no public URL/client/location | Confirm what company and transfer context may be named publicly. |
| Credits | Saël Simard — Creator / system architect | Identify hardware, research, software, company, or partner credits that must accompany the case. |
| Outcomes / facts | Seed describes EmotiBit, EEG, Flutter, Firebase, realtime and encrypted transport. The dossier mentions an approximately 2,101-hour internal-record figure, but the seed omits it. | Verify every technology and disclosure. Withhold hours, participant data, accuracy claims, customers, and transferred implementation detail unless explicitly approved. |
| Hero treatment | **PROVISIONAL: `typographic`** | Safest first release. An approved abstract/system diagram may replace it only after IP review. |
| Required assets | None for typographic release. Optional: redacted pipeline diagram or non-sensitive hardware photograph. No gallery/video required. | Do not use screenshots, architecture diagrams, hostnames, datasets, or code that expose transferred/private IP. |
| Source / rights / credit | N/A for typographic treatment; UNKNOWN for any later image/diagram | Record who created and owns any diagram or hardware photograph. |
| Alt / focal point | N/A for typographic hero | If media is later approved, add localized alt and focal point; diagrams also need an equivalent text explanation. |
| Internal-note removal | Seed system copy contains a transferred-IP disclaimer | Rewrite for clear public attribution after owner/legal review; do not expose internal transaction or implementation details merely to explain the caveat. |
| Final approval | `[PENDING — OWNER / DATE]` | Owner and IP reviewer must both approve the public preview. |
| Migration | Code seed; no explicit hero treatment or CMS media | **NOT STARTED.** Backfill `typographic`, verify copy/credits, and keep non-public until IP sign-off. |

- [ ] Assign DRI, date, and IP reviewer.
- [ ] Define the public disclosure boundary in writing.
- [ ] Confirm role, authorship, credits, and technical claims.
- [ ] Approve clean EN/FR public copy with no internal/private details.
- [ ] Backfill typographic treatment and complete final preview.

### 6.4 The Man Who Planted Trees

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign a DRI who can coordinate studio permission. |
| Current state | `_status: published`; `verification: needs-media`; featured order 2 | **BLOCKED.** |
| EN/FR copy | All core fields and what-changed exist in both locales | **DRAFT PRESENT.** Role has strong public source support; full copy still needs approval. |
| Exact role | EN: “Technical Architecture Design — Supply + Demand”<br>FR: “Conception de l’architecture technique — Supply + Demand” | **SOURCE SUPPORT:** Supply + Demand’s official project page publicly credits Saël with Technical Architecture Design. Preserve this exact attribution. |
| Authorship / tier | `contribution` / `B — Professional contribution` | Correct conservative treatment; owner/studio confirmation still required for final record. |
| Context | `2025`; Supply + Demand; Canadian Museum of Nature; touring immersive exhibition; external studio project URL | Confirm partner naming, tour status, locations, and any mention of Frédéric Back/Jean Giono with appropriate context. |
| Credits | Supply + Demand — Studio; Saël Simard — Technical Architecture Design | Confirm the fuller production/partner credit line required by the studio and museum. |
| Outcomes / facts | Seed describes a touring forest-inspired exhibition and official technical-architecture credit; no attendance, venue count, tour scale, or measured impact is stored | The official role may be public. Withhold quantitative tour/visitor/impact claims until sourced. |
| Hero treatment | **PROVISIONAL: `media` if authorized; otherwise `typographic`** | Do not make release depend on an uncleared studio photograph. |
| Required assets | Release media option: one authorized high-resolution installation hero. Optional: gallery or short approved clip. No diagram required unless studio clears it. | Current hardcoded `/stills/man-who-planted-trees.jpg` is credited to Supply + Demand, but permission terms are not recorded. |
| Source / rights / credit | Supply + Demand imagery; written reuse approval required | **UNKNOWN PERMISSION.** Request original file, allowed crops/contexts, credit string, credit link, and expiry/withdrawal terms if applicable. |
| Alt / focal point | English hardcoded alt only; no CMS focal point | Write EN/FR image-specific alt and approve a crop that preserves the installation’s important content. |
| Internal-note removal | Conservative contribution language is public-facing and should remain | Remove only editorial instructions; preserve clear studio/team attribution. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval and any required studio approval reference. |
| Migration | Code seed plus hardcoded cover; no CMS media | **NOT STARTED.** Ingest only after permission; otherwise backfill typographic treatment. |

- [ ] Assign DRI and studio contact date.
- [ ] Approve exact context and full credit chain.
- [ ] Obtain media permission or choose typographic treatment by freeze.
- [ ] Add EN/FR alt, credit, focal point, and CMS relation if media is used.
- [ ] Complete final EN/FR preview and reconciliation.

### 6.5 Viventi Mori

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign a collaborator-facing content/media owner. |
| Current state | `_status: published`; `verification: needs-media`; featured order 5 | **BLOCKED.** |
| EN/FR copy | All core fields and what-changed exist in both locales | **DRAFT PRESENT.** Exact year and preferred artistic credit remain open in the dossier. |
| Exact role | EN: “Physical system / case design and fabrication — collaborative creator”<br>FR: “Système physique / conception et fabrication du coffre — créateur collaboratif” | Confirm with Saël and collaborators. Avoid implying sole authorship of illustration, animation/3D, Notch, or sound. |
| Authorship / tier | `collaborative` / `A — Signature` | Confirm tier and whether the `authored` tag should coexist with collaborative authorship. |
| Context | `2018–2019`; Kommon Collective; “Presented at Pixelatl” | Confirm exact build and presentation year, official event naming, and location. |
| Credits | Sylvie Béraud — illustrations/design; Alexandre DeBavelaere / Alex Vlair — animation/3D/Notch; Bobby Léon — sound; Saël Simard — physical system/case | Preserve all four. Confirm spellings, role phrasing, Kommon Collective credit, and any omitted collaborators. |
| Outcomes / facts | Seed describes the portable three-projector object and fabrication. No audience, award, exhibition count, or performance outcome is stored | Verify the physical specifications and presentation history. Add no scale/outcome claim without evidence. |
| Hero treatment | **PROVISIONAL: `media` if collaborator-authorized; otherwise `typographic`** | The work benefits from object imagery, but rights and credits take priority. |
| Required assets | Desired release set: one object/installation hero and up to 3 detail images; optional existing teaser video. No diagram required. | Dossier references Alex Vlair, Dessignare, and Vimeo media; those references are not reuse permission. |
| Source / rights / credit | Third-party/collaborator-hosted sources; ownership and reuse terms unknown | Obtain original files and written approval from the appropriate creator/rightsholder. Credit each asset, not only the project. |
| Alt / focal point | No CMS media or localized alt | Write object-specific EN/FR alt; choose focal points that keep skull, case, and mapped surface legible where applicable. |
| Internal-note removal | No explicit archive instruction in seed | Resolve the dossier’s year/role confirmations before final copy; remove research framing. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval after collaborator-credit and media review. |
| Migration | Code seed; no CMS media | **NOT STARTED.** Backfill treatment, credits, asset-level rights/alt/focal point, or select typographic by freeze. |

- [ ] Assign DRI and date.
- [ ] Confirm year, role, tag/tier, spellings, and complete credits.
- [ ] Request collaborator-approved originals and per-asset terms.
- [ ] Approve EN/FR copy, hero/gallery/video, alt, and crops.
- [ ] Complete migration and final preview.

### 6.6 Omega Protocol

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign an archive-recovery and partner-credit owner. |
| Current state | `_status: published`; `verification: needs-media`; featured order 4 | **BLOCKED.** |
| EN/FR copy | All core fields and what-changed exist in both locales | **DRAFT PRESENT; INTERNAL RESEARCH LANGUAGE EMBEDDED.** |
| Exact role | EN: “Creator / Producer”<br>FR: “Créateur / producteur” | This is per Saël; the dossier says formal company credit must be verified. Do not publish as sole authorship until partner/company context is settled. |
| Authorship / tier | `authored` / `A — Signature` | Confirm after the credit review. |
| Context | `2023`; Mother of the Nation Festival, Abu Dhabi; no studio/client stored | Confirm official producer/company, client/festival naming, dates, venue, and partner list. |
| Credits | Saël Simard — Creator / Producer only | **INCOMPLETE UNTIL REVIEW.** Recover company, production partner, development, art, sound, venue/festival, and other required credits. |
| Outcomes / facts | Seed/public-research draft describes a multiplayer location-based VR game, alien combat, and teleportation. Hardware, tracking, spectator layer, player count, attendance, throughput, and formal partners are unknown | Publish no numerical or architectural claim until archives or owner evidence support it. Attribute press-derived descriptions where necessary. |
| Hero treatment | **PROVISIONAL: `typographic` until archive recovery** | Upgrade to media only after credit and rights review. |
| Required assets | Desired: gameplay still, headset/arena photograph, spectator view; optional trailer and approved high-level diagram. Typographic release requires none. | Recover originals before using press/social images. |
| Source / rights / credit | Press references exist; original asset owner and reuse rights unknown | Do not republish press imagery by default. Record creator/rightsholder and permission for each selected asset. |
| Alt / focal point | No media records | Add EN/FR alt and focal point after asset selection; describe the visible experience without asserting unverified mechanics. |
| Internal-note removal | System copy says details/credits are “to be recovered from production archives” | **REMOVE BEFORE PUBLICATION.** Resolve the gaps or shorten the public system section to verified facts. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval after company/partner/rights review. |
| Migration | Code seed; no CMS media/treatment | **NOT STARTED.** Backfill typographic first; attach media only after review. |

- [ ] Assign DRI and archive owner.
- [ ] Confirm company/client/partner context, exact role, and full credits.
- [ ] Verify gameplay/technical facts and remove archive instructions.
- [ ] Approve typographic treatment or rights-cleared assets.
- [ ] Complete migration and final EN/FR preview.

### 6.7 Versus

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign an archive-recovery and partner-credit owner. |
| Current state | `_status: published`; `verification: needs-media`; not featured | **BLOCKED.** |
| EN/FR copy | All core fields and what-changed exist in both locales | **DRAFT PRESENT; INTERNAL RESEARCH LANGUAGE EMBEDDED.** |
| Exact role | EN: “Creator / Producer”<br>FR: “Créateur / producteur” | Per Saël; formal company credit remains unverified. |
| Authorship / tier | `authored` / `A — Signature` | Confirm after authorship/partner review. |
| Context | `2022`; Mother of the Nation Festival, Abu Dhabi; client `LINKVIVA` (owner-confirmed 2026-08-21); no studio stored | Client is confirmed. Any additional production partners still need confirmation. |
| Credits | Saël Simard — Creator / Producer only | Recover company, partners, collaborators, festival/client, and media credits. |
| Outcomes / facts | Seed calls it multiplayer immersive VR and pairs it with Omega Protocol. Exact gameplay, hardware, player count, tracking, throughput, and results are unknown | Do not turn the two-year lineage into a performance or evolution claim beyond what Saël approves. |
| Hero treatment | **PROVISIONAL: `typographic` until archive recovery** | Media is not required to keep a safely scoped record, but incomplete copy/credits still block publication. |
| Required assets | Desired: gameplay/arena hero and one spectator/system view; optional trailer. Typographic release requires none. | Recover original production media rather than reusing festival social content without permission. |
| Source / rights / credit | Festival social evidence exists; reuse terms unknown | **UNKNOWN.** Obtain originals and per-asset permission/credit. |
| Alt / focal point | No media records | Add only after approved asset selection. |
| Internal-note removal | Experience says details “should be recovered from archives”; system says hardware/player count are “pending archive recovery” | **REMOVE BEFORE PUBLICATION.** Replace with verified public facts or omit those sections. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval after archive, credit, and rights review. |
| Migration | Code seed; no CMS media/treatment | **NOT STARTED.** Backfill typographic after copy/credit verification. |

- [ ] Assign DRI and date.
- [ ] Recover exact gameplay, system, company, partner, and credit records.
- [ ] Remove research instructions and approve EN/FR copy.
- [ ] Approve typographic treatment or rights-cleared media.
- [ ] Complete migration and final preview.

### 6.8 Villa Hublot

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign an owner who can coordinate Bakuza/client approval. |
| Current state | `_status: published`; `verification: needs-media`; not featured | **BLOCKED.** |
| EN/FR copy | Title, role, lede, question, experience, and system exist; `whatChanged` is absent in both locales | **DRAFT PRESENT.** Decide whether an outcomes/learning section is needed; do not fill it with generic impact language. |
| Exact role | EN: “System Designer — Bakuza Events”<br>FR: “Concepteur de systèmes — Bakuza Events” | The dossier cites public/resume support; obtain final owner/studio approval. |
| Authorship / tier | `contribution` / `B — Professional contribution` | Preserve contribution framing. |
| Context | `2022`; Bakuza Events; Hublot — FIFA World Cup, Doha; Doha, Qatar | Confirm official event/client naming and whether the work was a Bakuza employment or contract contribution. |
| Credits | Bakuza Events — Studio; Saël Simard — System Designer | Confirm Hublot/client/production partners and the complete creative/technical credit chain. |
| Outcomes / facts | Seed describes interactive multimedia systems in a hospitality environment; exact systems, visitor numbers, operational outcomes, and scale are not stored | Verify the systems Saël designed. Add no guest/engagement/brand-impact claim without evidence. |
| Hero treatment | **PROVISIONAL: `typographic` until authorized media arrives** | Upgrade to media only with Bakuza/client approval. |
| Required assets | Desired: one authorized installation hero and optionally one clean detail or approved video still. No diagram required. | Dossier points to Bakuza thumbnail/video as research sources, not automatic reuse permission. |
| Source / rights / credit | Bakuza/client-controlled media likely; terms unrecorded | Request approved original, crop permission, asset-level credit, and any brand-usage restrictions. |
| Alt / focal point | No media records | Add EN/FR alt and focal point after approval; respect logo/brand crop requirements if supplied. |
| Internal-note removal | No explicit archive instruction in seed | Verify exact system scope and remove any statement that cannot be substantiated. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval and any required Bakuza/client approval reference. |
| Migration | Code seed; no CMS media/treatment | **NOT STARTED.** Add treatment, complete context/credits, and migrate authorized media if received. |

- [ ] Assign DRI and Bakuza contact.
- [ ] Confirm role, employment/contract context, client/event naming, and full credits.
- [ ] Decide whether `whatChanged` is required and write only sourced copy.
- [ ] Secure media terms or approve typographic treatment.
- [ ] Complete migration and final EN/FR preview.

### 6.9 Sensory Odyssey / Vivid

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign an owner who can coordinate Supply + Demand approval. |
| Current state | `_status: published`; `verification: needs-media`; not featured | **BLOCKED.** |
| EN/FR copy | Title, role, lede, question, experience, and system exist; `whatChanged` is absent | **DRAFT PRESENT.** System copy contains unresolved confirmation language. |
| Exact role | EN: “System Designer — Supply + Demand”<br>FR: “Concepteur de systèmes — Supply + Demand” | Per Saël; confirm approved public wording with the studio. |
| Authorship / tier | `contribution` / `B — Professional contribution` | Preserve clear statement that Saël did not create Sensory Odyssey. |
| Context | `2026`; Supply + Demand; North American deployment; Vivid at California Academy of Sciences described in body; no client/location field | Confirm exact cities, tour/deployment dates, venue naming, Modular Exhibit System wording, and whether the Academy should be a structured context field. |
| Credits | Sensory Odyssey Studio — content/original production; Supply + Demand — North American co-production; Saël Simard — System Designer | Confirm Muséum national d’Histoire naturelle and other required production/venue credits. |
| Outcomes / facts | Seed describes projection, sound, scent, interactive avatars, scenography, and system design. Exact architecture and cities remain unconfirmed; no visitor/tour/operational outcome is stored | Verify scope. Publish no venue count, reliability, scale, or impact claim without approval. |
| Hero treatment | **PROVISIONAL: `typographic` until studio-authorized imagery arrives** | Avoid hotlinking or republishing Academy assets. |
| Required assets | Desired: one authorized installation hero and up to 2 environment/detail images; optional approved video. No public technical diagram required. | Request originals from Supply + Demand with full credit metadata. |
| Source / rights / credit | Academy page has credited photographs; dossier recommends studio-authorized originals | **UNKNOWN PERMISSION.** Public availability does not grant reuse rights. |
| Alt / focal point | No media records | Add EN/FR alt, credit, and focal point once assets and crops are approved. |
| Internal-note removal | System says exact cities and architecture details “remain for confirmation” | **REMOVE BEFORE PUBLICATION.** Resolve the facts or omit the unverified detail. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval and any required Supply + Demand approval reference. |
| Migration | Code seed; no CMS media/treatment | **NOT STARTED.** Complete context/credits, backfill treatment, and ingest only authorized assets. |

- [ ] Assign DRI and studio contact.
- [ ] Confirm exact role, cities, dates, system scope, and complete credit chain.
- [ ] Remove confirmation language and approve EN/FR copy.
- [ ] Obtain authorized media or approve typographic treatment.
- [ ] Complete migration and final preview.

### 6.10 Le Repaire (secret secret)

| Control | Current repository value | Status / required action |
|---|---|---|
| DRI / target | `[ASSIGN]` / `[SCHEDULE]` | Assign an owner who can coordinate studio and photographer approval. |
| Current state | `_status: published`; `verification: needs-media`; not featured | **BLOCKED.** |
| EN/FR copy | Title, role, lede, question, experience, and system exist; `whatChanged` is absent | **DRAFT PRESENT.** |
| Exact role | EN: “System Designer / Integrator — Supply + Demand”<br>FR: “Concepteur de systèmes / intégrateur — Supply + Demand” | Per Saël. The studio’s public post does not list individual technical-team credits, so confirm wording before publication. |
| Authorship / tier | `contribution` / `B — Professional contribution` | Preserve studio-production framing and avoid implying overall creative authorship. |
| Context | `2026`; Supply + Demand; Village historique de Val-Jalbert; historical experience in pulp railway cars | Confirm location, opening/project dates, official title styling, audience age wording, and what institutional context may be used. |
| Credits | Supply + Demand — Studio; Saël Simard — System Designer / Integrator; Naomi Silver-Vézina — Photography (studio post) | Confirm complete studio/creative/technical credits and whether the photography credit applies to every selected asset. |
| Outcomes / facts | Seed describes an experience for children roughly 6–12, 1920s Val-Jalbert, three named characters, and studio disciplines; no visitor, capacity, run, or outcome data is stored | Verify the audience range, story details, and systems contribution. Add no scale/outcome claim without evidence. |
| Hero treatment | **PROVISIONAL: `typographic` until studio/photographer-authorized media arrives** | Upgrade only after per-asset permission. |
| Required assets | Desired: one authorized railway-car/installation hero and optionally 2 interaction/environment images. No video/diagram required for release. | Request originals from Supply + Demand rather than extracting social images. |
| Source / rights / credit | Studio post credits Naomi Silver-Vézina; reuse terms and selected-asset authorship are unrecorded | Obtain written studio/rightsholder permission, exact credit, and credit URL if required. |
| Alt / focal point | No media records | Add image-specific EN/FR alt and focal points after final asset selection. |
| Internal-note removal | Seed contains a public-facing attribution explanation, not an archive instruction | Keep conservative team attribution if approved; remove any editor-facing explanation and resolve `whatChanged` intentionally. |
| Final approval | `[PENDING — OWNER / DATE]` | Record owner approval and any required studio/photographer approval reference. |
| Migration | Code seed; no CMS media/treatment | **NOT STARTED.** Backfill treatment/context/credits; ingest authorized media only. |

- [ ] Assign DRI and studio/photographer contact.
- [ ] Confirm exact role, context, audience/story facts, and full credits.
- [ ] Decide whether `whatChanged` is required and approve both locales.
- [ ] Obtain media permission or approve typographic treatment.
- [ ] Complete migration and final EN/FR preview.

## 7. Asset request minimum

Every media request should ask for more than a file:

- [ ] Original/high-resolution asset or approved derivative
- [ ] Creator/photographer and rightsholder
- [ ] Written web/social/portfolio reuse permission
- [ ] Required visible credit and credit URL
- [ ] Allowed crops, edits, overlays, and responsive variants
- [ ] Territory, duration, embargo, and withdrawal constraints, if any
- [ ] Confirmation that identifiable people, brands, and locations are cleared where applicable
- [ ] EN/FR caption source, if one is required
- [ ] Preferred focal point or crop notes

Store the permission record outside the public Media document if it contains private contact or contractual information; link a stable internal reference from this ledger/migration report.

## 8. Migration and reconciliation checklist

- [ ] Back up production data and record the backup identifier.
- [ ] Introduce the M0-04 readiness/hero/media contract before backfilling production records.
- [ ] Stop the seed from making unready records publicly eligible.
- [ ] Set all ten records to a non-public state before the dry run, unless the future query gate already excludes them.
- [ ] Create/update Media records with source, credit, localized alt, and focal point.
- [ ] Set `heroTreatment` explicitly for every project.
- [ ] Migrate selected hardcoded Azul Vivo, OnMove, and Man Who Planted Trees assets into CMS records or document why a fallback remains.
- [ ] Remove internal research language identified above.
- [ ] Validate required EN and FR fields without fallback masking omissions.
- [ ] Run a staging dry run and generate before/after counts by slug, locale, status, verification, hero treatment, and media relation.
- [ ] Reconcile all ten staging rows against this ledger.
- [ ] Test rollback and record the result.
- [ ] Observe the content freeze, run final previews, then approve eligible records one at a time.

## 9. Release roll-up

| Metric | Current | Release target |
|---|---:|---:|
| Projects with assigned DRI | 0 / 10 | 10 / 10 |
| Projects with target approval date | 0 / 10 | 10 / 10 |
| Projects with documented final EN/FR approval | 0 / 10 | Every public project |
| Projects with verified exact role/context/credits | 0 / 10 documented | Every public project |
| Projects with explicit hero treatment | 0 / 10 in current schema/seed | 10 / 10 |
| Media treatments with recorded reuse rights | 0 documented | Every media-based treatment |
| Projects with internal-note cleanup signed off | 0 / 10 documented | 10 / 10 |
| Projects reconciled by migration report | 0 / 10 | 10 / 10 |
| Projects with recorded final owner approval | 0 / 10 | Every public project |
| Public-ready projects | 0 / 10 | Owner-selected set; no unready records public |

The release target is not necessarily ten public projects. It is ten accounted-for records and zero accidentally public records. A deliberately withheld project is acceptable when its ledger explains why.

## 10. Update log

| Date | Project | Change | Evidence/link | Updated by | Final approval affected? |
|---|---|---|---|---|---|
| `[YYYY-MM-DD]` | `[SLUG]` | `[CHANGE]` | `[REFERENCE]` | `[NAME]` | `[YES/NO]` |
