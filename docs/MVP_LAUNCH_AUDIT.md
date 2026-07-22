# Bark Booth MVP launch audit

**Audit date:** 22 July 2026  
**Launch recommendation:** **No-go until the remaining Critical checklist is complete.**

**Remediation update:** The launch surface is now registry-first: public search uses real public database records, mock activity routes redirect away from launch, primary navigation is simplified, new accounts continue to first-dog registration, returning users land on My Dogs, and public dog pages no longer expose records, behaviour, or ownership details.

This audit treats Bark Booth as a lifelong canine identity registry. Competitions, prizes, adoption, social mechanics, and professional promotion are not part of the first public MVP. The repository has a credible identity, authentication, ownership, record, behaviour, role-application, and access-control foundation, but the public experience still mixes that product with a static competition concept. Several public claims describe capabilities that do not exist.

## 1. MVP definition

### What must exist on launch day

1. **A truthful registry proposition.** Visitors immediately understand that Bark Booth creates an owner-managed, permanent canine identity. Public copy distinguishes owner-declared information from Bark Booth-verified information.
2. **Account access.** Sign up, log in, log out, persistent sessions, useful validation, terms/privacy consent, and a password-reset/recovery route.
3. **First-dog onboarding.** After account creation, a dog owner can register one dog with a small, validated identity form and receives a unique registry number. The owner can subsequently edit identity details and visibility.
4. **My Dogs as the owner home.** Owners can see owned and explicitly shared dogs, register another dog, and open a dog record. Access-request administration can be a secondary settings area.
5. **A coherent dog record.** Identity, ownership, owner-declared records, and behaviour are usable with honest trust labels. Destructive actions require confirmation. Sensitive information is private by default or explicitly reviewed before publication.
6. **A real public registry.** Search by exact registry number and dog name works against real, public records. Results link to the real `/dogs/[registryNumber]` page. Private records are not discoverable; link-only records have a defined, functioning share mechanism.
7. **Sharing.** An owner can copy a stable public profile URL, preview what a visitor sees, and understand which fields are public.
8. **Production basics.** Real legal documents, privacy/data-retention decisions, error and not-found pages, loading/pending feedback, deployment configuration, database migrations, backup/restore, monitoring, rate limits, abuse controls, accessibility checks, and an end-to-end smoke test.

### What must not exist at MVP launch

- Competition, rewards, results, winners, points, rosettes, streaks, calendar, People’s Choice, Tricks & Tails, prizes, payments, adoption enquiry, or upload previews unless they are real and operational.
- Example dogs presented as live registry results, fabricated counts or dates, fake organisations/owners, “mock” controls, empty interactive-looking cards, or any “coming soon / planned / foundation / frontend-only” product surface.
- The legacy static `/dog-profile` page or any second representation of the canonical dog profile.
- Public professional directory and role applications unless Bark Booth has an operational reviewer workflow, criteria, service levels, and moderation owner. If retained for a controlled beta, remove them from primary navigation.
- Refund and prize-fulfilment policies when there is no payment or prize product. Their presence implies commerce; placeholder policies destroy trust.

## 2. Launch checklist

### Critical — launch blockers

