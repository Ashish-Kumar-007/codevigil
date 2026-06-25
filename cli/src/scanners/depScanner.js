/**
 * CodeVigil CLI — Dependency Scanner
 * Analyzes the dependency tree for structural red flags.
 */

const path = require('path');
const { readJsonSafe, isDirectory, listDirs } = require('../utils/fileUtils');

/**
 * Well-known popular packages (for typosquatting detection).
 */
const POPULAR_PACKAGES = [
  'lodash', 'express', 'react', 'axios', 'moment', 'chalk', 'commander',
  'webpack', 'babel', 'eslint', 'prettier', 'jest', 'mocha', 'typescript',
  'ethers', 'web3', 'hardhat', 'truffle', 'solidity', 'openzeppelin',
  'next', 'nuxt', 'vue', 'angular', 'svelte', 'tailwindcss',
  'mongoose', 'sequelize', 'prisma', 'pg', 'mysql', 'redis',
  'dotenv', 'cors', 'helmet', 'morgan', 'passport', 'jsonwebtoken',
  'socket.io', 'ws', 'http-proxy', 'node-fetch', 'got', 'superagent',
];

/**
 * Calculate Levenshtein distance between two strings.
 */
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/**
 * Known-good packages that trigger false positives due to short names.
 */
const TYPOSQUAT_WHITELIST = [
  'acorn', 'arg', 'vite', 'ora', 'got', 'npm', 'ini', 'ms', 'qs',
  'ws', 'ip', 'os', 'fs', 'vm', 'he', 'js', 'at', 'bn',
  'glob', 'mime', 'send', 'vary', 'etag', 'xtend', 'pump',
];

/**
 * Check if a package name looks like a typosquat of a popular package.
 * @param {string} name - Package name to check
 * @returns {object|null} { target, distance } if suspicious, null otherwise
 */
function checkTyposquat(name) {
  if (POPULAR_PACKAGES.includes(name)) return null;
  if (TYPOSQUAT_WHITELIST.includes(name)) return null;
  if (name.length < 4) return null; // Too short to reliably detect

  for (const popular of POPULAR_PACKAGES) {
    // Only compare packages of similar length
    if (Math.abs(name.length - popular.length) > 2) continue;

    const dist = levenshtein(name.toLowerCase(), popular.toLowerCase());
    // If distance is exactly 1 character, it's suspicious
    if (dist === 1 && name.length >= 5) {
      return { target: popular, distance: dist };
    }
    // Also check for common typosquatting patterns
    if (name === popular + 's' || name === popular + '-js' || name === popular + '-util' || name === popular + '-utils') {
      return { target: popular, distance: 1 };
    }
  }
  return null;
}

/**
 * Analyze all packages in node_modules for structural red flags.
 * @param {string} projectDir - Root project directory
 * @param {object} options - { ignore }
 * @returns {Array} Array of warnings
 */
function analyzeDependencies(projectDir, options = {}) {
  const { ignore = [] } = options;
  const nodeModulesDir = path.join(projectDir, 'node_modules');
  const warnings = [];

  if (!isDirectory(nodeModulesDir)) return warnings;

  const entries = listDirs(nodeModulesDir);

  for (const entry of entries) {
    if (ignore.includes(entry)) continue;

    if (entry.startsWith('@')) {
      const scopeDir = path.join(nodeModulesDir, entry);
      const scopedPkgs = listDirs(scopeDir);
      for (const scopedPkg of scopedPkgs) {
        const fullName = `${entry}/${scopedPkg}`;
        if (ignore.includes(fullName)) continue;
        const pkgJson = readJsonSafe(path.join(scopeDir, scopedPkg, 'package.json'));
        if (pkgJson) {
          analyzePackage(fullName, pkgJson, warnings);
        }
      }
    } else {
      const pkgJson = readJsonSafe(path.join(nodeModulesDir, entry, 'package.json'));
      if (pkgJson) {
        analyzePackage(entry, pkgJson, warnings);
      }
    }
  }

  return warnings;
}

/**
 * Analyze a single package for structural red flags.
 */
function analyzePackage(name, pkg, warnings) {
  // Typosquatting check
  const typosquat = checkTyposquat(name);
  if (typosquat) {
    warnings.push({
      package: name,
      version: pkg.version,
      type: 'typosquat',
      severity: 'high',
      message: `Package name is suspiciously similar to "${typosquat.target}" (distance: ${typosquat.distance})`,
    });
  }

  // Check for suspicious repository info
  if (!pkg.repository && !pkg.homepage && pkg.scripts) {
    const hasInstallScript = ['preinstall', 'install', 'postinstall'].some(h => pkg.scripts[h]);
    if (hasInstallScript) {
      warnings.push({
        package: name,
        version: pkg.version,
        type: 'no_repo',
        severity: 'medium',
        message: 'Has install scripts but no repository or homepage listed',
      });
    }
  }

  // Check for very low version with install scripts
  if (pkg.version && pkg.version.startsWith('0.0.') && pkg.scripts) {
    const hasInstallScript = ['preinstall', 'install', 'postinstall'].some(h => pkg.scripts[h]);
    if (hasInstallScript) {
      warnings.push({
        package: name,
        version: pkg.version,
        type: 'early_version',
        severity: 'medium',
        message: `Very early version (${pkg.version}) with install scripts — could be a newly published attack package`,
      });
    }
  }

  // Check for empty or trivially small description with install scripts
  if ((!pkg.description || pkg.description.length < 10) && pkg.scripts) {
    const hasInstallScript = ['preinstall', 'install', 'postinstall'].some(h => pkg.scripts[h]);
    if (hasInstallScript) {
      warnings.push({
        package: name,
        version: pkg.version,
        type: 'no_description',
        severity: 'low',
        message: 'Has install scripts but minimal or no description',
      });
    }
  }
}

module.exports = { analyzeDependencies, checkTyposquat, POPULAR_PACKAGES };
