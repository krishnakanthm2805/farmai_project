import React, { useState } from 'react';
import { X, UploadCloud, FileText, Sparkles, AlertCircle, CheckCircle2, HardDrive, RefreshCw, Layers } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onAnalyzeText, onUploadFile, onScanLocalFolders, isAnalyzing }) {
  const [activeMode, setActiveMode] = useState('file'); // 'file' | 'text' | 'local'
  const [rawText, setRawText] = useState('');
  const [docTitle, setDocTitle] = useState('Custom Patta / Sale Deed Extract');
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

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

  const handleScanClick = () => {
    if (onScanLocalFolders) {
      onScanLocalFolders();
    }
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
              <h3 className="text-base font-bold text-white tracking-tight">Ingest Land Records & GeoSpatial Datasets</h3>
              <p className="text-xs text-slate-400">Upload single documents or large ZIP bundles (supports up to 1GB+ archives)</p>
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
        <div className="px-5 pt-4 flex flex-wrap gap-2 border-b border-slate-800 pb-3.5 bg-slate-900/50">
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
            <span>Upload ZIP / Document</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('local')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'local'
                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HardDrive size={14} />
            <span>Scan Local Workspace</span>
          </button>

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
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {activeMode === 'file' && (
            <form onSubmit={handleFileSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 transition-all relative">
                <UploadCloud size={36} className="text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-200">
                  {selectedFile ? (
                    <span className="text-emerald-400">{selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
                  ) : (
                    'Click to select or drag & drop ZIP bundle or land document'
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports 500MB+ ZIP datasets, PDFs, PNGs, JPGs, TIFFs, GeoJSONs
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-emerald-400">⚡ Streamed Chunk Ingestion</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-cyan-400">Auto-Folder Unpacking</span>
                </div>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mt-4 text-xs text-slate-400 block mx-auto"
                  accept=".zip,.pdf,.jpg,.jpeg,.png,.tif,.tiff,.txt,.geojson,.json"
                />
              </div>

              {selectedFile && selectedFile.size > 50 * 1024 * 1024 && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
                  <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Large Dataset Detected ({formatFileSize(selectedFile.size)}):</span>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      FarmAI streams this file directly to disk in 8MB chunks without memory bottlenecks. All subfolders (Patta, LPS, AS, GO, Geospatial layers) will be cataloged and indexed automatically.
                    </p>
                  </div>
                </div>
              )}

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
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Ingesting & Processing Stream...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Upload & Verify Bundle</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeMode === 'local' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <HardDrive size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Zero-Upload Instant Workspace Ingestion</h4>
                    <p className="text-[11px] text-slate-400">Directly indexes files already present in the project folders without browser upload latency.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5 font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">📁</span>
                    <span>backend/data/Land_documents/ (LA_Patta, LPS, AS, GO)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">🗺️</span>
                    <span>backend/data/Geospatial_Layer/ (12 GeoJSON boundary layers)</span>
                  </div>
                </div>
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
                  type="button"
                  onClick={handleScanClick}
                  disabled={isAnalyzing}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Scanning & Indexing Folders...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Scan & Ingest Workspace Folders</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeMode === 'text' && (
            <form onSubmit={handleTextSubmit} className="space-y-3.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-300">Document Title / Reference</label>
                <button
                  type="button"
                  onClick={loadSampleTemplate}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-semibold"
                >
                  <Sparkles size={12} />
                  <span>Load Sample Text</span>
                </button>
              </div>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Registered Sale Deed Doc No 2024/91"
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Raw Document OCR Text / Property Schedule</label>
                <textarea
                  rows={7}
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
          )}
        </div>
      </div>
    </div>
  );
}
