Start here: CLAUDE.md at the project root. It's a living reference I've kept updated after every batch — roles, folder structure, data model, and a progress log. Whenever you (or a future me) forget how something works, that file is the fastest way back in.

The "backend" layer — shared/js/, read in this order:

mock-data.js — every seed value lives here: demo users, LOCD applications, the assessment template, mock patients. This is the file to edit if you want to add/change demo data.
state.js — all the localStorage read/write functions (getUsers, updateApplication, etc.) plus the requireRole() guard every protected page uses. Think of it as the mock database API.
scoring.js — the actual LOCD eligibility engine; takes a door + answers, returns qualifies/detail.
nav.js — renders the top nav bar every page shares.
utils.js — small helpers (date formatting, id generation).
The "frontend" layer — one folder per role, each self-contained:

auth/ — login, register, registration-status (shared by everyone before approval)
state-admin/ — registration queue, all-LOCDs, template editor
facility/ — dashboard, patient lookup, the 7-Door assessment form, documents, determination result, appeal
auditor/ — read-only all-LOCDs + detail view
The pattern every page follows (once you see it once, every page reads the same way):


<script src="../shared/js/utils.js"></script>
<script src="../shared/js/mock-data.js"></script>
<script src="../shared/js/state.js"></script>
<script src="../shared/js/nav.js"></script>
<script>
  const user = requireRole("...", "../auth/login.html");  // guard
  if (user) { renderNav(...); render(); }                  // only renders if allowed
  function render() { /* reads state, builds HTML string, wires up buttons */ }
</script>
Suggested reading path if you want to actually trace a flow end-to-end: open facility/patient-lookup.html → follow into facility/assessment.html → facility/determination-result.html — that's the one path that touches almost every shared file (mock data, state helpers, and the scoring engine all at once), so it's the best single tour of how the pieces connect.
