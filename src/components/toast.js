/**
 * CodeVigil — Toast Notification System
 */

let container = null;

function ensureContainer() {
  if (!container || !document.body.contains(container)) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show a toast notification
 * @param {string} message - Text to display
 * @param {'success'|'error'|'info'|'warning'} [type='info'] - Toast variant
 * @param {number} [duration=3000] - Auto-dismiss in ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  const c = ensureContainer();

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${icons[type] || ''}</span>
    <span>${message}</span>
  `;

  c.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
