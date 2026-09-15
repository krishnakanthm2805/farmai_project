import React from 'react';
import { UploadCloud, FileSearch, Hash, Layers, GitCompare, Compass, ShieldAlert, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function WorkflowStepper() {
  const steps = [
    { id: 1, label: 'Upload Document', desc: 'Patta / Deed PDF/Image', icon: UploadCloud, active: true },
    { id: 2, label: 'OCR Extraction', desc: 'Tamil & English OCR', icon: FileSearch, active: true },
    { id: 3, label: 'Extract Survey No', desc: 'Entities & Sub-division', icon: Hash, active: true },
    { id: 4, label: 'Link Cadastral', desc: 'GeoJSON Polygon Match', icon: Layers, active: true },
    { id: 5, label: 'Compare Area', desc: 'Doc vs GIS vs FMB', icon: GitCompare, active: true },
    { id: 6, label: 'FMB Vectorize', desc: 'Ladder Offset Triangulation', icon: Compass, active: true },
    { id: 7, label: 'Spatial Analysis', desc: 'Water & Road Buffers', icon: ShieldAlert, active: true },
    { id: 8, label: 'Risk Scoring', desc: '0–100 Title Integrity', icon: CheckCircle2, active: true },
    { id: 9, label: 'Audit Certificate', desc: 'Signed Due-Diligence PDF', icon: Award, active: true },
  ];

  return (
    <div className="dash-card p-5 bg-white border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="text-emerald-600">⚡</span>
            <span>FarmAI Autonomous Document-to-GIS Verification Pipeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-End Multimodal Land Intelligence & Spatial Reconciliation Workflow
          </p>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Active Pipeline (Task 2)
        </span>
      </div>

      {/* Responsive Horizontal Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-sm mb-1.5 font-bold text-xs">
                <Icon size={16} />
              </div>
              <div className="text-[11px] font-bold text-slate-800 line-clamp-1">{step.label}</div>
              <div className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{step.desc}</div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-5 text-slate-300 pointer-events-none z-10">
                  <ArrowRight size={12} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
