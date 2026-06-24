/**
 * CodeVigil — Global Footer Component
 */

export function renderFooter() {
  return `
    <footer class="footer" style="border-top: 1px solid var(--border-subtle); background: var(--bg-secondary); padding: 40px 20px; text-align: center; color: var(--text-secondary); margin-top: auto;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 24px;">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-primary);">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;">
            <path d="M16 2L4 8v8c0 7.73 5.12 14.95 12 16.8 6.88-1.85 12-9.07 12-16.8V8L16 2z" fill="rgba(0,240,255,0.12)" stroke="#00f0ff" stroke-width="1.5"/>
            <path d="M12 16l3 3 5-6" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Code<span style="color: var(--cyan);">Vigil</span>
        </div>
        
        <div style="display: flex; gap: 24px; font-size: 0.9rem;">
          <a href="#/" class="footer-link">Home</a>
          <a href="#/dashboard" class="footer-link">Dashboard</a>
          <a href="https://github.com/Ashish-Kumar-007/codevigil" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub</a>
          <a href="#" class="footer-link">Privacy Policy</a>
        </div>
      </div>
      <div style="margin-top: 32px; font-size: 0.85rem; color: var(--text-muted);">
        &copy; ${new Date().getFullYear()} CodeVigil. Protect your Web3 journey.
      </div>
    </footer>
  `;
}
