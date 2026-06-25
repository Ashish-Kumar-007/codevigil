/**
 * CodeVigil CLI — File Utilities
 * Safe, read-only file system operations.
 */

const fs = require('fs');
const path = require('path');

/**
 * Safely read a JSON file. Returns null on failure.
 */
function readJsonSafe(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Safely read a text file. Returns null on failure.
 */
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Check if a path exists and is a directory.
 */
function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a path exists and is a file.
 */
function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

/**
 * List immediate subdirectories of a directory.
 */
function listDirs(dirPath) {
  try {
    return fs.readdirSync(dirPath).filter(name => {
      return isDirectory(path.join(dirPath, name)) && !name.startsWith('.');
    });
  } catch {
    return [];
  }
}

/**
 * Resolve a file path relative to a base, with safety checks.
 */
function safePath(base, ...segments) {
  const resolved = path.resolve(base, ...segments);
  // Ensure the resolved path is within the base to prevent traversal
  if (!resolved.startsWith(path.resolve(base))) {
    return null;
  }
  return resolved;
}

module.exports = { readJsonSafe, readFileSafe, isDirectory, isFile, listDirs, safePath };
