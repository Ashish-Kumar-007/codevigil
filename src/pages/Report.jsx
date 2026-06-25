import React, { useState } from 'react';
import { AlertTriangle, Send, Loader2, CheckCircle2, Plus, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ReportStore } from '../data/store';
import { SCAM_TYPES } from '../data/seedData';
import { useNavigate } from 'react-router-dom';

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  { value: 'high', label: 'High', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
  { value: 'low', label: 'Low', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
];

function TagInput({ tags, setTags, placeholder, color }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={placeholder}
          className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 text-sm transition-colors"
        />
        <Button type="button" onClick={addTag} variant="outline" size="sm" className="border-white/10 text-slate-400 hover:bg-white/5">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <Badge key={i} variant="outline" className={`text-[10px] ${color} flex items-center gap-1`}>
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    type: '',
    severity: '',
    title: '',
    description: '',
    evidence: '',
    wallets: [],
    domains: [],
    github: [],
    social: [],
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const isValid = form.type && form.severity && form.title.trim() && form.description.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    setTimeout(() => {
      ReportStore.add({
        type: form.type,
        severity: form.severity,
        title: form.title.trim(),
        description: form.description.trim(),
        evidence: form.evidence.trim(),
        identifiers: {
          wallets: form.wallets,
          domains: form.domains,
          github: form.github,
          social: form.social,
        },
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[#0a0e1a]/80 border-emerald-500/30 backdrop-blur-xl p-12 text-center max-w-md shadow-[0_0_40px_rgba(0,250,136,0.1)]">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Report Submitted!</h2>
          <p className="text-sm text-slate-400 mb-6">
            Thank you for helping protect the Web3 community. Your report has been added to the public registry and will be reviewed by community validators.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/database')} className="bg-gradient-to-r from-[#00f0ff] to-[#00c4ff] text-black font-bold">
              View Database
            </Button>
            <Button onClick={() => { setSubmitted(false); setForm({ type: '', severity: '', title: '', description: '', evidence: '', wallets: [], domains: [], github: [], social: [] }); }} variant="outline" className="border-white/20 text-slate-400">
              Submit Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Report a Scam
        </h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Contribute to the community's safety by reporting scams, phishing sites, malicious packages, and wallet drainers. All reports are publicly accessible to help protect others.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6 space-y-5">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Report Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Fake Binance recruiter stealing SSH keys via npm package"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe how the scam works, how you encountered it, and what it does..."
                  rows={5}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 resize-none text-sm leading-relaxed transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Evidence / Code Snippet</label>
                <textarea
                  value={form.evidence}
                  onChange={(e) => updateField('evidence', e.target.value)}
                  placeholder="Paste the malicious code, suspicious URL, or other evidence..."
                  rows={4}
                  spellCheck={false}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-[#00fa88] placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 resize-none text-sm leading-relaxed transition-colors font-mono"
                />
              </div>
            </Card>

            {/* Identifiers */}
            <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6 space-y-5">
              <h3 className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Known Identifiers</h3>
              <p className="text-xs text-slate-600 -mt-3">Add wallet addresses, domains, GitHub repos, or social handles associated with this scam.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">🔑 Wallet Addresses</label>
                  <TagInput tags={form.wallets} setTags={(v) => updateField('wallets', v)} placeholder="0x..." color="text-orange-300 border-orange-500/20 bg-orange-500/10" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">🌐 Domains</label>
                  <TagInput tags={form.domains} setTags={(v) => updateField('domains', v)} placeholder="evil-site.com" color="text-red-300 border-red-500/20 bg-red-500/10" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">💻 GitHub Repos</label>
                  <TagInput tags={form.github} setTags={(v) => updateField('github', v)} placeholder="github.com/user/repo" color="text-purple-300 border-purple-500/20 bg-purple-500/10" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">👤 Social Handles</label>
                  <TagInput tags={form.social} setTags={(v) => updateField('social', v)} placeholder="@handle or Discord#1234" color="text-blue-300 border-blue-500/20 bg-blue-500/10" />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Scam Type */}
            <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Scam Type *</h3>
              <div className="space-y-2">
                {SCAM_TYPES.map(type => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => updateField('type', type.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${form.type === type.id
                      ? 'border-[#00f0ff]/40 bg-[#00f0ff]/10 text-white'
                      : 'border-white/5 bg-transparent text-slate-400 hover:bg-white/[0.02] hover:border-white/10'
                    }`}
                  >
                    <span>{type.icon}</span> {type.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Severity */}
            <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Severity *</h3>
              <div className="grid grid-cols-2 gap-2">
                {SEVERITY_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateField('severity', opt.value)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold uppercase transition-all ${form.severity === opt.value
                      ? opt.color
                      : 'border-white/5 text-slate-500 hover:bg-white/[0.02]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-gradient-to-r from-[#ff2a5f] to-[#ff6b35] text-white font-bold hover:opacity-90 disabled:opacity-40 h-12 text-base"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Submit Report</>
              )}
            </Button>

            {/* Warning */}
            <Card className="bg-yellow-500/5 border-yellow-500/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-yellow-400">Important:</strong> Do not include your own private keys, mnemonic phrases, or passwords in reports. All submissions are publicly visible.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
