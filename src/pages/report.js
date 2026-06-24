/**
 * CodeVigil — Report a Scam Page
 * Multi-step form with progress indicator
 */

import { ReportStore, AuthStore } from '../data/store.js';
import { showToast } from '../components/toast.js';
import { SCAM_TYPES } from '../data/seedData.js';

let currentStep = 0;
let formData = {
  type: '',
  title: '',
  description: '',
  evidence: '',
  severity: 'high',
  identifiers: { wallets: '', domains: '', github: '', social: '' },
};

const STEPS = [
  { label: 'Scam Type', icon: '📋' },
  { label: 'Details', icon: '📝' },
  { label: 'Identifiers', icon: '🔗' },
  { label: 'Severity', icon: '⚡' },
  { label: 'Review', icon: '✅' },
];

export function renderReportPage() {
  const user = AuthStore.getUser();
  if (!user) {
    return `
      <div class="page-enter text-center" id="report-page" style="padding: 100px 20px;">
        <div style="font-size: 4rem; margin-bottom: 24px;">🔒</div>
        <h1 class="heading-lg mb-sm">Authentication Required</h1>
        <p class="text-secondary mb-lg">You must be logged in to submit a scam report to the community database.</p>
        <button class="btn btn--primary btn--lg" onclick="window.__openAuthModal()">Sign In to Report</button>
      </div>
    `;
  }

  currentStep = 0;
  formData = {
    type: '',
    title: '',
    description: '',
    evidence: '',
    severity: 'high',
    identifiers: { wallets: '', domains: '', github: '', social: '' },
  };

  return `
    <div class="page-enter" id="report-page">
      <h1 class="heading-lg mb-sm">🚨 Report a Scam</h1>
      <p class="text-secondary mb-lg">Help protect the community by reporting scam encounters.</p>

      <!-- Step Indicator -->
      <div class="form-steps" id="form-steps">
        ${STEPS.map((s, i) => `
          <div class="form-step ${i === 0 ? 'active' : ''}" id="step-indicator-${i}">
            <span class="form-step__num">${i + 1}</span>
            ${s.label}
          </div>
        `).join('')}
      </div>

      <!-- Step Content -->
      <div class="card card--static" style="min-height: 340px;" id="form-content">
        ${renderStep(0)}
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-md" id="form-nav">
        <button class="btn btn--ghost" id="prev-btn" onclick="window.__reportPrev()" style="visibility: hidden;">← Previous</button>
        <button class="btn btn--primary" id="next-btn" onclick="window.__reportNext()">Next →</button>
      </div>
    </div>
  `;
}

export function initReportPage() {
  window.__reportNext = nextStep;
  window.__reportPrev = prevStep;
  window.__selectScamType = selectScamType;
  window.__selectSeverity = selectSeverity;
  window.__submitReport = submitReport;
}

function renderStep(step) {
  switch (step) {
    case 0: return renderTypeStep();
    case 1: return renderDetailsStep();
    case 2: return renderIdentifiersStep();
    case 3: return renderSeverityStep();
    case 4: return renderReviewStep();
    default: return '';
  }
}

