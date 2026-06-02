/**
 * CodeVigil — Message Analyzer
 * Detects social engineering red flags in messages / DMs / emails
 */

import { MESSAGE_PATTERNS } from './patterns.js';

/**
 * Analyse a message for social engineering red flags
 * @param {string} text - The message content
 * @returns {object} Analysis result
 */
export function analyzeMessage(text) {
  if (!text || !text.trim()) {
    return {
      score: 0,
      riskLevel: 'SAFE',
      flags: [],
      summary: 'No message provided for analysis.',
      recommendations: [],
      analyzedAt: new Date().toISOString(),
    };
  }

  const flags = [];

  for (const pattern of MESSAGE_PATTERNS) {
    pattern.regex.lastIndex = 0;

    const matches = [];
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      matches.push(match[0]);
      if (match[0].length === 0) {
        pattern.regex.lastIndex++;
      }
    }

    if (matches.length > 0) {
      flags.push({
        id: pattern.id,
        name: pattern.name,
        icon: pattern.icon,
        description: pattern.description,
        advice: pattern.advice,
        matchCount: matches.length,
        matchedTexts: [...new Set(matches)].slice(0, 5), // Limit displayed matches
      });
    }
  }

  // Score: each flag adds weight, capped at 100
  const rawScore = flags.reduce((acc, f) => acc + 12 + (f.matchCount - 1) * 4, 0);
  const score = Math.min(100, rawScore);

  // Risk level
  let riskLevel, severity;
  if (score >= 70) { riskLevel = 'HIGH RISK'; severity = 'critical'; }
  else if (score >= 45) { riskLevel = 'SUSPICIOUS'; severity = 'high'; }
  else if (score >= 20) { riskLevel = 'CAUTION'; severity = 'medium'; }
  else if (flags.length > 0) { riskLevel = 'LOW RISK'; severity = 'low'; }
  else { riskLevel = 'LIKELY SAFE'; severity = 'safe'; }

  // Recommendations
  const recommendations = generateRecommendations(flags, score);

  const summary = flags.length === 0
    ? 'No obvious red flags detected. However, always verify the sender\'s identity independently.'
    : `Detected ${flags.length} red flag${flags.length > 1 ? 's' : ''}. ${score >= 70 ? 'This message has strong indicators of a scam.' : score >= 45 ? 'This message shows concerning patterns.' : 'Some elements warrant caution.'}`;

  return {
    score,
    riskLevel,
    severity,
    flags,
    summary,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}

function generateRecommendations(flags, score) {
  const recs = [];

  if (score >= 70) {
    recs.push({ icon: '🚫', text: 'Do not engage further with this sender.' });
    recs.push({ icon: '📢', text: 'Report this message to the platform.' });
  }

  if (flags.some(f => f.id === 'run_code_request')) {
    recs.push({ icon: '🛡️', text: 'Never run code from unknown sources. Use a sandboxed VM if you must test.' });
  }

  if (flags.some(f => f.id === 'impersonation')) {
    recs.push({ icon: '🔍', text: 'Verify the sender\'s identity through official company channels.' });
  }

  if (flags.some(f => f.id === 'compensation')) {
    recs.push({ icon: '💭', text: 'Research the company and position independently. If the pay is unrealistic, it\'s bait.' });
  }

  if (flags.some(f => f.id === 'suspicious_links')) {
    recs.push({ icon: '🔗', text: 'Expand and verify all links before clicking. Use a URL scanner.' });
  }

  if (flags.some(f => f.id === 'crypto_payment')) {
    recs.push({ icon: '💸', text: 'Never send cryptocurrency upfront for any job or opportunity.' });
  }

  if (flags.some(f => f.id === 'private_communication')) {
    recs.push({ icon: '📧', text: 'Keep conversations on official platforms. Moving to private channels is a red flag.' });
  }

  if (recs.length === 0) {
    recs.push({ icon: '✅', text: 'Stay cautious and verify the sender\'s identity through independent channels.' });
  }

  return recs;
}