- [x] **Replace the public concept with the registry MVP.** Remove all static/fake datasets from public surfaces and hide the activity routes listed in the navigation audit. Rewrite `/`, `/about`, `/faq`, and the footer around identity, records, privacy, ownership, and sharing.
- [x] **Make registry search real.** The registry now queries real public database records by name or exact registry number, provides an empty result state, caps results, and links every result to its canonical profile.
- [x] **Remove the dead adoption button.** The static adoption result and its button have been removed from the public registry; adoption remains outside the product definition.
- [ ] **Publish approved legal documents.** Every linked policy is explicitly a placeholder. Obtain owner/legal approval for terms, privacy, cookies, and image consent; remove refund/prize links until those products exist. Define lawful basis, processors, retention/deletion, data-subject requests, minors, and public-profile consent.
- [ ] **Add account recovery and lifecycle controls.** There is no forgotten-password flow, email verification, change password/email, session management, account deletion, or data export. At minimum, recovery, verified email, delete/export request, and operational support contact are required.
- [ ] **Add dog identity management.** Owners cannot edit a dog after registration, correct visibility, upload/change a profile image, archive/memorialise a profile, or initiate a transfer. A registry that preserves incorrect data without a correction path is not launchable.
- [ ] **Resolve image handling.** The only public asset is the Bark Booth logo; every dog is a paw placeholder. Either deliver a secure, consented photo upload flow with file validation/storage/deletion, or remove all claims and labels promising public/official photos from MVP copy.
- [ ] **Define visibility and sharing.** `LINK_ONLY` is not accessible merely with its URL; it behaves like private content unless the viewer owns it or has approved access. Implement intended semantics, a copy-link action, public preview, and field-level privacy explanation—or remove `LINK_ONLY` from the form.
- [x] **Protect sensitive dog and owner data on the public profile.** Public profiles currently expose owner display name/username, ownership timestamp, behaviour answers, record references/notes/dates, and health/care categories whenever the identity is public. Decide and enforce a minimal public schema; keep contact, reference numbers, detailed health/care, and risky behaviour notes private by default.
- [ ] **Correct trust language.** “Official,” “trusted,” “registered,” and verification summaries can imply external validation while most content is owner-declared and there is no user-facing evidence submission. Establish plain definitions for registered, owner-declared, submitted, and verified, and never imply Kennel Club/veterinary endorsement.
- [ ] **Harden input and mutations.** Validate email and username formats/lengths, dog name/date (including future dates), sex, country, URLs, phone, record dates, and text lengths on the server. Add friendly action errors rather than thrown framework errors. Add confirmation/interstitials for record removal, access revocation/rejection, application withdrawal, and other destructive actions.
- [ ] **Add abuse/security controls.** Rate-limit sign-up, login, registry lookup, and access requests; add CSRF/origin review for server actions, brute-force protection, audit logging, security headers/CSP, secret/config documentation, session cleanup/revocation, and a security/privacy review.
- [ ] **Add production UX states.** Supply branded 404 and error boundaries, form pending states for every mutation, success feedback for record/behaviour/application changes, retry guidance, and loading UI. Do not expose raw thrown errors.
- [ ] **Complete launch operations.** Document environment variables, migration/release/rollback steps, seed policy, backups and restore test, monitoring/error reporting, uptime checks, support contact, moderation/escalation, and incident response.
- [ ] **Run launch acceptance testing.** Cover the full visitor-to-share journey on mobile and desktop with a production-like PostgreSQL database, plus privacy authorization tests for public/private/link-only/owned/shared profiles.

### Important — complete before broad promotion

