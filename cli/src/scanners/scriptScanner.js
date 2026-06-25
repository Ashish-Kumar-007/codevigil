/**
 * CodeVigil CLI — Script Scanner
 * Detects dangerous lifecycle scripts in package.json files.
 */

const path = require('path');
const { readJsonSafe, isDirectory, listDirs } = require('../utils/fileUtils');

/** Lifecycle scripts that auto-execute for package CONSUMERS (not authors) */
const DANGEROUS_HOOKS = ['preinstall', 'install', 'postinstall'];

/** Patterns that indicate malicious intent in script commands */
const SCRIPT_PATTERNS = [
  { id: 'curl_pipe_bash', regex: /curl\s.*\|\s*(?:ba)?sh/i, severity: 'critical', description: 'Downloads and executes remote shell script' },
  { id: 'wget_exec', regex: /wget\s.*[|;].*(?:ba)?sh/i, severity: 'critical', description: 'Downloads and executes remote payload via wget' },
  { id: 'node_eval', regex: /node\s+-e\s+["']/i, severity: 'high', description: 'Inline Node.js code execution via -e flag' },
  { id: 'node_eval_require', regex: /node\s+-e\s+.*require\s*\(/i, severity: 'critical', description: 'Inline Node.js requiring modules (potential payload loader)' },
  { id: 'child_process', regex: /child_process/i, severity: 'high', description: 'References child_process module for command execution' },
  { id: 'exec_sync', regex: /execSync|exec\s*\(/i, severity: 'high', description: 'Synchronous command execution' },
  { id: 'powershell', regex: /powershell\s/i, severity: 'high', description: 'Invokes PowerShell (potential fileless malware)' },
  { id: 'base64_decode', regex: /(?:atob|Buffer\.from)\s*\(.*(?:base64|'|")/i, severity: 'high', description: 'Base64 decoding in script (obfuscation technique)' },
  { id: 'eval_call', regex: /\beval\s*\(/i, severity: 'critical', description: 'eval() call detected in install script' },
  { id: 'discord_cdn', regex: /cdn\.discordapp\.com/i, severity: 'critical', description: 'References Discord CDN (common malware hosting)' },
  { id: 'telegram_api', regex: /api\.telegram\.org/i, severity: 'high', description: 'References Telegram API (potential data exfiltration)' },
  { id: 'hidden_file_access', regex: /\/\.\w+|\\.\w+/i, severity: 'medium', description: 'Accesses hidden files or directories' },
  { id: 'env_access', regex: /process\.env\.|\.env\b/i, severity: 'medium', description: 'Accesses environment variables or .env files' },
  { id: 'ssh_access', regex: /\.ssh\//i, severity: 'critical', description: 'Accesses SSH keys directory' },
  { id: 'crypto_wallet', regex: /\.ethereum|\.solana|wallet|keystore|mnemonic|seed\.json/i, severity: 'critical', description: 'Accesses cryptocurrency wallet data' },
  { id: 'external_url', regex: /https?:\/\/(?!(?:registry\.npmjs|github\.com|nodejs\.org))/i, severity: 'medium', description: 'References external URL (not npm/github/node)' },
];

/**
 * Scan a single package.json for dangerous scripts.
 * @param {string} pkgPath - Path to the package.json
 * @returns {Array} Array of findings
 */
function scanPackageScripts(pkgPath) {
  const pkg = readJsonSafe(pkgPath);
  if (!pkg || !pkg.scripts) return [];

  const findings = [];
  const pkgName = pkg.name || path.basename(path.dirname(pkgPath));

  for (const hook of DANGEROUS_HOOKS) {
    const script = pkg.scripts[hook];
    if (!script) continue;

    // The script exists — that alone is noteworthy
    const finding = {
      package: pkgName,
      version: pkg.version || 'unknown',
      hook,
      script,
      threats: [],
      severity: 'low', // baseline: having a lifecycle script
      filePath: pkgPath,
    };

    // Check against patterns
    for (const pattern of SCRIPT_PATTERNS) {
      if (pattern.regex.test(script)) {
        finding.threats.push({
          id: pattern.id,
          severity: pattern.severity,
          description: pattern.description,
        });
      }
    }

    // Determine overall severity (highest threat wins)
    if (finding.threats.length > 0) {
      const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
      finding.severity = finding.threats.reduce((worst, t) => {
        return severityOrder.indexOf(t.severity) < severityOrder.indexOf(worst) ? t.severity : worst;
      }, 'low');
    }

    findings.push(finding);
  }

  return findings;
}

/**
 * Scan node_modules for packages with dangerous scripts.
 * @param {string} projectDir - Root project directory
 * @param {object} options - { depth, ignore }
 * @returns {object} { findings, scannedCount, cleanCount }
 */
function scanNodeModules(projectDir, options = {}) {
  const { depth = 1, ignore = [] } = options;
  const nodeModulesDir = path.join(projectDir, 'node_modules');

  if (!isDirectory(nodeModulesDir)) {
    return { findings: [], scannedCount: 0, cleanCount: 0 };
  }

  const allFindings = [];
  let scannedCount = 0;

  // Get all packages (including scoped)
  const entries = listDirs(nodeModulesDir);

  for (const entry of entries) {
    if (ignore.includes(entry)) continue;

    if (entry.startsWith('@')) {
      // Scoped package — scan subdirectories
      const scopeDir = path.join(nodeModulesDir, entry);
      const scopedPkgs = listDirs(scopeDir);
      for (const scopedPkg of scopedPkgs) {
        const fullName = `${entry}/${scopedPkg}`;
        if (ignore.includes(fullName)) continue;
        const pkgJsonPath = path.join(scopeDir, scopedPkg, 'package.json');
        const findings = scanPackageScripts(pkgJsonPath);
        allFindings.push(...findings);
        scannedCount++;
      }
    } else {
      const pkgJsonPath = path.join(nodeModulesDir, entry, 'package.json');
      const findings = scanPackageScripts(pkgJsonPath);
      allFindings.push(...findings);
      scannedCount++;
    }
  }

  const cleanCount = scannedCount - new Set(allFindings.map(f => f.package)).size;

  return { findings: allFindings, scannedCount, cleanCount };
}

module.exports = { scanPackageScripts, scanNodeModules, DANGEROUS_HOOKS, SCRIPT_PATTERNS };
