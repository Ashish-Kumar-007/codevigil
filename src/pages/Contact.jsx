import React, { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle2, MessageSquare, MapPin } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const isValid = form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[#0a0e1a]/80 border-emerald-500/30 backdrop-blur-xl p-12 text-center max-w-md shadow-[0_0_40px_rgba(0,250,136,0.1)]">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Message Sent!</h2>
          <p className="text-sm text-slate-400 mb-6">
            Thanks for reaching out to the CodeVigil team. We've received your message and will get back to you within 24-48 hours.
          </p>
          <Button 
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} 
            className="bg-gradient-to-r from-[#00f0ff] to-[#00c4ff] text-black font-bold"
          >
            Send Another Message
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Write to Us
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Have a question about our security tools, want to report a critical vulnerability, or interested in partnering? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Contact Info Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00f0ff]/10 flex items-center justify-center flex-shrink-0 border border-[#00f0ff]/20">
                  <Mail className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Email</p>
                  <p className="text-sm text-slate-400">security@codevigil.xyz</p>
                  <p className="text-sm text-slate-400">support@codevigil.xyz</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ffaa00]/10 flex items-center justify-center flex-shrink-0 border border-[#ffaa00]/20">
                  <MessageSquare className="w-5 h-5 text-[#ffaa00]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Community</p>
                  <p className="text-sm text-slate-400">Discord: discord.gg/codevigil</p>
                  <p className="text-sm text-slate-400">Twitter: @CodeVigilApp</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#ff2a5f]/10 flex items-center justify-center flex-shrink-0 border border-[#ff2a5f]/20">
                  <MapPin className="w-5 h-5 text-[#ff2a5f]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Global HQ</p>
                  <p className="text-sm text-slate-400">Decentralized Web</p>
                  <p className="text-sm text-slate-400">Operating Worldwide</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="How can we help?"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 resize-none text-sm leading-relaxed transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full bg-gradient-to-r from-[#00f0ff] to-[#00c4ff] text-black font-bold hover:opacity-90 disabled:opacity-40 h-12 text-base"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Send Message</>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
