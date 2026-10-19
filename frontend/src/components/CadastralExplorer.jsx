import React, { useState } from 'react';
import { Layers, Search, ArrowUpRight, ShieldCheck, AlertOctagon, Database, ExternalLink, Shield } from 'lucide-react';

export default function CadastralExplorer({ cadastralData, onSelectSurvey, selectedSurveyNo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'CLEAR' | 'DISPUTED'

  const features = cadastralData?.features || [];

  const totalCount = features.length;
  const clearCount = features.filter(f => !f.properties.is_disputed).length;
  const disputedCount = features.filter(f => f.properties.is_disputed).length;

  const filteredFeatures = features.filter((feat) => {
    const p = feat.properties;
    const matchSearch =
      p.survey_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.registered_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.patta_no && p.patta_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.parcel_id && p.parcel_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filterType === 'CLEAR') return !p.is_disputed;
    if (filterType === 'DISPUTED') return p.is_disputed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Database & Search Section */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database size={16} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Cadastral GIS Land Registry Database
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-10.5">
            Government Survey Records & Digital Cadastral Map Layer
          </p>
        </div>

        {/* Control Toolbar */}
        <div className="flex flex-wrap items-center gap-3 text-xs w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search survey no, owner, patta..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Filter Tab Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                filterType === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>All</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'ALL' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setFilterType('CLEAR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                filterType === 'CLEAR'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Clear Titles</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'CLEAR' ? 'bg-slate-950/30 text-slate-950' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'}`}>
                {clearCount}
              </span>
            </button>

            <button
              onClick={() => setFilterType('DISPUTED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                filterType === 'DISPUTED'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Discrepancies / Disputed</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'DISPUTED' ? 'bg-white/30 text-white' : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'}`}>
                {disputedCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Redesign */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs font-medium bg-slate-900/90">
                <th className="py-3.5 px-4">Survey Reference</th>
                <th className="py-3.5 px-4">Registered Pattadar / Owner</th>
                <th className="py-3.5 px-4">Cadastral GIS Area</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFeatures.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Database size={28} className="mx-auto text-slate-600 mb-2 animate-pulse" />
                    <p className="text-sm font-medium">No cadastral parcels match your search query</p>
                  </td>
                </tr>
              ) : (
                filteredFeatures.map((feat) => {
                  const p = feat.properties;
                  const isSelected = p.survey_no === selectedSurveyNo;

                  return (
                    <tr
                      key={p.parcel_id}
                      className={`transition-colors duration-150 ${
                        isSelected
                          ? 'bg-emerald-950/25'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Survey Reference */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm font-mono flex items-center gap-1.5">
                          <span>#{p.survey_no}</span>
                        </div>
                        <div className="inline-block mt-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700/60">
                          {p.parcel_id}
                        </div>
                      </td>

                      {/* Registered Pattadar / Owner */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">
                          {p.registered_owner}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          Patta: {p.patta_no}
                        </div>
                      </td>

                      {/* Cadastral GIS Area */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-100 tabular-nums">
                          {p.gis_area_acres} Acres
                        </div>
                        <div className="text-xs text-slate-400 tabular-nums mt-0.5">
                          {p.gis_area_sqm} Sq.m
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700/50">
                          {p.land_classification}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {p.is_disputed ? (
                          <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <AlertOctagon size={12} className="shrink-0" />
                            <span>Flagged</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <ShieldCheck size={12} className="shrink-0" />
                            <span>Clear</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isSelected ? (
                          <button
                            onClick={() => onSelectSurvey(p.survey_no)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                          >
                            <span>Active</span>
                            <ExternalLink size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectSurvey(p.survey_no)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-all duration-150"
                          >
                            <span>Reconcile</span>
                            <ArrowUpRight size={12} className="text-slate-400" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
