import os
import re
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from uuid import uuid4
from utils.fraud_enrichment import enrich_fraud_detection, get_fraud_stats
from dotenv import load_dotenv
from utils.wifi_auto_scan import auto_wifi_scan

load_dotenv()

# Optional MongoDB logging
MONGO_URI = os.getenv("MONGO_URI")
mongo = None

try:
    if MONGO_URI:
        from pymongo import MongoClient
        mongo = MongoClient(MONGO_URI)
        db = mongo.get_database(os.getenv("MONGO_DB", "digital_fortress"))
    else:
        db = None
except Exception:
    mongo = None
    db = None

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

SAFE_ADVICE = "URL appears safe, but always verify before entering credentials."

# In-memory storage for deception events when MongoDB is not configured
DECEPTIONS = []

# --- Helpers ---
def score_url(url: str):
    try:
        parsed = urlparse(url)
        host = parsed.hostname or ""
        scheme = parsed.scheme or ""
        path = parsed.path or ""

        risk = 0
        reasons = []

        if scheme == "http":
            risk += 40
            reasons.append("Site uses insecure HTTP (no HTTPS)")

        # Suspicious keywords
        risky_keywords = [
            "login", "verify", "update", "password", "bank", "gift", "lottery",
            "confirm", "unlock", "suspend", "win", "otp", "credential"
        ]
        found = [kw for kw in risky_keywords if kw in (host + path).lower()]
        if found:
            risk += min(40, 5 * len(found))
            reasons.append(f"Suspicious keywords in URL: {', '.join(found)}")

        # Excessive subdomains (e.g., a.b.c.d.example)
        if host.count(".") >= 4:
            risk += 10
            reasons.append("Too many subdomains (possible obfuscation)")

        # Numeric-looking domain
        if re.match(r"^\d+[.-]", host or ""):
            risk += 10
            reasons.append("Numeric-looking domain")

        # Cap 0..100
        risk = max(0, min(100, risk))

        safe = risk < 30
        level = "safe" if safe else ("danger" if risk >= 70 else "medium")
        reason = SAFE_ADVICE if safe else (reasons[0] if reasons else "Potential risk detected")

        return {
            "url": url,
            "risk_score": risk,
            "safe": safe,
            "level": level,
            "reason": reason,
            "reasons": reasons,
            "advice": SAFE_ADVICE if safe else "Proceed with caution. Verify the site before entering any information.",
        }
    except Exception as e:
        return {"url": url, "risk_score": 50, "safe": False, "level": "medium", "reason": str(e)}


def analyze_text_basic(text: str):
    text_l = text.lower()
    patterns = {
        "high": [
            r"send\s+otp", r"share\s+password", r"bank\s+account", r"urgent\s+payment",
            r"crypto\s+investment", r"suspend\s+your\s+account", r"click\s+link\s+to\s+verify",
        ],
        "medium": [r"limited\s+offer", r"act\s+now", r"confirm\s+identity", r"prize|lottery|gift"],
    }
    level = "safe"
    reasons = []

    for pat in patterns["high"]:
        if re.search(pat, text_l):
            level = "high"
            reasons.append(f"Matched pattern: {pat}")
    if level != "high":
        for pat in patterns["medium"]:
            if re.search(pat, text_l):
                level = "medium"
                reasons.append(f"Matched pattern: {pat}")

    response = {
        "level": level,
        "confidence": 90 if level == "high" else (70 if level == "medium" else 50),
        "reason": reasons[0] if reasons else "No risky patterns detected",
        "advice": "Do not share sensitive info. Verify sender and links before acting." if level != "safe" else "Looks okay, but stay cautious.",
        "risky_keywords": ["otp", "password", "bank", "verify", "payment", "gift", "lottery"] if level != "safe" else [],
    }
    return response


# --- Routes ---
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"success": True, "message": "Digital Fortress API is running (Flask)"})


@app.route("/api/url_scan", methods=["POST"])
def url_scan():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "")
    if not url:
        return jsonify({"success": False, "error": "url is required"}), 400

    result = score_url(url)
    return jsonify({"success": True, "data": result})


