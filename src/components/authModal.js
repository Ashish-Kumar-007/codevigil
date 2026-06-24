import { AuthStore } from '../data/store.js';
import { showToast } from './toast.js';

export function renderAuthModal() {
  return `
    <div class="modal-overlay" id="auth-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center;">
      <div class="card" style="width: 100%; max-width: 400px; padding: 32px; position: relative;">
        <button onclick="window.__closeAuthModal()" style="position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer;">×</button>
        <div class="text-center mb-lg">
          <div style="font-size: 3rem; margin-bottom: 16px;">🛡️</div>
          <h2 class="heading-lg mb-sm">Join CodeVigil</h2>
          <p class="text-secondary" style="font-size: 0.9rem;">Register to report scams and protect the community.</p>
        </div>
        
        <div class="flex-col gap-md">
          <div class="input-group">
            <label for="auth-username">Username or Email</label>
            <input type="text" id="auth-username" class="input" placeholder="Enter username..." />
          </div>
          <button class="btn btn--primary btn--lg w-full" onclick="window.__loginStandard()">Continue</button>
          
          <div class="text-center text-muted my-sm" style="font-size: 0.85rem;">— OR —</div>
          
          <button class="btn btn--ghost btn--lg w-full flex items-center justify-center gap-sm" onclick="window.__loginWeb3()">
            🦊 Connect Wallet
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initAuthModal() {
  window.__openAuthModal = () => {
    document.getElementById('auth-modal-overlay').style.display = 'flex';
  };
  
  window.__closeAuthModal = () => {
    document.getElementById('auth-modal-overlay').style.display = 'none';
  };
  
  window.__loginStandard = () => {
    const username = document.getElementById('auth-username').value.trim();
    if (!username) {
      showToast('Please enter a username', 'warning');
      return;
    }
    AuthStore.login(username, false);
    completeLogin(username);
  };
  
  window.__loginWeb3 = () => {
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6);
    AuthStore.login(mockAddress, true);
    completeLogin(mockAddress);
  };
  
  window.__logout = () => {
    AuthStore.logout();
    updateNavUI();
    showToast('Logged out successfully', 'info');
    if (location.hash === '#/report') {
      location.hash = '#/dashboard';
    }
  };
}

function completeLogin(username) {
  window.__closeAuthModal();
  showToast(`Welcome back, ${username}!`, 'success');
  updateNavUI();
  
  if (location.hash === '#/report') {
    window.dispatchEvent(new Event('hashchange'));
  }
}

export function updateNavUI() {
  const user = AuthStore.getUser();
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) return;
  
  if (user) {
    authContainer.innerHTML = `
      <div class="flex items-center gap-md">
        <span class="badge badge--info">${user.isWallet ? '🦊' : '👤'} ${user.username}</span>
        <button class="btn btn--ghost btn--sm" onclick="window.__logout()">Logout</button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button class="btn btn--primary" onclick="window.__openAuthModal()">Sign In / Register</button>
    `;
  }
}
