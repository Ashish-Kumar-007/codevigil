/**
 * CodeVigil CLI — Scan Command
 * Quick scan: checks package.json scripts and dependency structure.
 */

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const { scanNodeModules, scanPackageScripts } = require('../scanners/scriptScanner');
const { analyzeDependencies } = require('../scanners/depScanner');
const { renderScanResults } = require('../reporters/consoleReporter');
const { outputScanJson } = require('../reporters/jsonReporter');
const { isFile } = require('../utils/fileUtils');

module.exports = async function scanCommand(options) {
  const projectDir = path.resolve(options.dir || '.');
  const isJson = options.json || false;
  const ignore = options.ignore ? options.ignore.split(',').map(s => s.trim()) : [];
  const depth = parseInt(options.depth) || 1;

  // Check project exists
  const pkgJsonPath = path.join(projectDir, 'package.json');
  if (!isFile(pkgJsonPath)) {
    if (!isJson) {
      console.log(chalk.red('  ❌ No package.json found in ') + chalk.white(projectDir));
      console.log(chalk.gray('  Run this command from a Node.js project directory.'));
    }
    process.exit(1);
  }

  if (!isJson) {
    console.log(chalk.gray(`  Project: ${chalk.white(projectDir)}`));
    console.log('');
  }

  // Step 1: Scan root package.json
  const spinner = isJson ? null : ora({ text: 'Scanning package.json...', prefixText: '  ' }).start();
  const rootFindings = scanPackageScripts(pkgJsonPath);

  if (spinner) {
    if (rootFindings.length > 0) {
      spinner.warn(chalk.yellow(`Root package.json: ${rootFindings.length} install script(s) found`));
    } else {
      spinner.succeed(chalk.green('Root package.json: clean'));
    }
  }

  // Step 2: Scan node_modules
  const spinner2 = isJson ? null : ora({ text: 'Scanning node_modules...', prefixText: '  ' }).start();
  const { findings: moduleFindings, scannedCount, cleanCount } = scanNodeModules(projectDir, { depth, ignore });

  if (spinner2) {
    if (moduleFindings.length > 0) {
      spinner2.warn(chalk.yellow(`Scanned ${scannedCount} packages — ${moduleFindings.length} finding(s)`));
    } else if (scannedCount === 0) {
      spinner2.info(chalk.gray('No node_modules directory found'));
    } else {
      spinner2.succeed(chalk.green(`Scanned ${scannedCount} packages — all clean`));
    }
  }

  // Step 3: Dependency analysis
  const spinner3 = isJson ? null : ora({ text: 'Analyzing dependency tree...', prefixText: '  ' }).start();
  const depWarnings = analyzeDependencies(projectDir, { ignore });

  if (spinner3) {
    if (depWarnings.length > 0) {
      spinner3.warn(chalk.yellow(`${depWarnings.length} structural warning(s)`));
    } else {
      spinner3.succeed(chalk.green('Dependency structure looks clean'));
    }
  }

  // Combine all script findings
  const allFindings = [...rootFindings, ...moduleFindings];

  // Calculate total score
  const severityScores = { critical: 30, high: 18, medium: 8, low: 3 };
  let totalScore = allFindings.reduce((acc, f) => acc + (severityScores[f.severity] || 0), 0);
  totalScore += depWarnings.reduce((acc, w) => acc + (severityScores[w.severity] || 0), 0);
  totalScore = Math.min(100, totalScore);

  let overallSeverity = 'safe';
  if (totalScore >= 80) overallSeverity = 'critical';
  else if (totalScore >= 55) overallSeverity = 'high';
  else if (totalScore >= 30) overallSeverity = 'medium';
  else if (totalScore > 0) overallSeverity = 'low';

  // Output
  if (isJson) {
    outputScanJson({ scriptFindings: allFindings, depWarnings, scannedCount, cleanCount, totalScore, overallSeverity });
  } else {
    renderScanResults({ scriptFindings: allFindings, depWarnings, scannedCount, cleanCount, totalScore, overallSeverity });
  }

  // Exit code
  process.exit(totalScore >= 55 ? 1 : 0);
};
