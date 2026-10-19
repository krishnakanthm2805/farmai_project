"""
FarmAI - Document Metadata Store
Provides persistent storage, querying, and S3 linkage for uploaded land documents.
Persists metadata to disk in backend/data/uploaded_documents.json and syncs with AWS.
"""

import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DOCUMENTS_STORE_FILE = os.path.join(DATA_DIR, "uploaded_documents.json")

# Initial benchmark seed records matching the recommended UI design
DEFAULT_DOCUMENTS = [
    {
        "document_id": "DOC-SAMPLE-01",
        "filename": "Patta_Sample_01.pdf",
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
        "status": "Verified",
        "storage_key": "documents/Patta_Sample_01.pdf",
        "survey_no": "102/1A",
        "owner": "K. R. Ramanathan & R. Meenakshi",
        "village": "Perungudi",
        "district": "Chennai",
        "area_acres": 2.45,
        "doc_type": "Patta / Chitta",
        "title_integrity_score": 98,
        "analysis_result_id": "DOC-SAMPLE-01"
    },
    {
        "document_id": "DOC-002",
        "filename": "Sale_Deed_02.pdf",
        "uploaded_at": datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - 1500, timezone.utc).isoformat(), # ~25 min ago
        "status": "Under Review",
        "storage_key": "documents/Sale_Deed_02.pdf",
        "survey_no": "104/1",
        "owner": "M. Subramanian & Sons",
        "village": "Perungudi",
        "district": "Chennai",
        "area_acres": 1.80,
        "doc_type": "Registered Sale Deed",
        "title_integrity_score": 68,
        "analysis_result_id": "DOC-SAMPLE-02"
    },
    {
        "document_id": "DOC-003",
        "filename": "Land_Record_03.pdf",
        "uploaded_at": datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - 86400, timezone.utc).isoformat(), # ~Yesterday
        "status": "Discrepancy",
        "storage_key": "documents/Land_Record_03.pdf",
        "survey_no": "108/3",
        "owner": "A. Chandran & Co-owners",
        "village": "Allikulam",
        "district": "Thoothukudi",
        "area_acres": 3.10,
        "doc_type": "Settlement Deed",
        "title_integrity_score": 42,
        "analysis_result_id": "DOC-SAMPLE-03"
    },
    {
        "document_id": "DOC-004",
        "filename": "FMB_Ladder_102.pdf",
        "uploaded_at": datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - 172800, timezone.utc).isoformat(), # 2 days ago
        "status": "Verified",
        "storage_key": "documents/FMB_Ladder_102.pdf",
        "survey_no": "102/3B",
        "owner": "S. Sundaravalli",
        "village": "Perungudi",
        "district": "Chennai",
        "area_acres": 1.45,
        "doc_type": "FMB Field Measurement",
        "title_integrity_score": 95,
        "analysis_result_id": "DOC-SAMPLE-04"
    },
    {
        "document_id": "DOC-005",
        "filename": "Adangal_Extract_112.pdf",
        "uploaded_at": datetime.fromtimestamp(datetime.now(timezone.utc).timestamp() - 259200, timezone.utc).isoformat(), # 3 days ago
        "status": "Discrepancy",
        "storage_key": "documents/Adangal_Extract_112.pdf",
        "survey_no": "106/1A",
        "owner": "P. Marimuthu",
        "village": "Keelathattaparai",
        "district": "Thoothukudi",
        "area_acres": 2.15,
        "doc_type": "Adangal Extract",
        "title_integrity_score": 65,
        "analysis_result_id": "DOC-SAMPLE-05"
    }
]


