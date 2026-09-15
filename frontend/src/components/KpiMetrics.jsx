import React from 'react';
import { FileText, CheckCircle2, AlertTriangle, AlertOctagon, Sprout, MapPin, Calendar } from 'lucide-react';

export default function KpiMetrics({ 
  totalRecords = 247, 
  matchedRecords = 189, 
  discrepanciesCount = 42, 
  highRiskCount = 16 
}) {
  return (
    <div className="space-y-4">
      {/* Dashboard Title & Location / Timestamp Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <Sprout size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Land Intelligence Dashboard
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verify. Compare. Detect. Protect.
            </p>
          </div>
        </div>

        {/* Location & Time Pills */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm">
            <MapPin size={13} className="text-emerald-600" />
            <span>Madurai, Tamil Nadu</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm font-mono text-[11px]">
            <Calendar size={13} className="text-slate-500" />
            <span>15 Sep 2026, 10:24 AM</span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Land Records */}
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Land Records</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalRecords}</div>
          </div>
        </div>

        {/* Card 2: Matched Records */}
        <div className="dash-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Matched Records</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{matchedRecords}</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            76.5%
          </span>
        </div>

        {/* Card 3: Discrepancies Found */}
        <div className="dash-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Discrepancies Found</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{discrepanciesCount}</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
            17.0%
          </span>
        </div>

        {/* Card 4: High Risk Cases */}
        <div className="dash-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertOctagon size={22} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">High Risk Cases</div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{highRiskCount}</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
            6.5%
          </span>
        </div>
      </div>
    </div>
  );
}
