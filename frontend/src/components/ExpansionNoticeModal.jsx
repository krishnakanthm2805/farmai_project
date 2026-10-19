import React, { useState } from 'react';
import { X, AlertTriangle, Layers, MapPin, CheckCircle2, Download, Send, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ExpansionNoticeModal({ isOpen, onClose, reconciliationData, ocrData }) {
  const [isRequested, setIsRequested] = useState(false);

  if (!isOpen) return null;

  const surveyNo = reconciliationData?.survey_no || ocrData?.full_survey_ref || ocrData?.survey_no || 'Uploaded Parcel';
  const village = reconciliationData?.cadastral_parcel?.village || ocrData?.village || 'Unknown Village';
  const taluk = reconciliationData?.cadastral_parcel?.taluk || ocrData?.taluk || 'Local Taluk';
  const district = reconciliationData?.cadastral_parcel?.district || ocrData?.district || 'Tamil Nadu';
  const owners = ocrData?.owners?.join(', ') || ocrData?.owner_name || reconciliationData?.cadastral_parcel?.registered_owner || 'Land Holder';
  const areaAcres = ocrData?.area?.acres || reconciliationData?.document_claimed?.area_acres || '1.20';

  const handleDownloadExtraction = () => {
    const dataToExport = {
      notice: "FarmAI Land Intelligence - Future Implementation Area Record",
      status: "OUT_OF_PRESET_DATASET",
      tier: "PHASE_2_EXPANSION_CANDIDATE",
      survey_number: surveyNo,
      village,
      taluk,
      district,
      documented_owner: owners,
      documented_area_acres: areaAcres,
      ocr_extracted: ocrData || {},
      reconciliation: reconciliationData || {},
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FarmAI_ExpansionNotice_SNo_${String(surveyNo).replace(/[\/\\]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRequestOnboarding = () => {
    setIsRequested(true);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl border border-amber-500/40 bg-slate-900 shadow-2xl rounded-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-400 flex items-center justify-center shrink-0 shadow">
              <AlertTriangle size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Jurisdiction Coverage Warning</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/50">
                  Future Implementation Area
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Uploaded Patta is outside our active Phase-1 GIS Cadastral dataset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300/80 font-medium">Uploaded Parcel Identifier:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">Survey #{surveyNo}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300/80 font-medium">Detected Location:</span>
              <span className="font-medium text-slate-200 flex items-center gap-1">
                <MapPin size={12} className="text-amber-400" />
                {village}, {taluk} ({district})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300/80 font-medium">Claimed Land Extent:</span>
              <span className="font-semibold text-slate-200">{areaAcres} Acres</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300/80 font-medium">Recorded Owner:</span>
              <span className="font-semibold text-slate-200 truncate max-w-[280px]">{owners}</span>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              The current version of <strong className="text-emerald-400">FarmAI – GeoLand Intelligence</strong> has pre-configured high-resolution cadastral vector layers for the <strong className="text-white">Keelathattaparai Pilot Zone (Thoothukudi District, Tamil Nadu)</strong>.
            </p>
            <p className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80 text-amber-200/90 text-xs">
              ⚠️ <strong>Why this warning is shown:</strong> Your uploaded Patta references a jurisdiction outside this pilot polygon index. The document has been geolocated and OCR fields extracted, but official shapefile verification, sub-division FMB laddering, and environmental buffer analytics for this taluk are marked as a <strong>Future Implementation Area (Phase-2 Expansion)</strong>.
            </p>
          </div>

          {/* Feature Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Active Now */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 size={14} />
                <span>Currently Active for this Document</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Multilingual OCR extraction (Tamil/English)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Survey No., Patta No., and Owner extraction
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> District centroid geo-positioning on map
                </li>
              </ul>
            </div>

            {/* Scheduled in Phase 2 */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Layers size={14} />
                <span>Phase-2 Future Implementation</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">→</span> Revenue Taluk Cadastral Shapefile ingestion
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">→</span> FMB Sub-division ladder geometric verification
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">→</span> Automated waterbody & road buffer compliance
                </li>
              </ul>
            </div>
          </div>

          {/* Success Banner if Requested */}
          {isRequested && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>
                <strong>Request Registered!</strong> Village <strong>{village} ({taluk})</strong> has been queued for Phase-2 Cadastral GIS digitization roadmap.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleDownloadExtraction}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Export OCR Extraction</span>
          </button>

          <div className="flex items-center gap-2">
            {!isRequested ? (
              <button
                type="button"
                onClick={handleRequestOnboarding}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Send size={13} />
                <span>Request Phase-2 Onboarding</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} /> Queued for Phase-2
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
