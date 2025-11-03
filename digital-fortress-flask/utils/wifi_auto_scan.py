import os
import time
from typing import Dict, Any
import json
import requests

# Cache: prefer Redis if URL is provided, else in-memory
_CACHE: Dict[str, Any] = {}
_CACHE_TTL_SECONDS = 60 * 30  # 30 minutes

_redis = None
_redis_url = os.getenv("WIFI_REDIS_URL") or os.getenv("REDIS_URL")
if _redis_url:
    try:
        import redis  # type: ignore
        _redis = redis.from_url(_redis_url, decode_responses=True)
    except Exception:
        _redis = None


def _cache_get(key: str):
    try:
        if _redis is not None:
            data = _redis.get(key)
            return json.loads(data) if data else None
    except Exception:
        pass
    entry = _CACHE.get(key)
    if not entry:
        return None
    if time.time() - entry["ts"] > _CACHE_TTL_SECONDS:
        _CACHE.pop(key, None)
        return None
    return entry["value"]


def _cache_set(key: str, value: Any):
    try:
        if _redis is not None:
            _redis.setex(key, int(_CACHE_TTL_SECONDS), json.dumps(value))
            return
    except Exception:
        pass
    _CACHE[key] = {"ts": time.time(), "value": value}


DEFAULT_TIMEOUT = float(os.getenv("WIFI_SCAN_TIMEOUT", "1.8"))


