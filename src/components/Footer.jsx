import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0e1a] py-10 px-4 mt-auto text-center text-slate-400">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-white text-lg">
          <Shield className="w-6 h-6 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
          <span>Code<span className="text-[#00f0ff]">Vigil</span></span>
        </div>
        
        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <a href="https://github.com/Ashish-Kumar-007/codevigil" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
      <div className="mt-8 text-sm text-slate-500">
        &copy; {new Date().getFullYear()} CodeVigil. Protect your Web3 journey.
      </div>
    </footer>
  );
}
