/**
 * CodeVigil — Main Application
 * Hash-based SPA router + page orchestration
 */

import { initStore } from './data/store.js';
import { renderNavbar } from './components/navbar.js';
import { renderLandingPage } from './pages/landing.js';
import { renderDashboard, animateDashboardCounters } from './pages/dashboard.js';
import { renderScanPage, initScanPage } from './pages/scan.js';
import { renderReportPage, initReportPage } from './pages/report.js';
import { renderDatabasePage, initDatabasePage } from './pages/database.js';
import { renderAnalyzePage, initAnalyzePage } from './pages/analyze.js';
import { renderAuthModal, initAuthModal, updateNavUI } from './components/authModal.js';
import { renderFooter } from './components/footer.js';

/* ============ Router ============ */

const routes = {
  '/':         { render: renderLandingPage,   init: null },
  '/dashboard':{ render: renderDashboard,     init: animateDashboardCounters },
  '/scan':     { render: renderScanPage,      init: initScanPage },
  '/report':   { render: renderReportPage,    init: initReportPage },
  '/database': { render: renderDatabasePage,  init: initDatabasePage },
  '/analyze':  { render: renderAnalyzePage,   init: initAnalyzePage },
};

function getRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash.split('?')[0] || '/';
}

function navigateTo(route) {
  const config = routes[route] || routes['/'];
  const app = document.getElementById('app');
  if (!app) return;

  document.getElementById('nav-links')?.classList.remove('open');

  const pageHtml = config.render();
  const mainClass = route === '/' ? 'landing-main' : 'main-content';
  
  app.innerHTML = renderNavbar(route) + `<main class="${mainClass}" style="min-height: calc(100vh - var(--nav-height) - 150px);">${pageHtml}</main>` + renderFooter() + renderAuthModal();

  if (config.init) {
    requestAnimationFrame(() => config.init());
  }

  // Always init auth modal events and UI
  initAuthModal();
  updateNavUI();

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
