# CodeVigil — Don't Run That Code 🛡️

A full-featured platform to protect web3 developers from code-based scams, social engineering attacks, and malicious packages. Think **VirusTotal meets Web3 security** with a community layer.

## 🌟 Features

- **🔍 Code Scanner** — Paste suspicious code (JavaScript, Python, Solidity, Shell) and get instant analysis for 40+ malicious patterns, including wallet drainers, reverse shells, and data exfiltration.
- **🚨 Scam Reporter** — Submit scam encounters to build a community-driven threat database.
- **📡 Scam Database** — Look up wallets, domains, GitHub repos, or Telegram handles to check if they're flagged by the community.
- **💬 Message Analyzer** — Paste suspicious DMs/emails to detect social engineering red flags (urgency, impersonation, unrealistic compensation).

## 🚀 Quick Start

CodeVigil is built as a fast, client-side Single Page Application (SPA) using Vite and Vanilla JS. All data is persisted in `localStorage` for privacy and ease of use.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ashish-Kumar-007/codevigil.git
   cd codevigil
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

## 🛠️ Tech Stack

- **Framework:** Vite + Vanilla JavaScript (ES Modules)
- **Styling:** Custom CSS Design System (Dark Cybersecurity Theme with Glassmorphism)
- **Routing:** Custom Hash-based SPA Router
- **Storage:** Client-side `localStorage`

## 🧠 Threat Detection Engine

The local scanning engine detects 40+ known malicious patterns across various categories:

- **Code Execution & Obfuscation:** `eval()`, `atob()` chains, hex-encoded payloads
- **Network Exfiltration:** Webhook URLs (Discord/Telegram), suspicious `fetch()` calls
- **File System Access:** Access to `.env`, `~/.ssh/`, and browser profile data
- **Crypto / Wallet Specific:** Private key extraction, seed phrase access, `setApprovalForAll` drainers
- **Process Execution:** Reverse shells, `child_process.exec()`, PowerShell download cradles

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request to add more detection patterns, scam reports, or UI improvements.

## 📄 License

This project is open-source and available under the MIT License.
