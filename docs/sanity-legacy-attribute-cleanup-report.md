# Sanity legacy attribute cleanup — pre-flight audit

Dataset attribute limit: **2000**. Studio blocked at **2002** attributes.

Hidden schema fields **still count** when document data exists. This cleanup **unsets** stored values only (`unset[]`); documents are not deleted.

Replacement singletons expected in production:

- `headerSettings` (`_id: headerSettings`)
- `footerSettings` (`_id: footerSettings`)
- `termsConditionsSettings` (`_id: termsConditionsSettings`)
- `faqsSettings` (`_id: faqsSettings`)

---

## Summary table

| Document type | Field path | Still queried/read? | Safe to unset | Reason |
|---------------|------------|---------------------|---------------|--------|
| `siteSettings` | `header` | Fallback only if `headerSettings` missing | **Yes** (if `headerSettings` exists) | Replaced by `headerSettings`; nested object is large |
| `siteSettings` | `footer` | Fallback only if `footerSettings` missing | **Yes** (if `footerSettings` exists) | Replaced by `footerSettings` |
| `siteSettings` | `socialLinks` | Fallback via `getSiteSettingsShell` / `resolveFooterShell` | **Yes** (if `footerSettings` exists) | Social links live on `footerSettings.socialMedia` |
| `siteSettings` | `copyright` | Fallback footer copyright | **Yes** (if `footerSettings` exists) | Copyright on `footerSettings` |
| `siteSettings` | `defaultWhatsappUrl` | Fallback WhatsApp | **No** | Still read when footer doc lacks URL; keep until footer has value |
| `footerSettings` | `footer` (nested legacy block) | Not read when new column model used | **Yes** (if `column1` defined) | Hidden legacy nested footer |
| `footerSettings` | `socialLinks` | Legacy fallback in `resolveFooterShell` | **Yes** (if `socialMedia` length > 0) | Replaced by `socialMedia[]` |
| `footerSettings` | `copyright` | Legacy fallback | **Yes** (if `bottomBar.copyright` or column model present) | Replaced by `bottomBar` |
| `experiencePage` | `snapshotStatSelections` | Studio preview only | **Yes** | Not used in `soqtapataStructuredCms` runtime |
| `experiencePage` | `payloadV1` | Not in `soqtapataStructuredPageBySlugQuery` | **Yes** | Deprecated JSON blob |
| `experiencePage` | `tailorMadeImage`, `tailorMadeAlt`, `tailorMadeCtaLabel` | GROQ fetch only; not passed to `resolveTailorMadeBand` | **Yes** | Tailor band is copy + smart link only |
| `experiencePage` | `lodgePageLink`, `lodgeCtaSmartLink` | Deprecated; lodge cards use KC slugs | **Yes** | `lodgeCtaLabel` / visibility still active |
| `experiencePage` | `resources` (`experiencePageResources`) | Deprecated overrides | **Yes** | Cards edited on Experience KC |
| `experiencePage` | `overviewHighlightOrder`, `wildlifeDisplayOrder`, `includesDisplayOrder`, `notIncludesDisplayOrder`, `faqDisplayOrder`, `resourcesFromExperienceOrder`, `termsImportantNotesKeys`, `termsImportantNotesOrder` | Only if `*OrderKeys` empty | **Yes** | Replaced by `_key` pickers |
| `experiencePage` | `relatedSectionEyebrow`, `relatedSectionTitle` | Deprecated | **Yes** | `sectionModules` presentation |
| `experiencePage` | `reviewRefs` | Fallback when `reviewsSection.reviewCards` empty | **Per doc** | Unset only when `reviewsSection.reviewCards` has items |
| `experiencePage` | `reviewsLayout` | `reviewsLayoutFromRow` fallback | **No** | Still merged for rating/copy when block empty |
| `experiencePage` | `reserveBlock` | Legacy reserve fallback | **No** | Still read after `reserveCtaSettings` |
| `experience` | `termsPanels` | Legacy; central CK preferred | **Per doc** | Unset when central terms apply to this experience |
| `experience` | `fullTermsPdf` | Legacy PDF; central CK preferred | **Per doc** | Unset when central PDF resolves for experience |
| `experience` | `faqs` | Legacy; central FAQs preferred | **Per doc** | Unset when central FAQs apply to experience |
| `experience` | `resources` (`experienceResourceCard[]`) | Legacy cards | **Per doc** | Unset when `knowledgeResources` has items |
| `experience` | `travelerGuideSections` | Legacy buckets | **Per doc** | Unset when `travelerGuideSubsections` has items |
| `routesPage` | `routeCards[].footPriceHtml` | Not in GROQ; computed at runtime | **Yes** | `resolveRoutesPageData` builds foot price HTML |
| `lodgePage` | `menuCtaLabel`, `menuCtaSmartLink` | Not referenced in `lodgePageCms` | **Yes** | Mega menu CTA from KC / header |
| `lodgePage` | `heroImageOverride`, `heroCtaSmartLink` (legacy) | Hidden; superseded by hero picks | **Yes** | Hero from KC gallery picks |
| `homePage` | Many `* (legacy)` copy fields | Fallback in `homePageDefaults` / `applyHomePageSmartLinks` | **No** (this pass) | Needs per-field smart-link migration audit |

---

## Intentionally retained (still used)

