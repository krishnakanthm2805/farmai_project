import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import KpiMetrics from './components/KpiMetrics';
import GisMap from './components/GisMap';
import DocumentPanel from './components/DocumentPanel';
import CadastralRegistryTable from './components/CadastralRegistryTable';
import RecentDocumentsCard from './components/RecentDocumentsCard';
import RiskAssessmentCard from './components/RiskAssessmentCard';
import RightSidebar from './components/RightSidebar';
import AnalysisReportsView from './components/AnalysisReportsView';
import LandRecordsView from './components/LandRecordsView';
import UploadModal from './components/UploadModal';
import AuditCertificateModal from './components/AuditCertificateModal';
import ExpansionNoticeModal from './components/ExpansionNoticeModal';

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurveyNo, setSelectedSurveyNo] = useState('102/3A');
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isExpansionOpen, setIsExpansionOpen] = useState(false);
  const [bottomLeftTab, setBottomLeftTab] = useState('recent_docs'); // 'recent_docs' | 'registry'

  // History & Route Navigation Helper (powers Browser Back/Forward buttons)
  const navigateTo = (navId, addToHistory = true) => {
    const cleanNav = navId === 'records' ? 'land_records' : navId;
    setActiveNav(cleanNav);
    if (addToHistory && typeof window !== 'undefined') {
      window.history.pushState({ nav: cleanNav }, '', `#${cleanNav}`);
    }
  };

  // Synchronize Browser Back / Forward buttons (HTML5 History API)
  useEffect(() => {
    const initialHash = window.location.hash.replace('#', '');
    const validRoutes = ['dashboard', 'map', 'documents', 'land_records', 'records', 'analysis', 'settings'];

    if (initialHash && validRoutes.includes(initialHash)) {
      const cleanNav = initialHash === 'records' ? 'land_records' : initialHash;
      setActiveNav(cleanNav);
      window.history.replaceState({ nav: cleanNav }, '', `#${cleanNav}`);
    } else {
      window.history.replaceState({ nav: 'dashboard' }, '', '#dashboard');
    }

    const handlePopState = (event) => {
      if (event.state && event.state.nav) {
        setActiveNav(event.state.nav);
      } else {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        const cleanNav = hash === 'records' ? 'land_records' : hash;
        setActiveNav(cleanNav);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Backend state
  const [cadastralData, setCadastralData] = useState(null);
  const [referenceLayers, setReferenceLayers] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [sampleDocs, setSampleDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic KPI Metrics State (Updates on single or batch document uploads)
  const [kpiCounts, setKpiCounts] = useState({
    total: 247,
    matched: 189,
    discrepancies: 42,
    highRisk: 16
  });
  const [uploadedRecords, setUploadedRecords] = useState([]);

  const registerAnalyzedDocument = (data) => {
    if (!data) return;
    const riskData = data.risk_assessment || {};
    const riskTier = riskData.risk_tier || '';
    const score = typeof riskData.title_integrity_score === 'number' ? riskData.title_integrity_score : 100;
    const hasCritical = (riskData.critical_flags_count || 0) > 0 || riskTier.includes('CRITICAL');

    let category = 'matched';
    let statusLabel = 'Match';
    let statusType = 'match';
    let isDisputed = false;

    if (score < 50 || hasCritical || riskTier.includes('CRITICAL') || riskTier.includes('HIGH')) {
      category = 'highRisk';
      statusLabel = 'High Risk';
      statusType = 'risk';
      isDisputed = true;
    } else if (score < 80 || riskTier.includes('MODERATE') || (riskData.warning_flags_count || 0) > 0) {
      category = 'discrepancies';
      statusLabel = 'Discrepancy';
      statusType = 'discrepancy';
      isDisputed = true;
    }

    setKpiCounts((prev) => ({
      total: prev.total + 1,
      matched: category === 'matched' ? prev.matched + 1 : prev.matched,
      discrepancies: category === 'discrepancies' ? prev.discrepancies + 1 : prev.discrepancies,
      highRisk: category === 'highRisk' ? prev.highRisk + 1 : prev.highRisk
    }));

    const docOcr = data.ocr_extracted || {};
    const rec = data.reconciliation || {};
    const sNo = rec.survey_no || docOcr.full_survey_ref || docOcr.survey_no || 'Uploaded';
    const ownersList = docOcr.owners || [];
    const ownerName = ownersList.length > 0 ? ownersList.join(', ') : (docOcr.owner_name || 'Uploaded Patta Holder');
    const docArea = docOcr.area?.acres ? String(docOcr.area.acres) : '1.20';
    const gisArea = rec.cadastral_parcel?.gis_area_acres ? String(rec.cadastral_parcel.gis_area_acres) : docArea;
    const diffVal = (parseFloat(docArea) - parseFloat(gisArea)).toFixed(2);
    const diffStr = parseFloat(diffVal) > 0 ? `+${diffVal}` : `${diffVal}`;

    const newRecord = {
      survey_no: sNo,
      sub_div: sNo.includes('/') ? sNo.split('/')[1] : '',
      owner: ownerName,
      doc_area: docArea,
      gis_area: gisArea,
      diff: diffStr,
      status: statusLabel,
      statusType: statusType,
      isDisputed: isDisputed,
      village: docOcr.village || 'Perungudi'
    };

    setUploadedRecords((prev) => [newRecord, ...prev.filter(r => r.survey_no !== sNo)]);
  };

  // Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Load parcels GeoJSON
        const cadRes = await fetch('/api/cadastral/parcels');
        if (cadRes.ok) {
          const cadJson = await cadRes.json();
          setCadastralData(cadJson);
        }

        // Load GIS Reference layers
        const layerRes = await fetch('/api/cadastral/layers');
        if (layerRes.ok) {
          const layerJson = await layerRes.json();
          setReferenceLayers(layerJson);
        }

        // Load benchmark sample documents
        const samplesRes = await fetch('/api/samples');
        if (samplesRes.ok) {
          const samplesJson = await samplesRes.json();
          setSampleDocs(samplesJson);
        }

        // Run default analysis on 102/1A (or active sample)
        const analysisRes = await fetch('/api/analyze/sample/DOC-SAMPLE-01', { method: 'POST' });
        if (analysisRes.ok) {
          const analysisJson = await analysisRes.json();
          setAnalysisResult(analysisJson);
        }
      } catch (err) {
        console.error('Initial data load error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectSurvey = async (sNo, docId) => {
    if (!sNo && !docId) return;
    const cleanNo = sNo ? String(sNo).trim() : '';
    if (cleanNo) setSelectedSurveyNo(cleanNo);
    navigateTo('dashboard'); // Navigate directly to dashboard so map & inspection update
    try {
      setIsLoading(true);
      let sampleId = docId || 'DOC-SAMPLE-01';
      if (!docId && cleanNo) {
        if (cleanNo.includes('104')) sampleId = 'DOC-SAMPLE-02';
        else if (cleanNo.includes('108')) sampleId = 'DOC-SAMPLE-03';
        else if (cleanNo.includes('106') || cleanNo.includes('110')) sampleId = 'DOC-SAMPLE-04';
        else if (cleanNo.includes('112')) sampleId = 'DOC-SAMPLE-05';
      }

      const res = await fetch(`/api/analyze/sample/${sampleId}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        // If user searched for a specific cadastral parcel in the database, fetch its real geometry/props
        try {
          const parcelRes = await fetch(`/api/cadastral/parcel/${encodeURIComponent(cleanNo)}`);
          if (parcelRes.ok) {
            const cadParcel = await parcelRes.json();
            if (cadParcel && cadParcel.properties) {
              if (!data.reconciliation) data.reconciliation = {};
              data.reconciliation.survey_no = cleanNo;
              data.reconciliation.cadastral_parcel = cadParcel.properties;
              if (data.ocr_extracted) {
                data.ocr_extracted.survey_no = cleanNo;
                data.ocr_extracted.full_survey_ref = cleanNo;
                if (cadParcel.properties.registered_owner) {
                  data.ocr_extracted.owners = [cadParcel.properties.registered_owner];
                }
              }
            }
          }
        } catch (e) {
          console.warn("Direct parcel query notice:", e);
        }
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomTextAnalysis = async (text, docTitle) => {
    try {
      setIsLoading(true);
      setIsUploadOpen(false);
      const res = await fetch('/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, doc_title: docTitle })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        registerAnalyzedDocument(data);
        if (data.reconciliation?.survey_no) {
          setSelectedSurveyNo(data.reconciliation.survey_no);
        }
        // Refresh cadastral GeoJSON so new dynamic parcel appears on map & table
        const cadRes = await fetch('/api/cadastral/parcels');
        if (cadRes.ok) {
          const cadJson = await cadRes.json();
          setCadastralData(cadJson);
        }
        navigateTo('dashboard');
      }
    } catch (err) {
      console.error('Custom text analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setIsLoading(true);
      setIsUploadOpen(false);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_type', 'Patta / Deed');

      const isZip = file.name.toLowerCase().endsWith('.zip');
      const endpoint = isZip ? '/api/batch/upload-zip' : '/api/analyze/upload';

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        
        if (isZip && data.documents?.length > 0) {
          // Take first document as active display
          const firstDoc = data.documents[0];
          setAnalysisResult({
            pipeline_status: 'SUCCESS',
            ocr_extracted: firstDoc.ocr_extracted,
            reconciliation: firstDoc.reconciliation,
            risk_assessment: firstDoc.risk_assessment,
            terrain_analysis: firstDoc.terrain_analysis
          });
          if (firstDoc.survey_no) {
            setSelectedSurveyNo(firstDoc.survey_no);
          }
          data.documents.forEach((doc) => registerAnalyzedDocument(doc));
        } else {
          setAnalysisResult(data);
          if (data.reconciliation?.survey_no) {
            setSelectedSurveyNo(data.reconciliation.survey_no);
          }
          registerAnalyzedDocument(data);
        }

        // Refresh cadastral GeoJSON
        const cadRes = await fetch('/api/cadastral/parcels');
        if (cadRes.ok) {
          const cadJson = await cadRes.json();
          setCadastralData(cadJson);
        }

        // Refresh samples list
        const samplesRes = await fetch('/api/samples');
        if (samplesRes.ok) {
          const samplesJson = await samplesRes.json();
          setSampleDocs(samplesJson);
        }

        navigateTo('dashboard');
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanLocalFolders = async () => {
    try {
      setIsLoading(true);
      setIsUploadOpen(false);
      const res = await fetch('/api/batch/scan-folders', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.documents?.length > 0) {
          const firstDoc = data.documents[0];
          setAnalysisResult({
            pipeline_status: 'SUCCESS',
            ocr_extracted: firstDoc.ocr_extracted,
            reconciliation: firstDoc.reconciliation,
            risk_assessment: firstDoc.risk_assessment,
            terrain_analysis: firstDoc.terrain_analysis
          });
          if (firstDoc.survey_no) {
            setSelectedSurveyNo(firstDoc.survey_no);
          }
          data.documents.forEach((doc) => registerAnalyzedDocument(doc));
        }
        
        // Refresh cadastral GeoJSON
        const cadRes = await fetch('/api/cadastral/parcels');
        if (cadRes.ok) {
          const cadJson = await cadRes.json();
          setCadastralData(cadJson);
        }

        // Refresh sample list
        const samplesRes = await fetch('/api/samples');
        if (samplesRes.ok) {
          const samplesJson = await samplesRes.json();
          setSampleDocs(samplesJson);
        }

        navigateTo('dashboard');
      }
    } catch (err) {
      console.error('Local scan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={navigateTo}
        documentCount={2}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar with Live Search Engine */}
        <TopHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelectSurvey={handleSelectSurvey}
          cadastralData={cadastralData}
          uploadedRecords={uploadedRecords}
          sampleDocs={sampleDocs}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          {/* Universal In-App Back Navigation Bar (shown on all child pages) */}
          {activeNav !== 'dashboard' && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    navigateTo('dashboard');
                  }
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-800 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer group select-none"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-emerald-600" />
                <span>← Back to Dashboard</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Current View:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold capitalize">
                  {activeNav.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* View 1: Main Dashboard (Default) */}
          {activeNav === 'dashboard' && (
            <>
              {/* Top Title & 4 KPI Metric Cards */}
              <KpiMetrics
                totalRecords={kpiCounts.total}
                matchedRecords={kpiCounts.matched}
                discrepanciesCount={kpiCounts.discrepancies}
                highRiskCount={kpiCounts.highRisk}
                location={
                  analysisResult?.reconciliation?.cadastral_parcel?.village
                    ? `${analysisResult.reconciliation.cadastral_parcel.village}, ${analysisResult.reconciliation.cadastral_parcel.district || 'Tamil Nadu'}`
                    : analysisResult?.ocr_extracted?.village
                    ? `${analysisResult.ocr_extracted.village}, ${analysisResult.ocr_extracted.district || 'Tamil Nadu'}`
                    : 'Madurai, Tamil Nadu'
                }
              />

              {/* Core Content Grid (Center Workspace + Right Info Panel) */}
              <div className="flex gap-5">
                {/* Center Main Workspace (Dual Pane Top + Dual Card Bottom) */}
                <div className="flex-1 space-y-5 min-w-0">
                  {/* Dual-Pane Row: Interactive Map (Left) + Document Panel (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: GIS Map View (7 cols) */}
                    <div className="lg:col-span-7 h-[440px]">
                      <GisMap
                        cadastralData={cadastralData}
                        referenceLayers={referenceLayers}
                        selectedSurveyNo={selectedSurveyNo}
                        reconciliationData={analysisResult?.reconciliation}
                        onSelectParcel={handleSelectSurvey}
                        onOpenExpansionNotice={() => setIsExpansionOpen(true)}
                      />
                    </div>

                    {/* Right: Document & Extraction Panel (5 cols) */}
                    <div className="lg:col-span-5 h-[440px]">
                      <DocumentPanel
                        onOpenUpload={() => setIsUploadOpen(true)}
                        ocrData={analysisResult?.ocr_extracted}
                        reconciliationData={analysisResult?.reconciliation}
                        onOpenExpansionNotice={() => setIsExpansionOpen(true)}
                        onSelectDocument={(docId) => {
                          if (docId === 'patta') handleSelectSurvey('102/3A');
                          else if (docId === 'sale_deed') handleSelectSurvey('104/1');
                          else if (docId === 'fmb') handleSelectSurvey('102/3B');
                          else if (docId === 'adangal') handleSelectSurvey('106/1A');
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Dual-Card Row: Recent Land Documents / Cadastral Registry (Left) + Risk Assessment (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Recent Land Documents & Cadastral Registry (7 cols) */}
                    <div className="lg:col-span-7 min-h-[380px] flex flex-col">
                      {/* Top Switcher Tabs between Recent Documents and Cadastral Registry */}
                      <div className="flex items-center justify-between mb-2 px-1">
                        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setBottomLeftTab('recent_docs')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              bottomLeftTab === 'recent_docs'
                                ? 'bg-white text-emerald-800 font-bold shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Recent Land Documents (5)
                          </button>
                          <button
                            type="button"
                            onClick={() => setBottomLeftTab('registry')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                              bottomLeftTab === 'registry'
                                ? 'bg-white text-emerald-800 font-bold shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Cadastral Registry ({kpiCounts.total})
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                          {bottomLeftTab === 'recent_docs' ? 'Latest verified uploads' : 'Official GIS parcel database'}
                        </span>
                      </div>

                      {/* Active Card Body */}
                      <div className="flex-1 min-h-0">
                        {bottomLeftTab === 'recent_docs' ? (
                          <RecentDocumentsCard
                            onSelectDocument={handleSelectSurvey}
                            onOpenUpload={() => setIsUploadOpen(true)}
                            onViewAll={() => navigateTo('land_records')}
                            uploadedRecords={uploadedRecords}
                            selectedSurveyNo={selectedSurveyNo}
                          />
                        ) : (
                          <CadastralRegistryTable
                            selectedSurveyNo={selectedSurveyNo}
                            onSelectSurvey={handleSelectSurvey}
                            totalRecords={kpiCounts.total}
                            uploadedRecords={uploadedRecords}
                            searchTerm={searchTerm}
                            onViewAll={() => navigateTo('land_records')}
                          />
                        )}
                      </div>
                    </div>

                    {/* Right: Land Analysis & Risk Assessment (5 cols) */}
                    <div className="lg:col-span-5 min-h-[380px]">
                      <RiskAssessmentCard
                        selectedSurveyNo={selectedSurveyNo}
                        riskData={analysisResult?.risk_assessment}
                        onOpenAudit={() => setIsAuditOpen(true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Sidebar: "Why this UI works?" + "Alternative Layout Options" */}
                <RightSidebar />
              </div>
            </>
          )}

          {/* View 2: Full Map Viewer */}
          {activeNav === 'map' && (
            <div className="h-[750px]">
              <GisMap
                cadastralData={cadastralData}
                referenceLayers={referenceLayers}
                selectedSurveyNo={selectedSurveyNo}
                reconciliationData={analysisResult?.reconciliation}
                onSelectParcel={handleSelectSurvey}
                onOpenExpansionNotice={() => setIsExpansionOpen(true)}
              />
            </div>
          )}

          {/* View 3: Dedicated Documents & Upload Panel */}
          {activeNav === 'documents' && (
            <div className="max-w-3xl mx-auto min-h-[500px]">
              <DocumentPanel
                onOpenUpload={() => setIsUploadOpen(true)}
                ocrData={analysisResult?.ocr_extracted}
                reconciliationData={analysisResult?.reconciliation}
                onOpenExpansionNotice={() => setIsExpansionOpen(true)}
                onSelectDocument={(docId) => {
                  if (docId === 'patta') handleSelectSurvey('102/3A');
                  else if (docId === 'sale_deed') handleSelectSurvey('104/1');
                  else if (docId === 'fmb') handleSelectSurvey('102/3B');
                  else if (docId === 'adangal') handleSelectSurvey('106/1A');
                }}
              />
            </div>
          )}

          {/* View 4: Land Records Database */}
          {(activeNav === 'land_records' || activeNav === 'records') && (
            <LandRecordsView
              cadastralData={cadastralData}
              selectedSurveyNo={selectedSurveyNo}
              onSelectSurvey={handleSelectSurvey}
              totalRecords={kpiCounts.total}
              uploadedRecords={uploadedRecords}
              searchTerm={searchTerm}
              onBack={() => navigateTo('dashboard')}
            />
          )}

          {/* View 5: Analysis & Reports */}
          {activeNav === 'analysis' && (
            <AnalysisReportsView
              reconciliationData={analysisResult?.reconciliation}
              riskData={analysisResult?.risk_assessment}
              onOpenAudit={() => setIsAuditOpen(true)}
              onBack={() => navigateTo('dashboard')}
            />
          )}

          {/* View 6: Settings */}
          {activeNav === 'settings' && (
            <div className="dash-card p-6 bg-white space-y-4 max-w-2xl mx-auto">
              <h3 className="text-base font-bold text-slate-900">FarmAI Platform Configuration</h3>
              <p className="text-xs text-slate-500">Statutory buffer thresholds and OCR confidence parameters for Task 2.</p>
              
              <div className="space-y-3 text-xs pt-2">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-700">Water Body Statutory Buffer Zone:</span>
                  <span className="font-bold text-emerald-700 font-mono">30.0 meters</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-700">Highway Right-of-Way Corridor Setback:</span>
                  <span className="font-bold text-amber-700 font-mono">10.0 - 45.0 meters</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-700">Legal Area Variance Tolerance Margin:</span>
                  <span className="font-bold text-blue-700 font-mono">2.0%</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Footer Line */}
          <div className="pt-4 pb-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600">🌱</span>
              <span>AI-Powered | GIS Enabled | Document Intelligence | Risk Assessment</span>
            </div>
            <div className="text-right">
              <span>"Smarter Land Verification for a Transparent Tomorrow" 🌾</span>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Document Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalyzeText={handleCustomTextAnalysis}
        onUploadFile={handleFileUpload}
        onScanLocalFolders={handleScanLocalFolders}
        isAnalyzing={isLoading}
      />

      {/* Audit Certificate Modal */}
      <AuditCertificateModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        reconciliationData={analysisResult?.reconciliation}
        riskData={analysisResult?.risk_assessment}
      />

      {/* Future Implementation Area / Expansion Notice Modal */}
      <ExpansionNoticeModal
        isOpen={isExpansionOpen}
        onClose={() => setIsExpansionOpen(false)}
        reconciliationData={analysisResult?.reconciliation}
        ocrData={analysisResult?.ocr_extracted}
      />
    </div>
  );
}
