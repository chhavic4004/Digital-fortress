import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import ResultCard from "@/components/ResultCard";

const FraudDetector = () => {
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const base = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

  const analyzeMessage = async () => {
    if (!input.trim()) return;
    
    setAnalyzing(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch(`${base}/detect_fraud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      
      const data = await response.json();
      
      if (data?.success && data?.data) {
        setResult(data.data);
      } else {
        setError("Failed to analyze. Please try again.");
      }
    } catch (error) {
      setError("Could not contact threat intelligence servers. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.12),transparent_45%)]" />
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <Shield className="h-14 w-14 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold">Fraud Detector — <span className="text-primary">AI & API-Powered Scam Analysis</span></h1>
            <p className="text-base md:text-lg text-muted-foreground">Paste a suspicious message or link and scan its digital footprint.</p>
          </div>

          <Card className="bg-card/60 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Analyze message or link</CardTitle>
              <CardDescription>We only send extracted URLs to external reputation APIs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste suspicious message, link, or number here…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-36"
              />
              <Button onClick={analyzeMessage} disabled={!input.trim() || analyzing} size="lg" className="w-full">
                {analyzing ? (
                  <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Scanning digital footprint…</span>
                ) : (
                  "Scan Now"
                )}
              </Button>
              {error && (
                <div className="text-sm text-yellow-400">⚠️ {error}</div>
              )}
            </CardContent>
          </Card>

          {result && (
            <ResultCard result={result} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudDetector;

