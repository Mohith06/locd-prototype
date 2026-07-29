// nav.js — renders the shared top nav bar. Depends on state.js being loaded first.
// Usage: put <div id="app-nav-root"></div> as the first element in <body>, then call
// renderNav({ loginPath: "relative/path/to/auth/login.html" }) after the DOM is ready.
// Optional: pass links: [{ label, href, active }] to render an in-nav tab row (used by
// role-specific sections with multiple pages, e.g. state-admin/).

function renderNav(options) {
  const opts = options || {};
  const loginPath = opts.loginPath || "login.html";
  const root = document.getElementById("app-nav-root");
  if (!root) return;

  const user = getCurrentUser();

  const nav = document.createElement("div");
  nav.className = "app-nav";

  const inner = document.createElement("div");
  inner.className = "app-nav__inner";

  const brand = document.createElement("span");
  brand.className = "app-nav__brand";
  brand.textContent = "LOCD Assessment Platform";
  inner.appendChild(brand);

  if (opts.links && opts.links.length) {
    const linksBox = document.createElement("div");
    linksBox.className = "app-nav__links";

    opts.links.forEach(function (link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;
      a.className = "app-nav__link" + (link.active ? " app-nav__link--active" : "");
      linksBox.appendChild(a);
    });

    inner.appendChild(linksBox);
  }

  if (user) {
    const userBox = document.createElement("div");
    userBox.className = "app-nav__user";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = user.name + " — " + user.role;
    userBox.appendChild(nameSpan);

    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "app-nav__logout";
    logoutBtn.textContent = "Log Out";
    logoutBtn.addEventListener("click", function () {
      logout();
      window.location.href = loginPath;
    });
    userBox.appendChild(logoutBtn);

    inner.appendChild(userBox);
  }

  nav.appendChild(inner);
  root.appendChild(nav);
}
