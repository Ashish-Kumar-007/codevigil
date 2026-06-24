/**
 * CodeVigil — Data Store
 * localStorage-based persistence layer
 */

import { SEED_REPORTS } from './seedData.js';

const KEYS = {
  REPORTS: 'codevigil_reports',
  SCAN_HISTORY: 'codevigil_scan_history',
  MSG_HISTORY: 'codevigil_msg_history',
  STATS: 'codevigil_stats',
  INITIALIZED: 'codevigil_initialized',
  USER: 'codevigil_user',
};

/* ============ Helpers ============ */

function read(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ============ Init / Seed ============ */

export function initStore() {
  if (!read(KEYS.INITIALIZED)) {
    write(KEYS.REPORTS, SEED_REPORTS);
    write(KEYS.SCAN_HISTORY, []);
    write(KEYS.MSG_HISTORY, []);
    write(KEYS.STATS, {
      totalScans: 247,
      threatsDetected: 189,
      reportsSubmitted: SEED_REPORTS.length,
      communityMembers: 1842,
    });
    write(KEYS.INITIALIZED, true);
  }
}

/* ============ Scam Reports ============ */

export const ReportStore = {
  getAll() {
    return read(KEYS.REPORTS) || [];
  },

  getById(id) {
    return this.getAll().find(r => r.id === id) || null;
  },

  add(report) {
    const reports = this.getAll();
    const newReport = {
      id: `rpt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...report,
      reportedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      verified: false,
    };
    reports.unshift(newReport);
    write(KEYS.REPORTS, reports);
    StatsStore.increment('reportsSubmitted');
    return newReport;
  },

  search(query) {
    if (!query || !query.trim()) return this.getAll();
    const q = query.toLowerCase().trim();
    return this.getAll().filter(r => {
      const searchable = [
        r.title,
        r.description,
        r.type,
        r.evidence || '',
        ...(r.identifiers?.wallets || []),
        ...(r.identifiers?.domains || []),
        ...(r.identifiers?.github || []),
        ...(r.identifiers?.social || []),
      ].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  },

  filterByType(type) {
    if (!type || type === 'all') return this.getAll();
    return this.getAll().filter(r => r.type === type);
  },

  vote(id, direction) {
    const reports = this.getAll();
    const report = reports.find(r => r.id === id);
    if (report) {
      if (direction === 'up') report.upvotes = (report.upvotes || 0) + 1;
      else report.downvotes = (report.downvotes || 0) + 1;
      write(KEYS.REPORTS, reports);
    }
    return report;
  },
};

/* ============ Scan History ============ */

export const ScanHistoryStore = {
  getAll() {
    return read(KEYS.SCAN_HISTORY) || [];
  },

  add(result) {
    const history = this.getAll();
    const entry = {
      id: `scan-${Date.now()}`,
      ...result,
      savedAt: new Date().toISOString(),
    };
    history.unshift(entry);
    // Keep last 100 entries
    if (history.length > 100) history.length = 100;
    write(KEYS.SCAN_HISTORY, history);
    StatsStore.increment('totalScans');
    if (result.score > 20) StatsStore.increment('threatsDetected');
    return entry;
  },

  clear() {
    write(KEYS.SCAN_HISTORY, []);
  },
};

/* ============ Message History ============ */

export const MessageHistoryStore = {
  getAll() {
    return read(KEYS.MSG_HISTORY) || [];
  },

  add(result) {
    const history = this.getAll();
    const entry = {
      id: `msg-${Date.now()}`,
      ...result,
      savedAt: new Date().toISOString(),
    };
    history.unshift(entry);
    if (history.length > 50) history.length = 50;
    write(KEYS.MSG_HISTORY, history);
    return entry;
  },
};

/* ============ Auth ============ */

export const AuthStore = {
  getUser() {
    return read(KEYS.USER);
  },
  login(username, isWallet = false) {
    const user = { username, isWallet, loggedInAt: new Date().toISOString() };
    write(KEYS.USER, user);
    return user;
  },
  logout() {
    localStorage.removeItem(KEYS.USER);
  }
};

/* ============ Stats ============ */

export const StatsStore = {
  get() {
    return read(KEYS.STATS) || {
      totalScans: 0,
      threatsDetected: 0,
      reportsSubmitted: 0,
      communityMembers: 0,
    };
  },

  increment(field) {
    const stats = this.get();
    stats[field] = (stats[field] || 0) + 1;
    write(KEYS.STATS, stats);
  },

  set(field, value) {
    const stats = this.get();
    stats[field] = value;
    write(KEYS.STATS, stats);
  },
};
