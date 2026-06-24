/**
 * CodeVigil — Navbar Component
 */

export function renderNavbar(currentPath) {
  return `
    <nav class="navbar" id="main-navbar">
      <a href="#/" class="navbar__logo" id="nav-logo" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: white;">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 28px; height: 28px;">
          <path d="M16 2L4 8v8c0 7.73 5.12 14.95 12 16.8 6.88-1.85 12-9.07 12-16.8V8L16 2z" fill="rgba(0,240,255,0.12)" stroke="#00f0ff" stroke-width="1.5"/>
          <path d="M12 16l3 3 5-6" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span style="font-weight: 700; font-size: 1.25rem;">Code<span style="color: var(--cyan);">Vigil</span></span>
      </a>

      <!-- Desktop Links -->
      <ul class="navbar__links" id="nav-links">
        <li class="navbar__link ${currentPath === '/dashboard' ? 'active' : ''}" onclick="location.hash='#/dashboard'">Dashboard</li>
        <li class="navbar__link ${currentPath === '/scan' ? 'active' : ''}" onclick="location.hash='#/scan'">Scan Code</li>
        <li class="navbar__link ${currentPath === '/report' ? 'active' : ''}" onclick="location.hash='#/report'">Report Scam</li>
        <li class="navbar__link ${currentPath === '/database' ? 'active' : ''}" onclick="location.hash='#/database'">Database</li>
        <li class="navbar__link ${currentPath === '/analyze' ? 'active' : ''}" onclick="location.hash='#/analyze'">Analyze Msg</li>
        <li id="nav-auth-container" class="navbar__auth"></li>
      </ul>

      <!-- Mobile Menu Toggle -->
      <button class="navbar__hamburger" id="nav-hamburger" onclick="document.getElementById('nav-links').classList.toggle('open')" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </nav>
  `;
}