- `experiencePage.reviewsLayout`, `reserveBlock`, `sectionModules`
- `experiencePage.lodgeCtaLabel`, `termsOrderKeys`, `faqOrderKeys`, active pickers
- `experience.cancellationPolicy`, `importantNotes`, `travelerGuideSubsections`, `knowledgeResources`
- `experience.mapPdfUrl` / `brochurePdfUrl` when no `knowledgeResources` (legacy path in resolver)
- `siteSettings.defaultWhatsappUrl` until footer settings owns WhatsApp URL
- All `homePage` legacy CTA strings (still fallback for smart links)

---

## Script

`scripts/cleanupSanityLegacyAttributes.ts` (npm: `cleanup:sanity-legacy-attributes`)

- Default: **dry-run**
- Apply: `--commit`
- Uses `SANITY_API_TOKEN` from `.env.local` (strips accidental `TU_TOKEN_AQUI` prefix if present)

## Production run (completed)

| Metric | Value |
|--------|-------|
| Fields before | **2077** (limit 2000) |
| Fields after | **1868** |
| Delta | **−209** |
| Patches committed | **18** (11 documents) |

Studio should load again (under limit).

### Documents patched

| Type | Count | Fields unset |
|------|-------|----------------|
| `siteSettings` | 1 | `header`, `footer`, `socialLinks`, `copyright` |
| `experiencePage` | 5 | `snapshotStatSelections`, tailor legacy image fields, `lodgePageLink`, `lodgeCtaSmartLink`, `resources`, `includesDisplayOrder`, `reviewRefs` |
| `experience` | 5 | `termsPanels`, `fullTermsPdf`, `faqs`, `resources` |
| `lodgePage` | 4 | `heroCtaSmartLink` |
| `routesPage` | 1 (3 array paths) | `routeCards[].footPriceHtml` |

---

## Second pass — Biodiversity / Learning Programme publish block (2026-06-06)

### Trigger

Publishing **Biodiversity Experiential Learning** failed with `Total attribute/datatype count 2007 exceeds limit of 2000`.

**Important:** Sanity’s 2000 limit is **dataset-wide** (unique stored attribute paths), not per document. No single document exceeded 2000; the dataset had crept back over the limit after new content and legacy stored fields.

### Affected documents

| Role | Type | ID | Slug / title |
|------|------|-----|--------------|
| Learning Programme (KC) | `learningProgramme` | `5e5f0c46-abb6-4949-ba4a-78adf4acb7fe` | `biodiversity-experiential-learning` — *Biodiversity Experiential Learning* |
| Experience Page (presentation) | `experiencePage` | `9202d4bc-66e6-40e3-bd10-9ea683a356fc` | `biodiversity-experiential-learning` |
| Stale singleton draft | `headerSettings` | `drafts.headerSettings` | Duplicate of published nav (discarded) |

LP draft attrs ≈ **328**; XP attrs ≈ **410**. Top LP contributors: `projects`, `resources`, `typicalDayRows`, `snapshotHighlights`, `howItWorksSteps`.

### Attribute contributors (dataset)

| Source | Approx. attrs removed | Notes |
|--------|----------------------|-------|
| `experiencePage` legacy CTAs / reserve (7 docs) | −44 | `pageHero.bookCta`, `internalNav.bookCta*`, `reserveBlock`, linked-price text |
| `routesPage` legacy `routeCards[].cta` | −4 | Superseded by `ctaSmartLink` |
| `routesPage` deprecated experiences/reviews/final CTA blobs | **−63** | `experienceCards` (~142 stored paths), filters, hero/reviews/final legacy |
| `drafts.headerSettings` discarded | 0 (paths already counted) | Stale Studio fork; nav structure matched published |

### Final stats

| Metric | Value |
|--------|-------|
| Before second pass | **2038** |
| After second pass | **1971** |
| Delta | **−67** |
| Learning Programme published | **Yes** (`5e5f0c46-abb6-4949-ba4a-78adf4acb7fe`) |

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run cleanup:sanity-legacy-attributes` | Dry-run legacy unset plan |
| `npm run cleanup:sanity-legacy-attributes -- --commit` | Apply patches |
| `npm run diagnose:sanity-document-attributes` | Per-document attribute audit |
| `npm run diagnose:sanity-document-attributes -- --id=<id>` | Single doc breakdown |

### Safe unset rules added (second pass)

- `routesPage`: `experienceCards`, `experiencesFilters`, `selectedExperiences`, hero legacy CTAs when smart links exist, reviews legacy when `reviewsSection` populated, final CTA legacy when `reserveCtaSettings` / smart links exist
- `experiencePage`: hero/nav/reserve legacy when smart-link replacements exist
- `learningProgramme` drafts: broken gallery `_upload` rows; `fieldBaseRef` when `lodgePresentationRows` populated

### Recommendations

1. **Re-run cleanup after major CMS migrations** — hidden schema fields still count when data remains stored.
2. **Unset legacy on `routesPage` / `homePage` / `aboutPage`** in a follow-up pass (same pattern as routes second pass); `homePage` legacy CTAs still fall back at runtime.
3. **Discard stale singleton drafts** (`headerSettings`, etc.) when Studio opens docs without publishing — use Sanity “Discard changes” or `discard_drafts`.
4. **Monitor** with stats API: `https://{projectId}.api.sanity.io/v1/data/stats/{dataset}` — keep headroom under **1900** for edits.
5. **Schema phase 2:** remove hidden legacy fields from schema once all documents are migrated (optional; unset is sufficient for the limit).
