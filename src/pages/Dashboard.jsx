import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, FileCode2, Users, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { StatsStore, ReportStore, ScanHistoryStore, initStore } from '../data/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalScans: 0, threatsDetected: 0, reportsSubmitted: 0, communityMembers: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    initStore();
    setStats(StatsStore.get());
    setRecentReports(ReportStore.getAll().slice(0, 5));
    setRecentScans(ScanHistoryStore.getAll().slice(0, 5));
  }, []);

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Welcome back to CodeVigil.
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-[#00fa88] animate-pulse"></span>
          System Secure • Active Monitoring Enabled
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl hover:border-[#00f0ff]/50 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Scans</CardTitle>
            <FileCode2 className="h-4 w-4 text-[#00f0ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalScans.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl hover:border-[#00fa88]/50 transition-all hover:shadow-[0_0_20px_rgba(0,250,136,0.15)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Threats Prevented</CardTitle>
            <ShieldCheck className="h-4 w-4 text-[#00fa88]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.threatsDetected.toLocaleString()}</div>
            <p className="text-xs text-[#00fa88]/70 mt-1">Saved ~$4.2M in assets</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl hover:border-[#ff2a5f]/50 transition-all hover:shadow-[0_0_20px_rgba(255,42,95,0.15)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Community Reports</CardTitle>
            <ShieldAlert className="h-4 w-4 text-[#ff2a5f]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.reportsSubmitted.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Crowdsourced intelligence</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl hover:border-[#b366ff]/50 transition-all hover:shadow-[0_0_20px_rgba(179,102,255,0.15)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Defenders</CardTitle>
            <Users className="h-4 w-4 text-[#b366ff]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.communityMembers.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Online globally</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="bg-transparent border-none shadow-none">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Community Reports</h2>
              <Link to="/database" className="text-sm text-[#00f0ff] hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentReports.length > 0 ? (
                recentReports.map(report => (
                  <div key={report.id} className="p-4 rounded-lg bg-[#0a0e1a]/60 border border-white/5 hover:border-white/10 transition-colors flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={
                          report.type === 'wallet_drainer' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          report.type === 'fake_job' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }>
                          {report.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-white font-medium">{report.title}</span>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-1">{report.description}</p>
                    </div>
                    <div className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic p-4 text-center border border-dashed border-white/10 rounded-lg">No recent reports.</div>
              )}
            </div>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="bg-[#0a0e1a] border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button onClick={() => navigate('/scan')} className="w-full justify-start bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30">
                <FileCode2 className="w-4 h-4 mr-2" /> Scan Snippet
              </Button>
              <Button onClick={() => navigate('/analyze')} className="w-full justify-start bg-[#ffaa00]/10 hover:bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]/30">
                <Activity className="w-4 h-4 mr-2" /> Analyze Message
              </Button>
              <Button onClick={() => navigate('/report')} className="w-full justify-start bg-[#ff2a5f]/10 hover:bg-[#ff2a5f]/20 text-[#ff2a5f] border border-[#ff2a5f]/30">
                <AlertTriangle className="w-4 h-4 mr-2" /> Report a Scam
              </Button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#0a0e1a] to-[#0f172a] border-white/10 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert className="w-24 h-24 text-[#00f0ff]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Protect Your Workspace</h3>
            <p className="text-sm text-slate-400 mb-4 relative z-10">Install our CLI tool to automatically scan your npm dependencies before they execute post-install scripts.</p>
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 relative z-10">
              Coming Soon
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
