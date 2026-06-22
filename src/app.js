/**
 * CodeVigil — Main Application
 * Hash-based SPA router + page orchestration
 */

import { initStore } from './data/store.js';
import { renderNavbar } from './components/navbar.js';
import { renderDashboard, animateDashboardCounters } from './pages/dashboard.js';
import { renderScanPage, initScanPage } from './pages/scan.js';
import { renderReportPage, initReportPage } from './pages/report.js';
import { renderDatabasePage, initDatabasePage } from './pages/database.js';
import { renderAnalyzePage, initAnalyzePage } from './pages/analyze.js';

/* ============ Router ============ */

const routes = {
  '/':         { render: renderDashboard,     init: animateDashboardCounters },
  '/scan':     { render: renderScanPage,      init: initScanPage },
  '/report':   { render: renderReportPage,    init: initReportPage },
  '/database': { render: renderDatabasePage,  init: initDatabasePage },
  '/analyze':  { render: renderAnalyzePage,   init: initAnalyzePage },
};

function getRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  // Strip query params
  return hash.split('?')[0] || '/';
}

function navigateTo(route) {
  const config = routes[route] || routes['/'];
  const app = document.getElementById('app');
  if (!app) return;

  // Close mobile menu
  document.getElementById('nav-links')?.classList.remove('open');

  // Render page
  const pageHtml = config.render();
  app.innerHTML = renderNavbar(route) + `<main class="main-content">${pageHtml}</main>`;

  // Initialise page (attach event handlers, animations, etc.)
  if (config.init) {
    // Small delay to ensure DOM is rendered
    requestAnimationFrame(() => {
      config.init();
    });
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

/* ============ Boot ============ */

function boot() {
  // Initialize localStorage with seed data on first visit
  initStore();

  // Handle route changes
  window.addEventListener('hashchange', () => navigateTo(getRoute()));

  // Initial render
  navigateTo(getRoute());
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
