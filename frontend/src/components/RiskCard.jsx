import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, CheckCircle2, ChevronRight, FileSpreadsheet, Scale, ArrowUpRight, Shield } from 'lucide-react';

export default function RiskCard({ riskData, onOpenAudit }) {
  if (!riskData) return null;

  const score = riskData.title_integrity_score;
  const tier = riskData.risk_tier;
  const color = riskData.risk_color;
  const verdict = riskData.verdict;

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
      case 'CRITICAL_LEGAL_VIOLATION':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase font-mono">Critical</span>;
      case 'WARNING':
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase font-mono">Warning</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase font-mono">Notice</span>;
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Scale size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Land Title Integrity & Risk Assessment</h3>
            <p className="text-[11px] text-slate-400">Automated Legal & Spatial Due Diligence</p>
          </div>
        </div>
      </div>

      {/* Score Overview Gauge Banner */}
      <div className="mt-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4 shadow-inner">
        {/* Circular Score Gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800/80"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${score}, 100`}
                stroke={color}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold font-sans leading-none text-white tabular-nums">{score}</span>
              <span className="text-[8px] font-mono text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Risk Assessment Tier</div>
            <div className="text-xs font-bold" style={{ color }}>{tier}</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">{verdict}</div>
          </div>
        </div>

        <button
          onClick={onOpenAudit}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-150 active:scale-95 shadow"
        >
          <span>Audit Sheet</span>
          <ArrowUpRight size={13} className="text-emerald-400" />
        </button>
      </div>

      {/* Discrepancy & Violation Flags */}
      <div className="mt-3.5 flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1">
        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
          <span>Audit Discrepancy Findings ({riskData.flags?.length || 0})</span>
          {riskData.critical_flags_count > 0 && (
            <span className="text-[10px] text-rose-400 font-mono font-semibold">{riskData.critical_flags_count} Critical Violations</span>
          )}
        </div>

        {(!riskData.flags || riskData.flags.length === 0) ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="font-medium">Zero discrepancies detected. Cadastral records, FMB measurements, and title deeds are in complete alignment.</span>
          </div>
        ) : (
          riskData.flags.map((flag, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs shadow-sm transition-all ${
                flag.severity?.includes('CRITICAL')
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-xs">{flag.title}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-medium">-{flag.penalty} pts</span>
                  {getSeverityBadge(flag.severity)}
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{flag.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Actionable Recommendations */}
      <div className="mt-3.5 pt-3 border-t border-slate-800">
        <div className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Info size={13} className="text-emerald-400" />
          <span>Recommended Administrative Action</span>
        </div>
        <ul className="space-y-1 text-[11px] text-slate-300">
          {(riskData.recommendations || []).map((rec, i) => (
            <li key={i} className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-emerald-400 font-bold">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
