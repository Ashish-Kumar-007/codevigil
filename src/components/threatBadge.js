/**
 * CodeVigil — Threat Badge Component
 */

export function renderBadge(severity, text) {
  const label = text || severity.toUpperCase();
  return `<span class="badge badge--${severity}">${label}</span>`;
}

export function renderSeverityBadge(severity) {
  const labels = {
    critical: '⛔ CRITICAL',
    high: '⚠️ HIGH',
    medium: '⚡ MEDIUM',
    low: 'ℹ️ LOW',
    safe: '✅ SAFE',
    info: '💡 INFO',
  };
  return renderBadge(severity, labels[severity] || severity.toUpperCase());
}
