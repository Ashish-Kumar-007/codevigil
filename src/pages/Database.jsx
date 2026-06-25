import React, { useEffect, useState } from 'react';
import { Search, Database, ThumbsUp, ThumbsDown, ShieldCheck, ExternalLink, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ReportStore, initStore } from '../data/store';
import { SCAM_TYPES } from '../data/seedData';
import { Link } from 'react-router-dom';

function getSeverityStyle(severity) {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
    case 'high': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
    case 'medium': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    default: return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
  }
}

function getTypeInfo(typeId) {
  return SCAM_TYPES.find(t => t.id === typeId) || { label: typeId, icon: '⚡', color: '#8892a8' };
}

function ReportCard({ report, onVote }) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = getTypeInfo(report.type);
  const sevStyle = getSeverityStyle(report.severity);

  return (
    <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl hover:border-white/15 transition-all">
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px] uppercase" style={{ borderColor: typeInfo.color + '40', color: typeInfo.color, backgroundColor: typeInfo.color + '15' }}>
                {typeInfo.icon} {typeInfo.label}
              </Badge>
              <Badge variant="outline" className={`text-[10px] uppercase ${sevStyle.text} ${sevStyle.border} ${sevStyle.bg}`}>
                {report.severity}
              </Badge>
              {report.verified && (
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
            </div>
            <h3 className="text-white font-semibold text-sm leading-snug">{report.title}</h3>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
            {new Date(report.reportedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">{report.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onVote(report.id, 'up')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> {report.upvotes || 0}
            </button>
            <button onClick={() => onVote(report.id, 'down')} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors">
              <ThumbsDown className="w-3.5 h-3.5" /> {report.downvotes || 0}
            </button>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-[#00f0ff] hover:underline flex items-center gap-1">
            {expanded ? 'Hide' : 'Details'}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
            {/* Identifiers */}
            {report.identifiers && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Known Identifiers</p>
                <div className="flex flex-wrap gap-1.5">
                  {report.identifiers.wallets?.map((w, i) => (
                    <code key={`w-${i}`} className="text-[10px] bg-orange-500/10 text-orange-300 px-2 py-0.5 rounded border border-orange-500/20">🔑 {w}</code>
                  ))}
                  {report.identifiers.domains?.map((d, i) => (
                    <code key={`d-${i}`} className="text-[10px] bg-red-500/10 text-red-300 px-2 py-0.5 rounded border border-red-500/20">🌐 {d}</code>
                  ))}
                  {report.identifiers.github?.map((g, i) => (
                    <code key={`g-${i}`} className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">💻 {g}</code>
                  ))}
                  {report.identifiers.social?.map((s, i) => (
                    <code key={`s-${i}`} className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">👤 {s}</code>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            {report.evidence && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Evidence</p>
                <div className="rounded-lg bg-black/40 p-3 overflow-x-auto">
                  <pre className="text-[11px] text-red-300 font-mono whitespace-pre-wrap break-all">{report.evidence}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function DatabasePage() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    initStore();
    setReports(ReportStore.getAll());
  }, []);

  const handleVote = (id, direction) => {
    ReportStore.vote(id, direction);
    setReports(ReportStore.getAll());
  };

  // Filter and search
  const filtered = reports.filter(r => {
    const matchesType = activeFilter === 'all' || r.type === activeFilter;
    if (!matchesType) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const searchable = [r.title, r.description, r.type, r.evidence || '', ...(r.identifiers?.wallets || []), ...(r.identifiers?.domains || [])].join(' ').toLowerCase();
    return searchable.includes(q);
  });

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Scam Database
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            A crowdsourced registry of verified scam reports. Search by wallet address, domain, GitHub repo, or keyword to check if something has been flagged by the community.
          </p>
        </div>
        <Link to="/report">
          <Button className="bg-gradient-to-r from-[#ff2a5f] to-[#ff6b35] text-white font-bold hover:opacity-90 whitespace-nowrap">
            + Report a Scam
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by wallet, domain, keyword..."
              className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/30 text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter('all')}
              className={`text-xs whitespace-nowrap ${activeFilter === 'all' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30' : 'border-white/10 text-slate-400'}`}
            >
              All
            </Button>
            {SCAM_TYPES.map(type => (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter(type.id)}
                className={`text-xs whitespace-nowrap ${activeFilter === type.id ? 'border-[#00f0ff]/30 text-[#00f0ff] bg-[#00f0ff]/10' : 'border-white/10 text-slate-400'}`}
              >
                {type.icon} {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          Showing <span className="text-white font-semibold">{filtered.length}</span> report{filtered.length !== 1 ? 's' : ''}
          {search && <> matching "<span className="text-[#00f0ff]">{search}</span>"</>}
        </p>
      </div>

      {/* Reports Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(report => (
            <ReportCard key={report.id} report={report} onVote={handleVote} />
          ))}
        </div>
      ) : (
        <Card className="bg-[#0a0e1a]/40 border-dashed border-white/10 p-12 text-center">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">No reports found matching your criteria.</p>
          <p className="text-slate-600 text-xs mt-1">Try adjusting your search or filters.</p>
        </Card>
      )}
    </div>
  );
}
