import { useState } from "react";
import { Wifi, Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const WiDefend = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setResult(null);

     // Animate progress bar just for visual smoothness
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
        }
        return prev + 10;
     });
     }, 300);

    try {
       // 🌐 Connect to your backend
      const response = await fetch("https://digital-fortress-backend.onrender.com/wifi_scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: "MyPublicWiFi",
          encryption: "WPA2",
          dns: "8.8.8.8",
          activity: "bank_login",
         }),
      });

      const data = await response.json();
      clearInterval(interval);
      setScanning(false);
      setProgress(100);

      // 🧠 Map backend response to your UI fields
      setResult({
        riskLevel: data.risk_level?.toLowerCase() || "unknown",
        encryption: data.encryption || "WPA2",
        dnsSafety: data.dns || "Secure",
        certificate: "Valid",
        exposedData: data.risk_factors?.length
          ? data.risk_factors
          : ["No major data exposure detected"],
      });
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
      });
    }
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Wifi className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Wi-<span className="text-primary">Defend</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Public Wi-Fi Network Security Scanner
            </p>
          </div>

          {/* Scanner Card */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Network Analysis</CardTitle>
              <CardDescription>
                Scan your current Wi-Fi connection for security vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!scanning && !result && (
                <Button
                  onClick={startScan}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Start Wi-Fi Scan
                </Button>
              )}

              {scanning && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-4">Scanning network...</p>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center p-6 bg-gradient-cyber rounded-lg border-2 border-primary/30">
                    <h3 className="text-lg font-medium mb-2">Risk Level</h3>
                    <p className={`text-4xl font-bold ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel.toUpperCase()}
                    </p>
                  </div>

                  {/* Security Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Encryption</span>
                      </div>
                      <p className="text-muted-foreground">{result.encryption}</p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">DNS Safety</span>
                      </div>
                      <p className="text-muted-foreground">{result.dnsSafety}</p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Certificate</span>
                      </div>
                      <p className="text-muted-foreground">{result.certificate}</p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Risk Score</span>
                      </div>
                      <p className="text-muted-foreground">6/10</p>
                    </div>
                  </div>

                  {/* Data Exposure Warning */}
                  <Card className="border-yellow-500/50 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-500">
                        <AlertTriangle className="h-5 w-5" />
                        Data Exposure Awareness
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">
                        On this network, the following data may be visible to attackers:
                      </p>
                      <ul className="space-y-2">
                        {result.exposedData.map((data: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-primary" />
                            <span>{data}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Protection Tips */}
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle>Protection Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Use a VPN to encrypt your traffic</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Avoid logging into sensitive accounts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Disable auto-connect to public networks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Use HTTPS websites only</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={startScan}
                    variant="outline"
                    className="w-full"
                  >
                    Scan Again
                  </Button>
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
