import React from 'react';
import { Scale, AlertTriangle, AlertOctagon, CheckCircle2, FileText, Check } from 'lucide-react';

export default function RiskAssessmentCard({ onOpenAudit, riskData, selectedSurveyNo = '102/3A' }) {
  const score = riskData?.title_integrity_score !== undefined ? riskData.title_integrity_score : 68;
  
  const getTierPill = (s) => {
    if (s >= 80) return <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Clear Title</span>;
    if (s >= 50) return <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">Medium Risk</span>;
    return <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">High Risk</span>;
  };

  const getGaugeColor = (s) => {
    if (s >= 80) return '#059669';
    if (s >= 50) return '#D97706';
    return '#DC2626';
  };

  return (
    <div className="dash-card p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Scale size={14} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Land Analysis & Risk Assessment</h3>
        </div>
      </div>

      {/* Score Gauge & Risk Flags Split */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Left Circular Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center text-center p-2">
          <div className="relative w-20 h-20 flex items-center justify-center mb-1">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${score}, 100`}
                stroke={getGaugeColor(score)}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 leading-none tabular-nums">{score}</span>
              <span className="text-[9px] font-bold text-slate-400">/100</span>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-800">Title Integrity Score</div>
          <div className="mt-1">{getTierPill(score)}</div>
        </div>

        {/* Right Risk Flags List */}
        <div className="sm:col-span-7 space-y-1.5 text-[11px] font-medium text-slate-700">
          <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
            <span>+ Risk Flags</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-rose-500 font-bold">▲</span>
            <span className="text-slate-700">0.03 Ac area mismatch</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <AlertTriangle size={13} className="text-amber-500 shrink-0" />
            <span className="text-slate-700">Partially within 10m road buffer</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-blue-500 font-bold">🌊</span>
            <span className="text-slate-700">Close to water body (120m)</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="text-slate-700">Document owner matches GIS owner</span>
          </div>
        </div>
      </div>

      {/* Key Findings Checklist */}
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
        <div className="font-bold text-slate-800 text-xs mb-1">Key Findings</div>
        <div className="flex items-start gap-1.5">
          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>Documented area (2.48 Ac) vs GIS area (2.45 Ac) — 0.03 Ac difference.</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>Parcel is within 10m road buffer zone (partial overlap).</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>No encroachment on water body (beyond 120m).</span>
        </div>
        <div className="flex items-start gap-1.5">
          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>Survey number and owner details match across documents.</span>
        </div>
      </div>

      {/* Big Action Button */}
      <button
        onClick={onOpenAudit}
        className="mt-3.5 w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
      >
        <FileText size={15} />
        <span>Generate Audit Certificate</span>
      </button>
    </div>
  );
}
