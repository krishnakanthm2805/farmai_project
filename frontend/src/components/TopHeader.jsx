import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopHeader({ searchTerm, setSearchTerm }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">
          GeoLand Intelligence
        </h2>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Survey No, Patta No, Owner Name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>
      </div>

      {/* Right Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            KM
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">Krishnakanth M</div>
            <div className="text-[11px] text-slate-400">Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
}
