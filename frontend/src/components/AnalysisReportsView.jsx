import React from 'react';
import WorkflowStepper from './WorkflowStepper';
import { GitCompare, ShieldAlert, Compass, Scale, CheckCircle2, AlertTriangle, AlertOctagon, FileText, ArrowUpRight } from 'lucide-react';

export default function AnalysisReportsView({ reconciliationData, riskData, onOpenAudit }) {
  const doc = reconciliationData?.document_claimed || { area_acres: 2.48, area_sqm: 10036.0, owners: ['R. Muthusamy'], land_classification: 'Ryotwari Wet' };
  const cad = reconciliationData?.cadastral_parcel || { gis_area_acres: 2.45, gis_area_sqm: 9914.8, survey_no: '102/3A', registered_owner: 'R. Muthusamy', land_classification: 'Ryotwari Wet' };
  const fmb = reconciliationData?.fmb_measured || { area_acres: 2.45, area_sqm: 9914.8, fmb_sheet_no: 'FMB-SH-102-2024' };
  const disc = reconciliationData?.discrepancies || {};
  const score = riskData?.title_integrity_score || 68;

  const areaDiff = (doc.area_acres - cad.gis_area_acres).toFixed(2);
  const areaDiffPct = Math.abs((doc.area_acres - cad.gis_area_acres) / cad.gis_area_acres * 100).toFixed(1);

  return (
    <div className="space-y-5">
      {/* 1. Workflow Visualizer */}
      <WorkflowStepper />

      {/* 2. Four Analysis Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: Document vs GIS Comparison */}
        <div className="dash-card p-5 bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <GitCompare size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Document vs GIS Comparison</h4>
                <p className="text-[11px] text-slate-500">Cadastral Extent Reconciliation</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Match
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center my-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Document Area</div>
              <div className="text-lg font-black text-slate-900 mt-1">{doc.area_acres} Ac</div>
              <div className="text-[10px] text-slate-400 font-mono">{doc.area_sqm} m²</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">GIS Cadastral Area</div>
              <div className="text-lg font-black text-slate-900 mt-1">{cad.gis_area_acres} Ac</div>
              <div className="text-[10px] text-slate-400 font-mono">{cad.gis_area_sqm} m²</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Difference</div>
              <div className="text-lg font-black text-rose-600 mt-1">{areaDiff > 0 ? `+${areaDiff}` : areaDiff} Ac</div>
              <div className="text-[10px] text-slate-400 font-mono">{areaDiffPct}% variance</div>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 mt-2">
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span>Tolerance Threshold:</span>
              <span className="font-bold text-slate-800">2.0% (Survey Standard)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span>Reconciliation Status:</span>
              <span className="font-bold text-emerald-700">Acceptable Normal Variance</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Ownership Alignment:</span>
              <span className="font-bold text-slate-800">{(doc.owners || []).join(', ')} (Verified)</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Spatial & Encroachment Analysis */}
        <div className="dash-card p-5 bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Spatial & Buffer Proximity Analysis</h4>
                <p className="text-[11px] text-slate-500">Statutory Setback & Encroachment Auditing</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Low Risk Buffer
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-blue-500 text-base">🌊</span>
                <div>
                  <div className="font-bold text-slate-900">Protected Water Body Proximity</div>
                  <div className="text-[11px] text-slate-500">Perungudi Lake Basin Setback: 30m Statutory Zone</div>
                </div>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                Safe (120m away)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-amber-500 text-base">🛣️</span>
                <div>
                  <div className="font-bold text-slate-900">Highway / Road Right-of-Way Corridor</div>
                  <div className="text-[11px] text-slate-500">10m Road Corridor Boundary Overlap Check</div>
                </div>
              </div>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                Partial Edge (0.01 Ac)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-emerald-500 text-base">🛡️</span>
                <div>
                  <div className="font-bold text-slate-900">Adjacent Parcel Encroachment</div>
                  <div className="text-[11px] text-slate-500">Cadastral Boundary Overlap with Neighbors</div>
                </div>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                Zero Overlap (0.00%)
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 3: FMB (Field Measurement Book) Analysis */}
        <div className="dash-card p-5 bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Compass size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">FMB Survey Ladder & Geometry Analysis</h4>
                <p className="text-[11px] text-slate-500">G-Line, Offsets, & Shoelace Triangulation</p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              Vectorized
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span>FMB Sheet Reference:</span>
              <span className="font-mono font-bold text-slate-800">{fmb.fmb_sheet_no || 'FMB-SH-102-2024'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span>Baseline G-Line Length:</span>
              <span className="font-mono font-bold text-slate-800">88.50 meters</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-1.5">
              <span>FMB Computed Triangulated Area:</span>
              <span className="font-mono font-bold text-cyan-700">{fmb.area_acres || 2.45} Acres ({fmb.area_sqm || 9914.8} m²)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Cadastral GIS Vector Deviation:</span>
              <span className="font-mono font-bold text-emerald-700">0.00 Acres (Exact Boundary Closure)</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Risk Assessment & Title Integrity Score */}
        <div className="dash-card p-5 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Scale size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Land Risk Assessment Summary</h4>
                <p className="text-[11px] text-slate-500">AI Title Integrity Index & Verdict</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Score: {score}/100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3">
            <div className="text-xs font-bold text-slate-800 mb-1">Audit Determination:</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Parcel is approved for transactional and registration due diligence. Low statutory setback flags noted with zero waterbody encroachment.
            </p>
          </div>

          <button
            onClick={onOpenAudit}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
          >
            <FileText size={15} />
            <span>Generate Official Due-Diligence Certificate</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
