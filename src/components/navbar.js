/**
 * CodeVigil — Navbar Component
 */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', hash: '#/' },
  { id: 'scan', label: 'Scan Code', hash: '#/scan' },
  { id: 'report', label: 'Report Scam', hash: '#/report' },
  { id: 'database', label: 'Database', hash: '#/database' },
  { id: 'analyze', label: 'Analyze Msg', hash: '#/analyze' },
];

export function renderNavbar(currentRoute) {
  const activeId = routeToId(currentRoute);

  return `
    <nav class="navbar" id="main-navbar">
      <div class="navbar__logo" onclick="location.hash='#/'" id="nav-logo">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L4 8v8c0 7.73 5.12 14.95 12 16.8 6.88-1.85 12-9.07 12-16.8V8L16 2z" fill="rgba(0,240,255,0.12)" stroke="#00f0ff" stroke-width="1.5"/>
          <path d="M12 16l3 3 5-6" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Code<span class="accent">Vigil</span></span>
      </div>
      <ul class="navbar__links" id="nav-links">
        ${NAV_ITEMS.map(item => `
          <li class="navbar__link ${activeId === item.id ? 'active' : ''}"
              data-nav="${item.id}"
              onclick="location.hash='${item.hash}'"
              id="nav-${item.id}">
            ${item.label}
          </li>
        `).join('')}
      </ul>
      <button class="navbar__hamburger" id="nav-hamburger" onclick="document.getElementById('nav-links').classList.toggle('open')" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </nav>
  `;
}

function routeToId(route) {
  if (!route || route === '/' || route === '') return 'dashboard';
  return route.replace(/^\//, '').split('/')[0];
}
