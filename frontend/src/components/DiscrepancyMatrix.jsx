import React from 'react';
import { GitCompare, CheckCircle2, AlertTriangle, AlertOctagon, Ruler, Compass, UserCheck, Check } from 'lucide-react';

export default function DiscrepancyMatrix({ reconciliationData }) {
  if (!reconciliationData || reconciliationData.status !== 'RECONCILED') {
    return (
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md text-center shadow-xl">
        <GitCompare size={36} className="text-slate-600 mx-auto mb-2" />
        <p className="text-xs text-slate-400">Reconciliation data not available</p>
      </div>
    );
  }

  const doc = reconciliationData.document_claimed;
  const cad = reconciliationData.cadastral_parcel;
  const fmb = reconciliationData.fmb_measured;
  const disc = reconciliationData.discrepancies;

  const areaDiffAcres = disc.area_reconciliation?.doc_vs_cadastral_diff_acres;
  const areaDiffPct = disc.area_reconciliation?.doc_vs_cadastral_percent;
  const areaStatus = disc.area_reconciliation?.status;

  const getAreaBadge = () => {
    if (areaStatus === 'VERIFIED_ACCURATE') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
          <CheckCircle2 size={12} /> Match (&lt;2% variance)
        </span>
      );
    } else if (areaStatus === 'MINOR_DEVIATION') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
          <AlertTriangle size={12} /> Minor Deviation ({areaDiffPct}%)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
          <AlertOctagon size={12} /> Severe Mismatch ({areaDiffPct}%)
        </span>
      );
    }
  };

  const getBoundaryBadge = (status) => {
    if (status === 'MATCH') {
      return <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">VERIFIED</span>;
    }
    return <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold">DIVERGENCE</span>;
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <GitCompare size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">3-Way Discrepancy & Verification Matrix</h3>
            <p className="text-[11px] text-slate-400">Cross-Audit: Document Claims vs Cadastral GIS vs FMB Survey</p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
          Tolerance: &lt;2.0% Margin
        </span>
      </div>

      {/* Main 3-Way Comparative Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-medium bg-slate-900/90">
              <th className="py-3 px-3.5">Verification Parameter</th>
              <th className="py-3 px-3.5 text-emerald-400">1. Document Extracted</th>
              <th className="py-3 px-3.5 text-blue-400">2. Cadastral GIS Layer</th>
              <th className="py-3 px-3.5 text-cyan-400">3. FMB Field Survey</th>
              <th className="py-3 px-3.5 text-right">Reconciliation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {/* Row 1: Total Extent / Area */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3.5 font-sans font-semibold text-slate-200 flex items-center gap-1.5">
                <Ruler size={13} className="text-emerald-400 shrink-0" />
                <span>Parcel Extent (Area)</span>
              </td>
              <td className="py-3 px-3.5 font-bold text-emerald-300 tabular-nums">
                {doc.area_acres} Acres <span className="text-slate-500 font-normal text-[10px]">({doc.area_sqm} m²)</span>
              </td>
              <td className="py-3 px-3.5 font-bold text-blue-300 tabular-nums">
                {cad.gis_area_acres} Acres <span className="text-slate-500 font-normal text-[10px]">({cad.gis_area_sqm} m²)</span>
              </td>
              <td className="py-3 px-3.5 font-bold text-cyan-300 tabular-nums">
                {fmb.area_acres} Acres <span className="text-slate-500 font-normal text-[10px]">({fmb.area_sqm} m²)</span>
              </td>
              <td className="py-3 px-3.5 text-right font-sans">
                {getAreaBadge()}
              </td>
            </tr>

            {/* Row 2: Survey Reference */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3.5 font-sans font-semibold text-slate-200">
                <span>Survey & Sub-division</span>
              </td>
              <td className="py-3 px-3.5 text-slate-300 font-bold">Survey #{reconciliationData.survey_no}</td>
              <td className="py-3 px-3.5 text-slate-300 font-bold">Survey #{cad.survey_no}</td>
              <td className="py-3 px-3.5 text-slate-300">Sheet #{fmb.fmb_sheet_no || 'FMB-REF'}</td>
              <td className="py-3 px-3.5 text-right font-sans">
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <Check size={11} /> MATCHED
                </span>
              </td>
            </tr>

            {/* Row 3: Registered Owner */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3.5 font-sans font-semibold text-slate-200 flex items-center gap-1.5">
                <UserCheck size={13} className="text-emerald-400 shrink-0" />
                <span>Title / Ownership Record</span>
              </td>
              <td className="py-3 px-3.5 text-slate-300 font-sans font-medium">{(doc.owners || []).join(', ')}</td>
              <td className="py-3 px-3.5 text-slate-300 font-sans font-medium">{cad.registered_owner}</td>
              <td className="py-3 px-3.5 text-slate-400 font-sans text-xs">Surveyor: {fmb.surveyor_id || 'TN-SURV'}</td>
              <td className="py-3 px-3.5 text-right font-sans">
                {disc.ownership_reconciliation?.is_match ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <Check size={11} /> VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    <AlertTriangle size={11} /> DIVERGENT
                  </span>
                )}
              </td>
            </tr>

            {/* Row 4: Land Classification */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-3 px-3.5 font-sans font-semibold text-slate-200">
                <span>Land Classification</span>
              </td>
              <td className="py-3 px-3.5 text-slate-300 font-sans">{doc.land_classification}</td>
              <td className="py-3 px-3.5 text-slate-300 font-sans">{cad.land_classification}</td>
              <td className="py-3 px-3.5 text-slate-400 font-sans">Ryotwari Standard</td>
              <td className="py-3 px-3.5 text-right font-sans">
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  <Check size={11} /> VERIFIED
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Boundary Neighbor Cross-Verification Card */}
      <div className="mt-3.5 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
          <Compass size={13} className="text-emerald-400" />
          <span>Topological Boundary Adjacency Audit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          {Object.entries(disc.boundary_reconciliation || {}).map(([dir, info]) => (
            <div key={dir} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/90 shadow-inner">
              <div className="flex items-center justify-between mb-1.5">
                <span className="capitalize font-bold text-slate-200">{dir}</span>
                {getBoundaryBadge(info.status)}
              </div>
              <div className="text-[11px] text-slate-400 truncate">Doc: <span className="font-semibold text-slate-200">{info.documented}</span></div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">GIS: <span className="font-semibold text-slate-200">{info.cadastral_actual}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
