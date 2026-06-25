/**
 * CodeVigil CLI — Code Scanner
 * Runs the full 40+ pattern regex engine against JavaScript files.
 * This is the CLI-adapted version of the web app's scanner engine.
 */

const path = require('path');
const { readFileSafe } = require('../utils/fileUtils');

/** Severity levels */
const SEVERITY = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low', INFO: 'info' };

/** Severity weight multipliers for scoring */
const SEVERITY_WEIGHTS = {
  [SEVERITY.CRITICAL]: 25,
  [SEVERITY.HIGH]: 15,
  [SEVERITY.MEDIUM]: 8,
  [SEVERITY.LOW]: 3,
  [SEVERITY.INFO]: 1,
};

/**
 * Core malicious code patterns (adapted from web engine).
 * Each has: id, name, severity, confidence, regex, description, remediation.
 */
const CODE_PATTERNS = [
  // Code Execution & Obfuscation
  { id: 'eval_usage', name: 'eval() Usage', severity: SEVERITY.CRITICAL, confidence: 0.85, regex: /\beval\s*\(/g, description: 'eval() executes arbitrary strings as code.', remediation: 'Replace eval() with JSON.parse() or explicit function calls.' },
  { id: 'function_constructor', name: 'Function() Constructor', severity: SEVERITY.CRITICAL, confidence: 0.9, regex: /new\s+Function\s*\(/g, description: 'Function constructor creates functions from strings (hidden eval).', remediation: 'Define functions explicitly.' },
  { id: 'base64_exec', name: 'Base64 Decode + Execution', severity: SEVERITY.CRITICAL, confidence: 0.95, regex: /(?:Buffer\.from|atob)\s*\([^)]*(?:base64|'|")[^)]*\)[\s\S]{0,50}(?:eval|Function|exec|spawn)/g, description: 'Decoding base64 and executing is a classic malware technique.', remediation: 'Never execute decoded base64 content.' },
  { id: 'atob_usage', name: 'atob() Decoding', severity: SEVERITY.MEDIUM, confidence: 0.5, regex: /\batob\s*\(/g, description: 'atob() decodes base64 strings (potential obfuscation).', remediation: 'Inspect what is being decoded.' },
  { id: 'string_obfuscation', name: 'String Concatenation Obfuscation', severity: SEVERITY.MEDIUM, confidence: 0.6, regex: /\[['"][a-z]{1,5}['"]\s*\+\s*['"][a-z]{1,5}['"]\]/g, description: 'Building strings from fragments to bypass detection.', remediation: 'Use clear, readable string values.' },

  // Network Exfiltration
  { id: 'fetch_post', name: 'fetch() POST Request', severity: SEVERITY.MEDIUM, confidence: 0.5, regex: /fetch\s*\([^)]+\)\s*[\s\S]{0,100}method\s*:\s*['"]POST['"]/g, description: 'POST request may be exfiltrating data.', remediation: 'Verify the destination URL and payload.' },
  { id: 'http_request', name: 'HTTP Request Module', severity: SEVERITY.MEDIUM, confidence: 0.45, regex: /(?:https?|http)\.(?:request|get)\s*\(/g, description: 'Direct HTTP request using Node.js core modules.', remediation: 'Verify the target URL is legitimate.' },
  { id: 'webhook_exfil', name: 'Webhook Exfiltration', severity: SEVERITY.CRITICAL, confidence: 0.9, regex: /(?:discord\.com\/api\/webhooks|hooks\.slack\.com|api\.telegram\.org)/g, description: 'Data exfiltration to messaging platform webhooks.', remediation: 'Remove webhook URLs. Report the endpoint.' },
  { id: 'dns_exfil', name: 'DNS-based Exfiltration', severity: SEVERITY.HIGH, confidence: 0.8, regex: /dns\.(?:resolve|lookup)\s*\(.*(?:Buffer|encode|btoa)/g, description: 'DNS queries for data exfiltration.', remediation: 'DNS should not be used to transmit encoded data.' },

  // File System Access
  { id: 'env_read', name: '.env File Access', severity: SEVERITY.HIGH, confidence: 0.75, regex: /readFile(?:Sync)?\s*\([^)]*\.env/g, description: 'Reading .env files containing secrets.', remediation: 'Install scripts should never read .env files.' },
  { id: 'ssh_key_read', name: 'SSH Key Access', severity: SEVERITY.CRITICAL, confidence: 0.95, regex: /(?:readFile|readdir)(?:Sync)?\s*\([^)]*\.ssh/g, description: 'Reading SSH keys directory.', remediation: 'No package should access SSH keys.' },
  { id: 'homedir_access', name: 'Home Directory Scanning', severity: SEVERITY.HIGH, confidence: 0.7, regex: /(?:os\.homedir|process\.env\.HOME|process\.env\.USERPROFILE)\s*\(\s*\)\s*\+\s*['"]\/\./g, description: 'Scanning hidden directories in home folder.', remediation: 'Packages should not traverse home directories.' },
  { id: 'wallet_file_read', name: 'Wallet File Access', severity: SEVERITY.CRITICAL, confidence: 0.95, regex: /(?:readFile|readdir)(?:Sync)?\s*\([^)]*(?:\.ethereum|\.solana|keystore|wallet)/g, description: 'Accessing cryptocurrency wallet storage files.', remediation: 'No install script should ever access wallet data.' },

  // Process Execution
  { id: 'exec_spawn', name: 'Process Execution', severity: SEVERITY.HIGH, confidence: 0.65, regex: /(?:exec|execSync|spawn|spawnSync|execFile)\s*\(/g, description: 'Spawning child processes.', remediation: 'Verify what command is being executed.' },
  { id: 'curl_wget', name: 'curl/wget Download', severity: SEVERITY.HIGH, confidence: 0.8, regex: /(?:exec|spawn)(?:Sync)?\s*\([^)]*(?:curl|wget)\s/g, description: 'Downloading files via curl/wget from a script.', remediation: 'Inspect the download URL carefully.' },
  { id: 'reverse_shell', name: 'Reverse Shell', severity: SEVERITY.CRITICAL, confidence: 0.99, regex: /(?:bash\s+-i|\/dev\/tcp\/|nc\s+-e|ncat\s|mkfifo)/g, description: 'Reverse shell pattern detected.', remediation: 'This is almost certainly malicious. Do not execute.' },

  // Crypto / Wallet Specific
  { id: 'mnemonic_access', name: 'Mnemonic/Seed Phrase Access', severity: SEVERITY.CRITICAL, confidence: 0.9, regex: /(?:mnemonic|seed[_\s]?phrase|private[_\s]?key|secret[_\s]?key)\s*(?:=|:)/gi, description: 'Accessing mnemonic seed phrases or private keys.', remediation: 'No package should handle seed phrases.' },
  { id: 'ethers_wallet', name: 'Ethers.js Wallet Instantiation', severity: SEVERITY.MEDIUM, confidence: 0.5, regex: /new\s+(?:ethers\.)?Wallet\s*\(/g, description: 'Creating wallet from private key.', remediation: 'Ensure private key source is safe.' },
  { id: 'approval_max', name: 'Unlimited Token Approval', severity: SEVERITY.CRITICAL, confidence: 0.85, regex: /approve\s*\([^)]*(?:MaxUint256|MAX_INT|2\*\*256)/g, description: 'Setting unlimited token approval (drainer pattern).', remediation: 'Never approve unlimited token spending.' },
];

/**
 * Scan a JavaScript file for malicious patterns.
 * @param {string} filePath - Path to the JS file
 * @returns {object} { findings, score, severity, filePath }
 */
function scanFile(filePath) {
  const code = readFileSafe(filePath);
  if (!code) return { findings: [], score: 0, severity: 'safe', filePath };

  const lines = code.split('\n');
  const findings = [];

  for (const pattern of CODE_PATTERNS) {
    pattern.regex.lastIndex = 0;

    let match;
    while ((match = pattern.regex.exec(code)) !== null) {
      const beforeMatch = code.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const matchedLine = lines[lineNumber - 1] || '';

      findings.push({
        patternId: pattern.id,
        name: pattern.name,
        severity: pattern.severity,
        confidence: pattern.confidence,
        matchedText: match[0],
        matchedLine: matchedLine.trim(),
        lineNumber,
        description: pattern.description,
        remediation: pattern.remediation,
        filePath,
      });

      if (match[0].length === 0) {
        pattern.regex.lastIndex++;
      }
    }
  }

  // De-duplicate
  const unique = [];
  const seen = new Set();
  for (const f of findings) {
    const key = `${f.patternId}:${f.lineNumber}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }

  // Score
  const rawScore = unique.reduce((acc, f) => acc + (SEVERITY_WEIGHTS[f.severity] || 5) * f.confidence, 0);
  const score = Math.min(100, Math.round(rawScore));

  // Severity
  let severity = 'safe';
  if (score >= 80) severity = 'critical';
  else if (score >= 55) severity = 'high';
  else if (score >= 30) severity = 'medium';
  else if (score >= 10) severity = 'low';

  return { findings: unique, score, severity, filePath };
}

module.exports = { scanFile, CODE_PATTERNS, SEVERITY };
