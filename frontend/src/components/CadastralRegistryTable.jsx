import React from 'react';
import { FileText, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CadastralRegistryTable({ 
  onSelectSurvey, 
  onViewAll,
  selectedSurveyNo = '102/3A',
  totalRecords = 247,
  uploadedRecords = [],
  searchTerm = ''
}) {
  const defaultRecords = [
    { survey_no: '102/1A', sub_div: '1A', owner: 'K. R. Ramanathan & R. Meenakshi', doc_area: '1.20', gis_area: '1.20', diff: '0.00', status: 'Match', statusType: 'match' },
    { survey_no: '102/3A', sub_div: '3A', owner: 'R. Muthusamy', doc_area: '2.48', gis_area: '2.45', diff: '-0.03', status: 'Match', statusType: 'match' },
    { survey_no: '102/3B', sub_div: '3B', owner: 'S. Lakshmi', doc_area: '1.75', gis_area: '1.72', diff: '-0.03', status: 'Match', statusType: 'match' },
    { survey_no: '104/1', sub_div: '1', owner: 'K. Rajendran', doc_area: '3.20', gis_area: '3.45', diff: '+0.25', status: 'Discrepancy', statusType: 'discrepancy' },
    { survey_no: '105/2', sub_div: '2', owner: 'V. Selvam', doc_area: '2.10', gis_area: '2.10', diff: '0.00', status: 'Match', statusType: 'match' },
    { survey_no: '106/1A', sub_div: '1A', owner: 'P. Meenakshi', doc_area: '4.50', gis_area: '4.90', diff: '+0.40', status: 'High Risk', statusType: 'risk' },
    { survey_no: '108/3', sub_div: '3', owner: 'Greenfield Logistics', doc_area: '2.00', gis_area: '2.00', diff: '0.00', status: 'High Risk', statusType: 'risk' },
    { survey_no: '110/1A', sub_div: '1A', owner: 'A. Balakrishnan & Sons', doc_area: '1.05', gis_area: '1.05', diff: '0.00', status: 'Discrepancy', statusType: 'discrepancy' },
    { survey_no: '112/1', sub_div: '1', owner: 'G. Murugan', doc_area: '1.50', gis_area: '1.50', diff: '0.00', status: 'Match', statusType: 'match' },
  ];

  // Merge newly uploaded Patta records at the top, avoiding duplicates
  const allRecords = [
    ...uploadedRecords,
    ...defaultRecords.filter(d => !uploadedRecords.some(u => u.survey_no === d.survey_no))
  ];

  // Filter dynamically if user typed in search bar
  const registryRecords = searchTerm && searchTerm.trim()
    ? allRecords.filter(r => 
        r.survey_no.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : allRecords;

  const getStatusBadge = (type, label) => {
    switch (type) {
      case 'match':
        return <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-bold">{label}</span>;
      case 'discrepancy':
        return <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-bold">{label}</span>;
      case 'risk':
        return <span className="inline-block px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold">{label}</span>;
      default:
        return <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">{label}</span>;
    }
  };

  return (
    <div className="dash-card p-4 flex flex-col justify-between h-full bg-white">
      {/* Table Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText size={14} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Cadastral Land Registry</h3>
        </div>
        <button 
          type="button"
          onClick={onViewAll}
          title="Open Full Land Records Registry"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-all cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60 text-[11px]">
              <th className="py-2.5 px-3">Survey No</th>
              <th className="py-2.5 px-3">Sub Division</th>
              <th className="py-2.5 px-3">Land Owner</th>
              <th className="py-2.5 px-3">Document Area (Ac)</th>
              <th className="py-2.5 px-3">GIS Area (Ac)</th>
              <th className="py-2.5 px-3">Difference</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registryRecords.map((row) => {
              const isSelected = row.survey_no === selectedSurveyNo || row.survey_no.replace('/', '-') === selectedSurveyNo.replace('/', '-');

              return (
                <tr
                  key={row.survey_no}
                  onClick={() => onSelectSurvey && onSelectSurvey(row.survey_no)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-emerald-50/70 font-semibold text-emerald-950' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.survey_no}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-600">{row.sub_div}</td>
                  <td className="py-2.5 px-3 font-medium">{row.owner}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums">{row.doc_area}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums">{row.gis_area}</td>
                  <td className={`py-2.5 px-3 font-mono tabular-nums font-semibold ${
                    row.diff.startsWith('+') ? 'text-rose-600' : row.diff.startsWith('-') ? 'text-rose-600' : 'text-slate-500'
                  }`}>
                    {row.diff}
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(row.statusType, row.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <span>Showing 1-{Math.min(registryRecords.length, 5)} of {totalRecords} records</span>
        <div className="flex items-center gap-1 font-mono text-xs">
          <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
            <ChevronLeft size={14} />
          </button>
          <button className="w-6 h-6 rounded bg-emerald-700 text-white font-bold flex items-center justify-center">1</button>
          <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center">2</button>
          <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center">3</button>
          <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center">4</button>
          <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center">5</button>
          <span className="px-1 text-slate-400">...</span>
          <button className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center">50</button>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-400">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
