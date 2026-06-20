/**
 * CodeVigil — Message Analyzer Page
 * Detect social engineering red flags in suspicious messages
 */

import { analyzeMessage } from '../engine/messageAnalyzer.js';
import { renderScoreGauge, animateGauge } from '../components/scoreGauge.js';
import { renderSeverityBadge } from '../components/threatBadge.js';
import { MessageHistoryStore } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { EXAMPLE_MESSAGES } from '../data/seedData.js';

let lastResult = null;

export function renderAnalyzePage() {
  return `
    <div class="page-enter" id="analyze-page">
      <h1 class="heading-lg mb-sm">💬 Message Analyzer</h1>
      <p class="text-secondary mb-lg">Paste a suspicious DM, email, or message to detect social engineering red flags.</p>

      <!-- Example Messages -->
      <div class="mb-md">
        <p class="text-muted mb-sm" style="font-size: 0.78rem;">Try an example message:</p>
        <div class="example-buttons" id="msg-examples">
          ${EXAMPLE_MESSAGES.map((ex, i) => `
            <button class="example-btn" data-msg-example="${i}" id="msg-example-${i}">${ex.label}</button>
          `).join('')}
        </div>
      </div>

      <!-- Message Input -->
      <div class="code-editor" id="msg-editor">
        <div class="code-editor__header">
          <div class="code-editor__dots">
            <div class="code-editor__dot code-editor__dot--red"></div>
            <div class="code-editor__dot code-editor__dot--yellow"></div>
            <div class="code-editor__dot code-editor__dot--green"></div>
          </div>
          <span class="code-editor__lang">message</span>
        </div>
        <textarea
          class="code-editor__textarea"
          id="msg-input"
          placeholder="Paste the suspicious message here...&#10;&#10;E.g., a Discord DM, LinkedIn message, Telegram chat, or email you received."
          style="min-height: 220px; white-space: pre-wrap; font-family: var(--font-ui); font-size: 0.9rem; line-height: 1.7;"
        ></textarea>
      </div>

      <!-- Analyze Button -->
      <div class="flex items-center gap-md mt-md">
        <button class="btn btn--primary btn--lg" id="analyze-btn" onclick="window.__analyzeMsg()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          Analyze Message
        </button>
        <button class="btn btn--ghost" onclick="window.__clearMsg()">Clear</button>
      </div>

      <!-- Progress Bar -->
      <div class="scan-progress mt-md" id="msg-progress">
        <div class="scan-progress__bar" id="msg-progress-bar"></div>
      </div>

      <!-- Results -->
      <div id="msg-results"></div>
    </div>
  `;
}

export function initAnalyzePage() {
  window.__analyzeMsg = performAnalysis;
  window.__clearMsg = clearMsg;

  // Example buttons
  document.querySelectorAll('[data-msg-example]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-msg-example'), 10);
      const example = EXAMPLE_MESSAGES[idx];
      if (!example) return;
      const textarea = document.getElementById('msg-input');
      if (textarea) textarea.value = example.text;
    });
  });
}

function performAnalysis() {
  const text = document.getElementById('msg-input')?.value || '';

  if (!text.trim()) {
    showToast('Please paste a message to analyze.', 'warning');
    return;
  }

  // Show scanning animation
  const progressEl = document.getElementById('msg-progress');
  progressEl?.classList.add('scan-progress--active');
  document.getElementById('analyze-btn').disabled = true;

  setTimeout(() => {
    lastResult = analyzeMessage(text);
    progressEl?.classList.remove('scan-progress--active');
    document.getElementById('analyze-btn').disabled = false;

    const bar = document.getElementById('msg-progress-bar');
    if (bar) bar.style.width = '100%';

    renderResults(lastResult);

    // Auto-save
    MessageHistoryStore.add({ text: text.substring(0, 200), ...lastResult });

    showToast(
      lastResult.score > 50 ? '🚨 Red flags detected!' : lastResult.score > 0 ? 'Some concerns found.' : 'Message appears safe.',
      lastResult.score > 50 ? 'error' : lastResult.score > 0 ? 'warning' : 'success'
    );
  }, 900);
}

function renderResults(result) {
  const container = document.getElementById('msg-results');
  if (!container) return;

  const cardClass = result.score >= 50 ? 'card--danger' : result.score > 0 ? '' : 'card--safe';

  container.innerHTML = `
    <div class="results-panel">
      <!-- Summary -->
      <div class="card ${cardClass} results-summary" id="msg-summary">
        ${renderScoreGauge(result.score, result.severity)}
        <div class="results-summary__info">
          <div class="results-summary__title">
            ${renderSeverityBadge(result.severity)}
            <span style="margin-left: 8px;">${result.riskLevel}</span>
          </div>
          <p class="results-summary__subtitle mt-sm">${result.summary}</p>
          <div class="flex gap-sm mt-md flex-wrap">
            <span class="badge badge--info">${result.flags.length} red flag${result.flags.length !== 1 ? 's' : ''} detected</span>
          </div>
        </div>
      </div>

      <!-- Red Flags -->
      ${result.flags.length > 0 ? `
        <h3 class="heading-md mb-md mt-lg">🚩 Detected Red Flags</h3>
        <div class="findings-list">
          ${result.flags.map(f => renderRedFlag(f)).join('')}
        </div>
      ` : ''}

      <!-- Recommendations -->
      ${result.recommendations.length > 0 ? `
        <h3 class="heading-md mb-md mt-lg">💡 Recommended Actions</h3>
        <div class="card card--static" style="padding: 20px;">
          <div class="flex-col gap-md">
            ${result.recommendations.map(r => `
              <div class="flex items-center gap-sm">
                <span style="font-size: 1.2rem; flex-shrink: 0;">${r.icon}</span>
                <span style="font-size: 0.9rem;">${r.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  setTimeout(() => animateGauge(result.score), 100);
}

function renderRedFlag(flag) {
  return `
    <div class="red-flag">
      <div class="red-flag__icon">${flag.icon}</div>
      <div class="red-flag__content">
        <div class="red-flag__title">${flag.name} <span class="badge badge--info" style="margin-left: 6px;">×${flag.matchCount}</span></div>
        <p class="red-flag__desc">${flag.description}</p>
        ${flag.matchedTexts.length > 0 ? `
          <div class="mt-sm" style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${flag.matchedTexts.map(t => `<span class="id-tag" style="color: var(--amber); border-color: rgba(255,170,0,0.3);">"${escapeHtml(t)}"</span>`).join('')}
          </div>
        ` : ''}
        <p class="finding__remediation mt-sm">💡 ${flag.advice}</p>
      </div>
    </div>
  `;
}

function clearMsg() {
  const textarea = document.getElementById('msg-input');
  if (textarea) textarea.value = '';
  const results = document.getElementById('msg-results');
  if (results) results.innerHTML = '';
  const bar = document.getElementById('msg-progress-bar');
  if (bar) bar.style.width = '0%';
  lastResult = null;
}

function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}
