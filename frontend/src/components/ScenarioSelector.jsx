import React from 'react';
import { Compass, ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, FileCheck } from 'lucide-react';

export default function ScenarioSelector({ samples, selectedSampleId, onSelectSample, isLoading }) {
  const getBadgeForTag = (tag) => {
    switch (tag) {
      case 'VERIFIED_CLEAN':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Clean Title</span>;
      case 'AREA_DISCREPANCY':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Area Mismatch</span>;
      case 'WATERBODY_ENCROACHMENT':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">Water Encroachment</span>;
      case 'ROAD_ROW_ENCROACHMENT':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">Road RoW Violation</span>;
      case 'FMB_BOUNDARY_MISMATCH':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">FMB Skew</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">Test Case</span>;
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-md shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass size={14} />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Benchmark Challenge Scenarios (Task 2 Test Suite)</h2>
        </div>
        <span className="text-[11px] text-slate-400">Select any pre-configured land parcel scenario to run automated reconciliation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {samples.map((s) => {
          const isSelected = selectedSampleId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectSample(s.id)}
              disabled={isLoading}
              className={`text-left p-3.5 rounded-xl transition-all duration-200 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-850/90 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40 translate-y-[-1px]'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono text-xs font-bold text-white">Survey #{s.survey_no}</span>
                  {getBadgeForTag(s.scenario_tag)}
                </div>
                <p className="text-xs font-medium text-slate-300 line-clamp-1">{s.title.split(' - ')[1] || s.title}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="tabular-nums font-semibold text-slate-300">{s.documented_area?.acres || '1.20'} Acres</span>
                <span className="text-emerald-400">Patta: {s.patta_no}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
