import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const FraudDetector = () => {
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeMessage = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      setResult({
        status: "suspicious",
        confidence: 87,
        risks: [
          "Urgency language detected",
          "Unusual sender domain",
          "Request for personal information",
          "Suspicious link patterns",
        ],
        recommendations: [
          "Do not click on any links",
          "Do not share personal information",
          "Report to cybercrime.gov.in",
          "Block the sender",
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500";
      case "suspicious":
        return "bg-yellow-500";
      case "fraudulent":
        return "bg-primary";
      default:
        return "bg-muted";
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
            <Shield className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Fraud <span className="text-primary">Detector</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              AI-Powered Message & Call Analysis
            </p>
          </div>

          {/* Input Card */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Analyze Message or Number</CardTitle>
              <CardDescription>
                Paste a message, link, or phone number to check for fraud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your message, link, or phone number here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-32"
              />
              <Button
                onClick={analyzeMessage}
                disabled={!input.trim() || analyzing}
                variant="hero"
                size="lg"
                className="w-full"
              >
                {analyzing ? "Analyzing..." : "Analyze for Fraud"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Status Badge */}
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Badge
                      className={`${getStatusColor(result.status)} text-white text-lg px-6 py-2`}
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                    <p className="text-muted-foreground">
                      Confidence: {result.confidence}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Indicators */}
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-500">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.risks.map((risk: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    What To Do Next
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="border-primary bg-gradient-cyber">
                <CardHeader>
                  <CardTitle>Emergency Helpline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg">
                      <strong>Cybercrime Helpline:</strong>{" "}
                      <a href="tel:1930" className="text-primary hover:text-accent">
                        1930
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Report at:{" "}
                      <a
                        href="https://cybercrime.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent underline"
                      >
                        cybercrime.gov.in
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudDetector;
