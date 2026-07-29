// mock-data.js — seed data for the prototype. Loaded once by state.js's seedIfEmpty().
// All demo accounts use the password "demo123".

const MOCK_SEED_USERS = [
  {
    id: "u1",
    email: "jane@example.com",
    password: "demo123",
    name: "Jane Whitfield",
    facility: "Maple Grove Nursing Facility",
    phone: "555-201-4477",
    title: "RN Assessor",
    licenseNumber: "MI-RN-88213",
    role: "Nursing Facility User",
    registrationStatus: "approved",
    submittedDate: "2026-06-02",
  },
  {
    id: "u2",
    email: "sam@example.com",
    password: "demo123",
    name: "Sam Ortiz",
    facility: "Riverside Care Center",
    phone: "555-330-9021",
    title: "Case Manager",
    licenseNumber: "MI-CM-51092",
    role: "Nursing Facility User",
    registrationStatus: "pending",
    submittedDate: "2026-07-20",
  },
  {
    id: "u3",
    email: "pat@example.com",
    password: "demo123",
    name: "Pat Nguyen",
    facility: "Lakeside MI Choice",
    phone: "555-410-6620",
    title: "Intake Coordinator",
    licenseNumber: "MI-IC-30456",
    role: "Nursing Facility User",
    registrationStatus: "rejected",
    submittedDate: "2026-07-10",
    rejectionReason:
      "Provider license number could not be verified against state records. Please confirm your license number and resubmit.",
  },
  {
    id: "u4",
    email: "admin@example.com",
    password: "demo123",
    name: "Morgan Reyes",
    facility: "Michigan Medicaid State Agency",
    phone: "555-777-0100",
    title: "LOCD Program Administrator",
    licenseNumber: "",
    role: "State Admin",
    registrationStatus: "approved",
    submittedDate: "2026-01-05",
  },
  {
    id: "u5",
    email: "auditor@example.com",
    password: "demo123",
    name: "Casey Lindqvist",
    facility: "Michigan Medicaid State Agency",
    phone: "555-777-0155",
    title: "Compliance Auditor",
    licenseNumber: "",
    role: "Auditor",
    registrationStatus: "approved",
    submittedDate: "2026-01-05",
  },
];

const MOCK_FACILITIES = [
  "Maple Grove Nursing Facility",
  "Riverside Care Center",
  "Lakeside MI Choice",
  "Cedar Ridge PACE",
  "Harborview MI Health Link",
];

// MOCK_LOCD_APPLICATIONS — feeds the State Admin "All LOCDs" oversight view, and (via
// submittedByUserId, added for Batch 3) the Nursing Facility User's "My LOCDs" dashboard.
// app5/app6 intentionally have no submittedByUserId — their submittedBy names don't correspond
// to any real seeded user, so they stay as decorative State-Admin-oversight-only demo rows.
const MOCK_LOCD_APPLICATIONS = [
  {
    id: "app1",
    patientName: "Dorothy Adkins",
    facility: "Riverside Care Center",
    program: "Nursing Facility",
    submittedBy: "Sam Ortiz",
    submittedByUserId: "u2",
    status: "Draft",
    qualifyingDoor: null,
    submittedDate: null,
    decisionDate: null,
  },
  {
    id: "app2",
    patientName: "Harold Winslow",
    facility: "Maple Grove Nursing Facility",
    program: "Nursing Facility",
    submittedBy: "Jane Whitfield",
    submittedByUserId: "u1",
    status: "Submitted",
    qualifyingDoor: null,
    submittedDate: "2026-07-18",
    decisionDate: null,
  },
  {
    id: "app3",
    patientName: "Evelyn Cho",
    facility: "Maple Grove Nursing Facility",
    program: "MI Choice",
    submittedBy: "Jane Whitfield",
    submittedByUserId: "u1",
    status: "Eligible",
    qualifyingDoor: "Door 1 — Activities of Daily Living",
    submittedDate: "2026-07-10",
    decisionDate: "2026-07-12",
  },
  {
    id: "app4",
    patientName: "Marcus Webb",
    facility: "Lakeside MI Choice",
    program: "MI Choice",
    submittedBy: "Pat Nguyen",
    submittedByUserId: "u3",
    status: "Approved",
    qualifyingDoor: "Door 4 — Treatments and Conditions",
    submittedDate: "2026-06-25",
    decisionDate: "2026-06-29",
  },
  {
    id: "app5",
    patientName: "Rosa Delgado",
    facility: "Cedar Ridge PACE",
    program: "PACE",
    submittedBy: "Alicia Grant",
    status: "Approved",
    qualifyingDoor: "Door 5 — Skilled Rehabilitation Therapies",
    submittedDate: "2026-06-02",
    decisionDate: "2026-06-06",
  },
  {
    id: "app6",
    patientName: "Walter Kim",
    facility: "Harborview MI Health Link",
    program: "MI Health Link",
    submittedBy: "Terry Boyle",
    status: "Denied",
    qualifyingDoor: null,
    submittedDate: "2026-05-14",
    decisionDate: "2026-05-19",
  },
  {
    id: "app7",
    patientName: "Nadia Petrov",
    facility: "Riverside Care Center",
    program: "Nursing Facility",
    submittedBy: "Sam Ortiz",
    submittedByUserId: "u2",
    status: "Appealed",
    qualifyingDoor: null,
    submittedDate: "2026-04-08",
    decisionDate: "2026-04-15",
  },
];