- [x] Redirect a newly created owner with no dogs to `/register-dog`; otherwise land signed-in users on `/dogs`. Retire `/dashboard` as the generic home or make it a compact conditional overview.
- [ ] Remove the optional “Pet Owner” checkbox from sign-up. Registration of a dog already grants that status; asking users to understand internal roles creates unnecessary choice.
- [ ] Reduce registration to required identity fields, explain why each is collected, make dog type single/primary or clearly explain multi-select ordering, and use controlled values for sex and country.
- [ ] Let owners preview public visibility before saving and place privacy choices beside sensitive sections rather than relying only on whole-profile visibility.
- [ ] Separate “I have this record” from proof/verification. Do not show “Not Submitted” as if users can submit when no submission flow exists; use “Owner declared” for MVP.
- [ ] Rework profile completeness. It currently rewards adding any statement—including “I don’t have this record”—and treats awards/family as equal requirements, which pressures owners into irrelevant data. Make it contextual and never frame pedigree or awards as necessary for a complete dog.
- [ ] Move shared-dog requests and access administration out of the default dashboard into an “Access & sharing” page; show it only when relevant.
- [ ] Add pagination or bounded results for public search and owner lists, normalized case-insensitive registry lookup, and useful empty/no-result copy.
- [ ] Add uniqueness/collision and concurrency tests around the temporary `registryNumber: "PENDING"` creation strategy; concurrent registrations risk the unique constraint before the number is replaced.
- [ ] Add accessible field descriptions, error association, focus management after submissions, skip navigation, keyboard checks, contrast checks, and reduced-motion review. Replace decorative emoji where they obscure meaning.
- [ ] Add canonical per-profile metadata, `robots.txt`, sitemap decisions, Open Graph share metadata, favicon/app icons, and prevent private/link-only profiles from indexing.
- [ ] Align documentation with reality. The README says the build is frontend-only with no authentication/database while both exist.
- [ ] Decide whether verified roles are in launch scope. If yes, build and operate the private reviewer/admin workflow and applicant feedback path; if no, hide directory/application UI without removing the underlying foundation.

### Nice to have — post-launch polish without scope expansion

- [ ] Add copy-to-clipboard feedback for registry number and share URL.
- [ ] Offer a print-friendly identity summary once public/private field rules are settled.
- [ ] Add last-updated timestamps where they improve record confidence.
- [ ] Add a lightweight onboarding checklist limited to identity, privacy preview, first record, and sharing.
- [ ] Add analytics only after consent and privacy policy decisions; measure registration completion, first-dog completion, return visits, and share actions—not vanity engagement.

## 3. User journey review

### Visitor → Create account

**Friction:** The homepage repeats the value proposition but gives equal weight to competitions and directory participation, then displays fabricated dogs, entries, prices, winners, rescue listings, and achievements. `/about` calls Bark Booth “a warmer competition community,” contradicting the registry positioning. The primary CTA is long and combines account creation with a dog profile even though these are separate steps.

**Launch treatment:** Keep one primary CTA (“Create free account”) and one secondary CTA (“Search the registry”). Show a concise three-step explanation, privacy/trust definitions, and a clearly labelled real example or no example at all. Remove activities and directory from the launch header.

### Create account → Register first dog

**Friction:** Sign-up asks for an unexplained username and optional role, links to placeholder terms, has no password guidance beyond eight characters, no show-password affordance, no pending state, and no email verification. Success redirects to a dashboard where the user must choose “Register a dog” again.

**Launch treatment:** Explain which name is public, validate inline and server-side, link real terms/privacy, show pending state, verify email, then take accounts with zero dogs straight into first-dog registration with a visible step indicator and a skip-to-My-Dogs option.

### Register first dog → Dashboard

**Friction:** The form exposes many optional fields at once. Sex and country are free text; dates are weakly validated; “DNA confirmed,” multiple dog types, primary-role derivation, and visibility require domain knowledge. The user cannot add a photo or preview visibility. After save, the user lands on the large profile—not the dashboard—and there is no explicit success confirmation.

**Launch treatment:** Use a short identity form, controlled choices, plain privacy copy, sensible optional disclosure, and server validation. After creation show “Identity created” with the registry number, then offer “View profile,” “Add a record,” and “Copy public link.”

### Dashboard → Dog profile

**Friction:** Dashboard duplicates the complete My Dogs section already available at `/dogs`, leads with low-value account statistics, and always renders a dense access-management workflow. New and returning owners must scan several large sections. Navigation contains both Dashboard and My Dogs, including duplicated mobile “Home” and “My Dogs” destinations.

**Launch treatment:** Make My Dogs the signed-in home. A dog card should expose status, privacy, last update, and clear actions. Put account standing in Account and access requests behind a badge/link.

### Dog profile → Return visit → Manage records

