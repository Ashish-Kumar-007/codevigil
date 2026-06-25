/**
 * CodeVigil CLI — Logger Utility
 * Colored, structured terminal output.
 */

const chalk = require('chalk');

const ICONS = {
  critical: '⛔',
  high: '⚠️ ',
  medium: '⚡',
  low: 'ℹ️ ',
  info: '📌',
  safe: '✅',
};

const COLORS = {
  critical: chalk.red.bold,
  high: chalk.hex('#ff6b35').bold,
  medium: chalk.yellow.bold,
  low: chalk.blue,
  info: chalk.gray,
  safe: chalk.green.bold,
};

function severity(level, message) {
  const icon = ICONS[level] || '•';
  const color = COLORS[level] || chalk.white;
  console.log(`  ${icon} ${color(level.toUpperCase())}: ${message}`);
}

function heading(text) {
  console.log('');
  console.log(chalk.white.bold(`  ${text}`));
  console.log(chalk.gray('  ' + '─'.repeat(text.length + 2)));
}

function detail(label, value) {
  console.log(chalk.gray(`     ${label}: `) + chalk.white(value));
}

function line(text = '') {
  console.log(text ? `  ${text}` : '');
}

function success(text) {
  console.log(chalk.green(`  ✅ ${text}`));
}

function warn(text) {
  console.log(chalk.yellow(`  ⚠️  ${text}`));
}

function error(text) {
  console.log(chalk.red(`  ❌ ${text}`));
}

function divider() {
  console.log(chalk.gray('  ' + '─'.repeat(50)));
}

module.exports = { severity, heading, detail, line, success, warn, error, divider, ICONS, COLORS };
