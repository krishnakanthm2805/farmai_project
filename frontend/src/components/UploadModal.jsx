import React, { useState } from 'react';
import { X, UploadCloud, FileText, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onAnalyzeText, onUploadFile, isAnalyzing }) {
  const [activeMode, setActiveMode] = useState('text'); // 'text' | 'file'
  const [rawText, setRawText] = useState('');
  const [docTitle, setDocTitle] = useState('Custom Patta / Sale Deed Extract');
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    onAnalyzeText(rawText, docTitle);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    onUploadFile(selectedFile);
  };

  const loadSampleTemplate = () => {
    setDocTitle('Patta Extract - Survey 102/1A');
    setRawText(`GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT
E-PATTA / CHITTA EXTRACT (FORM 10)
District: Chennai | Taluk: Sholinganallur | Village: Perungudi
Patta Number: 8841
Pattadar Name: 1. K. R. Ramanathan, 2. R. Meenakshi
Survey Number: 102 | Sub-Division: 1A
Land Type: Ryotwari Dry (Punjai)
Extent: 1.20 Acres (0 Hectares 48.56 Ares)
Boundaries:
  North by: Survey No. 102/1B
  South by: Village Road
  East by: Survey No. 103/2
  West by: Survey No. 101/4`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden rounded-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UploadCloud size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Upload Land Document for GeoAI Verification</h3>
              <p className="text-xs text-slate-400">Ingest Patta, Sale Deed, Adangal, or FMB sketch text for OCR reconciliation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-5 pt-4 flex gap-2.5 border-b border-slate-800 pb-3.5 bg-slate-900/50">
          <button
            type="button"
            onClick={() => setActiveMode('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'text'
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText size={14} />
            <span>Paste Document Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('file')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'file'
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UploadCloud size={14} />
            <span>Upload File (PDF / Image)</span>
          </button>

          <button
            type="button"
            onClick={loadSampleTemplate}
            className="ml-auto text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-semibold"
          >
            <Sparkles size={12} />
            <span>Load Sample Text</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {activeMode === 'text' ? (
            <form onSubmit={handleTextSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title / Reference</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Registered Sale Deed Doc No 2024/91"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Raw Document OCR Text / Property Schedule</label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                  placeholder="Paste Patta extract, Sale deed schedule, or Land record text..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || !rawText.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles size={14} className="animate-spin" />
                      <span>Processing OCR & Geo-Matching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Run AI Extraction & Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/60 transition-all">
                <UploadCloud size={36} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to select or drag & drop land record'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG, TIFF land record scans</p>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mt-4 text-xs text-slate-400"
                  accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,.txt"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing || !selectedFile}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles size={14} className="animate-spin" />
                      <span>Parsing File & Reconciling...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Upload & Verify</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
