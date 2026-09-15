"""
Automated Title Integrity & Land Risk Scoring Engine.
Computes a 0–100 Title Integrity Index with explainable risk flags,
penalties, and legal/administrative recommendations.
"""

from typing import Dict, Any, List

class LandRiskAnalyzer:
    def __init__(self):
        self.max_score = 100

    def evaluate_risk(self, reconciliation_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates Title Integrity Score, penalty breakdowns, and actionable advice."""
        if reconciliation_data.get("status") != "RECONCILED":
            return {
                "title_integrity_score": 0,
                "risk_tier": "UNKNOWN / UNRESOLVED",
                "risk_color": "#EF4444",
                "flags": [{"type": "ERROR", "message": "Parcel could not be reconciled with Cadastral database", "penalty": 100}],
                "recommendations": ["Verify survey number with local Taluk office."]
            }

        discrepancies = reconciliation_data.get("discrepancies", {})
        score = self.max_score
        flags: List[Dict[str, Any]] = []
        recommendations: List[str] = []

        # 1. Area Discrepancy Evaluation
        area_rec = discrepancies.get("area_reconciliation", {})
        area_diff_pct = area_rec.get("doc_vs_cadastral_percent", 0.0)
        area_diff_acres = area_rec.get("doc_vs_cadastral_diff_acres", 0.0)
        
        if area_diff_pct > 5.0:
            penalty = 30
            score -= penalty
            flags.append({
                "severity": "CRITICAL",
                "category": "AREA_DISCREPANCY",
                "penalty": penalty,
                "title": f"Major Area Discrepancy ({area_diff_pct}% deviation)",
                "description": f"Document claims {reconciliation_data['document_claimed']['area_acres']} Acres, but Cadastral GIS holds {reconciliation_data['cadastral_parcel']['gis_area_acres']} Acres (Excess claim: {area_diff_acres} Acres)."
            })
            recommendations.append("Immediate physical re-survey required by Taluk Head Surveyor before any transaction or registration.")
        elif area_diff_pct > 2.0:
            penalty = 12
            score -= penalty
            flags.append({
                "severity": "WARNING",
                "category": "AREA_DEVIATION",
                "penalty": penalty,
                "title": f"Minor Area Variance ({area_diff_pct}%)",
                "description": f"Area difference of {abs(area_diff_acres)} Acres falls outside the 2% normal survey margin of error."
            })
            recommendations.append("Verify field measurements against latest FMB sub-division ladder.")

        # 2. Waterbody Encroachment Evaluation
        encroachments = discrepancies.get("encroachments", {})
        if encroachments.get("has_waterbody_encroachment"):
            penalty = 40
            score -= penalty
            for wb in encroachments.get("waterbody_details", []):
                flags.append({
                    "severity": "CRITICAL_LEGAL_VIOLATION",
                    "category": "WATERBODY_ENCROACHMENT",
                    "penalty": penalty,
                    "title": f"Statutory Waterbody Encroachment ({wb.get('feature_name')})",
                    "description": f"Parcel overlaps with {wb.get('encroached_acres')} Acres of protected waterbody/buffer zone. In violation of TN Protection of Tanks and Eviction of Encroachment Act.",
                    "encroached_sqm": wb.get("encroached_sqm")
                })
            recommendations.append("HIGH RISK: Subject to summary eviction and demolition orders under High Court waterbody conservation directives. Title is legally unmarketable for the encroached portion.")

        # 3. Road / Corridor RoW Encroachment
        if encroachments.get("has_road_encroachment"):
            penalty = 25
            score -= penalty
            for rd in encroachments.get("road_details", []):
                flags.append({
                    "severity": "HIGH",
                    "category": "HIGHWAY_ROW_INFRINGEMENT",
                    "penalty": penalty,
                    "title": f"Road Right-of-Way Infringement ({rd.get('road_name')})",
                    "description": f"Parcel boundaries extend {rd.get('encroached_acres')} Acres into the designated Highway / Arterial corridor buffer.",
                    "encroached_sqm": rd.get("encroached_sqm")
                })
            recommendations.append("Building setback violation: Development approval will be denied by CMDA/DTCP due to Highway RoW overlap.")

        # 4. FMB Geometry & Ladder Discrepancy
        fmb_rec = discrepancies.get("fmb_reconciliation", {})
        if fmb_rec.get("is_fmb_skewed"):
            penalty = 15
            score -= penalty
            flags.append({
                "severity": "WARNING",
                "category": "FMB_SHAPE_SKEW",
                "penalty": penalty,
                "title": "FMB Sketch & Cadastral Shape Mismatch",
                "description": f"FMB ladder calculation deviates by {fmb_rec.get('fmb_vs_cadastral_percent')}% ({fmb_rec.get('fmb_vs_cadastral_diff_acres')} Acres) from digitized cadastral boundaries."
            })
            recommendations.append("FMB digitization rectification required at District Land Records Office.")

        # 5. Ownership Verification
        ownership_rec = discrepancies.get("ownership_reconciliation", {})
        if not ownership_rec.get("is_match"):
            penalty = 15
            score -= penalty
            flags.append({
                "severity": "WARNING",
                "category": "OWNERSHIP_MISMATCH",
                "penalty": penalty,
                "title": "Ownership Name Divergence",
                "description": f"Document names ({', '.join(ownership_rec.get('doc_owners', []))}) differ from Cadastral registry ({ownership_rec.get('cadastral_owner')})."
            })
            recommendations.append("Obtain registered Encumbrance Certificate (EC) and Patta Transfer Order to verify chain of title.")

        # 6. Boundary Neighbor Verification
        boundary_rec = discrepancies.get("boundary_reconciliation", {})
        mismatched_boundaries = [k.capitalize() for k, v in boundary_rec.items() if v.get("status") == "POTENTIAL_MISMATCH"]
        if mismatched_boundaries:
            penalty = 8
            score -= penalty
            flags.append({
                "severity": "INFO",
                "category": "BOUNDARY_ADJACENCY",
                "penalty": penalty,
                "title": f"Neighbor Boundary Verification ({', '.join(mismatched_boundaries)})",
                "description": f"Documented adjacent owners/landmarks on {', '.join(mismatched_boundaries)} do not directly match GIS cadastral neighbor records."
            })

        # Cap score between 0 and 100
        final_score = max(0, min(100, score))
        has_critical = any(f.get("severity") in ["CRITICAL", "CRITICAL_LEGAL_VIOLATION"] for f in flags)

        # Determine Tier
        if final_score >= 80 and not has_critical:
            tier = "CLEAR TITLE / LOW RISK"
            color = "#10B981" # Green
            verdict = "APPROVED FOR TRANSACTION / REGISTRATION"
        elif final_score >= 50 and not has_critical:
            tier = "MODERATE RISK / AUDIT REQUIRED"
            color = "#F59E0B" # Amber
            verdict = "CONDITIONAL APPROVAL - RECTIFICATION NEEDED"
        else:
            tier = "CRITICAL RISK / MAJOR DISCREPANCY"
            color = "#EF4444" # Red
            verdict = "REJECTED - ENCROACHMENT / TITLE DEFECT"

        if not recommendations:
            recommendations.append("All primary verification parameters satisfied. Clear title confirmed against Cadastral GIS & FMB records.")

        return {
            "title_integrity_score": final_score,
            "risk_tier": tier,
            "risk_color": color,
            "verdict": verdict,
            "total_flags_count": len(flags),
            "critical_flags_count": sum(1 for f in flags if f.get("severity") in ["CRITICAL", "CRITICAL_LEGAL_VIOLATION"]),
            "warning_flags_count": sum(1 for f in flags if f.get("severity") == "WARNING"),
            "flags": flags,
            "recommendations": recommendations,
            "audit_timestamp": "2026-09-15T15:20:00Z"
        }

risk_analyzer = LandRiskAnalyzer()
