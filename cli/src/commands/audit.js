/**
 * CodeVigil CLI — Audit Command
 * Deep scan: analyzes actual JS files referenced by install scripts.
 */

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { scanNodeModules, scanPackageScripts } = require('../scanners/scriptScanner');
const { scanFile } = require('../scanners/codeScanner');
const { analyzeDependencies } = require('../scanners/depScanner');
const { renderAuditResults } = require('../reporters/consoleReporter');
const { outputAuditJson } = require('../reporters/jsonReporter');
const { isFile, readJsonSafe, isDirectory, listDirs } = require('../utils/fileUtils');

/**
 * Resolve script file targets from install hooks.
 * e.g., "node setup.js" → resolve "setup.js" relative to the package.
 */
function resolveScriptFiles(finding) {
  const files = [];
  const script = finding.script || '';
  const pkgDir = path.dirname(finding.filePath);

  // Match patterns like "node somefile.js" or "node ./somefile.js"
  const nodeFileMatch = script.match(/node\s+(?:--[^\s]+\s+)*['"]*([^\s'"]+\.(?:js|mjs|cjs))['"']*/);
  if (nodeFileMatch) {
    const resolved = path.resolve(pkgDir, nodeFileMatch[1]);
    if (isFile(resolved)) files.push(resolved);
  }

  // Also check for common install script filenames
  const commonFiles = ['install.js', 'setup.js', 'postinstall.js', 'preinstall.js', 'prepare.js', 'index.js'];
  for (const f of commonFiles) {
    const resolved = path.resolve(pkgDir, f);
    if (isFile(resolved) && !files.includes(resolved)) {
      files.push(resolved);
    }
  }

  return files;
}

module.exports = async function auditCommand(options) {
  const projectDir = path.resolve(options.dir || '.');
  const isJson = options.json || false;
  const ignore = options.ignore ? options.ignore.split(',').map(s => s.trim()) : [];

  const pkgJsonPath = path.join(projectDir, 'package.json');
  if (!isFile(pkgJsonPath)) {
    if (!isJson) {
      console.log(chalk.red('  ❌ No package.json found in ') + chalk.white(projectDir));
    }
    process.exit(1);
  }

  if (!isJson) {
    console.log(chalk.gray(`  Project: ${chalk.white(projectDir)}`));
    console.log(chalk.gray(`  Mode:    ${chalk.cyan('Deep Audit')}`));
    console.log('');
  }

  // Step 1: Script scanning
  const spinner1 = isJson ? null : ora({ text: 'Scanning install scripts...', prefixText: '  ' }).start();
  const rootFindings = scanPackageScripts(pkgJsonPath);
  const { findings: moduleFindings, scannedCount } = scanNodeModules(projectDir, { depth: 1, ignore });
  const allScriptFindings = [...rootFindings, ...moduleFindings];

  if (spinner1) {
    spinner1.succeed(chalk.green(`Scanned ${scannedCount} packages — ${allScriptFindings.length} script finding(s)`));
  }

  // Step 2: Deep code analysis on files referenced by install scripts
  const spinner2 = isJson ? null : ora({ text: 'Analyzing install script files...', prefixText: '  ' }).start();
  const allCodeFindings = [];
  let filesScanned = 0;

  for (const finding of allScriptFindings) {
    const targetFiles = resolveScriptFiles(finding);
    for (const file of targetFiles) {
      const result = scanFile(file);
      allCodeFindings.push(...result.findings);
      filesScanned++;
    }
  }

  if (spinner2) {
    if (allCodeFindings.length > 0) {
      spinner2.warn(chalk.yellow(`Analyzed ${filesScanned} file(s) — ${allCodeFindings.length} code pattern(s) found`));
    } else if (filesScanned > 0) {
      spinner2.succeed(chalk.green(`Analyzed ${filesScanned} file(s) — no malicious patterns`));
    } else {
      spinner2.info(chalk.gray('No install script files to analyze'));
    }
  }

  // Step 3: Dependency analysis
  const spinner3 = isJson ? null : ora({ text: 'Checking dependency structure...', prefixText: '  ' }).start();
  const depWarnings = analyzeDependencies(projectDir, { ignore });

  if (spinner3) {
    if (depWarnings.length > 0) {
      spinner3.warn(chalk.yellow(`${depWarnings.length} structural warning(s)`));
    } else {
      spinner3.succeed(chalk.green('Dependency structure looks clean'));
    }
  }

  // Calculate total score
  const severityScores = { critical: 30, high: 18, medium: 8, low: 3 };
  let totalScore = allScriptFindings.reduce((acc, f) => acc + (severityScores[f.severity] || 0), 0);
  totalScore += allCodeFindings.reduce((acc, f) => acc + (severityScores[f.severity] || 0) * (f.confidence || 1), 0);
  totalScore += depWarnings.reduce((acc, w) => acc + (severityScores[w.severity] || 0), 0);
  totalScore = Math.min(100, Math.round(totalScore));

  let overallSeverity = 'safe';
  if (totalScore >= 80) overallSeverity = 'critical';
  else if (totalScore >= 55) overallSeverity = 'high';
  else if (totalScore >= 30) overallSeverity = 'medium';
  else if (totalScore > 0) overallSeverity = 'low';

  // Output
  if (isJson) {
    outputAuditJson({ scriptFindings: allScriptFindings, codeFindings: allCodeFindings, depWarnings, scannedCount, filesScanned, totalScore, overallSeverity });
  } else {
    renderAuditResults({ scriptFindings: allScriptFindings, codeFindings: allCodeFindings, depWarnings, scannedCount, filesScanned, totalScore, overallSeverity });
  }

  // Exit code
  process.exit(totalScore >= 55 ? 1 : 0);
};