// MOCK_PATIENTS — simulates the external Medicaid patient-lookup API (out of scope for real
// integration in this prototype). Never persisted to localStorage; looked up directly by
// facility/patient-lookup.html. First two intentionally match app1/app2's patient names, to
// demo a realistic "look up an existing patient to start a re-assessment" scenario.
const MOCK_PATIENTS = [
  { medicaidId: "MI-70012938", name: "Dorothy Adkins", dob: "1938-03-14", gender: "Female", facility: "Riverside Care Center" },
  { medicaidId: "MI-70044521", name: "Harold Winslow", dob: "1942-11-02", gender: "Male", facility: "Maple Grove Nursing Facility" },
  { medicaidId: "MI-70099873", name: "Priya Suresh", dob: "1955-06-30", gender: "Female", facility: "Maple Grove Nursing Facility" },
  { medicaidId: "MI-70051290", name: "Owen Fitzgerald", dob: "1949-01-19", gender: "Male", facility: "Riverside Care Center" },
  { medicaidId: "MI-70067744", name: "Grace Talbot", dob: "1961-09-08", gender: "Female", facility: "Lakeside MI Choice" },
];

// MOCK_ASSESSMENT_TEMPLATES — feeds the State Admin template/scoring editor.
// scoringParams shape depends on scoringStrategy:
//   weighted-sum-threshold / sum-of-minutes-threshold -> { threshold: number }
//   any-of-N-yes                                       -> { n: number }
//   boolean-condition-tree / count-pair                -> { ruleSummary: string }
const MOCK_ASSESSMENT_TEMPLATES = [
  {
    id: "tmpl_mi_nf",
    programName: "Michigan Nursing Facility LOCD",
    description:
      "Level of Care Determination for Nursing Facility, MI Choice, PACE, and MI Health Link programs. Applicant qualifies by meeting the criteria of any one of the 7 Doors below.",
    status: "Published",
    lastUpdated: "2026-06-15",
    doors: [
      {
        id: "door1",
        order: 1,
        name: "Door 1 — Activities of Daily Living",
        scoringStrategy: "weighted-sum-threshold",
        scoringParams: { threshold: 6 },
        questions: [
          {
            id: "d1q1",
            label: "Bed Mobility",
            fieldType: "single-select",
            options: [
              { label: "Independent / Supervision", value: 1 },
              { label: "Limited Assistance", value: 3 },
              { label: "Extensive Assistance / Total Dependence", value: 4 },
              { label: "Activity Did Not Occur", value: 8 },
            ],
          },
          {
            id: "d1q2",
            label: "Transfers",
            fieldType: "single-select",
            options: [
              { label: "Independent / Supervision", value: 1 },
              { label: "Limited Assistance", value: 3 },
              { label: "Extensive Assistance / Total Dependence", value: 4 },
              { label: "Activity Did Not Occur", value: 8 },
            ],
          },
          {
            id: "d1q3",
            label: "Toilet Use",
            fieldType: "single-select",
            options: [
              { label: "Independent / Supervision", value: 1 },
              { label: "Limited Assistance", value: 3 },
              { label: "Extensive Assistance / Total Dependence", value: 4 },
              { label: "Activity Did Not Occur", value: 8 },
            ],
          },
          {
            id: "d1q4",
            label: "Eating",
            fieldType: "single-select",
            options: [
              { label: "Independent / Supervision", value: 1 },
              { label: "Limited Assistance", value: 2 },
              { label: "Extensive Assistance / Total Dependence", value: 3 },
              { label: "Activity Did Not Occur", value: 8 },
            ],
          },
        ],
      },
      {
        id: "door2",
        order: 2,
        name: "Door 2 — Cognitive Performance",
        scoringStrategy: "boolean-condition-tree",
        scoringParams: {
          ruleSummary:
            "Qualifies if Decision-Making = Severely Impaired; OR Memory Problem = Yes AND Decision-Making is Moderately or Severely Impaired; OR Memory Problem = Yes AND Making Self Understood is Sometimes or Rarely/Never Understood.",
        },
        questions: [
          {
            id: "d2q1",
            label: "Short-Term Memory",
            fieldType: "single-select",
            options: [
              { label: "Memory Okay", value: 0 },
              { label: "Memory Problem", value: 0 },
            ],
          },
          {
            id: "d2q2",
            label: "Cognitive Skills for Daily Decision-Making",
            fieldType: "single-select",
            options: [
              { label: "Independent", value: 0 },
              { label: "Modified Independent", value: 0 },
              { label: "Moderately Impaired", value: 0 },
              { label: "Severely Impaired", value: 0 },
            ],
          },
          {
            id: "d2q3",
            label: "Making Self Understood",
            fieldType: "single-select",
            options: [
              { label: "Understood", value: 0 },
              { label: "Usually Understood", value: 0 },
              { label: "Sometimes Understood", value: 0 },
              { label: "Rarely / Never Understood", value: 0 },
            ],
          },
        ],
      },
      {
        id: "door3",
        order: 3,
        name: "Door 3 — Physician Involvement",
        scoringStrategy: "count-pair",
        scoringParams: {
          ruleSummary:
            "Qualifies if (Physician Visits ≥ 1 AND Order Changes ≥ 4) OR (Physician Visits ≥ 2 AND Order Changes ≥ 2), counted over the last 14 days.",
        },
        questions: [
          { id: "d3q1", label: "Physician Visits (last 14 days)", fieldType: "numeric" },
          { id: "d3q2", label: "Physician Order Changes (last 14 days)", fieldType: "numeric" },
        ],
      },
      {
        id: "door4",
        order: 4,
        name: "Door 4 — Treatments and Conditions",
        scoringStrategy: "any-of-N-yes",
        scoringParams: { n: 1 },
        questions: [
          { id: "d4q1", label: "Stage 3-4 pressure sores", fieldType: "yes-no" },
          { id: "d4q2", label: "Intravenous or parenteral feedings", fieldType: "yes-no" },
          { id: "d4q3", label: "Intravenous medications", fieldType: "yes-no" },
          { id: "d4q4", label: "End-stage care", fieldType: "yes-no" },
          {
            id: "d4q5",
            label: "Daily tracheostomy care, daily respiratory care, daily suctioning",
            fieldType: "yes-no",
          },
          { id: "d4q6", label: "Pneumonia within the last 14 days", fieldType: "yes-no" },
          { id: "d4q7", label: "Daily oxygen therapy", fieldType: "yes-no" },
          {
            id: "d4q8",
            label: "Daily insulin with two order changes in last 14 days",
            fieldType: "yes-no",
          },
          { id: "d4q9", label: "Peritoneal or hemodialysis", fieldType: "yes-no" },
        ],
      },
      {
        id: "door5",
        order: 5,
        name: "Door 5 — Skilled Rehabilitation Therapies",
        scoringStrategy: "sum-of-minutes-threshold",
        scoringParams: { threshold: 45 },
        questions: [
          { id: "d5q1", label: "Speech Therapy minutes (last 7 days)", fieldType: "numeric" },
          {
            id: "d5q2",
            label: "Occupational Therapy minutes (last 7 days)",
            fieldType: "numeric",
          },
          { id: "d5q3", label: "Physical Therapy minutes (last 7 days)", fieldType: "numeric" },
        ],
      },
      {
        id: "door6",
        order: 6,
        name: "Door 6 — Behavior",
        scoringStrategy: "boolean-condition-tree",
        scoringParams: {
          ruleSummary:
            "Qualifies if Delusions = Yes OR Hallucinations = Yes; OR any one behavior symptom occurred daily (code 3) on at least 4 of the last 7 days.",
        },
        questions: [
          { id: "d6q1", label: "Delusions", fieldType: "yes-no" },
          { id: "d6q2", label: "Hallucinations", fieldType: "yes-no" },
          {
            id: "d6q3",
            label: "Wandering — Frequency (last 7 days)",
            fieldType: "single-select",
            options: [
              { label: "0 — Not exhibited", value: 0 },
              { label: "1 — 1 to 3 days", value: 1 },
              { label: "2 — 4 to 6 days", value: 2 },
              { label: "3 — Daily", value: 3 },
            ],
          },
        ],
      },
      {
        id: "door7",
        order: 7,
        name: "Door 7 — Service Dependency",
        scoringStrategy: "boolean-condition-tree",
        scoringParams: {
          ruleSummary:
            "Qualifies only if ALL three are true: participant for at least one consecutive year; requires ongoing services to maintain current functional status; no other community, residential, or informal services are available.",
        },
        questions: [
          { id: "d7q1", label: "Participant for at least one consecutive year", fieldType: "yes-no" },
          { id: "d7q2", label: "Requires ongoing services to maintain functional status", fieldType: "yes-no" },
          { id: "d7q3", label: "No other community/residential/informal services available", fieldType: "yes-no" },
        ],
      },
    ],
  },
];