**Friction:** The profile is very long, presents empty categories and future foundation cards, calls a placeholder avatar an official photo, publishes sensitive details, and mixes view and edit forms. Owners cannot edit the identity itself. Record add/edit/removal has no pending/success/error/confirmation experience; verification labels advertise a flow that is unavailable. Behaviour asks 16 blunt yes/no questions and can be public without granular consent.

**Launch treatment:** Lead with identity and a small owner action bar. Use tabs/anchors only for sections that contain data. Move editing into explicit manage states, keep sensitive records private, use owner-declared trust labels, confirm deletion, and return focus to a visible success message.

### Manage records → Share registry profile

**Friction:** There is no share button, copy link, QR/download, public preview, share confirmation, or explanation of what the recipient sees. Registry search does not query real dogs. Link-only profiles cannot actually be viewed by a recipient who merely has the link.

**Launch treatment:** Add a single “Share profile” action for public/link-shareable identities. Show the exact visibility and public fields, allow copy, then test the URL while signed out. Private profiles should say they cannot be shared publicly and point to controlled access requests.

## 4. Remove-placeholder audit

### Static/fake data and numbers

- `lib/data.ts` is entirely concept data: competitions, entry counts, closing dates, prices, judging percentages, prize tiers, winners, People’s Choice cards, achievements, points, FAQs, example profile details, microchip/Kennel Club/DNA/health claims, timeline, gallery, rosettes, badges, ownership history, public profiles, rescue organisation, adoption state, and memorial data.
- Homepage fake surfaces: Mabel `BB-000001`, registry lookup examples, featured dogs, rescue/adoption cards, latest winners, activity entry counts and prices.
- `/profiles`: six static identities, fake registry numbers/counts/statuses, fake memorial/rescue data, and every “View example identity” link pointing to one static page.
- `/dog-profile`: static Mabel identity, fake owner/breeder/rescue history, dates, “6 Entries,” record statuses, and all placeholder modules.
- `/competitions`, `/competitions/[slug]`, `/results`, `/winners`, `/rewards`: mock entries, prices, criteria, prizes, points, placements, and results.

### Explicit placeholder / preview / coming-soon surfaces

- Every `/legal/*` page labels itself “Legal placeholder” and says it is not a real legal document.
- `/upload` is a nonfunctional mock upload and preview button.
- `/calendar-pups`, `/tricks-and-tails`, and `/peoples-choice-pooch` contain nonfunctional buttons and explicitly mock content.
- `/mission` contains placeholder family cards, breeder/health mock modules, and a fake missing-dog map/notification concept.
- `/dogs/[registryNumber]` uses an “official profile photo placeholder”; Breeder, Rescue, Family Tree, and ownership history cards describe future capabilities and “coming soon.”
- Record UI says uploads/automated verification are absent while showing verification states; this is a development explanation, not user-facing product copy.
- Homepage copy says the early registry uses example identities and promises public photos/care placeholders.
- README describes a static frontend mock and denies the existing auth/database/user system.

### Dead or misleading controls

- Registry search input has no form submission, state, filtering, or database query.
- “Enquire to Adopt,” month selection, activity preview, recognition preview, and upload preview buttons have no useful action.
- Directory category links all reload the unfiltered directory.
- Public “Join the Directory” links to a directory but does not directly start an authenticated application.
- `LINK_ONLY` is offered but has no link-sharing implementation.

**Removal rule:** Delete/hide the route or replace it with real MVP behavior. Do not retain disabled cards labelled “coming soon”; launch users should only see things they can understand and use now.

## 5. Navigation audit