function renderTypeStep() {
  return `
    <h2 class="heading-md mb-md">What type of scam did you encounter?</h2>
    <div class="type-grid">
      ${SCAM_TYPES.map(t => `
        <div class="card type-option ${formData.type === t.id ? 'selected' : ''}"
             onclick="window.__selectScamType('${t.id}')"
             id="type-${t.id}">
          <div class="type-option__icon">${t.icon}</div>
          <div class="type-option__label">${t.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDetailsStep() {
  return `
    <h2 class="heading-md mb-md">Provide details about the scam</h2>
    <div class="flex-col gap-md">
      <div class="input-group">
        <label for="report-title">Title *</label>
        <input class="input" id="report-title" placeholder="Brief, descriptive title of the scam" value="${escapeAttr(formData.title)}" oninput="window.__reportData={...window.__reportData, title: this.value}" />
      </div>
      <div class="input-group">
        <label for="report-desc">Description *</label>
        <textarea class="textarea" id="report-desc" placeholder="Describe what happened in detail: how you were contacted, what was asked, what the malicious behavior was..." style="min-height: 140px;">${formData.description}</textarea>
      </div>
      <div class="input-group">
        <label for="report-evidence">Evidence (code snippet, suspicious link, etc.)</label>
        <textarea class="textarea" id="report-evidence" placeholder="Paste any malicious code, suspicious URLs, transaction hashes, or other evidence..." style="min-height: 100px; font-family: var(--font-mono); font-size: 0.82rem;">${formData.evidence}</textarea>
      </div>
    </div>
  `;
}

function renderIdentifiersStep() {
  return `
    <h2 class="heading-md mb-md">Scam identifiers (optional but helpful)</h2>
    <p class="text-secondary mb-md" style="font-size: 0.85rem;">Add any wallet addresses, domains, GitHub repos, or social handles involved in the scam.</p>
    <div class="flex-col gap-md">
      <div class="input-group">
        <label for="id-wallets">🔐 Wallet Addresses (one per line)</label>
        <textarea class="textarea" id="id-wallets" placeholder="0x7a3B...d4F2&#10;0x9dE2...7cF3" style="min-height: 80px; font-family: var(--font-mono); font-size: 0.82rem;">${formData.identifiers.wallets}</textarea>
      </div>
      <div class="input-group">
        <label for="id-domains">🌐 Domains / URLs (one per line)</label>
        <textarea class="textarea" id="id-domains" placeholder="scam-site.xyz&#10;fake-airdrop.com" style="min-height: 80px;">${formData.identifiers.domains}</textarea>
      </div>
      <div class="input-group">
        <label for="id-github">📦 GitHub Repos (one per line)</label>
        <input class="input" id="id-github" placeholder="github.com/user/repo" value="${escapeAttr(formData.identifiers.github)}" />
      </div>
      <div class="input-group">
        <label for="id-social">💬 Social Handles (Telegram, Discord, Twitter — one per line)</label>
        <textarea class="textarea" id="id-social" placeholder="@scam_user&#10;Discord: ScamBot#1234" style="min-height: 80px;">${formData.identifiers.social}</textarea>
      </div>
    </div>
  `;
}

function renderSeverityStep() {
  const levels = [
    { id: 'critical', label: 'Critical', desc: 'Active fund theft, wallet draining, or severe data exfiltration', color: 'var(--red)' },
    { id: 'high', label: 'High', desc: 'Credential stealing, malicious packages, or significant security risk', color: 'var(--orange)' },
    { id: 'medium', label: 'Medium', desc: 'Social engineering, suspicious behavior, or potential threat', color: 'var(--amber)' },
    { id: 'low', label: 'Low', desc: 'Minor concern, phishing attempt, or spam', color: '#4da6ff' },
  ];

  return `
    <h2 class="heading-md mb-md">How severe is this scam?</h2>
    <div class="flex-col gap-sm">
      ${levels.map(l => `
        <div class="card type-option ${formData.severity === l.id ? 'selected' : ''}"
             onclick="window.__selectSeverity('${l.id}')"
             style="text-align: left; padding: 16px 20px; display: flex; align-items: center; gap: 16px;"
             id="severity-${l.id}">
          <div style="width: 14px; height: 14px; border-radius: 50%; background: ${l.color}; flex-shrink: 0;"></div>
          <div>
            <div style="font-weight: 700;">${l.label}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary);">${l.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderReviewStep() {
  const scamType = SCAM_TYPES.find(t => t.id === formData.type) || { icon: '❓', label: 'Unknown' };

  return `
    <h2 class="heading-md mb-md">Review your report</h2>
    <div class="flex-col gap-md">
      <div>
        <span class="text-muted" style="font-size: 0.78rem;">Scam Type</span>
        <p style="font-weight: 600;">${scamType.icon} ${scamType.label}</p>
      </div>
      <div>
        <span class="text-muted" style="font-size: 0.78rem;">Title</span>
        <p style="font-weight: 600;">${escapeHtml(formData.title) || '<em class="text-muted">Not provided</em>'}</p>
      </div>
      <div>
        <span class="text-muted" style="font-size: 0.78rem;">Description</span>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${escapeHtml(formData.description).substring(0, 300) || '<em class="text-muted">Not provided</em>'}${formData.description.length > 300 ? '...' : ''}</p>
      </div>
      <div>
        <span class="text-muted" style="font-size: 0.78rem;">Severity</span>
        <p><span class="badge badge--${formData.severity}">${formData.severity.toUpperCase()}</span></p>
      </div>
      ${formData.evidence ? `<div>
        <span class="text-muted" style="font-size: 0.78rem;">Evidence</span>
        <pre style="font-family: var(--font-mono); font-size: 0.78rem; background: rgba(0,0,0,0.3); padding: 12px; border-radius: var(--radius-sm); overflow-x: auto; white-space: pre-wrap; max-height: 120px; overflow-y: auto;">${escapeHtml(formData.evidence)}</pre>
      </div>` : ''}
    </div>
  `;
}

function selectScamType(type) {
  formData.type = type;
  document.querySelectorAll('.type-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`type-${type}`)?.classList.add('selected');
}

function selectSeverity(severity) {
  formData.severity = severity;
  document.querySelectorAll('.type-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`severity-${severity}`)?.classList.add('selected');
}

function saveCurrentStepData() {
  if (currentStep === 1) {
    formData.title = document.getElementById('report-title')?.value || '';
    formData.description = document.getElementById('report-desc')?.value || '';
    formData.evidence = document.getElementById('report-evidence')?.value || '';
  } else if (currentStep === 2) {
    formData.identifiers.wallets = document.getElementById('id-wallets')?.value || '';
    formData.identifiers.domains = document.getElementById('id-domains')?.value || '';
    formData.identifiers.github = document.getElementById('id-github')?.value || '';
    formData.identifiers.social = document.getElementById('id-social')?.value || '';
  }
}

function nextStep() {
  saveCurrentStepData();

  // Validation
  if (currentStep === 0 && !formData.type) {
    showToast('Please select a scam type.', 'warning');
    return;
  }
  if (currentStep === 1 && !formData.title.trim()) {
    showToast('Please provide a title.', 'warning');
    return;
  }

  if (currentStep === 4) {
    submitReport();
    return;
  }

  currentStep++;
  updateStepUI();
}

function prevStep() {
  saveCurrentStepData();
  if (currentStep > 0) {
    currentStep--;
    updateStepUI();
  }
}

function updateStepUI() {
  // Update step indicators
  STEPS.forEach((_, i) => {
    const el = document.getElementById(`step-indicator-${i}`);
    if (!el) return;
    el.className = 'form-step';
    if (i < currentStep) el.classList.add('completed');
    else if (i === currentStep) el.classList.add('active');
  });

  // Update content
  const content = document.getElementById('form-content');
  if (content) content.innerHTML = renderStep(currentStep);

  // Update nav buttons
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (prevBtn) prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  if (nextBtn) {
    nextBtn.textContent = currentStep === 4 ? '🚀 Submit Report' : 'Next →';
    if (currentStep === 4) {
      nextBtn.className = 'btn btn--success btn--lg';
      nextBtn.onclick = submitReport;
    } else {
      nextBtn.className = 'btn btn--primary';
    }
  }
}

function submitReport() {
  if (!formData.type || !formData.title.trim()) {
    showToast('Missing required fields.', 'error');
    return;
  }

  // Parse identifiers from text to arrays
  const parseLines = str => str.split('\n').map(s => s.trim()).filter(Boolean);
  const report = {
    type: formData.type,
    title: formData.title,
    description: formData.description,
    evidence: formData.evidence,
    severity: formData.severity,
    identifiers: {
      wallets: parseLines(formData.identifiers.wallets),
      domains: parseLines(formData.identifiers.domains),
      github: parseLines(formData.identifiers.github),
      social: parseLines(formData.identifiers.social),
    },
  };

  const saved = ReportStore.add(report);
  showToast(`Report submitted! ID: ${saved.id}`, 'success', 5000);

  // Show success state
  const content = document.getElementById('form-content');
  if (content) {
    content.innerHTML = `
      <div class="text-center" style="padding: 48px 20px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🛡️</div>
        <h2 class="heading-lg mb-sm" style="color: var(--green);">Report Submitted!</h2>
        <p class="text-secondary mb-md">Thank you for helping protect the community.</p>
        <p class="text-mono" style="font-size: 0.82rem; color: var(--text-muted);">Report ID: ${saved.id}</p>
        <div class="flex gap-sm mt-lg" style="justify-content: center;">
          <button class="btn btn--primary" onclick="location.hash='#/database'">View Database</button>
          <button class="btn btn--ghost" onclick="location.hash='#/report'">Submit Another</button>
        </div>
      </div>
    `;
  }
  const nav = document.getElementById('form-nav');
  if (nav) nav.style.display = 'none';
}

function escapeHtml(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
