#!/usr/bin/env node

/**
 * CodeVigil CLI — Protect Your Workspace
 * Scans npm dependencies for malicious scripts and known threat patterns.
 */

const { Command } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');
const scanCommand = require('../src/commands/scan');
const auditCommand = require('../src/commands/audit');

const program = new Command();

// Banner
console.log('');
console.log(chalk.cyan.bold('  ╔══════════════════════════════════════╗'));
console.log(chalk.cyan.bold('  ║') + chalk.white.bold('   🛡️  CodeVigil — Dependency Scanner  ') + chalk.cyan.bold('║'));
console.log(chalk.cyan.bold('  ╚══════════════════════════════════════╝'));
console.log('');

program
  .name('codevigil')
  .description('Scan npm dependencies for malicious postinstall scripts and obfuscated payloads.')
  .version(pkg.version);

program
  .command('scan')
  .description('Quick scan: check package.json scripts and top-level dependencies')
  .option('-d, --dir <path>', 'Project directory to scan', '.')
  .option('--depth <n>', 'Max depth for node_modules scanning', '1')
  .option('--json', 'Output results as JSON')
  .option('--verbose', 'Show detailed output')
  .option('--ignore <patterns>', 'Comma-separated package names to skip', '')
  .action(scanCommand);

program
  .command('audit')
  .description('Deep scan: analyze all install script files with the full pattern engine')
  .option('-d, --dir <path>', 'Project directory to scan', '.')
  .option('--json', 'Output results as JSON')
  .option('--verbose', 'Show detailed output')
  .option('--ignore <patterns>', 'Comma-separated package names to skip', '')
  .action(auditCommand);

program.parse();
