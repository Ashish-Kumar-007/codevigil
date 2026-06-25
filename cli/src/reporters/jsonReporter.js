/**
 * CodeVigil CLI — JSON Reporter
 * Machine-readable JSON output for CI/CD integration.
 */

/**
 * Output scan results as JSON.
 */
function outputScanJson({ scriptFindings, depWarnings, scannedCount, cleanCount, totalScore, overallSeverity }) {
  const output = {
    tool: 'codevigil',
    version: '1.0.0',
    scanType: 'quick',
    timestamp: new Date().toISOString(),
    summary: {
      scannedCount,
      cleanCount,
      totalScore,
      severity: overallSeverity,
      scriptFindingsCount: scriptFindings.length,
      depWarningsCount: depWarnings ? depWarnings.length : 0,
    },
    scriptFindings: scriptFindings.map(f => ({
      package: f.package,
      version: f.version,
      hook: f.hook,
      script: f.script,
      severity: f.severity,
      threats: f.threats,
    })),
    depWarnings: (depWarnings || []).map(w => ({
      package: w.package,
      version: w.version,
      type: w.type,
      severity: w.severity,
      message: w.message,
    })),
  };

  console.log(JSON.stringify(output, null, 2));
}

/**
 * Output audit results as JSON.
 */
function outputAuditJson({ scriptFindings, codeFindings, depWarnings, scannedCount, filesScanned, totalScore, overallSeverity }) {
  const output = {
    tool: 'codevigil',
    version: '1.0.0',
    scanType: 'audit',
    timestamp: new Date().toISOString(),
    summary: {
      scannedCount,
      filesScanned,
      totalScore,
      severity: overallSeverity,
      scriptFindingsCount: scriptFindings.length,
      codeFindingsCount: codeFindings ? codeFindings.length : 0,
      depWarningsCount: depWarnings ? depWarnings.length : 0,
    },
    scriptFindings: scriptFindings.map(f => ({
      package: f.package,
      version: f.version,
      hook: f.hook,
      script: f.script,
      severity: f.severity,
      threats: f.threats,
    })),
    codeFindings: (codeFindings || []).map(f => ({
      patternId: f.patternId,
      name: f.name,
      severity: f.severity,
      confidence: f.confidence,
      filePath: f.filePath,
      lineNumber: f.lineNumber,
      matchedLine: f.matchedLine,
      description: f.description,
      remediation: f.remediation,
    })),
    depWarnings: (depWarnings || []).map(w => ({
      package: w.package,
      version: w.version,
      type: w.type,
      severity: w.severity,
      message: w.message,
    })),
  };

  console.log(JSON.stringify(output, null, 2));
}

module.exports = { outputScanJson, outputAuditJson };
