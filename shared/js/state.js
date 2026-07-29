// state.js — localStorage-backed mock "backend". Depends on mock-data.js being loaded first.

const USERS_KEY = "locd_users";
const CURRENT_USER_KEY = "locd_currentUserId";
const APPLICATIONS_KEY = "locd_applications";
const TEMPLATES_KEY = "locd_templates";

function seedIfEmpty() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_SEED_USERS));
  }
}

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  const normalized = (email || "").trim().toLowerCase();
  return getUsers().find((u) => u.email.toLowerCase() === normalized);
}

function findUserById(id) {
  return getUsers().find((u) => u.id === id);
}

function updateUser(id, patch) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = Object.assign({}, users[idx], patch);
  saveUsers(users);
  return users[idx];
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

function setCurrentUser(id) {
  localStorage.setItem(CURRENT_USER_KEY, id);
}

function getCurrentUser() {
  const id = localStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  return findUserById(id) || null;
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// requireRole — shared guard for role-restricted pages. Redirects and returns null if the
// current user is missing, has a different role, or isn't approved; otherwise returns the user.
function requireRole(role, redirectPath) {
  const user = getCurrentUser();
  if (!user || user.role !== role || user.registrationStatus !== "approved") {
    window.location.href = redirectPath;
    return null;
  }
  return user;
}

function seedApplicationsIfEmpty() {
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(MOCK_LOCD_APPLICATIONS));
  }
}

function getApplications() {
  const raw = localStorage.getItem(APPLICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveApplications(applications) {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

function findApplicationById(id) {
  return getApplications().find((a) => a.id === id);
}

function updateApplication(id, patch) {
  const applications = getApplications();
  const idx = applications.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  applications[idx] = Object.assign({}, applications[idx], patch);
  saveApplications(applications);
  return applications[idx];
}

function addApplication(application) {
  const applications = getApplications();
  applications.push(application);
  saveApplications(applications);
  return application;
}

function seedTemplatesIfEmpty() {
  if (!localStorage.getItem(TEMPLATES_KEY)) {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(MOCK_ASSESSMENT_TEMPLATES));
  }
}

function getTemplates() {
  const raw = localStorage.getItem(TEMPLATES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTemplates(templates) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

function findTemplateById(id) {
  return getTemplates().find((t) => t.id === id);
}

function updateTemplate(id, patch) {
  const templates = getTemplates();
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  templates[idx] = Object.assign({}, templates[idx], patch);
  saveTemplates(templates);
  return templates[idx];
}

// Run seeding as soon as this script loads on any page.
seedIfEmpty();
seedApplicationsIfEmpty();
seedTemplatesIfEmpty();
