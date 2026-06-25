/**
 * CodeVigil CLI — Console Reporter
 * Beautiful, color-coded terminal output.
 */

const chalk = require('chalk');
const log = require('../utils/logger');

/**
 * Render the scan results to the terminal.
 */
function renderScanResults({ scriptFindings, depWarnings, scannedCount, cleanCount, totalScore, overallSeverity }) {
  // Script Findings
  if (scriptFindings.length > 0) {
    log.heading('Dangerous Install Scripts Detected');

    for (const finding of scriptFindings) {
      console.log('');
      log.severity(finding.severity, `${chalk.white.bold(finding.package)}@${finding.version}`);
      log.detail('Hook', chalk.yellow(finding.hook));
      log.detail('Script', chalk.gray(truncate(finding.script, 120)));

      if (finding.threats.length > 0) {
        for (const threat of finding.threats) {
          console.log(chalk.gray('     → ') + chalk.red(threat.description));
        }
      }
    }
  }

  // Dependency Warnings
  if (depWarnings && depWarnings.length > 0) {
    log.heading('Dependency Warnings');

    for (const warn of depWarnings) {
      log.severity(warn.severity, `${chalk.white.bold(warn.package)}@${warn.version}`);
      console.log(chalk.gray(`     → ${warn.message}`));
    }
  }

  // Summary
  console.log('');
  log.divider();
  renderSummary({ scriptFindings, depWarnings, scannedCount, cleanCount, totalScore, overallSeverity });
}

/**
 * Render the audit (deep scan) results.
 */
function renderAuditResults({ scriptFindings, codeFindings, depWarnings, scannedCount, filesScanned, totalScore, overallSeverity }) {
  // Script findings first
  if (scriptFindings.length > 0) {
    log.heading('Dangerous Install Scripts');
    for (const finding of scriptFindings) {
      console.log('');
      log.severity(finding.severity, `${chalk.white.bold(finding.package)}@${finding.version}`);
      log.detail('Hook', chalk.yellow(finding.hook));
      log.detail('Script', chalk.gray(truncate(finding.script, 120)));
      for (const threat of finding.threats) {
        console.log(chalk.gray('     → ') + chalk.red(threat.description));
      }
    }
  }

  // Code findings
  if (codeFindings && codeFindings.length > 0) {
    log.heading('Malicious Code Patterns');
    for (const finding of codeFindings) {
      console.log('');
      log.severity(finding.severity, chalk.white.bold(finding.name));
      log.detail('File', chalk.cyan(finding.filePath));
      log.detail('Line', chalk.yellow(finding.lineNumber));
      log.detail('Code', chalk.gray(truncate(finding.matchedLine, 100)));
      console.log(chalk.gray('     → ') + chalk.red(finding.description));
      console.log(chalk.gray('     💡 ') + chalk.blue(finding.remediation));
    }
  }

  // Dep warnings
  if (depWarnings && depWarnings.length > 0) {
    log.heading('Dependency Warnings');
    for (const warn of depWarnings) {
      log.severity(warn.severity, `${chalk.white.bold(warn.package)}@${warn.version}`);
      console.log(chalk.gray(`     → ${warn.message}`));
    }
  }

  console.log('');
  log.divider();

  // Summary
  const totalFindings = (scriptFindings?.length || 0) + (codeFindings?.length || 0);
  console.log('');
  console.log(chalk.white.bold('  Summary'));
  console.log(chalk.gray(`  Packages scanned: ${chalk.white(scannedCount)}`));
  if (filesScanned !== undefined) console.log(chalk.gray(`  Files analyzed:    ${chalk.white(filesScanned)}`));
  console.log(chalk.gray(`  Total findings:   ${chalk.white(totalFindings)}`));
  if (depWarnings) console.log(chalk.gray(`  Dep warnings:     ${chalk.white(depWarnings.length)}`));
  console.log('');

  renderThreatScore(totalScore, overallSeverity);
}

/**
 * Render the summary block.
 */
function renderSummary({ scriptFindings, depWarnings, scannedCount, cleanCount, totalScore, overallSeverity }) {
  const dangerousCount = new Set(scriptFindings.map(f => f.package)).size;

  console.log('');
  console.log(chalk.white.bold('  Summary'));
  console.log(chalk.gray(`  Packages scanned:  ${chalk.white(scannedCount)}`));
  console.log(chalk.gray(`  Clean packages:    ${chalk.green(cleanCount)}`));
  console.log(chalk.gray(`  Packages flagged:  ${dangerousCount > 0 ? chalk.red(dangerousCount) : chalk.green('0')}`));
  console.log(chalk.gray(`  Script findings:   ${scriptFindings.length > 0 ? chalk.red(scriptFindings.length) : chalk.green('0')}`));
  if (depWarnings) {
    console.log(chalk.gray(`  Dep warnings:      ${depWarnings.length > 0 ? chalk.yellow(depWarnings.length) : chalk.green('0')}`));
  }
  console.log('');

  renderThreatScore(totalScore, overallSeverity);
}

/**
 * Render the threat score bar.
 */
function renderThreatScore(score, severity) {
  const color = severity === 'critical' ? chalk.red : severity === 'high' ? chalk.hex('#ff6b35') : severity === 'medium' ? chalk.yellow : severity === 'low' ? chalk.blue : chalk.green;

  const barLength = 30;
  const filled = Math.round((score / 100) * barLength);
  const bar = color('█'.repeat(filled)) + chalk.gray('░'.repeat(barLength - filled));

  console.log(`  Threat Score: ${color.bold(score + '/100')} — ${color.bold(severity.toUpperCase())}`);
  console.log(`  [${bar}]`);
  console.log('');

  if (score >= 80) {
    console.log(chalk.red.bold('  🚨 DO NOT install these dependencies without thorough review.'));
  } else if (score >= 55) {
    console.log(chalk.hex('#ff6b35').bold('  ⚠️  Exercise extreme caution. Review each finding before proceeding.'));
  } else if (score >= 30) {
    console.log(chalk.yellow('  ⚡ Some concerning patterns detected. Investigate before production use.'));
  } else if (score > 0) {
    console.log(chalk.blue('  ℹ️  Minor concerns detected. Likely safe but worth reviewing.'));
  } else {
    console.log(chalk.green.bold('  ✅ No threats detected. Dependencies appear safe.'));
  }
  console.log('');
}

function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

module.exports = { renderScanResults, renderAuditResults, renderThreatScore };
