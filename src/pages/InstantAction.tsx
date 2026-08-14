import { useState } from "react";
import { Shield, AlertTriangle, Phone, FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Link, useSearchParams } from "react-router-dom";
import EmergencyIntake from "@/features/emergency/EmergencyIntake";
import EmergencyResponse from "@/features/emergency/EmergencyResponse";
import { emergencyFlows } from "@/features/emergency/emergencyFlows";
import type { EmergencyDomain } from "@/features/emergency/types";

const inferDomainFromText = (text: string): EmergencyDomain => {
  const t = text.toLowerCase();
  if (/(upi|transaction|money|transferred|card|debited|fraud)/.test(t)) return "fraud_upi";
  if (/(hack|password|login|locked out|account access|session)/.test(t)) return "account_compromise";
  if (/(wifi|wi-fi|network|hotspot|public network)/.test(t)) return "unsafe_wifi";
  if (/(link|otp|phishing|scam|message|sms|email)/.test(t)) return "scam_phishing";
  return "general_help";
};

const InstantAction = () => {
  const [searchParams] = useSearchParams();
  const domainFromUrl = searchParams.get("domain") as EmergencyDomain | null;

  const [selectedDomain, setSelectedDomain] = useState<EmergencyDomain | null>(domainFromUrl);
  const [freeform, setFreeform] = useState("");
  const [activeDomain, setActiveDomain] = useState<EmergencyDomain | null>(domainFromUrl);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStart = () => {
    const domain = selectedDomain ?? inferDomainFromText(freeform);
    setActiveDomain(domain);
    setActiveStep(null);
    setCompletedSteps(new Set());
  };

  const handleChangeCategory = () => {
    setActiveDomain(null);
    setSelectedDomain(null);
    setFreeform("");
    setActiveStep(null);
    setCompletedSteps(new Set());
  };

  const toggleStep = (stepIndex: number) => {
    setActiveStep(activeStep === stepIndex ? null : stepIndex);
  };

  const completeStep = (stepIndex: number) => {
    setCompletedSteps(new Set([...completedSteps, stepIndex]));
  };

  const activeFlow = activeDomain ? emergencyFlows[activeDomain] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <AlertTriangle className="h-16 w-16 text-primary mx-auto animate-pulse" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Instant Action <span className="text-primary">Guidance</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Tell us what happened — we'll show the right steps first
            </p>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ⚠️ Act Immediately - Time is Critical
            </Badge>
          </div>

          {/* Emergency Banner - always visible regardless of triage state */}
          <Card className="bg-gradient-to-r from-primary/20 to-red-500/20 border-2 border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">🚨 Need Immediate Help?</h3>
                  <p className="text-muted-foreground">
                    If money has been transferred, call these numbers NOW:
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a href="tel:1930" className="flex items-center gap-2 text-lg font-bold text-primary hover:text-accent">
                    <Phone className="h-5 w-5" />
                    1930 - Cybercrime Helpline
                  </a>
                  <a href="tel:100" className="flex items-center gap-2 text-lg font-bold text-primary hover:text-accent">
                    <Phone className="h-5 w-5" />
                    100 - Emergency Police
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Triage-driven flow: intake first, then domain-specific response */}
          {!activeFlow ? (
            <EmergencyIntake
              selectedDomain={selectedDomain}
              onSelectDomain={setSelectedDomain}
              freeform={freeform}
              setFreeform={setFreeform}
              onStart={handleStart}
            />
          ) : (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={handleChangeCategory}>
                ← Wrong category? Start over
              </Button>
              <EmergencyResponse
                flow={activeFlow}
                activeStep={activeStep}
                completedSteps={completedSteps}
                onToggleStep={toggleStep}
                onCompleteStep={completeStep}
              />
            </div>
          )}

{/* Quick Actions Footer */}
<Card className="bg-gradient-cyber border-primary/30">
  <CardHeader>
    <CardTitle>Quick Action Buttons</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a
        href="https://cybercrime.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
      >
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-medium">File Complaint Online</span>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </a>
      <a
        href="tel:1930"
        className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
      >
        <Phone className="h-5 w-5 text-primary" />
        <span className="font-medium">Call 1930 Helpline</span>
      </a>
      <Link
        to="/fraud-detector"
        className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
      >
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-medium">Back to Fraud Detector</span>
      </Link>
    </div>
  </CardContent>
</Card>

          {/* Important Notes */}
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <AlertTriangle className="h-5 w-5" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Time is Critical:</strong> Report within 24 hours for best chance of recovery
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Save All Evidence:</strong> Screenshots, transaction IDs, messages
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Don't Panic:</strong> Follow steps in order, stay calm
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Contact Bank First:</strong> Block cards/UPI immediately before filing FIR
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstantAction;