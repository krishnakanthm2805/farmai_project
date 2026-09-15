"""
Batch Ingestion & Directory Scanner Engine.
Recursively scans subfolders for PDFs, images, and geospatial layers,
or extracts and parses uploaded ZIP bundles automatically.
"""

import os
import zipfile
import json
import io
from typing import Dict, Any, List, Optional

from backend.ocr_engine import ocr_engine
from backend.fmb_parser import fmb_engine
from backend.spatial_engine import spatial_engine
from backend.risk_analyzer import risk_analyzer
from backend.terrain_engine import terrain_engine

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
LAND_DOCS_DIR = os.path.join(DATA_DIR, "Land_documents")
GEOSPATIAL_DIR = os.path.join(DATA_DIR, "Geospatial_Layer")

class BatchIngestionEngine:
    def __init__(self):
        os.makedirs(LAND_DOCS_DIR, exist_ok=True)
        os.makedirs(GEOSPATIAL_DIR, exist_ok=True)

    def process_zip_bytes(self, zip_bytes: bytes) -> Dict[str, Any]:
        """Extracts a ZIP archive in-memory or on disk and processes all contained documents and GIS layers."""
        processed_docs = []
        processed_layers = []
        
        with zipfile.ZipFile(io.BytesIO(zip_bytes), "r") as z:
            for file_info in z.infolist():
                if file_info.is_dir() or file_info.filename.startswith("__MACOSX") or file_info.filename.startswith("."):
                    continue
                
                filename = os.path.basename(file_info.filename)
                ext = os.path.splitext(filename)[1].lower()
                file_data = z.read(file_info.filename)
                
                # 1. Process Land Documents (PDF, Images)
                if ext in [".pdf", ".jpg", ".jpeg", ".png", ".tif", ".tiff", ".txt"]:
                    target_path = os.path.join(LAND_DOCS_DIR, filename)
                    with open(target_path, "wb") as f:
                        f.write(file_data)
                    
                    # Run Multimodal OCR
                    doc_data = ocr_engine.extract_from_file_bytes(file_data, filename)
                    survey_no = doc_data.get("full_survey_ref") or doc_data.get("survey_no") or "102/3A"
                    
                    # Compute FMB, Spatial reconciliation, Terrain & Risk
                    fmb_data = fmb_engine.calculate_fmb_polygon(survey_no)
                    reconciliation = spatial_engine.reconcile_land_record(doc_data, fmb_data)
                    risk_evaluation = risk_analyzer.evaluate_risk(reconciliation)
                    
                    coords = reconciliation.get("cadastral_parcel", {}).get("geometry", {}).get("coordinates", [[[78.7844, 9.8227]]])[0][0]
                    terrain_data = terrain_engine.analyze_parcel_terrain(
                        lat=coords[1],
                        lng=coords[0],
                        district=doc_data.get("district", "Ramanathapuram"),
                        taluk=doc_data.get("taluk", "R.S. Mangalam")
                    )
                    
                    processed_docs.append({
                        "filename": filename,
                        "relative_path": file_info.filename,
                        "file_size_bytes": len(file_data),
                        "survey_no": survey_no,
                        "ocr_extracted": doc_data,
                        "reconciliation": reconciliation,
                        "risk_assessment": risk_evaluation,
                        "terrain_analysis": terrain_data
                    })

                # 2. Process Geospatial Layers (GeoJSON, JSON)
                elif ext in [".geojson", ".json"]:
                    target_path = os.path.join(GEOSPATIAL_DIR, filename)
                    with open(target_path, "wb") as f:
                        f.write(file_data)
                    
                    try:
                        geojson_content = json.loads(file_data.decode("utf-8", errors="ignore"))
                        # Ingest into spatial engine
                        if "features" in geojson_content:
                            for feat in geojson_content["features"]:
                                s_no = feat.get("properties", {}).get("survey_no")
                                if s_no:
                                    clean_s = str(s_no).strip().replace(" ", "")
                                    spatial_engine.parcels_by_survey[clean_s] = feat
                                    spatial_engine.cadastral_geojson["features"].append(feat)
                            processed_layers.append({
                                "filename": filename,
                                "feature_count": len(geojson_content["features"]),
                                "type": "GeoJSON FeatureCollection"
                            })
                    except Exception as e:
                        print(f"Notice on GeoJSON parse: {e}")

        # Update sample_documents.json registry
        self._sync_sample_documents_registry(processed_docs)

        return {
            "status": "SUCCESS",
            "total_documents_processed": len(processed_docs),
            "total_layers_ingested": len(processed_layers),
            "documents": processed_docs,
            "layers": processed_layers
        }

    def scan_and_ingest_folders(self) -> Dict[str, Any]:
        """Scans Land_documents and Geospatial_Layer subfolders on disk and indexes all files."""
        processed_docs = []
        processed_layers = []

        # 1. Scan Land_documents
        if os.path.exists(LAND_DOCS_DIR):
            for root, _, files in os.walk(LAND_DOCS_DIR):
                for f in files:
                    ext = os.path.splitext(f)[1].lower()
                    if ext in [".pdf", ".jpg", ".jpeg", ".png", ".tif", ".tiff", ".txt"]:
                        file_path = os.path.join(root, f)
                        with open(file_path, "rb") as fp:
                            file_data = fp.read()
                        
                        doc_data = ocr_engine.extract_from_file_bytes(file_data, f)
                        survey_no = doc_data.get("full_survey_ref") or doc_data.get("survey_no") or "102/3A"
                        fmb_data = fmb_engine.calculate_fmb_polygon(survey_no)
                        reconciliation = spatial_engine.reconcile_land_record(doc_data, fmb_data)
                        risk_evaluation = risk_analyzer.evaluate_risk(reconciliation)

                        coords = reconciliation.get("cadastral_parcel", {}).get("geometry", {}).get("coordinates", [[[78.7844, 9.8227]]])[0][0]
                        terrain_data = terrain_engine.analyze_parcel_terrain(
                            lat=coords[1],
                            lng=coords[0],
                            district=doc_data.get("district", "Ramanathapuram"),
                            taluk=doc_data.get("taluk", "R.S. Mangalam")
                        )

                        processed_docs.append({
                            "filename": f,
                            "survey_no": survey_no,
                            "ocr_extracted": doc_data,
                            "reconciliation": reconciliation,
                            "risk_assessment": risk_evaluation,
                            "terrain_analysis": terrain_data
                        })

        # 2. Scan Geospatial_Layer
        if os.path.exists(GEOSPATIAL_DIR):
            for root, _, files in os.walk(GEOSPATIAL_DIR):
                for f in files:
                    ext = os.path.splitext(f)[1].lower()
                    if ext in [".geojson", ".json"] and f != "sample_documents.json":
                        file_path = os.path.join(root, f)
                        with open(file_path, "r", encoding="utf-8") as fp:
                            try:
                                content = json.load(fp)
                                if "features" in content:
                                    for feat in content["features"]:
                                        s_no = feat.get("properties", {}).get("survey_no")
                                        if s_no:
                                            spatial_engine.parcels_by_survey[str(s_no).strip().replace(" ", "")] = feat
                                    processed_layers.append({
                                        "filename": f,
                                        "features": len(content["features"])
                                    })
                            except Exception:
                                pass

        self._sync_sample_documents_registry(processed_docs)

        return {
            "status": "SUCCESS",
            "total_documents": len(processed_docs),
            "total_layers": len(processed_layers),
            "documents": processed_docs,
            "layers": processed_layers
        }

    def _sync_sample_documents_registry(self, docs_list: List[Dict[str, Any]]):
        """Saves parsed documents to sample_documents.json so they appear in UI sample selector."""
        samples_path = os.path.join(DATA_DIR, "sample_documents.json")
        land_docs_samples_path = os.path.join(LAND_DOCS_DIR, "sample_documents.json")

        existing_samples = []
        if os.path.exists(samples_path):
            try:
                with open(samples_path, "r", encoding="utf-8") as f:
                    existing_samples = json.load(f)
            except Exception:
                existing_samples = []

        existing_ids = {s.get("id") or s.get("survey_no") for s in existing_samples}

        for idx, doc in enumerate(docs_list):
            ocr = doc.get("ocr_extracted", {})
            s_no = ocr.get("full_survey_ref") or ocr.get("survey_no") or f"DOC-{idx+10}"
            doc_id = f"ZIP-DOC-{s_no.replace('/', '-')}"

            if doc_id not in existing_ids:
                new_sample = {
                    "id": doc_id,
                    "title": f"Uploaded Record - {doc.get('filename')} (Survey {s_no})",
                    "doc_type": "e-Patta / Land Document",
                    "survey_no": s_no,
                    "patta_no": ocr.get("patta_no", "PAT-UPLOAD"),
                    "owner": ", ".join(ocr.get("owners", ["Pattadar"])),
                    "village": ocr.get("village", "Rajasingamangalam"),
                    "taluk": ocr.get("taluk", "R.S. Mangalam"),
                    "district": ocr.get("district", "Ramanathapuram"),
                    "documented_area": ocr.get("area", {}),
                    "land_classification": ocr.get("land_classification", "Ryotwari Dry (Punjai)"),
                    "boundaries": ocr.get("boundaries", {}),
                    "raw_text": ocr.get("raw_text", ""),
                    "scenario_tag": "INGESTED_ZIP_RECORD",
                    "expected_risk": "MEDIUM"
                }
                existing_samples.append(new_sample)
                existing_ids.add(doc_id)

        try:
            with open(samples_path, "w", encoding="utf-8") as f:
                json.dump(existing_samples, f, indent=2, ensure_ascii=False)
            with open(land_docs_samples_path, "w", encoding="utf-8") as f:
                json.dump(existing_samples, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error updating sample registry: {e}")

batch_engine = BatchIngestionEngine()
