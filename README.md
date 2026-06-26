# CodeVigil — Web3 Immune System 🛡️

A full-featured platform and CLI tool to protect developers from code-based scams, supply chain attacks, and malicious packages. Think **VirusTotal meets Web3 security** with a decentralized community layer.

![CodeVigil Dashboard](https://raw.githubusercontent.com/Ashish-Kumar-007/codevigil/main/public/demo.png)

## 🌟 The CodeVigil Ecosystem

CodeVigil consists of two main components:

### 1. The Web Platform
A premium, dark-mode React application featuring:
- **🔍 Code Scanner** — Paste suspicious code (JavaScript, Python, Solidity, Shell) and get instant analysis for 40+ malicious patterns, including wallet drainers and reverse shells.
- **💬 Message Analyzer** — Paste suspicious DMs/emails to detect social engineering red flags (urgency, impersonation, unrealistic compensation).
- **🚨 Scam Database** — A crowdsourced registry. Look up wallets, domains, GitHub repos, or Telegram handles to check if they're flagged.
- **🛡️ Scam Reporter** — Submit scam encounters to build the community-driven threat database.

### 2. The CLI Tool (`codevigil`)
A standalone npm package that runs directly in your terminal or CI/CD pipeline to protect your workspace from supply chain attacks.
- Scans `package.json` for dangerous install hooks (`preinstall`, `postinstall`).
- Deep-audits dependency code for obfuscated payloads and exfiltration attempts.
- Detects typosquatting (e.g., `lodas` vs `lodash`).

---

## 🚀 Quick Start

### For the Web App
The platform is built as a fast Single Page Application (SPA) using React, Vite, Tailwind CSS, and Shadcn UI.

1. Clone the repository:
   ```bash
   git clone https://github.com/Ashish-Kumar-007/codevigil.git
   cd codevigil
   ```

2. Install dependencies & run:
   ```bash
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

### For the CLI Tool
You can run the scanner locally on any Node.js project without installing it globally:

```bash
# Quick scan (checks scripts & node_modules structure)
npx @ashishksahoo/codevigil scan

# Deep audit (analyzes actual JS files referenced by scripts)
npx @ashishksahoo/codevigil audit
```

**CI/CD Integration:**
You can easily drop CodeVigil into GitHub Actions. It will exit with code `1` if threats are found, blocking malicious code from deploying.
```yaml
- name: Security Audit
  run: npx @ashishksahoo/codevigil scan --json
```

---

## 🛠️ Tech Stack

**Web Application:**
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **Routing:** React Router (Clean URLs)
- **Icons:** Lucide React
- **Storage:** Client-side `localStorage` (for MVP state management)

**CLI Tool:**
- **Framework:** Node.js + Commander.js
- **UI:** Chalk (colors) + Ora (spinners)
- **Engine:** Custom heuristic regex scanner

---

## 🧠 Threat Detection Engine

The local scanning engine detects 40+ known malicious patterns across various categories:

- **Code Execution & Obfuscation:** `eval()`, `atob()` chains, hex-encoded payloads
- **Network Exfiltration:** Webhook URLs (Discord/Telegram), suspicious `fetch()` calls
- **File System Access:** Access to `.env`, `~/.ssh/`, and browser profile data
- **Crypto / Wallet Specific:** Private key extraction, seed phrase access, `setApprovalForAll` drainers
- **Process Execution:** Reverse shells, `child_process.exec()`, PowerShell download cradles

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request to add more detection patterns, scam reports, or UI improvements.

## 📄 License

This project is open-source and available under the MIT License.
