"""
FarmAI - AWS Cloud Integration Module (ap-south-1 Mumbai)
Team 63: FAI-TCE-Team-63
Handles Amazon Textract, Amazon S3, and Amazon DynamoDB integrations.
"""

import os
import io
import time
import uuid
from typing import Dict, Any, Optional, Tuple, List

try:
    import boto3
    from botocore.exceptions import ClientError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False

REGION_NAME = os.getenv("AWS_DEFAULT_REGION", "ap-south-1")
S3_BUCKET = os.getenv("S3_BUCKET_NAME", "fai-tce-team63-farmai")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE_NAME", "fai-tce-team63-audit-records")


class AWSService:
    def __init__(self):
        self.region = REGION_NAME
        self.bucket_name = S3_BUCKET
        self.table_name = DYNAMODB_TABLE
        self.textract_client = None
        self.s3_client = None
        self.dynamodb_client = None
        self._init_clients()

    def _init_clients(self):
        if not BOTO3_AVAILABLE:
            return
        try:
            session = boto3.Session(region_name=self.region)
            self.textract_client = session.client("textract")
            self.s3_client = session.client("s3")
            self.dynamodb_client = session.client("dynamodb")
        except Exception as e:
            print(f"AWS Service init notice: {e}")

    def is_connected(self) -> bool:
        if not self.textract_client:
            return False
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            return True
        except Exception:
            return False

    def detect_text_with_textract(self, file_bytes: bytes, filename: str) -> Tuple[str, bool]:
        """
        Uses Amazon Textract (DetectDocumentText) to extract high-accuracy text.
        For images and single-page PDFs, passes raw bytes.
        For multi-page PDFs, buffers through S3 and extracts text.
        Returns: (extracted_text, is_success)
        """
        if not self.textract_client:
            return "", False

        try:
            is_pdf = filename.lower().endswith(".pdf") or file_bytes.startswith(b"%PDF")
            
            # If image or small single-page document (< 5 MB), try direct bytes
            if not is_pdf and len(file_bytes) < 5 * 1024 * 1024:
                response = self.textract_client.detect_document_text(
                    Document={"Bytes": file_bytes}
                )
                lines = [
                    b["Text"] for b in response.get("Blocks", [])
                    if b.get("BlockType") == "LINE" and "Text" in b
                ]
                return "\n".join(lines), True

            # For PDF documents, upload to S3 first then call Textract
            if self.s3_client and self.bucket_name:
                clean_name = os.path.basename(filename).replace(" ", "_")
                s3_key = f"textract_queue/{uuid.uuid4().hex[:8]}_{clean_name}"
                
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=s3_key,
                    Body=file_bytes,
                    ContentType="application/pdf" if is_pdf else "image/png"
                )

                response = self.textract_client.detect_document_text(
                    Document={
                        "S3Object": {
                            "Bucket": self.bucket_name,
                            "Name": s3_key
                        }
                    }
                )
                lines = [
                    b["Text"] for b in response.get("Blocks", [])
                    if b.get("BlockType") == "LINE" and "Text" in b
                ]
                return "\n".join(lines), True

        except Exception as err:
            print(f"Amazon Textract execution notice: {err}")
            return "", False

        return "", False

    def upload_to_s3(self, file_bytes: bytes, filename: str, folder: str = "land_documents") -> Optional[str]:
        """Uploads an ingested land record to S3 bucket."""
        if not self.s3_client:
            return None
        try:
            clean_name = os.path.basename(filename).replace(" ", "_")
            s3_key = f"{folder}/{uuid.uuid4().hex[:6]}_{clean_name}"
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3_key,
                Body=file_bytes
            )
            return f"s3://{self.bucket_name}/{s3_key}"
        except Exception as e:
            print(f"S3 upload notice: {e}")
            return None

    def record_audit_dynamodb(self, audit_payload: Dict[str, Any]) -> bool:
        """Stores title audit result in DynamoDB table."""
        if not self.dynamodb_client:
            return False
        try:
            audit_id = audit_payload.get("audit_id") or f"AUDIT-{uuid.uuid4().hex[:8].upper()}"
            survey_no = str(audit_payload.get("survey_no", "UNKNOWN"))
            score = str(audit_payload.get("score", 0))
            risk_tier = str(audit_payload.get("risk_tier", "UNKNOWN"))
            verdict = str(audit_payload.get("verdict", "PENDING"))
            timestamp = str(time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))

            item = {
                "audit_id": {"S": audit_id},
                "survey_no": {"S": survey_no},
                "score": {"N": score},
                "risk_tier": {"S": risk_tier},
                "verdict": {"S": verdict},
                "timestamp": {"S": timestamp},
                "team": {"S": "FAI-TCE-Team-63"}
            }

            self.dynamodb_client.put_item(
                TableName=self.table_name,
                Item=item
            )
            return True
        except Exception as e:
            print(f"DynamoDB audit record notice: {e}")
            return False

    def get_service_status(self) -> Dict[str, Any]:
        """Returns health and status of AWS services for dashboard display."""
        status = {
            "aws_region": self.region,
            "team_account": "FAI-TCE-Team-63 (022444446410)",
            "textract": "OFFLINE",
            "s3_bucket": self.bucket_name,
            "s3_status": "OFFLINE",
            "dynamodb_table": self.table_name,
            "dynamodb_status": "OFFLINE"
        }

        if self.textract_client:
            status["textract"] = "ACTIVE (ap-south-1)"

        if self.s3_client:
            try:
                self.s3_client.head_bucket(Bucket=self.bucket_name)
                status["s3_status"] = "CONNECTED"
            except Exception:
                status["s3_status"] = "CHECK_PERMISSIONS"

        if self.dynamodb_client:
            try:
                self.dynamodb_client.describe_table(TableName=self.table_name)
                status["dynamodb_status"] = "ACTIVE"
            except Exception:
                status["dynamodb_status"] = "INITIALIZING"

        return status


aws_service = AWSService()
