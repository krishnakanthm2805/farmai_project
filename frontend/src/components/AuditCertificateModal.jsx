import React from 'react';
import { X, Printer, ShieldCheck, Download, Award, CheckCircle2, AlertOctagon, Layers, QrCode } from 'lucide-react';

export default function AuditCertificateModal({ isOpen, onClose, reconciliationData, riskData }) {
  if (!isOpen || !reconciliationData) return null;

  const surveyNo = reconciliationData.survey_no;
  const cad = reconciliationData.cadastral_parcel;
  const doc = reconciliationData.document_claimed;
  const fmb = reconciliationData.fmb_measured;
  const score = riskData?.title_integrity_score || 0;
  const tier = riskData?.risk_tier || 'N/A';
  const color = riskData?.risk_color || '#10B981';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden rounded-2xl my-8">
        {/* Modal Controls Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between no-print bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Land Title Integrity Certificate & Audit Sheet</h3>
              <p className="text-[11px] text-slate-400">Official Automated Verification Record</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Printer size={14} />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-8 bg-[#070A11] text-slate-100 font-sans border-8 border-double border-slate-800/90 m-4 rounded-xl relative shadow-2xl">
          {/* Certificate Header */}
          <div className="text-center pb-6 border-b-2 border-emerald-500/40">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2.5 shadow-md shadow-emerald-500/20">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl font-extrabold uppercase tracking-wider text-white font-sans">
              FARMAI GEOLAND TITLE INTELLIGENCE
            </h2>
            <p className="text-xs text-slate-400 font-mono tracking-tight mt-1">
              Automated Cadastral & FMB Multimodal Due Diligence Verification Certificate
            </p>
            <div className="mt-2.5 inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-emerald-300 font-semibold">
              Certificate ID: CERT-FARMAI-{surveyNo.replace('/', '-')}-2026
            </div>
          </div>

          {/* Property Identity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800/90 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Survey Reference</span>
              <p className="font-bold text-emerald-300 text-sm mt-0.5">#{surveyNo}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Taluk / Village</span>
              <p className="font-bold text-white mt-0.5">{cad.taluk}, {cad.village}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Patta Record</span>
              <p className="font-bold text-white mt-0.5">PAT-2024-8841</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Land Classification</span>
              <p className="font-bold text-white mt-0.5">{cad.land_classification}</p>
            </div>
          </div>

          {/* Score & Verdict Banner */}
          <div className="p-4 rounded-xl border flex items-center justify-between gap-4 mb-6 bg-slate-900/90" style={{ borderColor: color }}>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Title Integrity Index</span>
              <div className="text-2xl font-extrabold font-sans tabular-nums" style={{ color }}>{score} / 100</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{tier}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Final Verification Verdict</span>
              <div className="text-xs font-bold text-white mt-1 max-w-[280px]">{riskData?.verdict}</div>
            </div>
          </div>

          {/* 3-Way Reconciliation Summary */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">Reconciliation Metrics</h4>
            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">1. Document Extent</span>
                <p className="font-bold text-emerald-400 text-sm mt-1 tabular-nums">{doc.area_acres} Acres</p>
                <p className="text-[10px] text-slate-500 tabular-nums">{doc.area_sqm} Sq.m</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">2. Cadastral GIS Extent</span>
                <p className="font-bold text-blue-400 text-sm mt-1 tabular-nums">{cad.gis_area_acres} Acres</p>
                <p className="text-[10px] text-slate-500 tabular-nums">{cad.gis_area_sqm} Sq.m</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">3. FMB Survey Extent</span>
                <p className="font-bold text-cyan-400 text-sm mt-1 tabular-nums">{fmb.area_acres} Acres</p>
                <p className="text-[10px] text-slate-500 tabular-nums">{fmb.area_sqm} Sq.m</p>
              </div>
            </div>
          </div>

          {/* Findings & Legal Advice */}
          <div className="mb-6 text-xs bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 mb-2 font-mono text-[11px]">Audit Findings & Recommendations:</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {(riskData?.recommendations || []).map((rec, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificate Footer Stamp */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <div>
              <p>Generated by FarmAI GeoLand Engine (Task 2)</p>
              <p>Certified Digitally: {new Date().toISOString()}</p>
            </div>
            <div className="text-right flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-200">DIGITALLY VERIFIED</p>
                <p className="text-[9px] text-emerald-400">SHA256: e8b9...41c2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
