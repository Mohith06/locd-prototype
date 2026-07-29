// utils.js — small shared helpers, no dependencies on other shared/js files

function formatDate(isoDateString) {
  if (!isoDateString) return "";
  const d = new Date(isoDateString + "T00:00:00");
  if (isNaN(d.getTime())) return isoDateString;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function generateId(prefix) {
  return (
    (prefix || "id") +
    "_" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 7)
  );
}

function qs(selector, root) {
  return (root || document).querySelector(selector);
}
