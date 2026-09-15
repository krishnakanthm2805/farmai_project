import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import KpiMetrics from './components/KpiMetrics';
import GisMap from './components/GisMap';
import DocumentPanel from './components/DocumentPanel';
import CadastralRegistryTable from './components/CadastralRegistryTable';
import RiskAssessmentCard from './components/RiskAssessmentCard';
import RightSidebar from './components/RightSidebar';
import AnalysisReportsView from './components/AnalysisReportsView';
import LandRecordsView from './components/LandRecordsView';
import UploadModal from './components/UploadModal';
import AuditCertificateModal from './components/AuditCertificateModal';

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurveyNo, setSelectedSurveyNo] = useState('102/3A');
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Backend state
  const [cadastralData, setCadastralData] = useState(null);
  const [referenceLayers, setReferenceLayers] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSelectSurvey = async (sNo) => {
    setSelectedSurveyNo(sNo);
    try {
      setIsLoading(true);
      let sampleId = 'DOC-SAMPLE-01';
      if (sNo.includes('104')) sampleId = 'DOC-SAMPLE-02';
      else if (sNo.includes('108')) sampleId = 'DOC-SAMPLE-03';
      else if (sNo.includes('106') || sNo.includes('110')) sampleId = 'DOC-SAMPLE-04';
      else if (sNo.includes('112')) sampleId = 'DOC-SAMPLE-05';

      const res = await fetch(`/api/analyze/sample/${sampleId}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
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
        if (data.reconciliation?.survey_no) {
          setSelectedSurveyNo(data.reconciliation.survey_no);
        }
        // Refresh cadastral GeoJSON so new dynamic parcel appears on map & table
        const cadRes = await fetch('/api/cadastral/parcels');
        if (cadRes.ok) {
          const cadJson = await cadRes.json();
          setCadastralData(cadJson);
        }
        setActiveNav('dashboard');
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

      const res = await fetch('/api/analyze/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        if (data.reconciliation?.survey_no) {
          setSelectedSurveyNo(data.reconciliation.survey_no);
        }
        // Refresh cadastral GeoJSON
        const cadRes = await fetch('/api/cadastral/parcels');
        if (cadRes.ok) {
          const cadJson = await cadRes.json();
          setCadastralData(cadJson);
        }
        setActiveNav('dashboard');
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased">
      {/* 1. Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        documentCount={2}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 space-y-5 max-w-[1600px] w-full mx-auto">
          {/* View 1: Main Dashboard (Default) */}
          {activeNav === 'dashboard' && (
            <>
              {/* Top Title & 4 KPI Metric Cards */}
              <KpiMetrics
                totalRecords={247}
                matchedRecords={189}
                discrepanciesCount={42}
                highRiskCount={16}
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
                      />
                    </div>

                    {/* Right: Document & Extraction Panel (5 cols) */}
                    <div className="lg:col-span-5 h-[440px]">
                      <DocumentPanel
                        onOpenUpload={() => setIsUploadOpen(true)}
                        ocrData={analysisResult?.ocr_extracted}
                        reconciliationData={analysisResult?.reconciliation}
                        onSelectDocument={(docId) => {
                          if (docId === 'patta') handleSelectSurvey('102/3A');
                          else if (docId === 'sale_deed') handleSelectSurvey('104/1');
                          else if (docId === 'fmb') handleSelectSurvey('102/3B');
                          else if (docId === 'adangal') handleSelectSurvey('106/1A');
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Dual-Card Row: Cadastral Registry (Left) + Risk Assessment (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Cadastral Land Registry Table (7 cols) */}
                    <div className="lg:col-span-7 min-h-[340px]">
                      <CadastralRegistryTable
                        selectedSurveyNo={selectedSurveyNo}
                        onSelectSurvey={handleSelectSurvey}
                      />
                    </div>

                    {/* Right: Land Analysis & Risk Assessment (5 cols) */}
                    <div className="lg:col-span-5 min-h-[340px]">
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
          {activeNav === 'land_records' && (
            <LandRecordsView
              cadastralData={cadastralData}
              selectedSurveyNo={selectedSurveyNo}
              onSelectSurvey={handleSelectSurvey}
            />
          )}

          {/* View 5: Analysis & Reports */}
          {activeNav === 'analysis' && (
            <AnalysisReportsView
              reconciliationData={analysisResult?.reconciliation}
              riskData={analysisResult?.risk_assessment}
              onOpenAudit={() => setIsAuditOpen(true)}
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
        isAnalyzing={isLoading}
      />

      {/* Audit Certificate Modal */}
      <AuditCertificateModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        reconciliationData={analysisResult?.reconciliation}
        riskData={analysisResult?.risk_assessment}
      />
    </div>
  );
}
