"""
FastAPI Backend API Server for FarmAI - Multimodal GeoAI & Land Document Intelligence Platform (Task 2).
"""

import os
import json
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.ocr_engine import ocr_engine
from backend.fmb_parser import fmb_engine
from backend.spatial_engine import spatial_engine
from backend.risk_analyzer import risk_analyzer
from backend.terrain_engine import terrain_engine

app = FastAPI(
    title="FarmAI GeoLand Intelligence API",
    description="Multimodal GeoAI, Land Document OCR, FMB Matching, & Discrepancy Detection Platform (Task 2)",
    version="1.0.0"
)

# Enable CORS for Frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    text: str
    doc_title: Optional[str] = "Uploaded Document"

class SurveyQueryRequest(BaseModel):
    survey_no: str

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FarmAI GeoLand Intelligence Backend",
        "version": "1.0.0",
        "modules": {
            "ocr_engine": "ACTIVE",
            "fmb_parser": "ACTIVE",
            "spatial_engine": "ACTIVE",
            "risk_analyzer": "ACTIVE"
        }
    }

@app.get("/api/cadastral/parcels")
def get_cadastral_parcels():
    """Returns the full Cadastral GeoJSON feature collection."""
    return spatial_engine.get_all_parcels()

@app.get("/api/cadastral/layers")
def get_reference_layers():
    """Returns waterbody and road GIS reference layers."""
    return spatial_engine.get_reference_layers()

@app.get("/api/cadastral/parcel/{survey_no:path}")
def get_parcel_detail(survey_no: str):
    """Retrieves single cadastral parcel by survey number."""
    parcel = spatial_engine.find_cadastral_parcel(survey_no)
    if not parcel:
        raise HTTPException(status_code=404, detail=f"Parcel {survey_no} not found")
    return parcel

@app.get("/api/fmb/{survey_no:path}")
def get_fmb_geometry(survey_no: str):
    """Retrieves FMB ladder offsets and computed polygon."""
    return fmb_engine.calculate_fmb_polygon(survey_no)

