# 🌾 FarmAI – GeoLand Intelligence: Executive Presentation Deck

> **Project**: FarmAI – Task 2: Multimodal GeoAI & Land Document Due Diligence Platform  
> **Team**: Team 63 (`FAI-TCE-Team-63`) | FarmAI Research & Engineering Team  
> **Downloadable PowerPoint File**: [`FarmAI_Project_Presentation.pptx`](file:///d:/project/farmai_project-main/FarmAI_Project_Presentation.pptx)  
> **Repository**: [https://github.com/krishnakanthm2805/farmai_project.git](https://github.com/krishnakanthm2805/farmai_project.git)  

---

## 📑 Slide Deck Outline & Speaker Script

```
┌────────────────────────────────────────────────────────────────────────┐
│                          12-SLIDE PRESENTATION                         │
├────┬───────────────────────────────────┬────┬───────────────────────────┤
│ 01 │ Title & Platform Overview         │ 07 │ Mathematical Risk Matrix  │
│ 02 │ The Real-World Problem Silos      │ 08 │ 5 Benchmark Stress Tests  │
│ 03 │ The FarmAI Value Proposition      │ 09 │ Interactive GIS UI & Cert │
│ 04 │ End-to-End System Architecture    │ 10 │ AWS Cloud & GitHub Actions│
│ 05 │ Core GeoAI Engines 1 to 3         │ 11 │ Business ROI & Roadmap    │
│ 06 │ Core GeoAI Engines 4 to 6         │ 12 │ Conclusion & Live Q&A     │
└────┴───────────────────────────────────┴────┴───────────────────────────┘
```

---

### Slide 1: Title & Platform Overview

#### Visual Layout:
* **Header Badge:** `TASK 2 • GEOLAND AI`
* **Title:** **FarmAI – GeoLand Intelligence**
* **Subtitle:** Autonomous Multimodal GeoAI & Land Document Due Diligence Platform
* **Tagline:** Real-time Bilingual OCR, FMB Ladder Vectorization, 3-Way Cadastral Reconciliation, and Statutory Buffer Auditing.
* **Technology Badges:** `FastAPI` • `Shapely` • `React 18` • `Leaflet` • `Amazon Textract` • `AWS DynamoDB`

#### 🎙️ Speaker Notes:
> *"Good morning respected evaluators and jury members. Today, our team is proud to present **FarmAI – GeoLand Intelligence**, an autonomous multimodal GeoAI platform designed to revolutionize land title due diligence, agro-financing, and large-scale infrastructure acquisition.*
>
> *Whether establishing a solar park, verifying agricultural crop loans, or acquiring land corridors, institutions today struggle with decades-old, fragmented records. FarmAI bridges the gap between unstructured physical paper deeds and modern geospatial satellite GIS in sub-seconds."*

---

### Slide 2: The Real-World Challenge: Manual Due Diligence is Broken

#### Visual Layout:
* **Pillar 1 (Heterogeneous Data Silos):** Hand-scanned bilingual e-Pattas (Form 10), Chitta, and Sale Deeds in Tamil and English completely disconnected from government cadastral maps.
* **Pillar 2 (Complex FMB Survey Ladders):** Field Measurement Books (FMB) use century-old G-lines and offset tables that take certified surveyors days to reconstruct manually.
* **Pillar 3 (Hidden Statutory Liabilities):** Illegal encroachments inside mandatory 30m waterbody buffers (*Kanmois*, rivers) and 15m road Right-of-Way (RoW) corridors go unnoticed until after funds are disbursed.
* **Impact Alert:** Financial institutions, clean energy developers, and government agencies face weeks of delays and multi-crore Non-Performing Loans (NPLs) caused by contested land titles.

#### 🎙️ Speaker Notes:
> *"Why is land due diligence so difficult in India? Because land data is fundamentally multimodal and fragmented. On one hand, you have unstructured, bilingual paper deeds written in Tamil and English with archaic revenue terminology. On the other hand, you have century-old Field Measurement Book (FMB) sketches with surveyor ladder offsets.*
>
> *Today, verifying a single parcel takes 3 to 5 business days of manual cross-examination by legal experts and surveyors. Worse, hidden statutory violations—such as building inside a protected 30-meter waterbody buffer—are often discovered only after loans are disbursed or construction begins."*

---

### Slide 3: The FarmAI Solution: Autonomous GeoAI Due Diligence

#### Visual Layout:
* **⚡ Sub-Second OCR Extraction:** Instant parsing of survey numbers, sub-divisions, pattadar names, and automatic conversion of Hectares-Ares and Cents into standardized Acres and Square Meters.
* **📐 FMB Ladder Vectorizer:** Triangulates G-line baselines and perpendicular offsets into metric vector polygons using the Shoelace formula.
* **🗺️ 3-Way Spatial Reconciliation:** Automatically computes area variance across Document Claim vs. GIS Cadastral Polygon vs. FMB Surveyed Boundary.
* **🛡️ Statutory Buffer Auditing:** Shapely computational geometry queries to detect 30m waterbody and 15m road corridor intrusions.
* **📊 Objective Title Risk Score (0–100):** Transparent mathematical penalty matrix classifying titles into Tier 1 (Clean), Tier 2 (Caution), or Tier 3 (Rejected).
* **📜 Automated Audit Certificate:** Issues downloadable, tamper-evident Due Diligence Certificates with surveyor blocks and SHA-256 audit hashes.

#### 🎙️ Speaker Notes:
> *"FarmAI solves this with an end-to-end autonomous pipeline. A user simply uploads a scanned deed or selects a survey number. In under two seconds, FarmAI performs OCR text extraction, converts FMB ladder sketches into vector coordinates, projects them onto satellite cadastral maps, checks for buffer violations, and calculates an objective Title Integrity Score from 0 to 100."*

---

### Slide 4: Multi-Tier System Architecture

#### Visual Layout:
* **Layer 1: Presentation Layer:** React 18, Vite, Tailwind CSS v4, Leaflet GIS with Esri World Imagery, Cadastral Registry Tables, and Discrepancy Matrix.
* **Layer 2: API & Gateway Layer:** FastAPI (Python 3.11/3.13), asynchronous non-blocking REST endpoints (`/api/analyze`, `/api/cadastral`, `/api/terrain`), 8MB chunked disk streaming worker.
* **Layer 3: Core GeoAI Engines:** OCR Engine, FMB Parser, Spatial Engine, Terrain Engine, Risk Analyzer, and Ingestion Pipeline.
* **Layer 4: Data & Cloud Layer:** AWS ap-south-1 (Mumbai), Amazon Textract, S3 Bucket (`fai-tce-team63-farmai`), DynamoDB (`fai-tce-team63-audit-records`), and 12 GeoJSON boundary layers.

#### 🎙️ Speaker Notes:
> *"Here is our 4-tier architecture. On the frontend, we built a responsive React 18 dashboard leveraging Leaflet for high-performance GIS map rendering. The frontend talks to a FastAPI asynchronous backend capable of streaming 500MB+ datasets in 8MB chunks without memory exhaustion.*
>
> *Underneath, the backend coordinates 6 specialized GeoAI engines and integrates seamlessly with AWS cloud services in the Mumbai region for enterprise storage, Textract OCR, and DynamoDB audit logging."*

---

### Slide 5: Deep-Dive: Core GeoAI Engines (Part 1 - Document & Geometry)

#### Visual Layout:
* **Engine 1: Multimodal OCR & Bilingual NLP (`ocr_engine.py`):**
  * Custom regex heuristics for Tamil Nadu Form 10 (e-Patta/Chitta).
  * Area unit conversion:
    $$\text{Acres} = (\text{Hectares} \times 2.47105) + (\text{Ares} \times 0.0247105)$$
  * Classifies Ryotwari Dry (*Punjai*), Wet (*Nanjai*), *Natham*, or *Poramboke*.
* **Engine 2: FMB G-Line Ladder Vectorizer (`fmb_parser.py`):**
  * Triangulates ladder points along azimuth $\theta$ with perpendicular offset $o_i$:
    $$x_i = x_0 + d_i \cos(\theta) - o_i \sin(\theta), \quad y_i = y_0 + d_i \sin(\theta) + o_i \cos(\theta)$$
  * Computes ground-truth FMB area via the Shoelace formula:
    $$A_{\text{FMB}} = \frac{1}{2} \left| \sum (x_i y_{i+1} - x_{i+1} y_i) \right|$$
* **Engine 3: Spatial Cadastral Reconciler (`spatial_engine.py`):**
  * MultiPolygon centroid flattening prevents coordinate NaN drift across 396 parcels.
  * Three-Way Area Variance:
    $$\Delta A_{\%} = \frac{|\text{Area}_{\text{Document}} - \text{Area}_{\text{GIS}}|}{\text{Area}_{\text{GIS}}} \times 100$$
  * Permissible bounds: $\le 2.0\%$ Clean, $2\%-5\%$ Moderate, $>5\%$ Critical Discrepancy.

#### 🎙️ Speaker Notes:
> *"Let's look at the mathematics behind Engines 1 through 3. Engine 1 normalizes bilingual Tamil and English entities, converting complex legacy land units like Hectares-Ares and Cents into standardized Acres and Square Meters.*
>
> *Engine 2 solves a century-old problem: it mathematically parses FMB survey ladders. Given a G-line baseline of length L and offset perpendiculars, it calculates exact Cartesian coordinates and computes polygon area using the Shoelace formula.*
>
> *Engine 3 executes a 3-way reconciliation between claimed document extent, satellite cadastral GIS polygons, and FMB ground truth. If the variance exceeds the statutory 2% threshold, it triggers an automated investigation flag."*

---

### Slide 6: Deep-Dive: Core GeoAI Engines (Part 2 - Terrain & Risk Intelligence)

#### Visual Layout:
* **Engine 4: Raster DEM & Terrain Inundation (`terrain_engine.py`):**
  * Samples Copernicus / SRTM 30m Digital Elevation Models at parcel centroid.
  * Slope Gradient: $\text{Slope (\%)} = (\Delta \text{Elevation} / \text{Run}) \times 100$.
  * Inundation Modeling: Elevation $<12\text{m}$ MSL & slope $<1.0\%$ flags high monsoon waterlogging vulnerability.
* **Engine 5: Title Integrity Risk Scorer (`risk_analyzer.py`):**
  * Starts at base score of 100 points.
  * Deducts weighted penalties for area variance, waterbody breach, road corridor overlap, FMB skew, and flood depression.
  * Classifies parcels into Tier 1 (Clean), Tier 2 (Caution), or Tier 3 (Rejected).
* **Engine 6: Batch Ingestion Pipeline (`batch_ingestion.py`):**
  * Handles 500MB+ bulk archives via 8MB streaming buffer.
  * SHA-256 deduplication ensures zero duplicate audit records.

#### 🎙️ Speaker Notes:
> *"Engines 4, 5, and 6 introduce environmental and risk intelligence. Engine 4 taps into 30-meter Digital Elevation Models to evaluate hydrological slope and elevation against regional flood lines, identifying if a farm or solar park is located in a high-risk monsoon flood depression.*
>
> *Engine 5 synthesizes all geometric, legal, and terrain findings into an objective composite score out of 100. And Engine 6 ensures our system handles institutional scale, processing 500MB+ folder archives containing hundreds of deeds simultaneously."*

---

### Slide 7: Mathematical Risk Penalty Matrix (0–100)

#### Visual Layout (Table):
| Parameter | Trigger Condition | Points Deducted | Statutory Legal Basis |
| :--- | :--- | :---: | :--- |
| **Area Variance ($P_{\text{area}}$)** | $\Delta A_{\%} > 5.0\%$ discrepancy | **-25 Pts** | Severe inflation between deed claim and GIS boundary |
| **Area Variance ($P_{\text{area}}$)** | $2.0\% < \Delta A_{\%} \le 5.0\%$ | **-10 Pts** | Moderate discrepancy requiring physical survey re-audit |
| **Waterbody Buffer ($P_{\text{water}}$)** | Encroaches inside 30m buffer | **-35 Pts** | Supreme Court / NGT protected waterbody non-development zone |
| **Road RoW Corridor ($P_{\text{road}}$)** | Encroaches inside 15m corridor | **-15 Pts** | State Highway expansion corridor structural violation |
| **FMB Boundary Skew ($P_{\text{fmb}}$)** | FMB ladder vs. GIS polygon mismatch | **-15 Pts** | Physical survey boundary does not close onto cadastral parcel |
| **Flood Vulnerability ($P_{\text{terrain}}$)** | Elevation $<12\text{m}$ & slope $<1\%$ | **-10 Pts** | Severe hydrological monsoon waterlogging risk |

#### Classification Tiers:
* 🟢 **Tier 1 (85–100): LOW RISK / CLEAN TITLE** $\rightarrow$ Approved for bank lending, solar farm lease, or registration.
* 🟡 **Tier 2 (60–84): MODERATE RISK / CAUTION** $\rightarrow$ Minor variance or setback issue; requires physical surveyor verification.
* 🔴 **Tier 3 (00–59): CRITICAL RISK / REJECTED** $\rightarrow$ Illegal waterbody encroachment or severe area inflation.

#### 🎙️ Speaker Notes:
> *"Rather than a subjective 'opinion', FarmAI uses a rigorous mathematical penalty matrix. A clean parcel starts at 100 points. If a deed claims 4.5 acres but GIS shows only 3.1 acres, 25 points are deducted.*
>
> *If any portion encroaches into the 30-meter waterbody buffer, a critical 35-point penalty is applied because Indian courts mandate zero development near water bodies. Titles are grouped into Tier 1 (Clean), Tier 2 (Caution), or Tier 3 (Rejected), giving banks an immediate go/no-go financing signal."*

---

### Slide 8: Automated Pipeline Verification: 5 Benchmark Stress Tests

#### Visual Layout (Table):
| Doc ID | Survey No. | Scenario Label | Discrepancy / Breach Detected | Audit Verdict |
| :--- | :---: | :--- | :--- | :---: |
| **DOC-SAMPLE-01** | `102/1A` | Clean Title Benchmark | $\Delta A = 0.8\%$ (Permissible), 0 Encroachments | 🟢 **LOW RISK (Clean)** |
| **DOC-SAMPLE-02** | `104/2B` | Severe Area Mismatch | Claimed 4.5 Ac vs. GIS 3.1 Ac ($\Delta A = +45\%$) | 🔴 **CRITICAL RISK** |
| **DOC-SAMPLE-03** | `108/3` | Waterbody Encroachment | Parcel overlaps 30m protected *Kanmoi* lake buffer | 🔴 **CRITICAL BREACH** |
| **DOC-SAMPLE-04** | `110/1A` | Road RoW Encroachment | Intrudes 4.2m into 15m road setback corridor | 🔴 **MAJOR DISCREPANCY** |
| **DOC-SAMPLE-05** | `112/1` | FMB Boundary Skew | FMB ladder triangulation misaligned with GIS polygon | 🟡 **MODERATE AUDIT** |

* **CI Suite Badge:** `✅ 100% Automated Test Pass` via `backend/test_pipeline.py` in under 2.5 seconds.

#### 🎙️ Speaker Notes:
> *"To rigorously prove our algorithms, we built an automated testing suite validating 5 real-world stress scenarios. Scenario 1 validates a perfectly clean title. Scenario 2 catches a fraudulent 45% area inflation.*
>
> *Scenarios 3 and 4 accurately pinpoint millimeter-level encroachments into waterbody buffers and road corridors. And Scenario 5 identifies when the FMB ladder sketch does not close onto the cadastral map. All 5 scenarios run and pass automatically on every single code commit."*

---

### Slide 9: Enterprise GIS & Frontend User Experience

#### Visual Layout:
* **Interactive Cadastral GIS Explorer:** Full Leaflet integration with Esri World Imagery satellite basemap, rendering 396 parcels dynamically with real-time Centroid Fly-To navigation.
* **Multimodal Document Inspector:** Side-by-side comparison displaying scanned deed PDFs alongside extracted OCR tokens with highlighted discrepancy badges.
* **Automated Due Diligence Certificate:** Printable, tamper-evident Land Audit Certificate featuring parcel boundary thumbnails, risk scoring breakdown, and SHA-256 validation hash.

#### 🎙️ Speaker Notes:
> *"The user interface is crafted for both legal analysts and field surveyors. When an analyst clicks any parcel in our Cadastral table, the map instantly flies to the parcel centroid on high-resolution satellite imagery.*
>
> *Analysts can inspect scanned deeds side-by-side with extracted data, toggle waterbody and road setback layers, and generate a formal Due Diligence Audit Certificate ready for legal sign-off in a single click."*

---

### Slide 10: AWS Cloud Architecture & Automated CI/CD Pipeline

#### Visual Layout:
* **AWS Cloud Integration (`ap-south-1` Mumbai):**
  * **Amazon Textract:** High-accuracy bilingual OCR and key-value pair extraction.
  * **Amazon S3 (`fai-tce-team63-farmai`):** Secure storage bucket for multi-page deeds and FMB sketches.
  * **Amazon DynamoDB (`fai-tce-team63-audit-records`):** High-throughput NoSQL audit log for immutable title history.
* **Automated CI/CD (GitHub Actions):**
  * Triggered on every push to `main`.
  * **Backend Job (Python 3.11):** Runs `test_pipeline.py` across all 5 benchmark scenarios.
  * **Frontend Job (Node.js 20):** Validates clean compilation with `npm run build`.
  * Secrets masked and encrypted (`***`) with zero credential exposure.

#### 🎙️ Speaker Notes:
> *"FarmAI is built on enterprise cloud infrastructure in the AWS Mumbai region. We utilize Amazon Textract for document text detection, Amazon S3 for secure document buffering, and Amazon DynamoDB for logging tamper-evident audit records.*
>
> *Our engineering pipeline is supported by GitHub Actions CI/CD. Every pull request or code push automatically triggers parallel runners that test our Python algorithms and build the React frontend, maintaining 100% green build health."*

---

### Slide 11: Measurable Business ROI & Future Technological Roadmap

#### Visual Layout:
* **Business Impact:**
  * **99% Faster Turnaround:** Cuts due diligence from 3–5 days to under 2 seconds per parcel.
  * **Eliminates Manual Math Errors:** Eliminates human error in ladder triangulation and unit conversions.
  * **NPL & Capital Protection:** Prevents multi-crore losses from litigated or buffer-violating lands.
  * **Institutional Readiness:** Standardized digital certificates for banks, REITs, and solar developers.
* **Technological Roadmap:**
  * **Phase 1:** Satellite optical change detection (Sentinel-2 / Planet Labs) for real-time temporal monitoring.
  * **Phase 2:** Fine-tuned Vision Transformer (Donut / LayoutLMv3) trained on ancient Tamil palm-leaf and archival revenue scripts.
  * **Phase 3:** Centimeter-precision UAV drone LiDAR elevation mesh for flood runoff modeling.
  * **Phase 4:** Blockchain title hashing on Polygon / Hyperledger to eliminate retroactive deed tampering.

#### 🎙️ Speaker Notes:
> *"The business impact is transformative: FarmAI reduces land due diligence turnaround by 99%—from days to sub-seconds—while preventing multi-crore non-performing loans for banks and clean energy projects.*
>
> *Looking ahead, our roadmap includes integrating Sentinel-2 optical imagery for temporal change detection, fine-tuning vision transformers for historic scripts, and anchoring certificates onto blockchain for tamper-proof title provenance."*

---

### Slide 12: Conclusion & Q&A

#### Visual Layout:
* **Header:** **FarmAI – GeoLand Intelligence 🌾🗺️**
* **Summary Points:**
  * ✅ Successfully solved the multimodal land verification problem (Deeds + FMB + GIS).
  * ✅ 100% automated mathematical due diligence with 6 specialized GeoAI engines.
  * ✅ Enterprise-ready architecture with AWS cloud services and automated CI/CD.
  * ✅ High-performance interactive GIS dashboard built with React 18 & Leaflet.
* **Call to Action:** *"Thank You! We are now open for Questions & Live Demonstration."*
* **Repository Link:** `https://github.com/krishnakanthm2805/farmai_project.git`

#### 🎙️ Speaker Notes:
> *"In summary, FarmAI turns opaque, fragmented land records into transparent, instant, mathematical intelligence. We look forward to answering your questions and inviting you to our live interactive demonstration. Thank you!"*

---

## 💡 Anticipated Evaluator Q&A Preparation

### Q1: How do you handle poor-quality, torn, or low-resolution scanned deeds?
> **Answer:** *"FarmAI uses a dual-engine fallback approach: if local Tesseract OCR detects low confidence or noisy background artifacts, the document is routed through Amazon Textract’s specialized deep document neural network, which utilizes morphological image enhancement and bounding-box text alignment."*

### Q2: What happens if the FMB ladder sketch is hand-drawn and slightly imperfect?
> **Answer:** *"Engine 2 normalizes offsets against the known G-line azimuth. If the computed polygon closure residual exceeds acceptable geometric closure error, Engine 5 applies an explicit 15-point 'FMB Boundary Skew' penalty rather than guessing, alerting the surveyor to re-verify the baseline in the field."*

### Q3: Why 30 meters for the waterbody buffer?
> **Answer:** *"Under the Tamil Nadu Protection of Tanks and Eviction of Encroachment Act and National Green Tribunal (NGT) directives, a 30-meter statutory non-development buffer is mandatory around rivers, lakes, and Kanmois. FarmAI codifies this legal rule directly into computational geometry."*
