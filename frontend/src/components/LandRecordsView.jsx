import React, { useState } from 'react';
import { Database, Search, Filter, ShieldCheck, AlertOctagon, ExternalLink, ArrowUpDown } from 'lucide-react';

export default function LandRecordsView({ cadastralData, onSelectSurvey, selectedSurveyNo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const defaultRecords = [
    { survey_no: '102/3A', sub_div: '3A', owner: 'R. Muthusamy', doc_area: '2.48', gis_area: '2.45', diff: '-0.03', status: 'Match', isDisputed: false, village: 'Perungudi' },
    { survey_no: '102/3B', sub_div: '3B', owner: 'S. Lakshmi', doc_area: '1.75', gis_area: '1.72', diff: '-0.03', status: 'Match', isDisputed: false, village: 'Perungudi' },
    { survey_no: '104/1', sub_div: '1', owner: 'K. Rajendran', doc_area: '3.20', gis_area: '3.45', diff: '+0.25', status: 'Discrepancy', isDisputed: true, village: 'Perungudi' },
    { survey_no: '105/2', sub_div: '2', owner: 'V. Selvam', doc_area: '2.10', gis_area: '2.10', diff: '0.00', status: 'Match', isDisputed: false, village: 'Perungudi' },
    { survey_no: '106/1A', sub_div: '1A', owner: 'P. Meenakshi', doc_area: '4.50', gis_area: '4.90', diff: '+0.40', status: 'High Risk', isDisputed: true, village: 'Perungudi' },
    { survey_no: '108/3', sub_div: '3', owner: 'Greenfield Logistics', doc_area: '2.00', gis_area: '2.00', diff: '0.00', status: 'High Risk', isDisputed: true, village: 'Perungudi' },
    { survey_no: '110/1A', sub_div: '1A', owner: 'A. Balakrishnan & Sons', doc_area: '1.05', gis_area: '1.05', diff: '0.00', status: 'Discrepancy', isDisputed: true, village: 'Perungudi' },
    { survey_no: '112/1', sub_div: '1', owner: 'G. Murugan', doc_area: '1.50', gis_area: '1.50', diff: '0.00', status: 'Match', isDisputed: false, village: 'Perungudi' },
  ];

  const filtered = defaultRecords.filter((r) => {
    const match = r.survey_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  r.owner.toLowerCase().includes(searchTerm.toLowerCase());
    if (!match) return false;
    if (filterType === 'CLEAR') return !r.isDisputed;
    if (filterType === 'DISPUTED') return r.isDisputed;
    return true;
  });

  return (
    <div className="dash-card p-6 bg-white space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Cadastral Land Records Registry</h3>
            <p className="text-xs text-slate-500">Official Government Survey Database & Parcel Inventory</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search survey no, owner..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${filterType === 'ALL' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'}`}
            >
              All ({defaultRecords.length})
            </button>
            <button
              onClick={() => setFilterType('CLEAR')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${filterType === 'CLEAR' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600'}`}
            >
              Clear Records
            </button>
            <button
              onClick={() => setFilterType('DISPUTED')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${filterType === 'DISPUTED' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'}`}
            >
              Flagged Discrepancies
            </button>
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50 py-3">
              <th className="py-3 px-4">Survey No</th>
              <th className="py-3 px-4">Sub Division</th>
              <th className="py-3 px-4">Land Owner</th>
              <th className="py-3 px-4">Document Area (Ac)</th>
              <th className="py-3 px-4">GIS Area (Ac)</th>
              <th className="py-3 px-4">Difference</th>
              <th className="py-3 px-4">Verification Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.map((r) => {
              const isSelected = r.survey_no === selectedSurveyNo;
              return (
                <tr key={r.survey_no} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-emerald-50/70 font-semibold' : ''}`}>
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">#{r.survey_no}</td>
                  <td className="py-3 px-4 text-slate-600">{r.sub_div}</td>
                  <td className="py-3 px-4 text-slate-800">{r.owner}</td>
                  <td className="py-3 px-4 font-mono tabular-nums">{r.doc_area} Ac</td>
                  <td className="py-3 px-4 font-mono tabular-nums">{r.gis_area} Ac</td>
                  <td className="py-3 px-4 font-mono font-bold tabular-nums">
                    <span className={r.diff.startsWith('+') ? 'text-rose-600' : r.diff.startsWith('-') ? 'text-amber-600' : 'text-slate-500'}>
                      {r.diff} Ac
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.isDisputed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold">
                        <AlertOctagon size={11} /> Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-bold">
                        <ShieldCheck size={11} /> Clear
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectSurvey && onSelectSurvey(r.survey_no)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <span>Reconcile</span>
                      <ExternalLink size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
