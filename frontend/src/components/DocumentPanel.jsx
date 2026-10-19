import React, { useState } from 'react';
import { UploadCloud, FileText, Image, CheckCircle2, MoreVertical, Sparkles, AlertTriangle, Compass, MapPin } from 'lucide-react';

export default function DocumentPanel({ onOpenUpload, ocrData, reconciliationData, onSelectDocument, onOpenExpansionNotice }) {
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'analysis' | 'risk'

  const defaultDocuments = [
    { id: 'patta', name: 'Patta.pdf', size: '2.4 MB', status: 'Extracted', isPdf: true },
    { id: 'sale_deed', name: 'Sale_Deed.pdf', size: '4.1 MB', status: 'Extracted', isPdf: true },
    { id: 'fmb', name: 'FMB_Sketch.jpg', size: '1.8 MB', status: 'Vectorized', isImage: true },
    { id: 'adangal', name: 'Adangal.pdf', size: '3.2 MB', status: 'Extracted', isPdf: true },
  ];

  const isOutOfPresetDataset = reconciliationData?.dataset_coverage?.is_covered === false;

  return (
    <div className="dash-card p-4 flex flex-col h-full bg-white">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs mb-3">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'analysis'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Analysis Results
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'risk'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Risk Summary
        </button>
      </div>

      {/* Out of Preset Dataset / Future Implementation Area Warning Alert Banner */}
      {isOutOfPresetDataset && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 shadow-xs mb-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={16} className="stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                  <span>Jurisdiction Notice</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200/90 text-amber-900 border border-amber-300">
                    Future Implementation Area
                  </span>
                </span>
                <span className="text-[10px] font-mono text-amber-700">Phase-2 Roadmap</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug mt-1">
                This Patta (Survey <strong>#{reconciliationData?.survey_no || ocrData?.full_survey_ref || 'Parcel'}</strong>) is outside our pre-setup Phase-1 GIS Cadastral dataset (Keelathattaparai Pilot Zone).
              </p>
              <p className="text-[10px] text-amber-700 mt-0.5">
                OCR text and entity fields were successfully extracted, but cadastral boundary ground-truthing and FMB ladder cross-verification are marked for <strong>Future Implementation Area expansion</strong>.
              </p>
              <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
                <span className="text-[10px] text-amber-700 font-mono">Pilot boundary: Keelathattaparai</span>
                <a
                  href="#settings"
                  onClick={(e) => { e.preventDefault(); if (onOpenExpansionNotice) onOpenExpansionNotice(); }}
                  className="font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-0.5"
                >
                  <span>Phase-2 Expansion Info →</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      {activeTab === 'documents' && (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Upload Drop Area */}
          <div
            onClick={onOpenUpload}
            className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-3.5 text-center cursor-pointer bg-slate-50/70 hover:bg-emerald-50/30 transition-all duration-150"
          >
            <UploadCloud size={22} className="text-slate-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-800">Upload Land Documents</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Drag & drop files or click to upload</p>
            <p className="text-[9px] text-slate-400 mt-1 font-medium">Supported: PDF, JPG, PNG (Max 10MB)</p>
          </div>

          {/* Document File List Items */}
          <div className="space-y-2">
            {defaultDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument && onSelectDocument(doc.id)}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 flex items-center justify-between gap-2 shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    doc.isImage ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {doc.isImage ? <Image size={16} /> : <FileText size={16} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{doc.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{doc.size}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    <CheckCircle2 size={10} />
                    {doc.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom OCR Extraction Complete Alert */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900 mt-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-800">OCR Extraction Complete</div>
              <p className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                Survey No, Owner details, Area and other key fields extracted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Tab View */}
      {activeTab === 'analysis' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800">Extracted Land Entities</div>
            <div className="flex justify-between border-b border-slate-200 pb-1 text-slate-600">
              <span>Survey Number</span>
              <span className="font-bold text-slate-800">{ocrData?.full_survey_ref || '102/3A'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1 text-slate-600">
              <span>Pattadar / Owner</span>
              <span className="font-bold text-slate-800">{(ocrData?.owners || ['R. Muthusamy']).join(', ')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1 text-slate-600">
              <span>Document Extent</span>
              <span className="font-bold text-emerald-700">{ocrData?.area?.acres || 2.48} Acres</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Classification</span>
              <span className="font-bold text-slate-800">{ocrData?.land_classification || 'Ryotwari Wet'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Risk Summary Tab View */}
      {activeTab === 'risk' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="font-bold text-amber-900">Spatial Risk Summary</div>
            <p className="text-amber-800 text-[11px]">
              Parcel 102/3A has a minor 0.03 Acre variance with partial road corridor buffer proximity.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
