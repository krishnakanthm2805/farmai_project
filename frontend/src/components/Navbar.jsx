import React from 'react';
import { Layers, ShieldCheck, MapPin, Sparkles, UploadCloud, FileText, CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, Shield } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenUpload, onOpenAudit, currentRiskTier, currentScore }) {
  const getScoreBadge = () => {
    const scoreVal = currentScore !== undefined ? currentScore : 100;
    
    if (scoreVal >= 80) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-500/20">
          <Shield size={13} className="text-emerald-400 fill-emerald-400/20" />
          <span className="tabular-nums">Title Score: {scoreVal}/100</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      );
    } else if (scoreVal >= 50) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-sm shadow-amber-500/10 ring-1 ring-amber-500/20">
          <AlertTriangle size={13} className="text-amber-400 fill-amber-400/20" />
          <span className="tabular-nums">Title Score: {scoreVal}/100</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold shadow-sm shadow-rose-500/10 ring-1 ring-rose-500/20">
          <AlertOctagon size={13} className="text-rose-400 fill-rose-400/20" />
          <span className="tabular-nums">Title Score: {scoreVal}/100</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
        </div>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Block */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-white/20">
            <Layers className="text-slate-950" size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                FarmAI <span className="text-emerald-400 font-semibold">GeoLand Intelligence</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Task 2 • Cadastral & FMB Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="text-emerald-400">📍</span>
              <span className="font-medium text-slate-300">Perungudi Taluk, Chennai District</span>
            </p>
          </div>
        </div>

        {/* Center Navigation Switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'reconciliation'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles size={13} className={activeTab === 'reconciliation' ? 'text-slate-950' : 'text-emerald-400'} />
            <span>AI Reconciliation</span>
          </button>

          <button
            onClick={() => setActiveTab('cadastral-explorer')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'cadastral-explorer'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers size={13} className={activeTab === 'cadastral-explorer' ? 'text-slate-950' : 'text-cyan-400'} />
            <span>Cadastral GIS Registry</span>
          </button>
        </div>

        {/* Right-side Action Bar */}
        <div className="flex items-center gap-2.5">
          {getScoreBadge()}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 hover:border-emerald-500/50 shadow-sm transition-all duration-150 active:scale-95"
          >
            <UploadCloud size={14} className="text-emerald-400" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={onOpenAudit}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 border border-emerald-400/30 transition-all duration-150 active:scale-95"
          >
            <FileText size={14} />
            <span>Audit Certificate</span>
          </button>
        </div>
      </div>
    </header>
  );
}
