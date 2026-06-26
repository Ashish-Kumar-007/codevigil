# CodeVigil CLI 🛡️

A powerful terminal utility to scan `npm` dependencies for malicious scripts, obfuscated payloads, crypto wallet drainers, reverse shells, and known supply chain threats before they execute.

Part of the **CodeVigil** ecosystem.

## 🚀 Key Features

*   **🔍 Script Hook Analysis:** Inspects `package.json` install scripts (`preinstall`, `postinstall`, `prepare`, etc.) for high-risk commands.
*   **🧠 Threat Detection Engine:** Scans files using a heuristics engine checking for over 40+ known malicious patterns (e.g. `setApprovalForAll`, Hex-encoded payloads, environment variable exfiltration, and suspicious fetches).
*   **📦 Dependency Audit:** Analyzes the actual JavaScript source files loaded by dependency scripts to verify there are no hidden payloads.
*   **⚡ Easy CI/CD Integration:** Exits with code `1` when a potential threat is detected, making it perfect for build pipeline security gates.

---

## 💻 Installation

Install the package globally using npm:

```bash
npm install -g @ashishksahoo/codevigil
```

Or run it directly without installing via `npx`:

```bash
npx @ashishksahoo/codevigil <command> [options]
```

---

## 🛠️ Usage & Commands

### 1. Quick Scan
Scans your project's `package.json` scripts and checks top-level dependency configurations.

```bash
codevigil scan [options]
```

**Options:**
*   `-d, --dir <path>`: The directory to scan (default: `.`)
*   `--depth <n>`: Maximum search depth for `node_modules` (default: `1`)
*   `--json`: Output results in structured JSON format
*   `--ignore <packages>`: Comma-separated list of package names to skip

### 2. Deep Audit
Performs a deep-dive analysis on the actual JavaScript files referenced by installation hooks.

```bash
codevigil audit [options]
```

**Options:**
*   `-d, --dir <path>`: The directory to audit (default: `.`)
*   `--json`: Output results in structured JSON format
*   `--ignore <packages>`: Comma-separated list of package names to skip

---

## 🛡️ CI/CD Pipeline Integration

Ensure malicious dependencies never slip into production by dropping CodeVigil into your GitHub Actions:

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-node: '18'

      - name: Install dependencies
        run: npm install

      - name: Run CodeVigil Scan
        run: npx @ashishksahoo/codevigil scan
```

## 📄 License

MIT
