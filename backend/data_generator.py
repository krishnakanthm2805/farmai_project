"""
Backend Data Store & Benchmark Generator for FarmAI GeoLand Intelligence.
Generates realistic Cadastral Survey Parcels, FMB measurements, Reference GIS layers
(Waterbodies, Roads, Admin boundaries), and sample land documents.
"""

import json
import os
import math

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Study Area: Perungudi / Sholinganallur Taluk, Chennai District (Reference: Lat 12.9600, Lng 80.2400)
BASE_LAT = 12.9600
BASE_LNG = 80.2400

# Conversion constants
SQM_TO_ACRES = 0.000247105
SQM_TO_HECTARES = 0.0001
SQM_TO_CENTS = 0.0247105

def init_mock_datasets():
    """Generates benchmark cadastral geojson, fmb records, reference layers and sample documents."""
    
    # 1. Cadastral Parcels GeoJSON
    # Let's create realistic survey parcels with various scenarios:
    # 102/1A: Clean parcel, 1.20 Acres
    # 102/1B: Clean parcel, 0.85 Acres
    # 104/2B: Area Discrepancy (Doc: 1.85 Acres vs Cadastral: 1.42 Acres)
    # 108/3: Waterbody Encroachment (Intersects Lake Buffer by 18%)
    # 110/1A: Road Encroachment (Extends 4.5m into National Highway corridor)
    # 112/4: FMB Boundary Shift (FMB offsets show different shape than Cadastral polygon)
    
    cadastral_features = [
        {
            "type": "Feature",
            "properties": {
                "parcel_id": "P-TN-CHN-102-1A",
                "survey_no": "102/1A",
                "village": "Perungudi",
                "taluk": "Sholinganallur",
                "district": "Chennai",
                "patta_no": "PAT-2024-8841",
                "gis_area_sqm": 4856.23,
                "gis_area_acres": 1.20,
                "gis_area_cents": 120.0,
                "land_classification": "Ryotwari Dry (Punjai)",
                "registered_owner": "K. R. Ramanathan & R. Meenakshi",
                "is_disputed": False,
                "neighbor_north": "102/1B",
                "neighbor_south": "Village Road",
                "neighbor_east": "103/2",
                "neighbor_west": "101/4"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80.2400, 12.9600],
                    [80.2408, 12.9602],
                    [80.2407, 12.9608],
                    [80.2399, 12.9606],
                    [80.2400, 12.9600]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "parcel_id": "P-TN-CHN-102-1B",
                "survey_no": "102/1B",
                "village": "Perungudi",
                "taluk": "Sholinganallur",
                "district": "Chennai",
                "patta_no": "PAT-2024-8842",
                "gis_area_sqm": 3440.00,
                "gis_area_acres": 0.85,
                "gis_area_cents": 85.0,
                "land_classification": "Ryotwari Dry (Punjai)",
                "registered_owner": "S. Sundaravalli",
                "is_disputed": False,
                "neighbor_north": "102/2",
                "neighbor_south": "102/1A",
                "neighbor_east": "103/1",
                "neighbor_west": "101/3"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80.2399, 12.9606],
                    [80.2407, 12.9608],
                    [80.2406, 12.9613],
                    [80.2398, 12.9611],
                    [80.2399, 12.9606]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "parcel_id": "P-TN-CHN-104-2B",
                "survey_no": "104/2B",
                "village": "Perungudi",
                "taluk": "Sholinganallur",
                "district": "Chennai",
                "patta_no": "PAT-2023-1109",
                "gis_area_sqm": 5746.54,
                "gis_area_acres": 1.42,
                "gis_area_cents": 142.0,
                "land_classification": "Ryotwari Wet (Nanjai)",
                "registered_owner": "V. Jayaprakash",
                "is_disputed": True,
                "neighbor_north": "104/1",
                "neighbor_south": "105/1",
                "neighbor_east": "104/2C",
                "neighbor_west": "104/2A"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80.2420, 12.9600],
                    [80.2430, 12.9601],
                    [80.2429, 12.9608],
                    [80.2418, 12.9607],
                    [80.2420, 12.9600]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "parcel_id": "P-TN-CHN-108-3",
                "survey_no": "108/3",
                "village": "Perungudi",
                "taluk": "Sholinganallur",
                "district": "Chennai",
                "patta_no": "PAT-2021-4091",
                "gis_area_sqm": 8093.71,
                "gis_area_acres": 2.00,
                "gis_area_cents": 200.0,
                "land_classification": "Ryotwari Dry (Punjai)",
                "registered_owner": "M/s Greenfield Logistics Infrastructure",
                "is_disputed": True,
                "neighbor_north": "108/2",
                "neighbor_south": "Eri Poramboke (Lake)",
                "neighbor_east": "109/1",
                "neighbor_west": "108/4"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80.2440, 12.9585],
                    [80.2452, 12.9587],
                    [80.2450, 12.9595],
                    [80.2438, 12.9593],
                    [80.2440, 12.9585]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "parcel_id": "P-TN-CHN-110-1A",
                "survey_no": "110/1A",
                "village": "Perungudi",
                "taluk": "Sholinganallur",
                "district": "Chennai",
                "patta_no": "PAT-2024-5512",
                "gis_area_sqm": 4250.00,
                "gis_area_acres": 1.05,
                "gis_area_cents": 105.0,
                "land_classification": "Commercial / Mixed",
                "registered_owner": "A. Balakrishnan & Sons",
                "is_disputed": True,
                "neighbor_north": "Old Mahabalipuram Road (OMR)",
                "neighbor_south": "110/1B",
                "neighbor_east": "111/1",
                "neighbor_west": "109/4"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80.2405, 12.9620],
                    [80.2415, 12.9621],
                    [80.2414, 12.9626],
                    [80.2403, 12.9625],
                    [80.2405, 12.9620]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "parcel_id": "P-TN-CHN-112-1",
                "survey_no": "112/1",
                "village": "Perungudi",
                "taluk": "Sholinganallur",
                "district": "Chennai",
                "patta_no": "PAT-2022-7721",
                "gis_area_sqm": 6070.28,
                "gis_area_acres": 1.50,
                "gis_area_cents": 150.0,
                "land_classification": "Ryotwari Wet (Nanjai)",
                "registered_owner": "G. Murugan",
                "is_disputed": True,
                "neighbor_north": "112/2",
                "neighbor_south": "111/3",
                "neighbor_east": "113/1",
                "neighbor_west": "112/3"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [80.2460, 12.9610],
                    [80.2472, 12.9612],
                    [80.2470, 12.9619],
                    [80.2458, 12.9617],
                    [80.2460, 12.9610]
                ]]
            }
        }
    ]

    cadastral_geojson = {
        "type": "FeatureCollection",
        "name": "Perungudi_Cadastral_Parcels",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": cadastral_features
    }

    # 2. Reference GIS Layers: Waterbodies (Eri / Tanks / Canals)
    waterbodies_geojson = {
        "type": "FeatureCollection",
        "name": "Perungudi_Waterbodies_and_Buffers",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "feature_name": "Perungudi Lake (Perungudi Eri)",
                    "category": "Waterbody / Eri Poramboke",
                    "buffer_zone_meters": 30.0,
                    "restriction": "Strictly No Construction / Encroachment Zone (CRZ/TN Water Resources Act)"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [80.2435, 12.9575],
                        [80.2460, 12.9578],
                        [80.2455, 12.9589],  # Note: Overlaps with parcel 108/3 which extends to 12.9585
                        [80.2430, 12.9586],
                        [80.2435, 12.9575]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "feature_name": "Buckingham Canal Feeder Channel",
                    "category": "Drainage Channel / Odai",
                    "buffer_zone_meters": 15.0,
                    "restriction": "Public Waterway - Mandatory 15m Setback"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [80.2390, 12.9590],
                        [80.2425, 12.9592],
                        [80.2475, 12.9596]
                    ]
                }
            }
        ]
    }

    # 3. Reference GIS Layers: Roads & Right-of-Way (RoW)
    roads_geojson = {
        "type": "FeatureCollection",
        "name": "Perungudi_Road_Network_and_RoW",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "road_name": "Rajiv Gandhi Salai / OMR (SH-49A)",
                    "category": "State Highway / Arterial Corridor",
                    "row_width_meters": 45.0,
                    "buffer_meters": 22.5
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [80.2395, 12.9625],
                        [80.2420, 12.9626],  # Note: 110/1A north boundary reaches 12.9626 -> RoW violation
                        [80.2450, 12.9627],
                        [80.2480, 12.9628]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "road_name": "Judges Colony 1st Cross Main Road",
                    "category": "Municipal Secondary Road",
                    "row_width_meters": 12.0,
                    "buffer_meters": 6.0
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [80.2398, 12.9598],
                        [80.2435, 12.9599],
                        [80.2465, 12.9600]
                    ]
                }
            }
        ]
    }

    # 4. FMB (Field Measurement Book) Survey Reference Records
    # FMBs contain ladder measurement points (G-line, Offsets/F-lines, Triangulation)
    fmb_records = {
        "102/1A": {
            "survey_no": "102/1A",
            "village": "Perungudi",
            "fmb_sheet_no": "FMB-SH-102-2021",
            "g_line_length_m": 88.5,
            "boundary_points": [
                {"point_id": "A", "lat": 12.9600, "lng": 80.2400, "description": "South-West Stone"},
                {"point_id": "B", "lat": 12.9602, "lng": 80.2408, "description": "South-East Stone"},
                {"point_id": "C", "lat": 12.9608, "lng": 80.2407, "description": "North-East Stone"},
                {"point_id": "D", "lat": 12.9606, "lng": 80.2399, "description": "North-West Stone"}
            ],
            "ladder_offsets": [
                {"chainage_m": 0.0, "offset_m": 0.0, "side": "origin"},
                {"chainage_m": 35.2, "offset_m": 24.8, "side": "left"},
                {"chainage_m": 62.0, "offset_m": 26.5, "side": "right"},
                {"chainage_m": 88.5, "offset_m": 0.0, "side": "terminal"}
            ],
            "computed_area_sqm": 4850.0,
            "computed_area_acres": 1.198,
            "survey_date": "2021-08-14",
            "surveyor_id": "TN-SURV-CHN-042"
        },
        "104/2B": {
            "survey_no": "104/2B",
            "village": "Perungudi",
            "fmb_sheet_no": "FMB-SH-104-2019",
            "g_line_length_m": 94.0,
            "boundary_points": [
                {"point_id": "A", "lat": 12.9600, "lng": 80.2420, "description": "SW Boundary"},
                {"point_id": "B", "lat": 12.9601, "lng": 80.2430, "description": "SE Boundary"},
                {"point_id": "C", "lat": 12.9608, "lng": 80.2429, "description": "NE Boundary"},
                {"point_id": "D", "lat": 12.9607, "lng": 80.2418, "description": "NW Boundary"}
            ],
            "ladder_offsets": [
                {"chainage_m": 0.0, "offset_m": 0.0, "side": "origin"},
                {"chainage_m": 42.0, "offset_m": 30.5, "side": "left"},
                {"chainage_m": 75.0, "offset_m": 31.0, "side": "right"},
                {"chainage_m": 94.0, "offset_m": 0.0, "side": "terminal"}
            ],
            "computed_area_sqm": 5740.0,
            "computed_area_acres": 1.418,
            "survey_date": "2019-11-20",
            "surveyor_id": "TN-SURV-CHN-019"
        },
        "108/3": {
            "survey_no": "108/3",
            "village": "Perungudi",
            "fmb_sheet_no": "FMB-SH-108-2020",
            "g_line_length_m": 110.0,
            "boundary_points": [
                {"point_id": "A", "lat": 12.9588, "lng": 80.2440, "description": "SW Original Stone (Excluding Lake Buffer)"},
                {"point_id": "B", "lat": 12.9589, "lng": 80.2452, "description": "SE Original Stone"},
                {"point_id": "C", "lat": 12.9595, "lng": 80.2450, "description": "NE Stone"},
                {"point_id": "D", "lat": 12.9593, "lng": 80.2438, "description": "NW Stone"}
            ],
            "ladder_offsets": [
                {"chainage_m": 0.0, "offset_m": 0.0, "side": "origin"},
                {"chainage_m": 55.0, "offset_m": 35.0, "side": "left"},
                {"chainage_m": 110.0, "offset_m": 0.0, "side": "terminal"}
            ],
            "computed_area_sqm": 6600.0,
            "computed_area_acres": 1.63,
            "survey_date": "2020-03-12",
            "surveyor_id": "TN-SURV-CHN-088"
        },
        "110/1A": {
            "survey_no": "110/1A",
            "village": "Perungudi",
            "fmb_sheet_no": "FMB-SH-110-2023",
            "g_line_length_m": 82.0,
            "boundary_points": [
                {"point_id": "A", "lat": 12.9620, "lng": 80.2405, "description": "SW Highway Corner"},
                {"point_id": "B", "lat": 12.9621, "lng": 80.2415, "description": "SE Highway Corner"},
                {"point_id": "C", "lat": 12.9626, "lng": 80.2414, "description": "NE Road Verge"},
                {"point_id": "D", "lat": 12.9625, "lng": 80.2403, "description": "NW Road Verge"}
            ],
            "ladder_offsets": [
                {"chainage_m": 0.0, "offset_m": 0.0, "side": "origin"},
                {"chainage_m": 40.0, "offset_m": 25.0, "side": "left"},
                {"chainage_m": 82.0, "offset_m": 0.0, "side": "terminal"}
            ],
            "computed_area_sqm": 4250.0,
            "computed_area_acres": 1.05,
            "survey_date": "2023-04-11",
            "surveyor_id": "TN-SURV-CHN-057"
        },
        "112/1": {
            "survey_no": "112/1",
            "village": "Perungudi",
            "fmb_sheet_no": "FMB-SH-112-2022",
            "g_line_length_m": 98.0,
            "boundary_points": [
                {"point_id": "A", "lat": 12.9610, "lng": 80.2460, "description": "SW Stone"},
                {"point_id": "B", "lat": 12.9611, "lng": 80.2469, "description": "SE Stone (True FMB marks 80.2469, Cadastral GIS shows 80.2472)"},
                {"point_id": "C", "lat": 12.9618, "lng": 80.2468, "description": "NE Stone"},
                {"point_id": "D", "lat": 12.9617, "lng": 80.2458, "description": "NW Stone"}
            ],
            "ladder_offsets": [
                {"chainage_m": 0.0, "offset_m": 0.0, "side": "origin"},
                {"chainage_m": 48.0, "offset_m": 28.0, "side": "left"},
                {"chainage_m": 98.0, "offset_m": 0.0, "side": "terminal"}
            ],
            "computed_area_sqm": 5460.0,
            "computed_area_acres": 1.349,
            "survey_date": "2022-06-18",
            "surveyor_id": "TN-SURV-CHN-033"
        }
    }

    # 5. Benchmark Land Documents (Patta, Sale Deed, Chitta)
    sample_documents = [
        {
            "id": "DOC-SAMPLE-01",
            "title": "Patta Extract - Clear Title Benchmark (Survey 102/1A)",
            "doc_type": "Patta / Chitta (Form e-Patta)",
            "survey_no": "102/1A",
            "patta_no": "8841",
            "owner": "K. R. Ramanathan & R. Meenakshi",
            "village": "Perungudi",
            "taluk": "Sholinganallur",
            "district": "Chennai",
            "documented_area": {
                "hectares": 0.4856,
                "acres": 1.20,
                "cents": 120.0,
                "sqm": 4856.23
            },
            "land_classification": "Ryotwari Dry (Punjai)",
            "boundaries": {
                "north": "Survey No. 102/1B",
                "south": "Village Road (Judges Colony)",
                "east": "Survey No. 103/2",
                "west": "Survey No. 101/4"
            },
            "raw_text": """GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT
E-PATTA / CHITTA EXTRACT (FORM 10)
District: Chennai | Taluk: Sholinganallur | Village: Perungudi
Patta Number: 8841 | Sub-division Year: 2024
Pattadar Name: 1. K. R. Ramanathan, 2. R. Meenakshi
Survey Number: 102 | Sub-Division: 1A
Land Type: Ryotwari Dry (Punjai) | Assessment: Rs. 14.50
Extent: 0 Hectares 48.56 Ares (Equivalent to 1.20 Acres / 120 Cents)
Boundaries:
  North by: Survey No. 102/1B (S. Sundaravalli)
  South by: Village Road
  East by: Survey No. 103/2
  West by: Survey No. 101/4
Remarks: Clean Title, No encumbrances recorded in e-Sevai database. Certified Digitally by Tahsildar.""",
            "scenario_tag": "VERIFIED_CLEAN",
            "expected_risk": "LOW"
        },
        {
            "id": "DOC-SAMPLE-02",
            "title": "Sale Deed - Severe Area Discrepancy (Survey 104/2B)",
            "doc_type": "Registered Sale Deed (Doc No. 3412/2023)",
            "survey_no": "104/2B",
            "patta_no": "1109",
            "owner": "V. Jayaprakash",
            "village": "Perungudi",
            "taluk": "Sholinganallur",
            "district": "Chennai",
            "documented_area": {
                "hectares": 0.7486,
                "acres": 1.85,
                "cents": 185.0,
                "sqm": 7486.68
            },
            "land_classification": "Ryotwari Wet (Nanjai)",
            "boundaries": {
                "north": "Survey No. 104/1",
                "south": "Survey No. 105/1",
                "east": "Survey No. 104/2C",
                "west": "Survey No. 104/2A"
            },
            "raw_text": """SUB-REGISTRAR OFFICE PERUNGUDI - REGISTERED DEED OF SALE
Doc No: 3412 of 2023 | Date: 18th October 2023
Purchaser: V. Jayaprakash S/o Varadarajan
Vendor: T. Subramaniam
Property Schedule:
All that piece and parcel of Agricultural Land situated at Perungudi Village, Sholinganallur Taluk, Chennai District.
Comprised in Survey No. 104/2B, Patta No. 1109.
Measuring an Extent of 1 Acre 85 Cents (1.85 Acres / 7,486.68 Sq.Mtrs / 80,586 Sq.Ft).
Boundaries:
  North by: Land in Survey No. 104/1
  South by: Land in Survey No. 105/1
  East by: Land in Survey No. 104/2C
  West by: Land in Survey No. 104/2A
Note: Cadastral Survey records show only 1.42 Acres. Document claims 1.85 Acres (Excess of 0.43 Acres).""",
            "scenario_tag": "AREA_DISCREPANCY",
            "expected_risk": "HIGH"
        },
        {
            "id": "DOC-SAMPLE-03",
            "title": "Adangal & Patta - Waterbody Encroachment (Survey 108/3)",
            "doc_type": "Patta Extract & Adangal Register",
            "survey_no": "108/3",
            "patta_no": "4091",
            "owner": "M/s Greenfield Logistics Infrastructure",
            "village": "Perungudi",
            "taluk": "Sholinganallur",
            "district": "Chennai",
            "documented_area": {
                "hectares": 0.8093,
                "acres": 2.00,
                "cents": 200.0,
                "sqm": 8093.71
            },
            "land_classification": "Commercial / Dry Land",
            "boundaries": {
                "north": "Survey No. 108/2",
                "south": "Perungudi Eri (Lake Boundary)",
                "east": "Survey No. 109/1",
                "west": "Survey No. 108/4"
            },
            "raw_text": """GOVERNMENT OF TAMIL NADU - ADANGAL / PATTA RECORD
District: Chennai | Taluk: Sholinganallur | Village: Perungudi
Patta No: 4091 | Survey No: 108/3
Registered Entity: M/s Greenfield Logistics Infrastructure
Extent: 2.00 Acres (0.80.93 Hectares)
Classification: Commercial / Dry Land
Boundaries:
  North by: Survey No. 108/2
  South by: Perungudi Eri Poramboke / Lake Foreshore
  East by: Survey No. 109/1
  West by: Survey No. 108/4
CRITICAL AUDIT NOTE: Southern 0.37 Acres extends directly inside the 30m statutory buffer zone of Perungudi Lake (Waterbody Encroachment).""",
            "scenario_tag": "WATERBODY_ENCROACHMENT",
            "expected_risk": "CRITICAL"
        },
        {
            "id": "DOC-SAMPLE-04",
            "title": "Patta Record - Road Right-of-Way Corridor Encroachment (Survey 110/1A)",
            "doc_type": "Patta Transfer Order",
            "survey_no": "110/1A",
            "patta_no": "5512",
            "owner": "A. Balakrishnan & Sons",
            "village": "Perungudi",
            "taluk": "Sholinganallur",
            "district": "Chennai",
            "documented_area": {
                "hectares": 0.4250,
                "acres": 1.05,
                "cents": 105.0,
                "sqm": 4250.00
            },
            "land_classification": "Commercial / Mixed",
            "boundaries": {
                "north": "Rajiv Gandhi Salai / OMR Highway",
                "south": "Survey No. 110/1B",
                "east": "Survey No. 111/1",
                "west": "Survey No. 109/4"
            },
            "raw_text": """REVENUE DIVISIONAL OFFICER - PATTA TRANSFER ORDER
District: Chennai | Taluk: Sholinganallur | Village: Perungudi
Patta No: 5512 | Survey No: 110/1A
Pattadar: A. Balakrishnan & Sons
Extent: 1.05 Acres (4,250 Sq.M)
Boundaries:
  North by: Old Mahabalipuram Road (OMR / Rajiv Gandhi Salai)
  South by: Survey No. 110/1B
  East by: Survey No. 111/1
  West by: Survey No. 109/4
HIGHWAY AUDIT: The northern parcel boundary infringes by 4.5 meters into the 45m State Highway RoW corridor.""",
            "scenario_tag": "ROAD_ROW_ENCROACHMENT",
            "expected_risk": "HIGH"
        },
        {
            "id": "DOC-SAMPLE-05",
            "title": "FMB Discrepancy & Boundary Shift (Survey 112/1)",
            "doc_type": "Field Measurement Book Extract & Patta",
            "survey_no": "112/1",
            "patta_no": "7721",
            "owner": "G. Murugan",
            "village": "Perungudi",
            "taluk": "Sholinganallur",
            "district": "Chennai",
            "documented_area": {
                "hectares": 0.6070,
                "acres": 1.50,
                "cents": 150.0,
                "sqm": 6070.28
            },
            "land_classification": "Ryotwari Wet (Nanjai)",
            "boundaries": {
                "north": "Survey No. 112/2",
                "south": "Survey No. 111/3",
                "east": "Survey No. 113/1",
                "west": "Survey No. 112/3"
            },
            "raw_text": """GOVERNMENT OF TAMIL NADU - SURVEY & SETTLEMENT DEPARTMENT
FMB SKETCH & PATTA AUDIT RECORD
Survey No: 112/1 | Patta: 7721
Owner: G. Murugan
Area Claimed: 1.50 Acres (6,070.28 Sq.M)
Boundaries:
  North by: Survey No. 112/2
  South by: Survey No. 111/3
  East by: Survey No. 113/1
  West by: Survey No. 112/3
FMB AUDIT NOTE: Eastern boundary stone coordinates in FMB ladder calculation do not match digitized Cadastral GIS layer (Shape skew detected). FMB area calculates to 1.349 Acres while Cadastral layer shows 1.50 Acres.""",
            "scenario_tag": "FMB_BOUNDARY_MISMATCH",
            "expected_risk": "MEDIUM"
        }
    ]

    # Save to JSON files
    with open(os.path.join(DATA_DIR, "cadastral_parcels.json"), "w", encoding="utf-8") as f:
        json.dump(cadastral_geojson, f, indent=2)

    with open(os.path.join(DATA_DIR, "waterbodies.json"), "w", encoding="utf-8") as f:
        json.dump(waterbodies_geojson, f, indent=2)

    with open(os.path.join(DATA_DIR, "roads.json"), "w", encoding="utf-8") as f:
        json.dump(roads_geojson, f, indent=2)

    with open(os.path.join(DATA_DIR, "fmb_records.json"), "w", encoding="utf-8") as f:
        json.dump(fmb_records, f, indent=2)

    with open(os.path.join(DATA_DIR, "sample_documents.json"), "w", encoding="utf-8") as f:
        json.dump(sample_documents, f, indent=2)

    print("Successfully initialized mock datasets in:", DATA_DIR)

if __name__ == "__main__":
    init_mock_datasets()