class DocumentStore:
    def __init__(self, filepath: str = DOCUMENTS_STORE_FILE):
        self.filepath = filepath
        self._ensure_store()

    def _ensure_store(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            try:
                with open(self.filepath, "w", encoding="utf-8") as f:
                    json.dump(DEFAULT_DOCUMENTS, f, indent=2)
            except Exception as e:
                print(f"Document store initialization notice: {e}")

    def _load_documents(self) -> List[Dict[str, Any]]:
        self._ensure_store()
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception as e:
            print(f"Error loading document store: {e}")
        return list(DEFAULT_DOCUMENTS)

    def _save_documents(self, docs: List[Dict[str, Any]]) -> bool:
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(docs, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving document store: {e}")
            return False

    def get_recent_documents(self, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Returns recent documents sorted by uploaded_at DESC.
        Limits to specified number of records (default 5 for compact dashboard card).
        """
        docs = self._load_documents()
        # Sort descending by uploaded_at
        docs.sort(key=lambda d: d.get("uploaded_at", ""), reverse=True)
        return docs[:limit]

    def get_all_documents(
        self, 
        status_filter: Optional[str] = None, 
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> Dict[str, Any]:
        """
        Returns all documents for the 'View All' full history page.
        Supports status filtering and search query.
        """
        docs = self._load_documents()
        docs.sort(key=lambda d: d.get("uploaded_at", ""), reverse=True)

        filtered = docs
        if status_filter and status_filter.lower() != "all":
            sf = status_filter.lower()
            filtered = [
                d for d in filtered 
                if d.get("status", "").lower() == sf or 
                   (sf == "verified" and "verif" in d.get("status", "").lower()) or
                   (sf == "under review" and ("review" in d.get("status", "").lower() or "process" in d.get("status", "").lower())) or
                   (sf == "discrepancy" and "discrep" in d.get("status", "").lower())
            ]

        if search and search.strip():
            sq = search.strip().lower()
            filtered = [
                d for d in filtered
                if sq in d.get("filename", "").lower() or
                   sq in d.get("document_id", "").lower() or
                   sq in d.get("survey_no", "").lower() or
                   sq in d.get("owner", "").lower() or
                   sq in d.get("village", "").lower()
            ]

        total = len(filtered)
        paginated = filtered[skip : skip + limit]
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "documents": paginated
        }

    def get_document_by_id(self, document_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single document record by ID."""
        docs = self._load_documents()
        for d in docs:
            if d.get("document_id") == document_id or d.get("id") == document_id:
                return d
        return None

    def add_document(
        self,
        filename: str,
        survey_no: str = "102/1A",
        owner: str = "Uploaded Landholder",
        village: str = "Perungudi",
        district: str = "Chennai",
        area_acres: float = 2.45,
        status: str = "Verified",
        storage_key: Optional[str] = None,
        doc_type: str = "Patta / Sale Deed",
        title_integrity_score: int = 90,
        analysis_result_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Creates and stores a new uploaded document record.
        Automatically sets uploaded_at to current UTC timestamp.
        """
        doc_id = f"DOC-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{uuid.uuid4().hex[:4].upper()}"
        now_iso = datetime.now(timezone.utc).isoformat()
        
        if not storage_key:
            clean_filename = os.path.basename(filename).replace(" ", "_")
            storage_key = f"documents/{doc_id}_{clean_filename}"

        new_doc = {
            "document_id": doc_id,
            "filename": filename,
            "uploaded_at": now_iso,
            "status": status,
            "storage_key": storage_key,
            "survey_no": survey_no,
            "owner": owner,
            "village": village,
            "district": district,
            "area_acres": round(float(area_acres), 2),
            "doc_type": doc_type,
            "title_integrity_score": title_integrity_score,
            "analysis_result_id": analysis_result_id or doc_id
        }

        docs = self._load_documents()
        # Insert at the beginning so latest is immediately first
        docs.insert(0, new_doc)
        self._save_documents(docs)
        return new_doc

    def update_document_status(
        self, 
        document_id: str, 
        status: str, 
        analysis_result_id: Optional[str] = None,
        title_integrity_score: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        """Updates the status and analysis linkage of an existing document."""
        docs = self._load_documents()
        updated = None
        for d in docs:
            if d.get("document_id") == document_id:
                d["status"] = status
                if analysis_result_id:
                    d["analysis_result_id"] = analysis_result_id
                if title_integrity_score is not None:
                    d["title_integrity_score"] = title_integrity_score
                updated = d
                break
        if updated:
            self._save_documents(docs)
        return updated


document_store = DocumentStore()