@app.get("/api/samples")
def get_sample_documents():
    """Returns benchmark sample test documents representing typical verification scenarios."""
    import os
    samples_path = os.path.join(os.path.dirname(__file__), "data", "sample_documents.json")
    if os.path.exists(samples_path):
        with open(samples_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@app.post("/api/analyze/sample/{sample_id}")
def analyze_sample(sample_id: str):
    """Executes end-to-end multimodal pipeline on a benchmark sample document."""
    # 1. OCR Extraction
    doc_data = ocr_engine.parse_sample_document(sample_id)
    survey_no = doc_data.get("full_survey_ref") or doc_data.get("survey_no")

    # 2. FMB Geometry
    fmb_data = fmb_engine.calculate_fmb_polygon(survey_no)

    # 3. Spatial Cadastral Reconciliation
    reconciliation = spatial_engine.reconcile_land_record(doc_data, fmb_data)

    # 4. Title Integrity & Risk Assessment
    risk_evaluation = risk_analyzer.evaluate_risk(reconciliation)

    # 5. Raster DEM & Terrain Analysis (Elevation, Slope, Flood Risk)
    cad_parcel = reconciliation.get("cadastral_parcel", {})
    coords = cad_parcel.get("geometry", {}).get("coordinates", [[[78.7844, 9.8227]]])[0][0]
    terrain_data = terrain_engine.analyze_parcel_terrain(
        lat=coords[1],
        lng=coords[0],
        district=doc_data.get("district", "Ramanathapuram"),
        taluk=doc_data.get("taluk", "R.S. Mangalam")
    )

    return {
        "pipeline_status": "SUCCESS",
        "sample_id": sample_id,
        "ocr_extracted": doc_data,
        "fmb_parsed": fmb_data,
        "reconciliation": reconciliation,
        "risk_assessment": risk_evaluation,
        "terrain_analysis": terrain_data
    }

@app.post("/api/analyze/text")
def analyze_raw_text(payload: TextAnalysisRequest):
    """Executes OCR extraction & spatial reconciliation from raw text."""
    # 1. OCR Extraction
    doc_data = ocr_engine.extract_from_text(payload.text, payload.doc_title)
    survey_no = doc_data.get("full_survey_ref") or doc_data.get("survey_no")

    # 2. FMB Geometry
    fmb_data = fmb_engine.calculate_fmb_polygon(survey_no)

    # 3. Spatial Cadastral Reconciliation
    reconciliation = spatial_engine.reconcile_land_record(doc_data, fmb_data)

    # 4. Title Integrity & Risk Assessment
    risk_evaluation = risk_analyzer.evaluate_risk(reconciliation)

    # 5. Raster DEM & Terrain Analysis
    cad_parcel = reconciliation.get("cadastral_parcel", {})
    coords = cad_parcel.get("geometry", {}).get("coordinates", [[[78.7844, 9.8227]]])[0][0]
    terrain_data = terrain_engine.analyze_parcel_terrain(
        lat=coords[1],
        lng=coords[0],
        district=doc_data.get("district", "Ramanathapuram"),
        taluk=doc_data.get("taluk", "R.S. Mangalam")
    )

    return {
        "pipeline_status": "SUCCESS",
        "ocr_extracted": doc_data,
        "fmb_parsed": fmb_data,
        "reconciliation": reconciliation,
        "risk_assessment": risk_evaluation,
        "terrain_analysis": terrain_data
    }

@app.post("/api/analyze/upload")
async def analyze_uploaded_document(
    file: UploadFile = File(...),
    doc_type: str = Form("Patta / Sale Deed")
):
    """Processes an uploaded PDF or image file, runs OCR parsing and spatial analysis."""
    contents = await file.read()
    filename = file.filename or "Uploaded_Patta.pdf"
    
    # 1. Multi-format OCR & Entity Extraction
    doc_data = ocr_engine.extract_from_file_bytes(contents, filename, doc_type)
    survey_no = doc_data.get("full_survey_ref") or doc_data.get("survey_no") or "102/3A"

    # 2. FMB Survey Geometry
    fmb_data = fmb_engine.calculate_fmb_polygon(survey_no)

    # 3. Spatial Cadastral Reconciliation
    reconciliation = spatial_engine.reconcile_land_record(doc_data, fmb_data)

    # 4. Title Integrity & Risk Assessment
    risk_evaluation = risk_analyzer.evaluate_risk(reconciliation)

    # 5. Raster DEM & Terrain Analysis
    cad_parcel = reconciliation.get("cadastral_parcel", {})
    coords = cad_parcel.get("geometry", {}).get("coordinates", [[[78.7844, 9.8227]]])[0][0]
    terrain_data = terrain_engine.analyze_parcel_terrain(
        lat=coords[1],
        lng=coords[0],
        district=doc_data.get("district", "Ramanathapuram"),
        taluk=doc_data.get("taluk", "R.S. Mangalam")
    )

    return {
        "pipeline_status": "SUCCESS",
        "file_uploaded": filename,
        "file_size_bytes": len(contents),
        "ocr_extracted": doc_data,
        "fmb_parsed": fmb_data,
        "reconciliation": reconciliation,
        "risk_assessment": risk_evaluation,
        "terrain_analysis": terrain_data
    }

@app.get("/api/terrain/{survey_no:path}")
def get_terrain_elevation(survey_no: str):
    """Retrieves DEM elevation, slope, and flood vulnerability for a survey parcel."""
    parcel = spatial_engine.find_cadastral_parcel(survey_no)
    lat, lng = 9.8227, 78.7844
    district, taluk = "Ramanathapuram", "R.S. Mangalam"
    if parcel:
        coords = parcel.get("geometry", {}).get("coordinates", [[[78.7844, 9.8227]]])[0][0]
        lng, lat = coords[0], coords[1]
        district = parcel.get("properties", {}).get("district", "Ramanathapuram")
        taluk = parcel.get("properties", {}).get("taluk", "R.S. Mangalam")
    return terrain_engine.analyze_parcel_terrain(lat, lng, district, taluk)

@app.get("/api/report/{survey_no:path}")
def generate_audit_certificate(survey_no: str):
    """Generates official verification certificate metadata."""
    cadastral = spatial_engine.find_cadastral_parcel(survey_no)
    if not cadastral:
        raise HTTPException(status_code=404, detail="Parcel not found")
        
    doc_data = ocr_engine.parse_sample_document(survey_no)
    fmb_data = fmb_engine.calculate_fmb_polygon(survey_no)
    reconciliation = spatial_engine.reconcile_land_record(doc_data, fmb_data)
    risk = risk_analyzer.evaluate_risk(reconciliation)

    return {
        "certificate_id": f"CERT-FARMAI-{survey_no.replace('/', '-')}-2026",
        "issue_authority": "FarmAI GeoLand Automated Due Diligence Registry",
        "survey_no": survey_no,
        "district": "Chennai",
        "taluk": "Sholinganallur",
        "village": "Perungudi",
        "title_integrity_score": risk["title_integrity_score"],
        "risk_tier": risk["risk_tier"],
        "verdict": risk["verdict"],
        "reconciliation": reconciliation,
        "risk_details": risk
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
