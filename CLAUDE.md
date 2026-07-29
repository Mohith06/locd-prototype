# LOCD Assessment Platform — Prototype

## Project Summary

Phase 1 click-through prototype of a Medicaid LOCD (Level of Care Determination) Assessment
Platform — a contractor project (prepared by Mohith for Vid). Scoped to Michigan LOCD only.
This is a **static demo prototype**, not production software: no backend, no real auth, no
database, no build tooling. Purpose is to validate workflows/screens before real development
starts. Full business requirements live in the BRD ("LOCD Assessment Platform — Requirements")
and the reference Michigan Medicaid Nursing Facility LOCD form (`AttachA__NF_LOC_Criteria_Form`)
discussed with the user — ask the user for these if section-level detail is needed and not
summarized below.

## Tech Constraints (non-negotiable for this prototype)

- Plain HTML/CSS/JS only. No npm, no bundler, no framework, no build step.
- Must be usable by opening `index.html` directly in a browser (file://) or via a trivial static
  server. All "data" is inline JS (`shared/js/mock-data.js`), never fetched JSON, to avoid
  file:// CORS issues.
- All persistence is `localStorage`, seeded once from mock data. No real backend/API calls
  anywhere (the "external Medicaid API" from the BRD is out of scope for this prototype).
- No password hashing or real security — this is a UI/workflow demo only.

## Roles & Access

- **State Admin** — state Medicaid agency staff. Approves/rejects nursing facility user
  registrations; configures assessment templates/scoring; views all LOCDs. Pages live in
  `state-admin/` (built in Batch 2). Demo account: `admin@example.com` / `demo123`.
- **Nursing Facility User** — staff at a nursing facility / MI Choice / PACE / MI Health Link
  provider. Registers for access (self-service); once approved, looks up/creates patients,
  conducts LOCD assessments, uploads documents, views own facility's LOCDs. Pages live in
  `facility/` (built in Batch 3). This is the only role with a self-service registration form.
  Demo accounts: `jane@example.com` (approved, has 2 pre-existing LOCDs), `sam@example.com`
  (pending — approve via `state-admin/registration-queue.html` to unlock his 2 pre-existing
  LOCDs on his dashboard).
- **Auditor** — state-level compliance reviewer. Read-only access to all LOCDs across all
  facilities. Pages live in `auditor/` (built in Batch 4). Demo account: `auditor@example.com` /
  `demo123`. Cannot create, edit, approve, or override anything.

## Folder Structure

```
locd-prototype/
  index.html                        # redirects to auth/login.html
  CLAUDE.md
  shared/
    css/
      base.css                      # tokens (palette/typography), reset, layout primitives
      components.css                # buttons, forms, status badges, cards, tables, nav bar
    js/
      utils.js                      # small helpers (date formatting, id generation)
      state.js                      # localStorage helpers (users, applications, templates,
                                     # session, requireRole guard, seeding)
      mock-data.js                  # seed data: users, LOCD applications, assessment templates,
                                     # mock patients (for lookup)
      scoring.js                    # pure LOCD scoring engine (scoreDoor / scoreApplication)
      nav.js                        # renders role-aware top nav bar + optional tab links + logout
    placeholder-dashboard.html      # stub landing page for any approved role other than State
                                     # Admin / Nursing Facility User (currently unreachable —
                                     # both real roles have their own dashboard now)
  auth/
    login.html
    register.html
    registration-status.html
  state-admin/                      # BUILT — Batch 2
    registration-queue.html         # approve/reject pending Nursing Facility User registrations
    all-locds.html                  # read-only, filterable list of all LOCD applications
    templates.html                  # list of assessment templates/programs
    template-editor.html            # per-door scoring strategy + threshold editor
  facility/                         # BUILT — Batch 3
    dashboard.html                  # "My LOCDs" — applications filtered to the logged-in user
    patient-lookup.html             # Medicaid ID search (mock) -> starts a new Draft application
    assessment.html                 # 7-Door stepper form; read-only once submitted
    document-upload.html            # attach/remove documents (metadata only, no file bytes)
    determination-result.html       # runs the scoring engine once, shows notice + per-door table
    appeal.html                     # Denied -> Appealed -> Approved/Denied, with appealHistory log
  auditor/                          # BUILT — Batch 4 (prototype complete — all 4 roles built)
    all-locds.html                  # read-only, filterable list of all LOCD applications
    locd-detail.html                # full read-only view: info, per-door Q&A, documents, appeals
```

## Mock Data & State Approach

- `localStorage['locd_users']` — array of user records:
  `{ id, email, password, name, facility, phone, title, licenseNumber, role,
  registrationStatus, submittedDate, rejectionReason? }`.
  `registrationStatus` is one of `pending | approved | rejected`.
- `localStorage['locd_currentUserId']` — the "session": the logged-in user's id, set on
  login/register, cleared on logout.
- **Seed-once rule**: `shared/js/mock-data.js` exports a seed array; `state.js`'s
  `seedIfEmpty()` writes it to `locd_users` only if that key doesn't already exist. Never
  overwrite existing localStorage on later loads — this is what lets state (e.g. an approval)
  persist across a demo session.
- Seeded demo accounts (see `mock-data.js` for exact credentials): one `approved`, one
  `pending`, one `rejected` Nursing Facility User, plus one `approved` State Admin and one
  `approved` Auditor — so all registration states and all roles are reachable from the login
  page immediately.
- `localStorage['locd_applications']` — array of LOCD application records (see
  `MOCK_LOCD_APPLICATIONS` in `mock-data.js`). Feeds `state-admin/all-locds.html` (via the plain
  `submittedBy` display-name string, unaffected by Batch 3) and `facility/dashboard.html` (via
  the newer `submittedByUserId` field, added in Batch 3 — retrofitted onto the 5 seed rows that
  correspond to a real user; the other 2 stay decorative, oversight-only rows). Full record shape
  after Batch 3: `{ id, patientName, facility, program, submittedBy, submittedByUserId, status,
  qualifyingDoor, submittedDate, decisionDate, templateId, medicaidId, answers, doorResults,
  documents, appealHistory, locdStartDate }`. Legacy/seed rows created before Batch 3 lack the
  newer fields entirely — every read site defaults defensively (e.g. `application.documents ||
  []`, `findTemplateById(application.templateId) || getTemplates()[0]`) rather than assuming
  they exist. `addApplication(application)` (Batch 3) creates new rows.
- `localStorage['locd_templates']` — array of assessment template records (see
  `MOCK_ASSESSMENT_TEMPLATES`), each with a nested `doors` array (7 Doors, each with
  `scoringStrategy` + `scoringParams` + `questions`). Feeds `state-admin/templates.html` /
  `template-editor.html` (editable at the strategy/threshold level) and `facility/assessment.html`
  (read-only, drives the actual question-and-answer flow) and `shared/js/scoring.js` (executes
  against it).
- `requireRole(role, redirectPath)` in `state.js` guards role-restricted pages: redirects (and
  returns null) unless the current user is logged in, has the matching `role`, and is
  `approved`. Every `state-admin/*.html` and `facility/*.html` page uses this, plus an additional
  ownership check on `facility/*.html` pages (`application.submittedByUserId === user.id`) so one
  Nursing Facility User can't view another's LOCD by guessing an `?id=` value.
- `shared/js/scoring.js` — pure functions, no localStorage access. `scoreDoor(door, answers)`
  dispatches to `GENERIC_SCORERS[door.scoringStrategy]` (covers doors 1/4/5, generically
  computable from `scoringParams` alone) or a `DOOR_SCORERS[door.id]` override (covers doors
  2/3/6/7, whose `boolean-condition-tree`/`count-pair` logic has no executable structure in the
  data — only prose `ruleSummary` — so it's hand-transcribed per door). `scoreApplication`
  scores every door and returns the first that qualifies. `facility/determination-result.html`
  runs this exactly once per application (on first view while `status === "Submitted"`) and
  caches the result onto the record as `doorResults`, so a later template edit by a State Admin
  can't retroactively change a past determination.

## Registration Workflow State Machine

```
Pending → Approved            (active user; State Admin action, built in Batch 2's
                                registration-queue.html)
Pending → Rejected → Resubmitted → Pending   (loop; Resubmit is user-driven, built in Batch 1)
```

`auth/register.html` always creates a new user with `registrationStatus: 'pending'` and
`role: 'Nursing Facility User'` (fixed — not user-selectable; State Admin/Auditor accounts are
assumed to be provisioned separately, not self-registered).

## Visual Style

Palette/typography/layout tokens live in `shared/css/base.css`; reusable components (buttons,
status badges, forms, tables, nav) live in `shared/css/components.css`. Every page links both,
in that order. Aesthetic: clean, professional, government/healthcare-appropriate — deep
navy/teal primary color, system font stack, status badges always paired with a text label (not
color alone) for accessibility.

## Build Batches / Progress Log

**All 4 batches complete — the click-through prototype covers every role/page from the original
BRD page list (Section 10).** Remaining gaps (no backend, no real auth, mocked PDF generation,
simplified template-editor scope, etc.) are intentional prototype simplifications, tracked below
under Known Simplifications, not unfinished batches.

- **Batch 1 — Auth pages (login, register, registration-status)**: done.
- **Batch 2 — State Admin** (registration queue, template/scoring editor, all LOCDs list): done.
  Template builder and scoring rule editor were combined into one page
  (`template-editor.html`) since both operate on the same nested `doors` array; question/option
  authoring was deliberately deferred (see Known Simplifications below).
- **Batch 3 — Nursing Facility User** (dashboard, patient lookup, LOCD assessment form/Doors
  1-7, document upload, determination result, appeal status update): done. Added a real scoring
  engine (`shared/js/scoring.js`) that executes against Batch 2's template data — see Known
  Simplifications below for the door6 approximation and document-upload limitations.
- **Batch 4 — Auditor** (all LOCDs read-only, LOCD detail read-only): done. `locd-detail.html` is
  the first full per-application detail view in the prototype — combines application info,
  per-door Q&A (from `answers`) and results (from cached `doorResults`, if present), documents,
  and appeal history, all read-only. Falls back gracefully to "no data recorded" messaging for
  legacy seed rows that predate Batch 3 and were never filled out via the real assessment form.

## Assessment Domain Reference (condensed — see BRD/reference form for full detail)

The Michigan LOCD form has 7 "Doors"; an applicant qualifies if they meet the criteria for ANY
one door. Full point values and rule text are in the reference form PDF — ask the user for it
before building Batch 3's assessment form/scoring logic.

1. **Door 1 — Activities of Daily Living**: Bed Mobility, Transfers, Toilet Use, Eating rated on
   a 6-point assistance scale; qualifies at ≥6 total points.
2. **Door 2 — Cognitive Performance**: memory + decision-making + making-self-understood;
   qualifies via one of 3 rule combinations (e.g. severely impaired decision-making).
3. **Door 3 — Physician Involvement**: physician visits + order changes in last 14 days;
   qualifies via one of 2 AND-combinations of counts.
4. **Door 4 — Treatments and Conditions**: 9 yes/no clinical items; qualifies if "yes" on ≥1 of
   9 plus continuing need.
5. **Door 5 — Skilled Rehabilitation Therapies**: ST/OT/PT minutes in last 7 days; qualifies at
   ≥45 total minutes plus continuing need.
6. **Door 6 — Behavior**: 5 behavior symptoms (frequency-coded 0-3) + delusions/hallucinations;
   qualifies via psychosis symptoms OR a daily behavior for ≥4 of last 7 days.
7. **Door 7 — Service Dependency**: current NF/MI Choice/PACE/MI Health Link participant; must
   meet ALL 3 of (≥1 year participation, ongoing service need, no alternative available).

Shared question field types: single-select, multi-select, numeric, yes/no. Scoring strategy
types referenced in the BRD: weighted-sum-threshold, boolean-condition-tree, count-pair,
any-of-N-yes, sum-of-minutes-threshold.

## Known Simplifications / Assumptions

- Self-registration is fixed to "Nursing Facility User" role; State Admin/Auditor accounts are
  not creatable through the UI in this prototype.
- Login password check is a plain string match — no hashing, no real security.
- License/credential field on the registration form is a single placeholder text input; exact
  required fields are TBD per the BRD.
- PDF generation (approval/denial/freedom-of-choice letters) will be mocked/static in Batch 3,
  not real PDF rendering.
- The external Medicaid patient-lookup API is out of scope for this prototype; Batch 3's patient
  lookup will use mock data only.
- Batch 2's template editor only lets a State Admin change a door's scoring strategy type and
  its numeric threshold/N or free-text rule summary — it does not support adding/removing/
  reordering questions or answer options, and `boolean-condition-tree`/`count-pair` rules are
  stored as plain descriptive text, not an executable rule format. Full question authoring is
  deferred until Batch 3 defines what the assessment-filling form actually needs to read.
- `state-admin/all-locds.html` is read-only with no per-application detail page — Batch 3 will
  define what a real LOCD application record contains, so a detail view wasn't built against the
  current placeholder `MOCK_LOCD_APPLICATIONS` shape to avoid rework.
- Door 6's real rule ("any behavior symptom occurred daily on ≥4 of the last 7 days") is
  approximated in `scoring.js`'s `scoreDoor6` by a single frequency-coded question (Wandering,
  code 3 = "Daily") because that's the only frequency-coded behavior question the Batch 2
  template data includes — the other 4 behavior symptoms are plain yes/no in this prototype.
- Document upload (`facility/document-upload.html`, and the court-decision attach step in
  `facility/appeal.html`) only records file name/type/size/category — never actual file bytes
  (`FileReader`/base64) — to avoid localStorage quota issues. This matches the existing
  PDF-generation-is-mocked precedent; there is no real file storage in this prototype.
- `facility/*.html`'s "Approved" status is reachable only via the appeal path
  (`Denied → Appealed → Approved`); there's no separate admin step that finalizes an `Eligible`
  result into `Approved`. `determination-result.html` always displays the *original* automated
  outcome (from cached `doorResults`), even after an appeal later reverses it — the reversal
  itself is visible on `appeal.html`'s `appealHistory` log, kept deliberately distinct from the
  automated determination per the BRD's requirement that overrides be logged separately.
- One template covers all 4 programs (Nursing Facility, MI Choice, PACE, MI Health Link) —
  there's no per-program template variation in this prototype.
