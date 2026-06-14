/**
 * CodeVigil — Code Scanner Page
 */

import { scanCode } from '../engine/scanner.js';
import { renderCodeEditor, attachLineUpdater } from '../components/codeEditor.js';
import { renderScoreGauge, animateGauge } from '../components/scoreGauge.js';
import { renderSeverityBadge } from '../components/threatBadge.js';
import { ScanHistoryStore } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { EXAMPLE_CODE_SNIPPETS } from '../data/seedData.js';

let lastResult = null;

export function renderScanPage() {
  return `
    <div class="page-enter" id="scan-page">
      <h1 class="heading-lg mb-sm">🔍 Code Scanner</h1>
      <p class="text-secondary mb-lg">Paste suspicious code below and scan for 40+ malicious patterns.</p>

      <!-- Language selector -->
      <div class="flex items-center gap-md mb-md" style="flex-wrap: wrap;">
        <div class="input-group" style="min-width: 180px;">
          <label for="scan-language">Language</label>
          <select class="select" id="scan-language">
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="solidity">Solidity</option>
            <option value="json">JSON / package.json</option>
            <option value="shell">Shell / Bash</option>
          </select>
        </div>
        <div style="flex:1;"></div>
        <div>
          <p class="text-muted" style="font-size: 0.78rem; margin-bottom: 4px;">Try an example:</p>
          <div class="example-buttons" id="example-buttons">
            ${EXAMPLE_CODE_SNIPPETS.map((ex, i) => `
              <button class="example-btn" data-example="${i}" id="example-btn-${i}">${ex.label}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Code Editor -->
      ${renderCodeEditor({
        id: 'scan-code',
        placeholder: '// Paste suspicious code here...\n// Or click an example above to try it out.',
        language: 'javascript',
        minHeight: 320,
      })}

      <!-- Scan Button -->
      <div class="flex items-center gap-md mt-md">
        <button class="btn btn--primary btn--lg" id="scan-btn" onclick="window.__scanCode()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Scan Code
        </button>
        <button class="btn btn--ghost" id="clear-btn" onclick="window.__clearScan()">Clear</button>
      </div>

      <!-- Progress Bar -->
      <div class="scan-progress mt-md" id="scan-progress">
        <div class="scan-progress__bar" id="scan-progress-bar"></div>
      </div>

      <!-- Results Panel -->
      <div id="scan-results"></div>
    </div>
  `;
}

export function initScanPage() {
  attachLineUpdater('scan-code');

  // Example buttons
  document.querySelectorAll('[data-example]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-example'), 10);
      const example = EXAMPLE_CODE_SNIPPETS[idx];
      if (!example) return;
      const textarea = document.getElementById('scan-code');
      textarea.value = example.code;
      textarea.dispatchEvent(new Event('input'));
      const langSelect = document.getElementById('scan-language');
      langSelect.value = example.language;
      const langLabel = document.getElementById('scan-code-lang');
      if (langLabel) langLabel.textContent = example.language;
    });
  });

  // Update language label when selector changes
  document.getElementById('scan-language')?.addEventListener('change', (e) => {
    const langLabel = document.getElementById('scan-code-lang');
    if (langLabel) langLabel.textContent = e.target.value;
  });

  // Expose global scan handlers
  window.__scanCode = performScan;
  window.__clearScan = clearScan;
  window.__toggleFinding = toggleFinding;
  window.__saveScan = saveScan;
}

function performScan() {
  const code = document.getElementById('scan-code')?.value || '';
  const language = document.getElementById('scan-language')?.value || 'javascript';

  if (!code.trim()) {
    showToast('Please paste some code to scan.', 'warning');
    return;
  }

  // Show scanning animation
  const progressEl = document.getElementById('scan-progress');
  progressEl?.classList.add('scan-progress--active');
  document.getElementById('scan-btn').disabled = true;

  // Simulate scanning delay for effect
  setTimeout(() => {
    lastResult = scanCode(code, language);
    progressEl?.classList.remove('scan-progress--active');
    document.getElementById('scan-btn').disabled = false;

    // Set progress bar to 100%
    const bar = document.getElementById('scan-progress-bar');
    if (bar) bar.style.width = '100%';

    renderResults(lastResult);
    showToast(
      lastResult.score > 50 ? 'Threats detected!' : lastResult.score > 0 ? 'Scan complete — minor issues found.' : 'Scan complete — code appears safe.',
      lastResult.score > 50 ? 'error' : lastResult.score > 0 ? 'warning' : 'success'
    );
  }, 1200);
}

function renderResults(result) {
  const container = document.getElementById('scan-results');
  if (!container) return;

  const cardClass = result.score >= 55 ? 'card--danger' : result.score > 0 ? '' : 'card--safe';

  container.innerHTML = `
    <div class="results-panel">
      <!-- Summary Card -->
      <div class="card ${cardClass} results-summary" id="results-summary">
        ${renderScoreGauge(result.score, result.severity)}
        <div class="results-summary__info">
          <div class="results-summary__title">
            ${renderSeverityBadge(result.severity)}
            <span style="margin-left: 8px;">${result.riskLevel}</span>
          </div>
          <p class="results-summary__subtitle mt-sm">${result.summary}</p>
          <div class="flex gap-sm mt-md" style="flex-wrap: wrap;">
            <span class="badge badge--info">${result.linesScanned} lines scanned</span>
            <span class="badge badge--info">${result.findings.length} pattern${result.findings.length !== 1 ? 's' : ''} matched</span>
            ${Object.entries(result.categoryBreakdown || {}).map(([cat, data]) =>
              `<span class="badge badge--info">${data.icon} ${data.count}</span>`
            ).join('')}
          </div>
          <div class="flex gap-sm mt-md">
            <button class="btn btn--ghost btn--sm" onclick="window.__saveScan()">💾 Save to History</button>
          </div>
        </div>
      </div>

      <!-- Findings List -->
      ${result.findings.length > 0 ? `
        <h3 class="heading-md mb-md">Detailed Findings</h3>
        <div class="findings-list" id="findings-list">
          ${result.findings.map((f, i) => renderFinding(f, i)).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Animate gauge
  setTimeout(() => animateGauge(result.score), 100);
}

function renderFinding(finding, index) {
  return `
    <div class="finding" onclick="window.__toggleFinding(${index})" id="finding-${index}">
      <div class="finding__header">
        <div class="flex items-center gap-sm">
          <span style="font-size: 1.1rem;">${finding.categoryIcon}</span>
          <span class="finding__name">${finding.name}</span>
        </div>
        <div class="flex items-center gap-sm">
          ${renderSeverityBadge(finding.severity)}
          <span class="text-muted" style="font-size: 0.78rem;">Line ${finding.lineNumber}</span>
        </div>
      </div>
      <div class="finding__line">${escapeHtml(finding.matchedLine)}</div>
      <div class="finding__details" id="finding-details-${index}">
        <p class="finding__explanation">💡 <strong>Why this is dangerous:</strong> ${finding.description}</p>
        <p class="finding__remediation mt-sm">✅ <strong>Remediation:</strong> ${finding.remediation}</p>
      </div>
    </div>
  `;
}

function toggleFinding(index) {
  const details = document.getElementById(`finding-details-${index}`);
  if (details) details.classList.toggle('open');
}

function saveScan() {
  if (!lastResult) return;
  ScanHistoryStore.add(lastResult);
  showToast('Scan saved to history.', 'success');
}

function clearScan() {
  const textarea = document.getElementById('scan-code');
  if (textarea) { textarea.value = ''; textarea.dispatchEvent(new Event('input')); }
  const results = document.getElementById('scan-results');
  if (results) results.innerHTML = '';
  const bar = document.getElementById('scan-progress-bar');
  if (bar) bar.style.width = '0%';
  lastResult = null;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