@app.route("/api/detect_fraud", methods=["POST"])
def detect_fraud():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    if not text:
        return jsonify({"success": False, "error": "text is required"}), 400

    # Get basic text analysis
    basic_result = analyze_text_basic(text)
    
    # Enrich with external API checks
    try:
        # Get API keys from environment
        api_keys = {
            "GOOGLE_SAFE_BROWSING_KEY": os.getenv("GOOGLE_SAFE_BROWSING_KEY"),
            "PHISHTANK_API": os.getenv("PHISHTANK_API"),
            "VIRUSTOTAL_KEY": os.getenv("VIRUSTOTAL_KEY")
        }
        
        # Run the enrichment function (synchronous version)
        enrichment_result = enrich_fraud_detection(text)
        
        # Calculate combined fraud score
        local_heuristic_score = basic_result.get("confidence", 0)
        
        # Get reputation and domain age scores from enrichment
        reputation_score = 0
        domain_age_score = 0
        
        if enrichment_result.get("highest_risk_url"):
            highest_risk = enrichment_result["highest_risk_url"]
            reputation_score = highest_risk.get("reputation_score", 0)
            domain_age_score = highest_risk.get("domain_age_score", 0)
        
        # Calculate weighted total score
        total_score = (local_heuristic_score * 0.5) + (reputation_score * 0.3) + (domain_age_score * 0.2)
        total_score = max(0, min(100, total_score))  # Ensure score is between 0-100
        
        # Determine risk level
        if total_score >= 70:
            risk_level = "High"
        elif total_score >= 40:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        # Prepare response
        result = {
            "fraud_score": round(total_score),
            "risk_level": risk_level,
            "risky_keywords": basic_result.get("risky_keywords", []),
            "external_sources": enrichment_result.get("external_sources", {}),
            "advice": basic_result.get("advice", "Proceed with caution."),
            "cached": enrichment_result.get("cached", False),
            "privacy_notice": "External APIs used only for URL reputation checks."
        }
        
        # Add AI risk explanation if score is high enough
        if total_score >= 40:
            reasons = []
            if basic_result.get("level") != "safe":
                reasons.append(basic_result.get("reason", "Suspicious text content"))
            
            if enrichment_result.get("external_sources"):
                for source, value in enrichment_result["external_sources"].items():
                    if "safe" not in value.lower() and "unknown" not in value.lower():
                        reasons.append(f"{source}: {value}")
            
            if reasons:
                result["risk_explanation"] = " + ".join(reasons[:3])
        
        return jsonify({"success": True, "data": result})
    except Exception as e:
        # Fallback to basic analysis if enrichment fails
        return jsonify({
            "success": True, 
            "data": basic_result,
            "error": f"Enrichment failed: {str(e)}"
        })


@app.route("/api/auto_wifi_scan", methods=["GET"])
def auto_wifi_scan_route():
    """Automatically scan current network using public resolvers/APIs.
    Privacy-safe: only public IP/network metadata is queried.
    """
    try:
        result = auto_wifi_scan()
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/auto_wifi_scan", methods=["GET"])
def auto_wifi_scan_route_alias():
    try:
        result = auto_wifi_scan()
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/detect_fraud_async", methods=["POST"])
def detect_fraud_async():
    """Asynchronous version of fraud detection endpoint."""
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    if not text:
        return jsonify({"success": False, "error": "text is required"}), 400

    # Return immediate acknowledgment
    return jsonify({
        "success": True,
        "message": "Fraud detection request received and processing",
        "request_id": str(uuid4())
    })


@app.route("/api/fraud_stats", methods=["GET"])
def fraud_stats():
    """Get statistics about fraud detection."""
    stats = get_fraud_stats()
    return jsonify({"success": True, "data": stats})


@app.route("/api/wifi_scan", methods=["GET"])  # Placeholder demo endpoint
def wifi_scan():
    # For privacy and portability, return a simple mocked response.
    return jsonify({
        "success": True,
        "data": {
            "ssid": os.getenv("WIFI_SSID", "Unknown"),
            "secure": True,
            "recommendation": "Use WPA2/WPA3, disable WPS, and change default router password.",
        }
    })


@app.route("/api/chatbot", methods=["POST"])  # Simple demo response
def chatbot():
    data = request.get_json(silent=True) or {}
    question = data.get("message", "")
    reply = (
        "Always verify the domain, look for HTTPS, and be wary of unexpected OTP or payment requests. "
        "I am a demo responder; connect me to a real AI later."
    )
    return jsonify({"success": True, "data": {"reply": reply, "echo": question}})