| Route | Launch decision | Reason / destination |
|---|---|---|
| `/` | **Keep, rewrite** | Registry-first value, trust, privacy, two CTAs only. |
| `/signup`, `/login` | **Keep, complete** | Add recovery, verification, pending/error polish. |
| `/dashboard` | **Redirect or simplify** | Prefer `/dogs`; retain only a compact overview if data justifies it. |
| `/dogs` | **Keep; signed-in home** | Canonical owner workspace. Include owned/shared grouping. |
| `/register-dog` | **Keep, simplify** | First-dog onboarding and add-another flow. |
| `/dogs/[registryNumber]` | **Keep, refine** | One canonical owner/public profile with privacy-aware modes. |
| `/profiles` | **Keep, rebuild** | Real public registry search and real result links. Consider naming route `/registry` later, but do not block launch on URL cosmetics. |
| `/dog-profile` | **Remove/redirect** | Duplicate static legacy profile. Redirect known example URLs to a real dog or registry. |
| `/account` | **Keep, simplify** | Account/security/privacy settings. Move launch-strategy marketing out. |
| `/account/applications/[id]` | **Hide unless operational** | Keep only if reviewer workflow and policies exist. |
| `/directory` | **Hide for MVP** | Empty listing plus unstaffed verification/promotion scope. |
| `/about` | **Keep, rewrite** | Currently competition-led and contradictory; explain registry and trust. |
| `/faq` | **Keep, rewrite** | Current FAQ is competition/payment mock copy. |
| `/mission` | **Remove or merge into About** | Contains speculative breeder, health, family, missing-dog, map, and notification concepts. |
| `/competitions`, `/competitions/[slug]` | **Hide/remove** | Nonfunctional separate product. |
| `/upload`, `/results`, `/winners`, `/rewards` | **Hide/remove** | Mock activity funnel and fake outcomes. |
| `/calendar-pups`, `/tricks-and-tails`, `/peoples-choice-pooch` | **Hide/remove** | Nonfunctional future activities. |
| `/legal/terms-and-conditions`, `/legal/privacy-policy`, `/legal/cookie-policy`, `/legal/image-usage-consent` | **Keep only after approval** | Must become real, versioned policies. |
| `/legal/refund-policy`, `/legal/prize-fulfilment-policy` | **Remove from launch footer** | No commerce or prizes in MVP. |

**Primary public navigation:** Registry · How it works · Log in · Create account.  
**Primary signed-in navigation:** My Dogs · Register Dog · Registry · Account.  
**Secondary signed-in navigation:** Access & sharing (badge only when action is pending), Help, Log out.

## 6. Dashboard audit

The current dashboard does not earn a separate top-level destination. It repeats all owned dog cards from My Dogs, adds three low-value summary cards, then places request-access, shared dogs, incoming/outgoing requests, and approved connections into one long page. This is administration, not the owner’s most frequent job.

**Recommendation:** use **My Dogs as the post-login homepage**.

- Zero dogs: focused first-dog empty state and registration CTA.
- One or more dogs: owned dogs first, shared dogs second, register-another CTA.
- Pending request: compact alert linking to Access & sharing.
- Profile incomplete: contextual action on that dog card, not a generic dashboard statistic.
- Account standing/location/member-since: Account page only.
- Do not show an empty shared-dogs request form to every owner on every return visit.

If `/dashboard` is retained, it should be a small task-focused overview and must not duplicate `/dogs`.

## 7. Registry audit

### Does it currently feel like a trusted canine registry?

**Not yet.** The visual identity is warm and the canonical dynamic profile has useful trust-state foundations, but public evidence says “competition concept” more often than “registry.” Trust is weakened by fabricated identities and statistics, explicitly fake legal policies, a search box that cannot search, placeholder official photos, fake ownership/health records, and “verified” affordances without an evidence submission/review experience.

### Required registry trust corrections

