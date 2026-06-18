/**
 * CodeVigil — Scam Database Page
 * Search and browse community-reported scams
 */

import { ReportStore } from '../data/store.js';
import { renderSeverityBadge } from '../components/threatBadge.js';
import { showToast } from '../components/toast.js';
import { SCAM_TYPES } from '../data/seedData.js';

let activeFilter = 'all';
let searchQuery = '';
let expandedReport = null;

export function renderDatabasePage() {
  activeFilter = 'all';
  searchQuery = '';
  expandedReport = null;

  const reports = ReportStore.getAll();
  const allReports = ReportStore.getAll();
  const typeCounts = { all: allReports.length };
  allReports.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

  // Top reported wallets/domains
  const identMap = {};
  allReports.forEach(r => {
    [...(r.identifiers?.wallets || []), ...(r.identifiers?.domains || [])].forEach(id => {
      identMap[id] = (identMap[id] || 0) + 1;
    });
  });
  const topIdentifiers = Object.entries(identMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return `
    <div class="page-enter" id="database-page">
      <h1 class="heading-lg mb-sm">📡 Scam Database</h1>
      <p class="text-secondary mb-lg">Search our community-driven database of reported scams. Look up wallets, domains, or project names.</p>

      <div class="page-grid">
        <div>
          <!-- Search Bar -->
          <div class="search-bar" id="search-bar">
            <input class="input" id="db-search" placeholder="Search by wallet, domain, GitHub repo, Telegram handle, or keyword..."
                   value="" oninput="window.__dbSearch(this.value)" />
            <button class="btn btn--primary" onclick="window.__dbSearch(document.getElementById('db-search').value)">
              🔍 Search
            </button>
          </div>

          <!-- Filter Pills -->
          <div class="filter-pills" id="filter-pills">
            <button class="filter-pill active" data-filter="all" onclick="window.__dbFilter('all')" id="filter-all">
              All (${typeCounts.all})
            </button>
            ${SCAM_TYPES.map(t => `
              <button class="filter-pill" data-filter="${t.id}" onclick="window.__dbFilter('${t.id}')" id="filter-${t.id}">
                ${t.icon} ${t.label} (${typeCounts[t.id] || 0})
              </button>
            `).join('')}
          </div>

          <!-- Results -->
          <div id="db-results">
            ${renderReportList(reports)}
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="card sidebar-card" id="db-sidebar">
            <h3 class="heading-md mb-md">🔥 Most Reported</h3>
            ${topIdentifiers.length > 0 ? topIdentifiers.map(([ident, count]) => `
              <div class="flex items-center justify-between" style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
                <span class="id-tag" style="cursor: pointer;" onclick="document.getElementById('db-search').value='${escapeAttr(ident)}'; window.__dbSearch('${escapeAttr(ident)}')">${truncate(ident, 28)}</span>
                <span class="badge badge--info">${count}</span>
              </div>
            `).join('') : '<p class="text-muted" style="font-size: 0.85rem;">No data yet.</p>'}

            <div class="mt-lg">
              <h3 class="heading-md mb-md">📈 Database Stats</h3>
              <div class="flex-col gap-sm">
                <div class="flex items-center justify-between">
                  <span class="text-secondary" style="font-size: 0.85rem;">Total Reports</span>
                  <span style="font-weight: 700;">${allReports.length}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-secondary" style="font-size: 0.85rem;">Verified</span>
                  <span style="font-weight: 700; color: var(--green);">${allReports.filter(r => r.verified).length}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-secondary" style="font-size: 0.85rem;">Critical</span>
                  <span style="font-weight: 700; color: var(--red);">${allReports.filter(r => r.severity === 'critical').length}</span>
                </div>
              </div>
            </div>

            <div class="mt-lg text-center">
              <button class="btn btn--danger btn--sm w-full" onclick="location.hash='#/report'">🚨 Report a Scam</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initDatabasePage() {
  window.__dbSearch = performSearch;
  window.__dbFilter = applyFilter;
  window.__dbVote = handleVote;
  window.__dbToggle = toggleReport;
}

function performSearch(query) {
  searchQuery = query;
  updateResults();
}

function applyFilter(type) {
  activeFilter = type;
  // Update pill active states
  document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
  document.getElementById(`filter-${type}`)?.classList.add('active');
  updateResults();
}

function updateResults() {
  let results = searchQuery ? ReportStore.search(searchQuery) : ReportStore.getAll();
  if (activeFilter !== 'all') {
    results = results.filter(r => r.type === activeFilter);
  }

  const container = document.getElementById('db-results');
  if (container) container.innerHTML = renderReportList(results);
}

function renderReportList(reports) {
  if (reports.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">🔍</div>
        <p class="empty-state__text">No reports found. Try a different search or filter.</p>
      </div>
    `;
  }

  return reports.map(r => renderReportCard(r)).join('');
}

function renderReportCard(report) {
  const scamType = SCAM_TYPES.find(t => t.id === report.type) || SCAM_TYPES[5];
  const isExpanded = expandedReport === report.id;
  const allIdents = [
    ...(report.identifiers?.wallets || []),
    ...(report.identifiers?.domains || []),
    ...(report.identifiers?.github || []),
    ...(report.identifiers?.social || []),
  ];

  return `
    <div class="card report-card" id="report-${report.id}" onclick="window.__dbToggle('${report.id}')">
      <div class="report-card__header">
        <div>
          <div class="flex items-center gap-sm mb-sm">
            <span class="badge" style="background: ${scamType.color}22; color: ${scamType.color}; border: 1px solid ${scamType.color}44;">
              ${scamType.icon} ${scamType.label}
            </span>
            ${renderSeverityBadge(report.severity)}
            ${report.verified ? '<span class="badge badge--safe">✓ Verified</span>' : ''}
          </div>
          <h3 class="report-card__title">${escapeHtml(report.title)}</h3>
        </div>
      </div>
      <p class="report-card__body">${escapeHtml(report.description).substring(0, 200)}${report.description.length > 200 ? '...' : ''}</p>

      ${allIdents.length > 0 ? `
        <div class="id-tags">
          ${allIdents.slice(0, 5).map(id => `<span class="id-tag">${truncate(escapeHtml(id), 32)}</span>`).join('')}
          ${allIdents.length > 5 ? `<span class="id-tag">+${allIdents.length - 5} more</span>` : ''}
        </div>
      ` : ''}

      <div class="report-card__meta mt-sm">
        <span>${timeAgo(report.reportedAt)}</span>
        <div class="report-card__votes" onclick="event.stopPropagation()">
          <button class="vote-btn" onclick="window.__dbVote('${report.id}', 'up')" id="vote-up-${report.id}">
            👍 ${report.upvotes || 0}
          </button>
          <button class="vote-btn" onclick="window.__dbVote('${report.id}', 'down')" id="vote-down-${report.id}">
            👎 ${report.downvotes || 0}
          </button>
        </div>
      </div>

      ${isExpanded && report.evidence ? `
        <div class="finding__details open mt-md">
          <h4 class="heading-sm mb-sm">Evidence</h4>
          <pre class="finding__line" style="white-space: pre-wrap;">${escapeHtml(report.evidence)}</pre>
        </div>
      ` : ''}
    </div>
  `;
}

function toggleReport(id) {
  expandedReport = expandedReport === id ? null : id;
  updateResults();
}

function handleVote(id, direction) {
  ReportStore.vote(id, direction);
  updateResults();
  showToast(direction === 'up' ? 'Upvoted! 👍' : 'Downvoted.', 'info', 1500);
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

function truncate(str, len) {
  return str.length > len ? str.substring(0, len) + '…' : str;
}

function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
