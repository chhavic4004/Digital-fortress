"""
Fraud Detection Enrichment Module
---------------------------------
This module provides external API integrations for fraud detection:
- Google Safe Browsing API
- PhishTank / OpenPhish
- WHOIS / RDAP for domain age
- Caching system for API results
"""

import os
import re
import time
import json
import logging
from datetime import datetime, timedelta
from urllib.parse import urlparse
import requests
from typing import Dict, List, Any, Optional, Tuple

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fraud_enrichment")

# Initialize cache
URL_CACHE = {}  # URL -> {result: dict, timestamp: float}
CACHE_TTL = 60 * 60  # 1 hour in seconds

# Extract URLs from text
def extract_urls(text: str) -> List[str]:
    """Extract URLs from text content."""
    # URL regex pattern
    url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+'
    return re.findall(url_pattern, text)

# Cache management
def get_cached_result(url: str) -> Optional[Dict]:
    """Get cached result for a URL if available and not expired."""
    if url in URL_CACHE:
        cache_entry = URL_CACHE[url]
        if time.time() - cache_entry["timestamp"] < CACHE_TTL:
            return cache_entry["result"]
    return None

def cache_result(url: str, result: Dict) -> None:
    """Cache result for a URL."""
    URL_CACHE[url] = {
        "result": result,
        "timestamp": time.time()
    }

def get_cache_stats() -> Dict:
    """Get statistics about the cache."""
    return {
        "cached_items": len(URL_CACHE),
        "cache_size_kb": len(json.dumps(URL_CACHE)) / 1024
    }

# Google Safe Browsing API
def check_google_safe_browsing(url: str) -> Dict:
    """Check URL against Google Safe Browsing API."""
    api_key = os.getenv("GOOGLE_SAFE_BROWSING_KEY")
    if not api_key:
        return {"status": "skipped", "reason": "API key not configured"}
    
    try:
        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
        payload = {
            "client": {
                "clientId": "digital-fortress",
                "clientVersion": "1.0.0"
            },
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }
        
        response = requests.post(endpoint, json=payload, timeout=1.5)
        if response.status_code == 200:
            result = response.json()
            if "matches" in result and len(result["matches"]) > 0:
                threat_type = result["matches"][0]["threatType"]
                return {"status": "unsafe", "threat_type": threat_type, "score": 100}
            return {"status": "safe", "score": 0}
        else:
            return {"status": "error", "reason": f"API returned status {response.status_code}"}
    except Exception as e:
        logger.error(f"Google Safe Browsing API error: {str(e)}")
        return {"status": "error", "reason": str(e)}

# PhishTank / OpenPhish API
def check_phishtank(url: str) -> Dict:
    """Check URL against PhishTank API."""
    api_key = os.getenv("PHISHTANK_API")
    if not api_key:
        # Fallback to OpenPhish if PhishTank API key is not available
        return check_openphish(url)
    
    try:
        endpoint = "https://checkurl.phishtank.com/checkurl/"
        payload = {
            "url": url,
            "format": "json",
            "app_key": api_key
        }
        
        response = requests.post(endpoint, data=payload, timeout=1.5)
        if response.status_code == 200:
            result = response.json()
            if "results" in result and result["results"]["in_database"]:
                return {
                    "status": "unsafe" if result["results"]["valid"] else "suspicious",
                    "score": 100 if result["results"]["valid"] else 70
                }
            return {"status": "safe", "score": 0}
        else:
            return {"status": "error", "reason": f"API returned status {response.status_code}"}
    except Exception as e:
        logger.error(f"PhishTank API error: {str(e)}")
        # Fallback to OpenPhish
        return check_openphish(url)

def check_openphish(url: str) -> Dict:
    """Check URL against OpenPhish database (free alternative)."""
    try:
        # OpenPhish doesn't have a direct API, but we can check their feed
        # This is a simplified implementation - in production, you'd download and cache their feed
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        
        # Simulate a check against OpenPhish database
        # In a real implementation, you would download and parse their feed
        return {"status": "unknown", "score": 0, "note": "OpenPhish check simulated"}
    except Exception as e:
        logger.error(f"OpenPhish check error: {str(e)}")
        return {"status": "error", "reason": str(e)}

# WHOIS / RDAP Lookup
def check_domain_age(url: str) -> Dict:
    """Check domain age using WHOIS/RDAP."""
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        
        # Use RDAP for domain lookup (more modern than WHOIS)
        rdap_url = f"https://rdap.org/domain/{domain}"
        
        response = requests.get(rdap_url, timeout=1.5)
        if response.status_code == 200:
            result = response.json()
            
            # Extract registration date if available
            events = result.get("events", [])
            registration_date = None
            
            for event in events:
                if event.get("eventAction") == "registration":
                    registration_date = event.get("eventDate")
                    break
            
            if registration_date:
                # Calculate domain age
                reg_date = datetime.fromisoformat(registration_date.replace("Z", "+00:00"))
                domain_age_days = (datetime.now(reg_date.tzinfo) - reg_date).days
                
                # Score based on domain age
                # New domains (< 30 days) are higher risk
                if domain_age_days < 30:
                    return {
                        "status": "suspicious", 
                        "score": max(0, 100 - domain_age_days * 3),
                        "domain_age_days": domain_age_days,
                        "note": f"New domain ({domain_age_days} days old)"
                    }
                elif domain_age_days < 90:
                    return {
                        "status": "medium", 
                        "score": max(0, 50 - (domain_age_days - 30)),
                        "domain_age_days": domain_age_days,
                        "note": f"Recent domain ({domain_age_days} days old)"
                    }
                else:
                    return {
                        "status": "established", 
                        "score": 0,
                        "domain_age_days": domain_age_days,
                        "note": f"Established domain ({domain_age_days} days old)"
                    }
            
            return {"status": "unknown", "score": 30, "note": "Domain age could not be determined"}
        else:
            return {"status": "error", "reason": f"RDAP API returned status {response.status_code}"}
    except Exception as e:
        logger.error(f"Domain age check error: {str(e)}")
        return {"status": "error", "reason": str(e)}

