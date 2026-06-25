import React, { useState } from 'react';
import { MessageSquareWarning, ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Sparkles, Send, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { analyzeMessage } from '../engine/messageAnalyzer';
import { MessageHistoryStore } from '../data/store';

const EXAMPLE_MESSAGES = [
  {
    label: 'Fake Job Offer',
    text: `Hi! I'm from Binance HR team. We saw your GitHub profile and are very impressed. We have an urgent remote position for a Senior Developer paying $15,000/month. Please download and run our coding assessment from this link: https://bit.ly/binance-test-app. You need to complete it within 24 hours or the position will be filled. Send your Telegram handle so we can continue privately.`,
  },
  {
    label: 'Collab Scam',
    text: `Hey bro, I really love your work! I'm a game developer and would love to collaborate with you. Can you download my game from https://drive.google.com/sketchy-link and test it? Just run the .exe file and let me know what you think. It would mean a lot to me! DM me on Discord: shadydev#1234`,
  },
  {
    label: 'Investment Scam',
    text: `🚀 EXCLUSIVE OPPORTUNITY: Our AI-powered trading bot generated 500% returns last month! We're only accepting 10 more members. Send 0.5 ETH to our smart contract to lock in your spot. This offer expires in 2 hours. Don't miss out! Your investment is 100% guaranteed to double within 48 hours. Act now before it's too late!`,
  },
];

function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-[0_0_30px_rgba(255,42,95,0.2)]', bar: 'bg-red-500' };
    case 'high': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-[0_0_30px_rgba(255,165,0,0.2)]', bar: 'bg-orange-500' };
    case 'medium': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-[0_0_30px_rgba(255,255,0,0.15)]', bar: 'bg-yellow-500' };
    case 'low': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', glow: '', bar: 'bg-blue-500' };
    default: return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_30px_rgba(0,250,136,0.15)]', bar: 'bg-emerald-500' };
  }
}

export default function AnalyzePage() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!message.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    // Simulate a brief scanning delay for UX
    setTimeout(() => {
      const analysis = analyzeMessage(message);
      setResult(analysis);
      setIsAnalyzing(false);

      // Save to history
      try {
        MessageHistoryStore.add({
          text: message.slice(0, 200),
          score: analysis.score,
          riskLevel: analysis.riskLevel,
          flagCount: analysis.flags.length,
        });
      } catch (e) {
        // Silently fail if store isn't initialized
      }
    }, 1200);
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
  };

  const colors = result ? getSeverityColor(result.severity) : null;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Message Analyzer
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Paste any suspicious DM, email, or Discord message below. Our heuristic engine will scan for social engineering red flags, phishing attempts, and common scam patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a suspicious message here..."
              rows={10}
              className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 resize-none text-sm leading-relaxed transition-colors"
            />
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleAnalyze}
                disabled={!message.trim() || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#00c4ff] text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {isAnalyzing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Analyze Message</>
                )}
              </Button>
              <Button onClick={handleClear} variant="outline" className="border-white/20 text-slate-400 hover:bg-white/5">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Example Messages */}
          <Card className="bg-transparent border-none shadow-none">
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_MESSAGES.map((ex, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => { setMessage(ex.text); setResult(null); }}
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
          {!result && !isAnalyzing && (
            <Card className="bg-[#0a0e1a]/40 border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
              <MessageSquareWarning className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-500 text-sm">Paste a message and hit <span className="text-[#00f0ff]">Analyze</span> to see the results here.</p>
            </Card>
          )}

          {isAnalyzing && (
            <Card className="bg-[#0a0e1a]/60 border-white/10 p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Loader2 className="w-10 h-10 text-[#00f0ff] animate-spin mb-4" />
              <p className="text-slate-400 text-sm animate-pulse">Running heuristic analysis...</p>
            </Card>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-4">
              {/* Score Card */}
              <Card className={`bg-[#0a0e1a]/80 border backdrop-blur-xl p-6 ${colors.border} ${colors.glow} transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.severity === 'critical' || result.severity === 'high' ? (
                      <ShieldAlert className={`w-8 h-8 ${colors.text}`} />
                    ) : result.severity === 'medium' || result.severity === 'low' ? (
                      <AlertTriangle className={`w-8 h-8 ${colors.text}`} />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    )}
                    <div>
                      <p className={`text-lg font-black ${colors.text}`}>{result.riskLevel}</p>
                      <p className="text-xs text-slate-500">Threat Score</p>
                    </div>
                  </div>
                  <div className={`text-4xl font-black ${colors.text}`}>
                    {result.score}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>

                <p className="text-sm text-slate-400 mt-4 leading-relaxed">{result.summary}</p>
              </Card>

              {/* Red Flags */}
              {result.flags.length > 0 && (
                <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">
                    Detected Red Flags ({result.flags.length})
                  </h3>
                  <div className="space-y-3">
                    {result.flags.map((flag, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-white font-medium text-sm flex items-center gap-2">
                            <span>{flag.icon}</span> {flag.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-white/5 text-slate-400 border-white/10">
                            {flag.matchCount} match{flag.matchCount > 1 ? 'es' : ''}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{flag.description}</p>
                        {flag.matchedTexts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {flag.matchedTexts.map((m, j) => (
                              <code key={j} className="text-[10px] bg-red-500/10 text-red-300 px-1.5 py-0.5 rounded border border-red-500/20 break-all">
                                {m.length > 60 ? m.slice(0, 60) + '…' : m}
                              </code>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-[#00f0ff]/70 italic">💡 {flag.advice}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
                  <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                        <span className="text-lg">{rec.icon}</span>
                        <p className="text-sm text-slate-300">{rec.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
