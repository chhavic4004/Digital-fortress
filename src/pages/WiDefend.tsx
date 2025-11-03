import { useState, useEffect } from "react";
import { Wifi, Shield, AlertTriangle, CheckCircle2, XCircle, Loader2, Globe, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import RiskMeter from "@/components/RiskMeter";
import DataExposureList from "@/components/DataExposureList";
import SourceCard from "@/components/SourceCard";

// Calls backend auto_wifi_scan endpoint to analyze current network via external APIs.
const WiDefend = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState({
    ssid: "",
    encryption: "",
    dns: "",
    activity: "",
    certificate: "",
    captivePortal: false,
    httpTest: true,
  });
  const [showForm, setShowForm] = useState(true);
  const base = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

  // Detect network information on component mount
  useEffect(() => {
    detectNetworkInfo();
  }, []);

  const detectNetworkInfo = async () => {
    // Try to detect connection type and DNS
    const connectionType = (navigator as any).connection?.type || 
                          (navigator as any).mozConnection?.type ||
                          (navigator as any).webkitConnection?.type || 'unknown';
    
    // Detect if it's WiFi
    const isWifi = connectionType === 'wifi' || 
                   (navigator as any).connection?.effectiveType?.includes('wifi') ||
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
    
    // Try to get DNS (limited browser capability)
    let detectedDNS = "";
    try {
      // Most browsers use system DNS, we'll default to checking
      detectedDNS = "System DNS";
    } catch (e) {
      // Can't detect DNS directly
    }

    // Auto-detect encryption based on connection type
    let detectedEncryption = "WPA2"; // Default assumption
    if (connectionType === 'cellular' || !isWifi) {
      detectedEncryption = "Mobile Data";
    }

    setNetworkInfo({
      ssid: isWifi ? "Current Network" : "Mobile/Unknown",
      encryption: detectedEncryption,
      dns: detectedDNS,
      activity: "",
      certificate: "",
      captivePortal: false,
      httpTest: true,
    });
  };

  const autoScan = async () => {
    setScanning(true);
    setProgress(0);
    setResult(null);
    setError(null);
    setShowForm(false);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? (clearInterval(interval), prev) : prev + 10));
    }, 220);

    try {
      const resp = await fetch(`${base}/auto_wifi_scan`, { method: "GET" });
      const data = await resp.json();
      clearInterval(interval);
      setScanning(false);
      setProgress(100);

      if (data?.success && data?.data) {
        const d = data.data;
        setResult({
          ssid: d.ssid || "Detected_WiFi",
          riskLevel: String(d.risk_level || "Low").toLowerCase(),
          riskScore: d.risk_score ?? 0,
          exposedData: d.possible_exposed_data || [],
          sources: d.sources || {},
          cached: !!d.cached,
          privacy: d.privacy_notice,
        });
      } else {
        setError("Could not connect to Wi-Defend server. Try again later.");
      }
    } catch (e) {
      clearInterval(interval);
      setScanning(false);
      setProgress(100);
      setError("Could not connect to Wi-Defend server. Try again later.");
    }
  };

  const startScan = async () => {
    if (!networkInfo.ssid.trim()) {
      alert("Please enter network name (SSID)");
      return;
    }

    setScanning(true);
    setProgress(0);
    setResult(null);
    setShowForm(false);

     // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
        }
        return prev + 10;
     });
     }, 300);

    try {
       // 🌐 Connect to your backend with real network info
      const response = await fetch(`${base}/wifi_scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: networkInfo.ssid,
          encryption: networkInfo.encryption || "WPA2",
          dns: networkInfo.dns || "",
          activity: networkInfo.activity || "general",
          certificate: networkInfo.certificate || "unknown",
          captivePortal: networkInfo.captivePortal || false,
          httpTest: networkInfo.httpTest || true,
         }),
      });

      const data = await response.json();
      clearInterval(interval);
      setScanning(false);
      setProgress(100);

      // 🧠 Map backend response format (handle both old and new format)
      console.log("Wi-Fi Scan Response:", data); // Debug log
      
      if (data.success) {
        // Check if response is nested in 'data' property (old format) or at root (new format)
        const responseData = data.data || data;
        
        setResult({
          ssid: responseData.ssid || data.ssid || "Unknown Network",
          riskLevel: (responseData.risk_level || data.risk_level || "unknown").toLowerCase(),
          riskScore: responseData.risk_score || data.risk_score || 0,
          encryption: responseData.encryption || data.encryption || "Unknown",
          exposedData: responseData.possible_exposed_data || data.possible_exposed_data || responseData.risk_factors || [],
          detectionReasons: responseData.detection_reason || data.detection_reason || responseData.risk_factors || [],
          recommendation: responseData.recommendation || data.recommendation || responseData.data_exposure_awareness || "Network security checked.",
          details: responseData.details || data.details || {
            dns_status: responseData.dns === "Unknown" ? "unknown" : "trusted",
            certificate_status: "unknown",
            captive_portal: false,
            http_security: "HTTPS detected",
          },
        });
      } else {
        console.error("Backend returned error:", data);
        throw new Error(data.message || "Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching Wi-Fi scan result:", error);
      clearInterval(interval);
      setScanning(false);
      setProgress(100);
      setResult({
        riskLevel: "high",
        encryption: "Unknown",
        dnsSafety: "Unknown",
        certificate: "Invalid",
        exposedData: ["Server not reachable — check your connection."],
        riskScore: "10/10",
      });
    }
  };

  const getDNSDisplay = (dns: string) => {
    if (!dns || dns === "Unknown") return "Secure";
    if (dns.includes("8.8.8.8") || dns.includes("1.1.1.1")) return "Secure";
    if (dns.includes("192.168") || dns.includes("10.0")) return "Potentially Risky";
    return "Checking...";
  };

  const getCertificateStatus = (encryption: string, riskLevel: string) => {
    if (encryption === "None" || encryption === "WEP") return "Invalid";
    if (riskLevel === "high") return "Invalid";
    if (encryption === "WPA" || encryption === "WPA2" || encryption === "WPA3") return "Valid";
    return "Checking...";
  };

  const getProtectionTips = (riskLevel: string, encryption: string) => {
    const tips = [];
    
    if (encryption === "None" || encryption === "WEP") {
      tips.push("CRITICAL: Use a VPN immediately - network has no encryption");
      tips.push("Avoid all sensitive activities on this network");
      tips.push("Do not access banking or payment apps");
    } else if (riskLevel === "high") {
      tips.push("Use a VPN to encrypt your traffic");
      tips.push("Avoid logging into sensitive accounts");
      tips.push("Do not make payments or banking transactions");
      tips.push("Consider using mobile data instead");
    } else if (riskLevel === "medium") {
      tips.push("Use a VPN for sensitive activities");
      tips.push("Avoid logging into banking apps");
      tips.push("Be cautious with personal information");
      tips.push("Use HTTPS websites only");
    } else {
      tips.push("Use a VPN to encrypt your traffic");
      tips.push("Avoid logging into sensitive accounts");
      tips.push("Disable auto-connect to public networks");
      tips.push("Use HTTPS websites only");
    }
    
    return tips;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.12),transparent_45%)]" />
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Wifi className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Wi-Defend — <span className="text-primary">Your Public Wi‑Fi Protector</span></h1>
            <p className="text-xl text-muted-foreground">Scan and analyze your current network to know how safe your connection really is.</p>
          </div>

          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Network Analysis</CardTitle>
              <CardDescription>Automatic and manual scan options. We never collect device identifiers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!scanning && !result && (
                <div className="space-y-4">
                  <Button onClick={autoScan} variant="hero" size="lg" className="w-full">
                    Start Scan Automatically
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">or enter details manually</div>
                  <div className="space-y-2">
                    <Label htmlFor="ssid">Network Name (SSID) *</Label>
                    <Input
                      id="ssid"
                      placeholder="e.g., MyWiFi, CoffeeShop_WiFi, etc."
                      value={networkInfo.ssid}
                      onChange={(e) => setNetworkInfo({ ...networkInfo, ssid: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="encryption">Encryption Type *</Label>
                    <Select
                      value={networkInfo.encryption}
                      onValueChange={(value) => setNetworkInfo({ ...networkInfo, encryption: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select encryption type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None (Open Network)</SelectItem>
                        <SelectItem value="WEP">WEP (Outdated)</SelectItem>
                        <SelectItem value="WPA">WPA (Old)</SelectItem>
                        <SelectItem value="WPA2">WPA2 (Recommended)</SelectItem>
                        <SelectItem value="WPA3">WPA3 (Most Secure)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dns">DNS Server (Optional)</Label>
                    <Input
                      id="dns"
                      placeholder="e.g., 8.8.8.8, 1.1.1.1, or leave blank"
                      value={networkInfo.dns}
                      onChange={(e) => setNetworkInfo({ ...networkInfo, dns: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Common secure DNS: 8.8.8.8 (Google), 1.1.1.1 (Cloudflare)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity">What will you do on this network?</Label>
                    <Select
                      value={networkInfo.activity}
                      onValueChange={(value) => setNetworkInfo({ ...networkInfo, activity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General browsing</SelectItem>
                        <SelectItem value="bank_login">Banking/Login</SelectItem>
                        <SelectItem value="payment">Payments/Shopping</SelectItem>
                        <SelectItem value="personal_data">Personal data access</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={startScan}
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={!networkInfo.ssid || !networkInfo.encryption}
                  >
                    Start Wi-Fi Scan
                  </Button>
                </div>
              )}

              {scanning && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-4">Checking DNS, Captive Portal, and Encryption…</p>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
                  </div>
                </div>
              )}

              {error && !scanning && (
                <div className="text-yellow-400 text-sm">⚠️ {error}</div>
              )}

              {result && (
                <div className="space-y-6">
                  <Card className="border-primary/20 bg-card/60 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Risk Summary</span>
                        <span className="text-sm text-muted-foreground">Network: {result.ssid}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RiskMeter score={result.riskScore} level={result.riskLevel} />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SourceCard title="DNS Safety" value={result.sources?.dns?.ok ? "OK" : `Status ${result.sources?.dns?.status ?? 'unknown'}`} kind="dns" />
                    <SourceCard title="TLS Certificate" value={result.sources?.tls?.grade || 'unknown'} kind="tls" />
                    <SourceCard title="Captive Portal" value={result.sources?.captive_portal ? 'Detected' : 'Not detected'} kind="captive" />
                    <SourceCard title="AbuseIPDB" value={typeof result.sources?.abuseipdb?.abuse_confidence === 'number' ? `${result.sources.abuseipdb.abuse_confidence}%` : 'Unknown'} kind="abuse" />
                    <SourceCard title="IP Info" value={result.sources?.ipinfo?.org || 'Unknown'} kind="ip" />
                  </div>

                  {Array.isArray(result.exposedData) && (
                    <Card className="border-primary/20 bg-card/60 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary"><XCircle className="h-5 w-5" /> Data Exposure Awareness</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DataExposureList items={result.exposedData} />
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-green-500/50 bg-green-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="h-5 w-5" />
                        What to do next
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Use VPN before logging into accounts.</li>
                        <li>Avoid online transactions on public Wi‑Fi.</li>
                        <li>Disconnect from networks showing captive portals.</li>
                        <li>Prefer mobile data for sensitive activities.</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setResult(null);
                        setShowForm(true);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan Different Network
                    </Button>
                    <Button
                      onClick={autoScan}
                      variant="outline"
                      className="flex-1"
                    >
                      Scan Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WiDefend;
