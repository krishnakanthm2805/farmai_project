import React, { useState } from 'react';
import { FileText, Eye, CheckCircle2, Copy, Sparkles, User, Hash, Ruler, MapPin, Compass } from 'lucide-react';

export default function DocumentInspector({ ocrData, isProcessing }) {
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'entities' | 'raw'
  const [copied, setCopied] = useState(false);

  if (!ocrData) {
    return (
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center min-h-[380px] text-center shadow-xl">
        <FileText size={40} className="text-slate-600 mb-3 animate-pulse" />
        <p className="text-sm text-slate-400 font-medium">Select a scenario or upload a document to inspect OCR extraction</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(ocrData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Land Record Document & OCR Inspector</h3>
            <p className="text-[11px] text-slate-400">Multimodal Entity Extraction</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-lg transition-all font-medium ${
              activeTab === 'visual' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual OCR
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-3 py-1 rounded-lg transition-all font-medium ${
              activeTab === 'entities' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Structured Entities
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1 rounded-lg transition-all font-medium ${
              activeTab === 'raw' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw OCR Text
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-3.5 flex-1 overflow-y-auto max-h-[480px] pr-1">
        {activeTab === 'visual' && (
          <div className="space-y-3">
            {/* Document Header Banner */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Document Title</span>
                <p className="text-xs font-semibold text-white truncate max-w-[260px]">{ocrData.document_title || 'Government Patta / Chitta Record'}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
                <Sparkles size={12} />
                <span>OCR: {ocrData.ocr_confidence || 98.4}%</span>
              </div>
            </div>

            {/* Simulated Scanned Parchment View with Bounding Box Highlights */}
            <div className="p-4 rounded-xl bg-[#070A11] border border-slate-800/90 relative font-mono text-xs text-slate-300 space-y-3 scanline-effect shadow-inner">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                <span className="font-bold text-[11px] tracking-wide">GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">FORM 10 EXTRACT</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-cyan-200">
                  <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <Hash size={10} className="text-cyan-400" /> Survey Reference
                  </div>
                  <div className="font-bold text-sm text-cyan-300 mt-0.5">{ocrData.full_survey_ref || ocrData.survey_no}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-indigo-500/40 text-indigo-200">
                  <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                    <FileText size={10} className="text-indigo-400" /> Patta Number
                  </div>
                  <div className="font-bold text-sm text-indigo-300 mt-0.5">#{ocrData.patta_no}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/40 text-emerald-200">
                <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                  <User size={10} className="text-emerald-400" /> Registered Pattadar / Owner
                </div>
                <div className="font-semibold text-xs text-white mt-0.5">{(ocrData.owners || []).join(', ') || 'N/A'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-200">
                <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1">
                  <Ruler size={10} className="text-amber-400" /> Documented Extent / Area
                </div>
                <div className="flex items-center gap-3 font-bold text-xs text-amber-300 tabular-nums mt-0.5">
                  <span>{ocrData.area?.acres} Acres</span>
                  <span className="font-normal text-slate-400">({ocrData.area?.cents} Cents)</span>
                  <span className="font-normal text-slate-400">{ocrData.area?.sqm} Sq.M</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
                <div className="text-[9px] text-slate-400 uppercase flex items-center gap-1 mb-1.5 font-semibold">
                  <Compass size={10} className="text-slate-400" /> Documented Neighbor Boundaries
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-950/90 p-1.5 rounded-md border border-slate-800"><span className="text-slate-400">North:</span> <span className="font-semibold text-slate-200">{ocrData.boundaries?.north}</span></div>
                  <div className="bg-slate-950/90 p-1.5 rounded-md border border-slate-800"><span className="text-slate-400">South:</span> <span className="font-semibold text-slate-200">{ocrData.boundaries?.south}</span></div>
                  <div className="bg-slate-950/90 p-1.5 rounded-md border border-slate-800"><span className="text-slate-400">East:</span> <span className="font-semibold text-slate-200">{ocrData.boundaries?.east}</span></div>
                  <div className="bg-slate-950/90 p-1.5 rounded-md border border-slate-800"><span className="text-slate-400">West:</span> <span className="font-semibold text-slate-200">{ocrData.boundaries?.west}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'entities' && (
          <div className="space-y-2 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <span>Entity Key</span>
                <span>Extracted Value</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-400 font-sans">Taluk / Village</span>
                <span className="font-semibold">{ocrData.taluk}, {ocrData.village}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-400 font-sans">Classification</span>
                <span className="font-semibold text-emerald-400">{ocrData.land_classification}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-400 font-sans">Area (Hectares)</span>
                <span className="font-semibold tabular-nums">{ocrData.area?.hectares} Ha</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-400 font-sans">Area (Acres / Cents)</span>
                <span className="font-semibold text-amber-300 tabular-nums">{ocrData.area?.acres} Ac / {ocrData.area?.cents} Cents</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span className="text-slate-400 font-sans">Patta Number</span>
                <span className="font-semibold text-indigo-300">{ocrData.patta_no}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 shadow transition-all"
            >
              {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="p-4 rounded-xl bg-[#070A11] border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {ocrData.raw_text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