def _get_ipapi() -> Dict[str, Any]:
    try:
        r = requests.get("https://ipapi.co/json/", timeout=DEFAULT_TIMEOUT)
        if r.ok:
            j = r.json()
            return {
                "ip": j.get("ip"),
                "asn": j.get("asn"),
                "org": j.get("org"),
                "network": j.get("network"),
                "country": j.get("country_name"),
                "region": j.get("region"),
                "city": j.get("city"),
                "timezone": j.get("timezone"),
                "version": j.get("version"),
                "type": j.get("version"),  # ipv4/ipv6 as network type surrogate
            }
        return {"error": f"ipapi status {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}


def _get_ipinfo() -> Dict[str, Any]:
    token = os.getenv("IPINFO_TOKEN")
    if not token:
        return {"skipped": True}
    try:
        r = requests.get(f"https://ipinfo.io/json?token={token}", timeout=DEFAULT_TIMEOUT)
        if r.ok:
            j = r.json()
            # ipinfo returns org like "ASXXXX ISP Name"
            return {
                "ip": j.get("ip"),
                "asn": (j.get("org") or "").split(" ")[0],
                "org": j.get("org"),
                "country": j.get("country"),
                "region": j.get("region"),
                "city": j.get("city"),
                "timezone": j.get("timezone"),
                "loc": j.get("loc"),
            }
        return {"error": f"ipinfo status {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}


def _dns_google_test() -> Dict[str, Any]:
    try:
        # Resolve example domain via Google DNS HTTPS resolver
        r = requests.get(
            "https://dns.google/resolve",
            params={"name": "example.com", "type": "A"},
            timeout=DEFAULT_TIMEOUT,
        )
        if r.ok:
            j = r.json()
            status = j.get("Status", 0)
            answers = j.get("Answer", [])
            return {
                "resolver": "dns.google",
                "ok": status == 0 and len(answers) > 0,
                "status": status,
                "answer_count": len(answers),
            }
        return {"resolver": "dns.google", "ok": False, "status": r.status_code}
    except Exception as e:
        return {"resolver": "dns.google", "ok": False, "error": str(e)}


def _captive_portal_probe() -> Dict[str, Any]:
    # Common captive portal check URL (should return 204, no redirect)
    endpoints = [
        "http://connectivitycheck.gstatic.com/generate_204",
        "http://clients3.google.com/generate_204",
    ]
    for url in endpoints:
        try:
            r = requests.get(url, allow_redirects=False, timeout=DEFAULT_TIMEOUT)
            captive = not (r.status_code == 204 and r.headers.get("Content-Length", "0") in ("0", 0))
            return {"endpoint": url, "status": r.status_code, "captive_portal": captive}
        except Exception as e:
            last_err = str(e)
    return {"endpoint": endpoints[-1], "captive_portal": False, "error": last_err}


def _abuseipdb_check(ip: str) -> Dict[str, Any]:
    api_key = os.getenv("ABUSEIPDB_KEY")
    if not api_key or not ip:
        return {"skipped": True}
    try:
        r = requests.get(
            "https://api.abuseipdb.com/api/v2/check",
            headers={"Key": api_key, "Accept": "application/json"},
            params={"ipAddress": ip, "maxAgeInDays": 90},
            timeout=DEFAULT_TIMEOUT,
        )
        if r.ok:
            j = r.json().get("data", {})
            return {
                "abuse_confidence": j.get("abuseConfidenceScore", 0),
                "isp": j.get("isp"),
                "country": j.get("countryCode"),
                "domain": j.get("domain"),
                "total_reports": j.get("totalReports", 0),
            }
        return {"error": f"abuseipdb status {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}


def _ssl_labs_probe(host: str = "google.com") -> Dict[str, Any]:
    # Optional: check a well-known host's TLS chain from current network
    try:
        r = requests.get(
            "https://api.ssllabs.com/api/v3/analyze",
            params={"host": host, "fromCache": "on", "maxAge": 24},
            timeout=DEFAULT_TIMEOUT,
        )
        if r.ok:
            j = r.json()
            endpoints = j.get("endpoints", [])
            grade = endpoints[0].get("grade") if endpoints else None
            return {"host": host, "grade": grade or "unknown"}
        return {"host": host, "error": f"ssllabs status {r.status_code}"}
    except Exception as e:
        return {"host": host, "error": str(e)}


def _score(telemetry: Dict[str, Any]) -> Dict[str, Any]:
    score = 0
    notes = []

    # Captive portal increases risk
    if telemetry.get("captive", {}).get("captive_portal"):
        score += 35
        notes.append("Captive portal detected")

    # DNS failure raises risk
    dns = telemetry.get("dns", {})
    if not dns.get("ok", False):
        score += 20
        notes.append("DNS resolver issues")

    # AbuseIPDB score contributes directly (capped)
    abuse = telemetry.get("abuseipdb", {})
    abuse_score = abuse.get("abuse_confidence", 0)
    score += min(40, int(abuse_score))
    if abuse_score:
        notes.append(f"AbuseIPDB confidence {abuse_score}")

    # IPv6-only or odd network type may hint captive/proxy
    if telemetry.get("ipapi", {}).get("version") == "IPv6":
        score += 5

    # Clamp
    score = max(0, min(100, score))

    if score >= 70:
        level = "High"
        exposed = ["Passwords", "OTP", "Browsing history"]
    elif score >= 40:
        level = "Medium"
        exposed = ["Passwords", "Browsing history"]
    else:
        level = "Low"
        exposed = []

    return {"risk_score": score, "risk_level": level, "possible_exposed_data": exposed, "notes": notes}


def auto_wifi_scan() -> Dict[str, Any]:
    # Prefer IPInfo if available, otherwise ipapi
    ipinfo = _get_ipinfo()
    ipapi = _get_ipapi() if ipinfo.get("skipped") else {}
    public_ip = ipinfo.get("ip") or ipapi.get("ip")

    # Cache key per public IP
    cache_key = f"auto_wifi_scan_v1:{public_ip or 'noip'}"
    cached = _cache_get(cache_key)
    if cached:
        return {**cached, "cached": True}

    dns = _dns_google_test()
    captive = _captive_portal_probe()
    abuse = _abuseipdb_check(public_ip)
    tls = _ssl_labs_probe()

    telemetry = {"ipinfo": ipinfo, "ipapi": ipapi, "dns": dns, "captive": captive, "abuseipdb": abuse, "tls": tls}
    scored = _score(telemetry)

    result = {
        "ssid": os.getenv("WIFI_SSID", "Detected_WiFi"),
        "risk_level": scored["risk_level"],
        "risk_score": scored["risk_score"],
        "possible_exposed_data": scored["possible_exposed_data"],
        "sources": {
            "ipinfo": ipinfo,
            "ipapi": ipapi,
            "dns": dns,
            "captive_portal": captive.get("captive_portal", False),
            "abuseipdb": abuse,
            "tls": tls,
        },
        "cached": False,
        "privacy_notice": "No device identifiers collected. Only public network info queried via external services.",
    }

    _cache_set(cache_key, result)
    return result
