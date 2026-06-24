import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/scan', label: 'Scan Code' },
    { path: '/report', label: 'Report Scam' },
    { path: '/database', label: 'Database' },
    { path: '/analyze', label: 'Analyze Msg' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] flex items-center justify-between px-4 md:px-10 bg-background/60 backdrop-blur-xl border-b border-white/10 z-50">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white no-underline">
        <Shield className="w-8 h-8 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        <span>Code<span className="text-[#00f0ff]">Vigil</span></span>
      </Link>

      <ul className={`md:flex md:flex-row md:items-center md:static absolute top-[72px] left-0 w-full md:w-auto bg-background/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-b md:border-none border-white/10 flex-col gap-2 p-4 md:p-0 transition-all ${isOpen ? 'flex' : 'hidden'}`}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-[#00f0ff] bg-[#00f0ff]/15 shadow-[0_0_24px_rgba(0,240,255,0.25)]' 
                    : 'text-slate-400 hover:text-white hover:bg-[#00f0ff]/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        <li className="md:ml-auto mt-4 md:mt-0 flex justify-center">
          <Button variant="default" className="bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            Sign In / Register
          </Button>
        </li>
      </ul>

      <button className="md:hidden text-slate-400 p-2" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
}
