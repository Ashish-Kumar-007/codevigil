import React from 'react';
import { Terminal, Shield, Package, GitBranch, TerminalSquare, Server } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function DocsPage() {
  return (
    <div className="py-8 space-y-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-[#00f0ff] to-[#00fa88] bg-clip-text text-transparent">
          CodeVigil CLI Documentation
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          The ultimate defense against supply chain attacks. Run our scanner in your terminal or CI/CD pipeline to catch malicious dependencies before they execute.
        </p>
      </div>

      {/* How it Protects You */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#00f0ff]" />
          How it Protects Your Workspace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#0a0e1a]/80 border-white/10 p-6 backdrop-blur-xl">
            <TerminalSquare className="w-8 h-8 text-[#00f0ff] mb-4" />
            <h3 className="text-white font-bold mb-2">Install Script Analysis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatically intercepts and analyzes `preinstall` and `postinstall` hooks in your dependencies. Flags scripts attempting to download remote payloads, access hidden files, or execute unauthorized commands.
            </p>
          </Card>
          <Card className="bg-[#0a0e1a]/80 border-white/10 p-6 backdrop-blur-xl">
            <Package className="w-8 h-8 text-[#00fa88] mb-4" />
            <h3 className="text-white font-bold mb-2">Typosquatting Defense</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Identifies dependencies with names suspiciously similar to popular libraries (e.g., `lodas` instead of `lodash`). Protects developers from accidentally installing malicious clones.
            </p>
          </Card>
          <Card className="bg-[#0a0e1a]/80 border-white/10 p-6 backdrop-blur-xl">
            <Server className="w-8 h-8 text-[#ff2a5f] mb-4" />
            <h3 className="text-white font-bold mb-2">Deep Exfiltration Checks</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects attempts to access your `.ssh` keys, cryptocurrency wallets, environment variables, or attempts to send your local data to external Discord webhooks and Telegram APIs.
            </p>
          </Card>
        </div>
      </section>

      {/* Installation & Usage */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-[#00f0ff]" />
          Quick Start Guide
        </h2>
        <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl overflow-hidden">
          <div className="border-b border-white/10 bg-black/40 px-4 py-3 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="p-6 space-y-6 font-mono text-sm">
            <div>
              <p className="text-slate-500 mb-2 font-sans text-xs uppercase tracking-wider font-bold">1. Run a Quick Scan (No installation required)</p>
              <code className="text-[#00fa88]">npx codevigil scan</code>
              <p className="text-slate-400 mt-2 text-xs">Scans all installed packages in your node_modules for malicious install hooks and structural warnings.</p>
            </div>
            
            <div className="h-px bg-white/10"></div>
            
            <div>
              <p className="text-slate-500 mb-2 font-sans text-xs uppercase tracking-wider font-bold">2. Run a Deep Audit</p>
              <code className="text-[#00fa88]">npx codevigil audit</code>
              <p className="text-slate-400 mt-2 text-xs">Performs a deep heuristic scan on the actual JavaScript files referenced by any install scripts.</p>
            </div>
          </div>
        </Card>
      </section>

      {/* CI/CD Integration */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-[#00f0ff]" />
          Continuous Integration (CI/CD)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Integrate CodeVigil directly into your GitHub Actions, GitLab CI, or Jenkins pipelines. The CLI supports a <Badge variant="outline" className="text-[#00f0ff] border-[#00f0ff]/30">--json</Badge> flag for machine-readable output.
            </p>
            <p className="text-slate-400 leading-relaxed">
              If CodeVigil detects any High or Critical severity threats, it automatically exits with a non-zero status code (`exit 1`), failing your build and preventing malicious code from reaching production.
            </p>
          </div>
          
          <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6 font-mono text-xs">
            <p className="text-slate-500 mb-3"># Example GitHub Actions Workflow</p>
            <div className="text-slate-300 space-y-1">
              <p><span className="text-purple-400">name:</span> Security Audit</p>
              <p><span className="text-purple-400">on:</span> [push, pull_request]</p>
              <br/>
              <p><span className="text-purple-400">jobs:</span></p>
              <p className="pl-4"><span className="text-blue-400">scan:</span></p>
              <p className="pl-8"><span className="text-purple-400">runs-on:</span> ubuntu-latest</p>
              <p className="pl-8"><span className="text-purple-400">steps:</span></p>
              <p className="pl-12">- <span className="text-blue-400">uses:</span> actions/checkout@v4</p>
              <p className="pl-12">- <span className="text-blue-400">name:</span> Install dependencies</p>
              <p className="pl-14"><span className="text-purple-400">run:</span> npm ci --ignore-scripts</p>
              <p className="pl-12">- <span className="text-blue-400">name:</span> Run CodeVigil Scanner</p>
              <p className="pl-14"><span className="text-purple-400">run:</span> npx codevigil scan</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
