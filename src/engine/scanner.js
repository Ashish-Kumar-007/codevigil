/**
 * CodeVigil — Code Scanning Engine
 * Performs pattern-based threat analysis on source code
 */

import { PATTERNS, SEVERITY, CATEGORY_ICONS } from './patterns.js';

/** Severity weight multipliers for scoring */
const SEVERITY_WEIGHTS = {
  [SEVERITY.CRITICAL]: 25,
  [SEVERITY.HIGH]: 15,
  [SEVERITY.MEDIUM]: 8,
  [SEVERITY.LOW]: 3,
  [SEVERITY.INFO]: 1,
};

/** Risk rating thresholds */
const RISK_LEVELS = [
  { min: 80, label: 'CRITICAL', severity: SEVERITY.CRITICAL },
  { min: 55, label: 'HIGH', severity: SEVERITY.HIGH },
  { min: 30, label: 'MEDIUM', severity: SEVERITY.MEDIUM },
  { min: 10, label: 'LOW', severity: SEVERITY.LOW },
  { min: 0, label: 'SAFE', severity: 'safe' },
];

/**
 * Scan code for malicious patterns
 * @param {string} code - Source code to analyse
 * @param {string} [language='javascript'] - Language hint (unused for MVP but reserved)
 * @returns {object} Analysis result
 */
export function scanCode(code, language = 'javascript') {
  if (!code || !code.trim()) {
    return {
      score: 0,
      riskLevel: 'SAFE',
      severity: 'safe',
      findings: [],
      summary: 'No code provided for analysis.',
      scannedAt: new Date().toISOString(),
      language,
      linesScanned: 0,
    };
  }

  const lines = code.split('\n');
  const findings = [];

  for (const pattern of PATTERNS) {
    // Reset regex state (global flag)
    pattern.regex.lastIndex = 0;

    let match;
    while ((match = pattern.regex.exec(code)) !== null) {
      // Determine which line the match is on
      const beforeMatch = code.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const matchedLine = lines[lineNumber - 1] || '';

      findings.push({
        patternId: pattern.id,
        name: pattern.name,
        category: pattern.category,
        categoryIcon: CATEGORY_ICONS[pattern.category] || '❓',
        severity: pattern.severity,
        confidence: pattern.confidence,
        matchedText: match[0],
        matchedLine: matchedLine.trim(),
        lineNumber,
        description: pattern.description,
        remediation: pattern.remediation,
      });

      // Prevent infinite loops on zero-length matches
      if (match[0].length === 0) {
        pattern.regex.lastIndex++;
      }
    }
  }

  // De-duplicate findings on same line + same pattern
  const unique = [];
  const seen = new Set();
  for (const f of findings) {
    const key = `${f.patternId}:${f.lineNumber}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }

  // Calculate threat score
  const rawScore = unique.reduce((acc, f) => {
    const weight = SEVERITY_WEIGHTS[f.severity] || 5;
    return acc + weight * f.confidence;
  }, 0);

  // Normalize to 0-100 (cap at 100)
  const score = Math.min(100, Math.round(rawScore));

  // Determine risk level
  const riskLevel = RISK_LEVELS.find(r => score >= r.min) || RISK_LEVELS[RISK_LEVELS.length - 1];

  // Sort findings by severity
  const severityOrder = [SEVERITY.CRITICAL, SEVERITY.HIGH, SEVERITY.MEDIUM, SEVERITY.LOW, SEVERITY.INFO];
  unique.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));

  // Build category summary
  const categoryBreakdown = {};
  for (const f of unique) {
    if (!categoryBreakdown[f.category]) {
      categoryBreakdown[f.category] = { count: 0, icon: f.categoryIcon };
    }
    categoryBreakdown[f.category].count++;
  }

  // Generate summary text
  const summary = generateSummary(unique, score, riskLevel.label);

  return {
    score,
    riskLevel: riskLevel.label,
    severity: riskLevel.severity,
    findings: unique,
    categoryBreakdown,
    summary,
    scannedAt: new Date().toISOString(),
    language,
    linesScanned: lines.length,
  };
}

/**
 * Generate a human-readable summary
 */
function generateSummary(findings, score, riskLabel) {
  if (findings.length === 0) {
    return 'No suspicious patterns detected. The code appears safe, but always exercise caution with untrusted sources.';
  }

  const criticalCount = findings.filter(f => f.severity === SEVERITY.CRITICAL).length;
  const highCount = findings.filter(f => f.severity === SEVERITY.HIGH).length;

  const parts = [`Detected ${findings.length} suspicious pattern${findings.length > 1 ? 's' : ''}.`];

  if (criticalCount > 0) {
    parts.push(`⛔ ${criticalCount} CRITICAL threat${criticalCount > 1 ? 's' : ''} found.`);
  }
  if (highCount > 0) {
    parts.push(`⚠️ ${highCount} HIGH severity issue${highCount > 1 ? 's' : ''}.`);
  }

  if (score >= 80) {
    parts.push('DO NOT RUN THIS CODE. It contains patterns consistent with known malware.');
  } else if (score >= 55) {
    parts.push('Exercise extreme caution. Review each finding carefully before proceeding.');
  } else if (score >= 30) {
    parts.push('Some concerning patterns detected. Investigate before running in production.');
  } else {
    parts.push('Minor concerns detected. Likely safe but worth reviewing.');
  }

  return parts.join(' ');
}
