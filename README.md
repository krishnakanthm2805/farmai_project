# FarmAI – GeoLand Intelligence 🌾🗺️

> **Multimodal GeoAI & Land Document Intelligence Platform**
> 
> Real-time Land Document OCR, FMB Vectorization, Cadastral GIS Reconciliation, Encroachment Detection, and Title Integrity Risk Scoring (0–100).

---

## 🌟 Key Features

* **Multimodal Land Document OCR**: Bilingual extraction (Tamil & English) for e-Patta/Chitta (Form 10), Sale Deeds, and Adangals. Automatically captures Survey Numbers, Subdivisions, Extents, Owners, and Land Classifications.
* **FMB Vectorizer**: Converts Field Measurement Book surveyor ladders, $G$-lines, and offset measurements into high-precision vector polygons.
* **Cadastral GIS Reconciliation**: Performs 3-way geometric reconciliation (Document Claimed Extent vs. Cadastral GIS Polygon vs. FMB Surveyed Area).
* **Statutory Encroachment Auditing**: Shapely geometric intersection algorithms to detect illegal intrusions into **30-meter waterbody buffers** (*Kanmois*, rivers, lakes) and **10m–15m road Right-of-Way (RoW)** setbacks.
* **Title Integrity Score (0–100)**: Comprehensive risk engine assessing ownership discrepancies, area inflation, and boundary variances.
* **Enterprise GIS Dashboard**: Interactive Leaflet satellite map (Esri World Imagery) with automatic parcel fly-to, dynamic landmark overlays, and downloadable Audit Certificates.

---

## 🏗️ Architecture & Technology Stack

### Backend
* **Python 3.13**
* **FastAPI & Uvicorn**: High-performance asynchronous REST API.
* **Shapely**: Computational geometry and spatial intersections.
* **PyPDF & Pytesseract**: Multimodal PDF/Image text extraction.

### Frontend
* **React 18 + Vite**
* **Tailwind CSS v4**
* **Leaflet & React-Leaflet**: Satellite, hybrid, and vector map visualizations.
* **Lucide React Icons**

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
python -m pip install fastapi uvicorn shapely pypdf pytesseract pillow
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be live at `http://127.0.0.1:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be accessible at `http://localhost:5173`.

---

## 📡 REST API Endpoints

* `GET /api/health` - Health check and module status.
* `GET /api/cadastral/parcels` - Full Cadastral GeoJSON feature collection.
* `GET /api/cadastral/layers` - Waterbody and road GIS reference layers.
* `POST /api/analyze/upload` - Upload and analyze raw PDF/image documents.
* `POST /api/analyze/text` - Direct text extraction & spatial reconciliation.
* `POST /api/analyze/sample/{sample_id}` - Benchmark sample evaluation.
* `GET /api/report/{survey_no}` - Land Audit Certificate generation.

---

## 📜 License
MIT License
