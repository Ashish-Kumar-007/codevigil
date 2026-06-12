/**
 * CodeVigil — Dashboard / Home Page
 */

import { StatsStore, ReportStore, ScanHistoryStore } from '../data/store.js';
import { renderSeverityBadge } from '../components/threatBadge.js';
import { SCAM_TYPES } from '../data/seedData.js';

export function renderDashboard() {
  const stats = StatsStore.get();
  const recentReports = ReportStore.getAll().slice(0, 5);
  const recentScans = ScanHistoryStore.getAll().slice(0, 5);

  // Scam type distribution for sidebar
  const allReports = ReportStore.getAll();
  const typeCounts = {};
  allReports.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

  return `
    <div class="page-enter">
      <!-- Hero Section -->
      <section class="hero" id="hero-section">
        <svg class="hero__shield" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M48 6L12 24v24c0 23.2 15.36 44.85 36 50.4 20.64-5.55 36-27.2 36-50.4V24L48 6z"
                fill="rgba(0,240,255,0.08)" stroke="#00f0ff" stroke-width="2"/>
          <path d="M48 18L20 32v18c0 18.56 11.9 35.88 28 40.32 16.1-4.44 28-21.76 28-40.32V32L48 18z"
                fill="rgba(0,240,255,0.05)" stroke="rgba(0,240,255,0.3)" stroke-width="1"/>
          <path d="M36 48l9 9 15-18" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="48" cy="48" r="40" stroke="rgba(0,240,255,0.1)" stroke-width="0.5" stroke-dasharray="4 4"/>
        </svg>
        <h1 class="heading-xl">
          <span class="text-gradient">CodeVigil</span>
        </h1>
        <p class="hero__tagline">
          Protect yourself from malicious code. <strong>Don't Run That Code.</strong>
        </p>
      </section>

      <!-- Stats Grid -->
      <section class="stats-grid" id="stats-grid">
        <div class="card stat-card" id="stat-scans">
          <div class="stat-card__value text-gradient" data-count="${stats.totalScans}">0</div>
          <div class="stat-card__label">Scans Performed</div>
        </div>
        <div class="card stat-card" id="stat-threats">
          <div class="stat-card__value" style="color: var(--red)" data-count="${stats.threatsDetected}">0</div>
          <div class="stat-card__label">Threats Detected</div>
        </div>
        <div class="card stat-card" id="stat-reports">
          <div class="stat-card__value" style="color: var(--amber)" data-count="${stats.reportsSubmitted}">0</div>
          <div class="stat-card__label">Scam Reports</div>
        </div>
        <div class="card stat-card" id="stat-community">
          <div class="stat-card__value" style="color: var(--green)" data-count="${stats.communityMembers}">0</div>
          <div class="stat-card__label">Community Members</div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions" id="quick-actions">
        <div class="card action-card" onclick="location.hash='#/scan'" id="action-scan">
          <div class="action-card__icon" style="background: var(--cyan-dim); color: var(--cyan);">🔍</div>
          <h3 class="action-card__title">Scan Code</h3>
          <p class="action-card__desc">Paste suspicious code and get instant threat analysis with 40+ pattern checks.</p>
        </div>
        <div class="card action-card" onclick="location.hash='#/report'" id="action-report">
          <div class="action-card__icon" style="background: var(--red-dim); color: var(--red);">🚨</div>
          <h3 class="action-card__title">Report Scam</h3>
          <p class="action-card__desc">Submit scam encounters to build our community-driven threat database.</p>
        </div>
        <div class="card action-card" onclick="location.hash='#/database'" id="action-search">
          <div class="action-card__icon" style="background: var(--amber-dim); color: var(--amber);">📡</div>
          <h3 class="action-card__title">Search Database</h3>
          <p class="action-card__desc">Look up wallets, domains, or handles to check if they've been flagged.</p>
        </div>
        <div class="card action-card" onclick="location.hash='#/analyze'" id="action-analyze">
          <div class="action-card__icon" style="background: var(--green-dim); color: var(--green);">💬</div>
          <h3 class="action-card__title">Analyze Message</h3>
          <p class="action-card__desc">Paste suspicious DMs or emails to detect social engineering red flags.</p>
        </div>
      </section>

      <!-- How It Works -->
      <section class="mt-xl" id="how-it-works-section">
        <h2 class="heading-lg text-center mb-lg">How It Works</h2>
        <div class="how-it-works">
          <div class="card how-step">
            <div class="how-step__number">1</div>
            <h3 class="how-step__title">Paste or Upload</h3>
            <p class="how-step__desc">Drop in suspicious code snippets, package.json files, or messages you've received.</p>
          </div>
          <div class="card how-step">
            <div class="how-step__number">2</div>
            <h3 class="how-step__title">Instant Analysis</h3>
            <p class="how-step__desc">Our engine scans for 40+ known malicious patterns including wallet drainers, reverse shells, and data exfiltration.</p>
          </div>
          <div class="card how-step">
            <div class="how-step__number">3</div>
            <h3 class="how-step__title">Stay Protected</h3>
            <p class="how-step__desc">Get a detailed threat report with risk scores, affected lines, and remediation steps.</p>
          </div>
        </div>
      </section>

      <!-- Recent Threats & Trending -->
      <section class="page-grid mt-xl" id="recent-section">
        <div>
          <div class="section-header">
            <h2 class="section-title">🔴 Recent Threats</h2>
            <button class="btn btn--ghost btn--sm" onclick="location.hash='#/database'">View All</button>
          </div>
          <div class="threat-feed" id="threat-feed">
            ${recentReports.length > 0 ? recentReports.map(r => renderThreatItem(r)).join('') : `
              <div class="empty-state">
                <div class="empty-state__icon">🛡️</div>
                <p class="empty-state__text">No threats reported yet.</p>
              </div>
            `}
          </div>
        </div>

        <div>
          <div class="card sidebar-card" id="sidebar-stats">
            <h3 class="heading-md mb-md">📊 Scam Categories</h3>
            ${SCAM_TYPES.filter(t => typeCounts[t.id]).map(t => `
              <div class="flex items-center justify-between" style="padding: 8px 0; border-bottom: 1px solid var(--border-subtle);">
                <span style="font-size: 0.88rem;">${t.icon} ${t.label}</span>
                <span class="badge badge--info">${typeCounts[t.id] || 0}</span>
              </div>
            `).join('')}
            <div class="mt-md" style="text-align:center;">
              <button class="btn btn--ghost btn--sm w-full" onclick="location.hash='#/database'">View Full Database</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderThreatItem(report) {
  const scamType = SCAM_TYPES.find(t => t.id === report.type) || SCAM_TYPES[5];
  return `
    <div class="threat-item" onclick="location.hash='#/database?id=${report.id}'" id="threat-${report.id}">
      <div class="threat-item__icon" style="background: ${scamType.color}22; color: ${scamType.color};">
        ${scamType.icon}
      </div>
      <div class="threat-item__info">
        <div class="threat-item__title">${escapeHtml(report.title)}</div>
        <div class="threat-item__meta">
          ${renderSeverityBadge(report.severity)} · ${timeAgo(report.reportedAt)} · 👍 ${report.upvotes}
        </div>
      </div>
    </div>
  `;
}

function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

/**
 * Animate the counter stats on the dashboard
 */
export function animateDashboardCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}
