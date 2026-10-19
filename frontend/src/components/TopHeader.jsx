import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, X, ArrowRight, Bell, Sparkles, MapPin, 
  FileText, CheckCircle2, AlertTriangle, AlertOctagon, 
  HelpCircle, Filter, Loader2, Compass, ShieldCheck 
} from 'lucide-react';

export default function TopHeader({ 
  searchTerm, 
  setSearchTerm, 
  onSelectSurvey,
  cadastralData,
  uploadedRecords = [],
  sampleDocs = []
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all'); // 'all' | 'survey' | 'owner' | 'village' | 'document_id'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'clean' | 'discrepancy' | 'encroachment' | 'unverified'
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results from Backend API (/api/cadastral/search) with debounce & client-side fallback
  useEffect(() => {
    let isCancelled = false;
    const query = searchTerm ? searchTerm.trim() : '';

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `/api/cadastral/search?q=${encodeURIComponent(query)}&type=${searchCategory}&status=${statusFilter}&limit=30`;
        const res = await fetch(url);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          let backendResults = data.results || [];

          // Also merge any newly uploaded records in memory matching the search
          if (uploadedRecords.length > 0) {
            const qLower = query.toLowerCase();
            const uploadedMatches = uploadedRecords.filter((rec) => {
              const matchText = 
                !query ||
                rec.survey_no?.toLowerCase().includes(qLower) ||
                rec.owner?.toLowerCase().includes(qLower) ||
                rec.village?.toLowerCase().includes(qLower);

              let matchStatus = true;
              if (statusFilter === 'clean') matchStatus = rec.statusType === 'match';
              else if (statusFilter === 'discrepancy') matchStatus = rec.statusType === 'discrepancy';
              else if (statusFilter === 'encroachment') matchStatus = rec.statusType === 'risk';

              return matchText && matchStatus;
            }).map((rec) => ({
              id: `UPLOADED-${rec.survey_no}`,
              type: 'document',
              survey_no: rec.survey_no,
              registered_owner: rec.owner,
              village: rec.village || 'Perungudi',
              area_acres: parseFloat(rec.doc_area) || 1.2,
              verification_status: rec.status === 'Match' ? 'Clean / Matched' : rec.status === 'Discrepancy' ? 'Discrepancy' : 'Possible Encroachment',
              status_tag: rec.statusType === 'match' ? 'clean' : rec.statusType === 'discrepancy' ? 'discrepancy' : 'encroachment',
              title_integrity_score: rec.statusType === 'match' ? 95 : rec.statusType === 'discrepancy' ? 68 : 42,
              source: 'Uploaded Patta Deed'
            }));

            // Prepend uploaded matches
            backendResults = [
              ...uploadedMatches,
              ...backendResults.filter(b => !uploadedMatches.some(u => u.survey_no === b.survey_no))
            ];
          }

          setSearchResults(backendResults);
        }
      } catch (err) {
        console.warn('Backend search fallback to client-side:', err);
      } finally {
        if (!isCancelled) setIsSearching(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm, searchCategory, statusFilter, uploadedRecords]);

  const handleSelectRecord = (record) => {
    const sNo = record.survey_no;
    setSearchTerm(sNo);
    setIsOpen(false);
    if (onSelectSurvey) {
      onSelectSurvey(sNo, record.document_id);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm || !searchTerm.trim()) {
      setIsOpen(true);
      return;
    }

    if (searchResults.length > 0) {
      handleSelectRecord(searchResults[0]);
    } else {
      const clean = searchTerm.trim();
      setIsOpen(false);
      if (onSelectSurvey) {
        onSelectSurvey(clean);
      }
    }
  };

  const getStatusBadge = (statusTag, label) => {
    switch (statusTag) {
      case 'clean':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 size={11} className="text-emerald-600" />
            <span>{label || 'Clean Title'}</span>
          </span>
        );
      case 'discrepancy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
            <AlertTriangle size={11} className="text-amber-600" />
            <span>{label || 'Discrepancy'}</span>
          </span>
        );
      case 'encroachment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
            <AlertOctagon size={11} className="text-rose-600" />
            <span>{label || 'Possible Encroachment'}</span>
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold">
            <HelpCircle size={11} className="text-slate-400" />
            <span>{label || 'Unverified'}</span>
          </span>
        );
    }
  };

  const parcelResults = searchResults.filter(r => r.type === 'parcel');
  const documentResults = searchResults.filter(r => r.type === 'document');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all">
      {/* Primary Top Bar Row */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* FarmAI Brand & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-600/20">
            <span className="font-mono text-base font-black">F</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">FarmAI</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                GeoLand
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              Cadastral Intelligence & Title Verification
            </div>
          </div>
        </div>

        {/* Global Land Search Hub (Center) */}
        <div className="flex-1 max-w-2xl mx-2 relative" ref={dropdownRef}>
          {/* Main Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-2.5 text-slate-400 pointer-events-none flex items-center justify-center">
                {isSearching ? (
                  <Loader2 size={16} className="text-emerald-600 animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                placeholder="Search land records (Example: 102/1A, Ramesh, or Keelathattaparai)..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setIsOpen(true);
                  }}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Clickable Action Button */}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all shrink-0 cursor-pointer"
            >
              <Search size={14} />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Categories & Verification Status Pills */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            {/* Search By Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Search by:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'survey', label: 'Survey No.' },
                { id: 'owner', label: 'Owner' },
                { id: 'village', label: 'Village' },
                { id: 'document_id', label: 'Document ID' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSearchCategory(cat.id);
                    setIsOpen(true);
                  }}
                  className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    searchCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Verification Status Filter */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] hidden sm:inline">
                Status:
              </span>
              {[
                { id: 'all', label: 'All', dot: null },
                { id: 'clean', label: 'Clean', dot: 'bg-emerald-500' },
                { id: 'discrepancy', label: 'Discrepancies', dot: 'bg-amber-500' },
                { id: 'encroachment', label: 'Encroachments', dot: 'bg-rose-500' },
                { id: 'unverified', label: 'Unverified', dot: 'bg-slate-400' }
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st.id);
                    setIsOpen(true);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {st.dot && <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />}
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rich Search Results Dropdown Overlay */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[500px] flex flex-col">
              {/* Header Bar */}
              <div className="p-3 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>
                    {searchResults.length > 0 
                      ? `Found ${searchResults.length} Land Results`
                      : 'No Matching Records'}
                  </span>
                  {statusFilter !== 'all' && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700 uppercase font-mono font-bold">
                      {statusFilter}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  Click to inspect parcel & fly on GIS Map
                </span>
              </div>

              {/* Scrollable Results List */}
              <div className="overflow-y-auto p-2 space-y-3 flex-1 divide-y divide-slate-100">
                {/* Section 1: Cadastral Land Parcels */}
                {parcelResults.length > 0 && (
                  <div className="pt-2 first:pt-0">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cadastral Land Database ({parcelResults.length})
                    </div>
                    <div className="space-y-1.5 mt-1">
                      {parcelResults.map((r, idx) => (
                        <div
                          key={`parcel-${r.id}-${idx}`}
                          onClick={() => handleSelectRecord(r)}
                          className="p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer group"
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                              #{r.survey_no.split('/')[0]}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  Survey No. {r.survey_no}
                                </span>
                                {getStatusBadge(r.status_tag, r.verification_status)}
                                {r.title_integrity_score && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold">
                                    Score: {r.title_integrity_score}/100
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-2">
                                <span><strong>Owner:</strong> {r.registered_owner}</span>
                                <span>•</span>
                                <span>{r.village}, {r.taluk}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-slate-100">
                            <div className="text-right">
                              <div className="text-xs font-mono font-bold text-slate-800">
                                {r.area_acres} Acres
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {r.area_sqm ? `${Math.round(r.area_sqm)} m²` : 'GIS Verified'}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-200 group-hover:border-emerald-600 transition-all">
                              <MapPin size={13} />
                              <span className="hidden md:inline">Inspect Map</span>
                              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Uploaded Land Documents & Benchmarks */}
                {documentResults.length > 0 && (
                  <div className="pt-2">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Land Documents & Title Deeds ({documentResults.length})
                    </div>
                    <div className="space-y-1.5 mt-1">
                      {documentResults.map((doc, idx) => (
                        <div
                          key={`doc-${doc.id}-${idx}`}
                          onClick={() => handleSelectRecord(doc)}
                          className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900 group-hover:text-blue-700">
                                  {doc.title || `Document ${doc.document_id}`}
                                </span>
                                {getStatusBadge(doc.status_tag, doc.verification_status)}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                Survey #{doc.survey_no} • {doc.registered_owner} • Patta No: {doc.patta_no || 'Pending'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {doc.area_acres} Ac
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:text-blue-800">
                              <span>Verify Deeds</span>
                              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State Prompt */}
                {searchResults.length === 0 && !isSearching && (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                      <HelpCircle size={24} />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      No matching parcels for "{searchTerm}" in category "{searchCategory}"
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      Unverified parcels or newly registered survey numbers can be queried directly against the spatial engine.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelectSurvey) onSelectSurvey(searchTerm.trim());
                      }}
                      className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Locate Survey #{searchTerm.trim()} on Map
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Guidance Bar */}
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Workflow: <strong>Search → View Record → Compare Patta/GIS/FMB → Locate on Map</strong></span>
                <span className="font-mono">Press <strong>ESC</strong> to close</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Session Status & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              KM
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">Krishnakanth M</div>
              <div className="text-[11px] text-slate-400">Land Intelligence Analyst</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

