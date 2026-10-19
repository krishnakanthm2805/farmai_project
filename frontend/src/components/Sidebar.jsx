import React from 'react';
import { 
  Home, 
  Map, 
  FileText, 
  Database, 
  BarChart3, 
  Award, 
  Settings, 
  Sprout, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

export default function Sidebar({ activeNav, setActiveNav, documentCount = 2, onOpenAudit }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'map', label: 'Map Viewer', icon: Map },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documentCount },
    { id: 'land_records', label: 'Land Records', icon: Database },
    { id: 'analysis', label: 'Analysis & Reports', icon: BarChart3 },
    { id: 'certificate', label: 'Audit Certificate', icon: Award, isAction: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B1512] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-[#152B24] select-none">
      <div>
        {/* Brand Logo & Name */}
        <div className="p-6 pb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950">
            <Sprout size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1 font-sans">
              Farm<span className="text-emerald-400">AI</span>
            </h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isAction) {
                    if (onOpenAudit) onOpenAudit();
                  } else {
                    setActiveNav(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#153B2F] text-white font-semibold shadow-inner border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#12251F]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Illustration & Tagline */}
      <div className="p-6 text-center border-t border-[#152B24]">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#122720] border border-emerald-500/20 flex items-center justify-center text-emerald-400/80 mb-3 shadow-inner">
          <svg className="w-10 h-10 text-emerald-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
            <path d="M4 22v-2a6 6 0 0 1 12 0v2" />
            <path d="M18 14l2 2 4-4" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-300 tracking-wide">
          Secure Lands
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Stronger Futures
        </p>
      </div>
    </aside>
  );
}
