// scoring.js — pure LOCD scoring engine. No localStorage access here; takes door/answers
// objects as plain arguments so it's independently testable. Depends on nothing else loading
// first, but is loaded after state.js by convention (alongside mock-data.js/utils.js).
//
// Answer shape (per question id, within a door's answers object):
//   { fieldType: "single-select"|"yes-no"|"numeric", value: number|boolean, label?: string }
// `label` (single-select only) is required for door2's scorer, since door2's option values are
// all 0 and only the option label text distinguishes cognitive-status tiers.

function value(answers, questionId) {
  const a = answers[questionId];
  return a ? a.value : undefined;
}

function label(answers, questionId) {
  const a = answers[questionId];
  return a ? a.label : undefined;
}

function sumQuestionValues(door, answers) {
  let total = 0;
  door.questions.forEach(function (q) {
    const v = value(answers, q.id);
    total += typeof v === "number" ? v : 0;
  });
  return total;
}

// weighted-sum-threshold (door 1) and sum-of-minutes-threshold (door 5) share this shape:
// sum every question's numeric value and compare to scoringParams.threshold.
function scoreThreshold(door, answers) {
  const total = sumQuestionValues(door, answers);
  const threshold = door.scoringParams.threshold;
  return {
    qualifies: total >= threshold,
    detail: "Total score " + total + " (needs ≥ " + threshold + ")",
  };
}

// any-of-N-yes (door 4): count "yes" answers, compare to scoringParams.n.
function scoreAnyOfNYes(door, answers) {
  let yesCount = 0;
  door.questions.forEach(function (q) {
    if (value(answers, q.id) === true) yesCount++;
  });
  const n = door.scoringParams.n;
  return {
    qualifies: yesCount >= n,
    detail: yesCount + " item(s) answered Yes (needs ≥ " + n + ")",
  };
}

const GENERIC_SCORERS = {
  "weighted-sum-threshold": scoreThreshold,
  "sum-of-minutes-threshold": scoreThreshold,
  "any-of-N-yes": scoreAnyOfNYes,
};

// Door 2 — Cognitive Performance. Transcribed directly from the door's ruleSummary. Option
// values are all 0 here, so this switches on option label text via label(), not value().
function scoreDoor2(door, answers) {
  const memory = label(answers, "d2q1");
  const decision = label(answers, "d2q2");
  const understood = label(answers, "d2q3");

  const memoryProblem = memory === "Memory Problem";
  const decisionSevere = decision === "Severely Impaired";
  const decisionModerateOrSevere = decision === "Moderately Impaired" || decision === "Severely Impaired";
  const understoodLow = understood === "Sometimes Understood" || understood === "Rarely / Never Understood";

  const qualifies = decisionSevere || (memoryProblem && decisionModerateOrSevere) || (memoryProblem && understoodLow);
  return {
    qualifies: qualifies,
    detail:
      "Memory: " + (memory || "—") + "; Decision-Making: " + (decision || "—") +
      "; Making Self Understood: " + (understood || "—"),
  };
}

// Door 3 — Physician Involvement. (visits≥1 AND orderChanges≥4) OR (visits≥2 AND orderChanges≥2).
function scoreDoor3(door, answers) {
  const visits = Number(value(answers, "d3q1")) || 0;
  const orderChanges = Number(value(answers, "d3q2")) || 0;
  const qualifies = (visits >= 1 && orderChanges >= 4) || (visits >= 2 && orderChanges >= 2);
  return {
    qualifies: qualifies,
    detail: visits + " physician visit(s), " + orderChanges + " order change(s) in last 14 days",
  };
}

// Door 6 — Behavior. Delusions=Yes OR Hallucinations=Yes OR a behavior occurred daily.
// Approximation: only one frequency-coded behavior question (Wandering) exists in this schema,
// so "code 3 (Daily)" on that question stands in for the ruleSummary's fuller "any behavior
// symptom daily on ≥4 of the last 7 days" clause. Documented in CLAUDE.md.
function scoreDoor6(door, answers) {
  const delusions = value(answers, "d6q1") === true;
  const hallucinations = value(answers, "d6q2") === true;
  const wanderingCode = value(answers, "d6q3");
  const dailyBehavior = wanderingCode === 3;
  const qualifies = delusions || hallucinations || dailyBehavior;
  return {
    qualifies: qualifies,
    detail:
      "Delusions: " + (delusions ? "Yes" : "No") + "; Hallucinations: " + (hallucinations ? "Yes" : "No") +
      "; Wandering frequency code: " + (wanderingCode != null ? wanderingCode : "—"),
  };
}

// Door 7 — Service Dependency. Must meet ALL three criteria.
function scoreDoor7(door, answers) {
  const yearParticipant = value(answers, "d7q1") === true;
  const ongoingServices = value(answers, "d7q2") === true;
  const noAlternative = value(answers, "d7q3") === true;
  const qualifies = yearParticipant && ongoingServices && noAlternative;
  return {
    qualifies: qualifies,
    detail:
      "≥ 1 yr participant: " + (yearParticipant ? "Yes" : "No") +
      "; Ongoing services needed: " + (ongoingServices ? "Yes" : "No") +
      "; No alternative available: " + (noAlternative ? "Yes" : "No"),
  };
}

const DOOR_SCORERS = {
  door2: scoreDoor2,
  door3: scoreDoor3,
  door6: scoreDoor6,
  door7: scoreDoor7,
};

function scoreDoor(door, answers) {
  const custom = DOOR_SCORERS[door.id];
  const scorer = custom || GENERIC_SCORERS[door.scoringStrategy];
  const result = scorer ? scorer(door, answers) : { qualifies: false, detail: "No scorer available." };
  return Object.assign({ doorId: door.id, doorName: door.name }, result);
}

function scoreApplication(template, answersByDoor) {
  const doorResults = template.doors.map(function (d) {
    return scoreDoor(d, answersByDoor[d.id] || {});
  });
  const winner = doorResults.find(function (r) {
    return r.qualifies;
  });
  return {
    eligible: !!winner,
    qualifyingDoor: winner ? winner.doorName : null,
    doorResults: doorResults,
  };
}