@app.route("/api/deceptions/log", methods=["POST"])  # Optional logging
def deceptions_log():
    payload = request.get_json(silent=True) or {}
    now_iso = datetime.utcnow().isoformat()

    # Normalize/sanitize event fields
    event = {
        "_id": payload.get("id") or str(uuid4()),
        "title": payload.get("title", "Suspicious Activity Detected"),
        "summary": payload.get("summary", payload.get("reason") or "Potential security threat detected."),
        "type": payload.get("type", "Suspicious Link"),
        "threat_source": payload.get("threat_source", payload.get("url", "Unknown")),
        "protected_items": payload.get("protected_items", []),
        "severity": payload.get("severity", "Medium"),
        "status": "published",  # publish immediately so it appears in the public feed
        "timestamp": payload.get("timestamp") or now_iso,
        "timeline": payload.get("timeline") or {
            "detection": {"timestamp": now_iso, "method": payload.get("source", "Extension")}
        },
        "metadata": {"source": payload.get("source", "Browser Extension"), "sanitized": True},
    }

    if db is not None:
        try:
            db.deceptions.insert_one({**event, "_source": "extension", "created_at": now_iso})
            return jsonify({"success": True, "data": {"id": event["_id"], "status": event["status"]}})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    # Store in memory and cap list length
    DECEPTIONS.insert(0, event)
    if len(DECEPTIONS) > 200:
        DECEPTIONS.pop()
    return jsonify({"success": True, "data": {"id": event["_id"], "status": event["status"]}})


@app.route("/api/deceptions/public", methods=["GET"])  # Public feed (sanitized)
def deceptions_public():
    limit = int(request.args.get("limit", 20))
    skip = int(request.args.get("skip", 0))

    items = []
    if db is not None:
        try:
            cursor = (
                db.deceptions.find({"status": "published"}).sort("timestamp", -1).skip(skip).limit(limit)
            )
            for d in cursor:
                items.append({
                    "id": str(d.get("_id")),
                    "title": d.get("title"),
                    "summary": d.get("summary"),
                    "type": d.get("type"),
                    "threat_source": d.get("threat_source"),
                    "protected_items": d.get("protected_items", []),
                    "severity": d.get("severity", "Medium"),
                    "timestamp": d.get("timestamp", datetime.utcnow().isoformat()),
                    "timeline": {"detection": (d.get("timeline") or {}).get("detection")},
                })
        except Exception:
            items = []
    else:
        # Use in-memory store
        for d in DECEPTIONS[skip: skip + limit]:
            items.append({
                "id": d["_id"],
                "title": d["title"],
                "summary": d["summary"],
                "type": d["type"],
                "threat_source": d.get("threat_source"),
                "protected_items": d.get("protected_items", []),
                "severity": d.get("severity", "Medium"),
                "timestamp": d.get("timestamp"),
                "timeline": {"detection": (d.get("timeline") or {}).get("detection")},
            })

    return jsonify({"success": True, "count": len(items), "data": items})


@app.route("/api/deceptions/<id>", methods=["GET"])  # Public details
def deceptions_get(id):
    if db is not None:
        try:
            d = db.deceptions.find_one({"_id": id}) or db.deceptions.find_one({"_id": {"$eq": id}})
            if not d:
                return jsonify({"success": False, "message": "Not found"}), 404
            if d.get("status") != "published":
                return jsonify({"success": False, "message": "Not published"}), 403
            d_out = {
                "id": str(d.get("_id")),
                "title": d.get("title"),
                "summary": d.get("summary"),
                "type": d.get("type"),
                "protected_items": d.get("protected_items", []),
                "severity": d.get("severity", "Medium"),
                "timestamp": d.get("timestamp", datetime.utcnow().isoformat()),
                "timeline": d.get("timeline"),
                "metadata": d.get("metadata", {}),
            }
            return jsonify({"success": True, "data": d_out})
        except Exception:
            return jsonify({"success": False, "message": "Error"}), 500

    # In-memory lookup
    for d in DECEPTIONS:
        if d["_id"] == id:
            d_out = {
                "id": d["_id"],
                "title": d["title"],
                "summary": d["summary"],
                "type": d["type"],
                "protected_items": d.get("protected_items", []),
                "severity": d.get("severity", "Medium"),
                "timestamp": d.get("timestamp"),
                "timeline": d.get("timeline"),
                "metadata": d.get("metadata", {}),
            }
            return jsonify({"success": True, "data": d_out})
    return jsonify({"success": False, "message": "Not found"}), 404


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    app.run(host="0.0.0.0", port=port)