# VirusTotal API (optional)
def check_virustotal(url: str) -> Dict:
    """Check URL against VirusTotal API."""
    api_key = os.getenv("VIRUSTOTAL_KEY")
    if not api_key:
        return {"status": "skipped", "reason": "API key not configured"}
    
    try:
        # First, get the URL ID by submitting the URL
        endpoint = f"https://www.virustotal.com/api/v3/urls"
        headers = {"x-apikey": api_key}
        payload = {"url": url}
        
        response = requests.post(endpoint, headers=headers, data=payload, timeout=1.5)
        if response.status_code == 200:
            result = response.json()
            analysis_id = result.get("data", {}).get("id")
            if not analysis_id:
                return {"status": "error", "reason": "Could not get analysis ID"}
            
            # Wait a moment for analysis to complete
            time.sleep(1)
            
            # Get the analysis results
            analysis_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
            analysis_response = requests.get(analysis_url, headers=headers, timeout=1.5)
            if analysis_response.status_code == 200:
                analysis = analysis_response.json()
                stats = analysis.get("data", {}).get("attributes", {}).get("stats", {})
                
                malicious = stats.get("malicious", 0)
                suspicious = stats.get("suspicious", 0)
                total = sum(stats.values())
                
                if total > 0:
                    score = (malicious * 100 + suspicious * 50) / total
                    status = "unsafe" if malicious > 0 else "suspicious" if suspicious > 0 else "safe"
                    return {
                        "status": status,
                        "score": score,
                        "malicious": malicious,
                        "suspicious": suspicious,
                        "total": total
                    }
                
                return {"status": "unknown", "score": 0}
            else:
                return {"status": "error", "reason": f"Analysis API returned status {analysis_response.status_code}"}
        else:
            return {"status": "error", "reason": f"API returned status {response.status_code}"}
    except Exception as e:
        logger.error(f"VirusTotal API error: {str(e)}")
        return {"status": "error", "reason": str(e)}

# Main enrichment function
def enrich_fraud_detection(text: str) -> Dict:
    """
    Enrich fraud detection with external API checks.
    
    Args:
        text: The text to analyze for fraud
        
    Returns:
        Dict containing enriched fraud detection results
    """
    # Extract URLs from text
    urls = extract_urls(text)
    
    # Initialize results
    results = {
        "urls_found": len(urls),
        "urls_analyzed": [],
        "external_sources": {},
        "cached": False
    }
    
    # If no URLs found, return early
    if not urls:
        return results
    
    # Process each URL
    highest_risk_score = 0
    highest_risk_url = None
    
    for url in urls:
        # Check cache first
        cached_result = get_cached_result(url)
        if cached_result:
            results["cached"] = True
            url_result = cached_result
        else:
            # Run all checks sequentially
            google_result = check_google_safe_browsing(url)
            phishtank_result = check_phishtank(url)
            domain_age_result = check_domain_age(url)
            virustotal_result = check_virustotal(url)
            
            # Calculate weighted score
            local_heuristic_score = 0  # Will be filled by the main app
            reputation_score = max(
                google_result.get("score", 0),
                phishtank_result.get("score", 0),
                virustotal_result.get("score", 0)
            )
            domain_age_score = domain_age_result.get("score", 0)
            
            # Store external sources info
            external_sources = {}
            if google_result.get("status") != "skipped":
                external_sources["google_safe_browsing"] = google_result.get("status", "unknown")
                if google_result.get("threat_type"):
                    external_sources["google_safe_browsing"] += f" ({google_result['threat_type']})"
            
            if phishtank_result.get("status") != "unknown":
                external_sources["phishtank"] = phishtank_result.get("status", "unknown")
            
            if domain_age_result.get("status") != "error":
                external_sources["whois"] = domain_age_result.get("note", "unknown")
            
            if virustotal_result.get("status") != "skipped":
                if virustotal_result.get("malicious", 0) > 0:
                    external_sources["virustotal"] = f"{virustotal_result.get('malicious', 0)} detections"
            
            # Store URL result
            url_result = {
                "url": url,
                "reputation_score": reputation_score,
                "domain_age_score": domain_age_score,
                "external_sources": external_sources,
                "api_results": {
                    "google_safe_browsing": google_result,
                    "phishtank": phishtank_result,
                    "domain_age": domain_age_result,
                    "virustotal": virustotal_result
                }
            }
            
            # Cache the result
            cache_result(url, url_result)
        
        # Track highest risk URL
        url_risk = url_result.get("reputation_score", 0) + url_result.get("domain_age_score", 0)
        if url_risk > highest_risk_score:
            highest_risk_score = url_risk
            highest_risk_url = url
        
        # Add to analyzed URLs
        results["urls_analyzed"].append(url_result)
    
    # Add highest risk URL info
    if highest_risk_url:
        for url_data in results["urls_analyzed"]:
            if url_data["url"] == highest_risk_url:
                results["highest_risk_url"] = url_data
                break
    
    # Add external sources summary
    if results["urls_analyzed"]:
        results["external_sources"] = results["urls_analyzed"][0]["external_sources"]
    
    return results

# Get fraud detection stats
def get_fraud_stats() -> Dict:
    """Get statistics about fraud detection."""
    return {
        "cache_stats": get_cache_stats(),
        "api_usage": {
            "google_safe_browsing": {"calls": 0},  # In a real implementation, track API usage
            "phishtank": {"calls": 0},
            "virustotal": {"calls": 0}
        }
    }