1. Show only real public records; label any deliberately retained demo as a clearly isolated demonstration never mixed into search results.
2. Explain registration versus verification in one plain-language trust legend on profiles.
3. Make every result canonical, stable, and shareable; show created/updated dates only when meaningful.
4. Publish a clear public/private field matrix. Avoid public owner contact, health reference numbers, detailed notes, and behavioural risk data by default.
5. Provide a report/correction/support route for inaccurate or harmful public records.
6. Remove unearned “Official” language. “Bark Booth canine identity” is accurate; “official profile” is not unless Bark Booth defines and substantiates the authority.
7. Do not imply relationships with the Kennel Club, IKC, FCI, Embark, Wisdom Panel, veterinary providers, or rescues merely because their names appear in a record catalogue.
8. Ensure private and link-only records are excluded from search engines, registry results, metadata, and caches.
9. Use real legal identity, organisation/contact details, policy versions, and a support channel in the footer.

## 8. Polish audit

### Content and terminology

- Standardize sentence case: “My dogs,” “Add record,” “View dog,” and “Bark Booth identity”; current interfaces mix title case and sentence case.
- Choose one public noun: **registry number** (not alternating profile number, Bark Booth number, passport, identity card, and canine identity record without definitions).
- Replace developer language (“foundation,” “mock,” “frontend-only,” “legacy,” “verification-aware,” “not connected yet”) with either real behavior or removal.
- Rewrite negative/clinical behaviour questions with context and privacy warnings; clarify that answers are observations, time-sensitive, and not professional guarantees.
- Remove monetization strategy copy from Account. Users need current pricing and terms, not hypothetical future charges.

### Forms and validation

- Mark required and optional fields consistently; add help and examples without relying on placeholders.
- Preserve submitted values after server errors and focus/announce the error summary.
- Add pending/disabled labels to sign-up, all record actions, behaviour save, access actions, account save, and role applications.
- Use autocomplete tokens for email, current/new password, name, phone, and URL; add show-password controls.
- Validate dates coherently (issue before expiry, birth not future), normalize registry numbers, constrain input lengths, and use enums/selects where free text creates inconsistent records.
- Explain visibility at the point of selection and make its default a deliberate product/legal decision; public-by-default is high risk for a dog profile containing health and behaviour details.

### Feedback and destructive actions

- Add visible success/error messages for dog creation, record add/edit/remove, behaviour save, account changes, role drafts/submission/withdrawal, and access decisions.
- Confirm removal/revocation/rejection/withdrawal with the object and consequence named.
- Do not rely on query-string feedback alone; ensure messages are styled by outcome (success, warning, error), dismissible where appropriate, and announced to assistive technology.

### Layout, cards, and hierarchy

- Reduce repeated nested `Section`/`Card` grids and oversized headings. The warm rounded-card system currently makes all content appear equally important.
- Do not render an empty card for every record category. Show existing records plus one “Add record” chooser.
- Keep public profile reading and owner editing visually distinct.
- Ensure mobile fixed navigation does not obscure page endings, validation messages, or focused controls; test safe-area insets and long labels.
- Add breadcrumbs/back links for account applications and deep dog management states.

### Icons, images, and accessibility

- Replace meaning-bearing emoji with the existing consistent icon style or text; decorative emoji should be hidden from assistive technology.
- Give the actual logo an intentional accessible name while avoiding duplicate nested labels; dog photos need meaningful alt text, placeholders should be decorative.
- Verify heading order (several pages contain page-level headings inside reusable sections), landmark structure, focus indicators, keyboard behavior for `<details>`, minimum target size, and color contrast for low-opacity text.
- Respect reduced motion for hover translation and future transitions.

### Loading, error, and empty states

- Add route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` experiences for database-backed routes.
- Differentiate no dogs, no search result, hidden/private profile, unauthorized access, network/database failure, and genuinely empty record categories.
- Empty states should offer one relevant next action; they should not explain internal implementation.

## Proposed launch gate

Bark Booth is ready for public MVP only when a tester can, on mobile and desktop, create and recover an account; register and correct a dog; understand privacy; add and remove an owner-declared record safely; return to My Dogs; find a real public dog; copy a working public URL; view that URL signed out; and confirm that no private/link-only/sensitive data leaks. The same test must encounter no fake data, dead controls, future-product copy, placeholder legal text, or raw application errors.
