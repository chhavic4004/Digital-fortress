import { useState } from "react";
import { Shield, AlertTriangle, Phone, FileText, CreditCard, ExternalLink, CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Link } from "react-router-dom";

const InstantAction = () => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps = [
    {
      id: 1,
      title: "Block Your Bank Card / UPI",
      icon: CreditCard,
      color: "text-primary",
      bgColor: "bg-primary/10",
      actions: [
        {
          bank: "Any Bank Card",
          steps: [
            "Call your bank's 24/7 helpline immediately",
            "Ask to block your debit/credit card",
            "Request a replacement card",
            "Change your online banking password",
          ],
        },
        {
          bank: "UPI (PhonePe, Google Pay, Paytm)",
          steps: [
            "Open your UPI app immediately",
            "Go to Settings → Security → Block UPI",
            "Or call your bank's UPI helpline",
            "File complaint with NPCI at help@npci.org.in",
          ],
        },
      ],
      emergency: {
        text: "If you can't reach bank, call:",
        numbers: ["1930 (Cybercrime Helpline)", "Your Bank's Emergency Number"],
      },
    },
    {
      id: 2,
      title: "File FIR / Cybercrime Complaint",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      actions: [
        {
          type: "Online Complaint (Recommended)",
          steps: [
            "Visit: cybercrime.gov.in",
            "Click 'Report & Track' → 'File a Complaint'",
            "Select 'Financial Fraud' or relevant category",
            "Fill in all details (transaction IDs, amounts, screenshots)",
            "Submit and note your complaint number",
          ],
          link: "https://cybercrime.gov.in",
        },
        {
          type: "Physical FIR at Police Station",
          steps: [
            "Visit nearest police station",
            "Carry: ID proof, transaction receipts, screenshots",
            "File FIR under Section 420 (Cheating) IPC",
            "Get FIR copy (important for bank claims)",
          ],
        },
      ],
      emergency: {
        text: "Quick Links:",
        links: [
          { text: "cybercrime.gov.in", url: "https://cybercrime.gov.in" },
          { text: "NPCI Dispute Resolution", url: "https://www.npci.org.in" },
        ],
      },
    },
    {
      id: 3,
      title: "Contact Emergency Helplines",
      icon: Phone,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      actions: [
        {
          type: "National Helplines",
          helplines: [
            { name: "National Cyber Crime Helpline", number: "1930", available: "24/7" },
            { name: "Cyber Crime Cell", number: "155260", available: "24/7" },
            { name: "Emergency Services", number: "100", available: "24/7" },
          ],
        },
        {
          type: "Bank Emergency Numbers",
          helplines: [
            { name: "SBI", number: "1800-1234", available: "24/7" },
            { name: "HDFC Bank", number: "1800-202-6161", available: "24/7" },
            { name: "ICICI Bank", number: "1800-1080", available: "24/7" },
            { name: "Axis Bank", number: "1800-209-5577", available: "24/7" },
            { name: "Kotak Bank", number: "1800-266-0810", available: "24/7" },
            { name: "PNB", number: "1800-180-2222", available: "24/7" },
            { name: "Bank of Baroda", number: "1800-258-4455", available: "24/7" },
          ],
        },
      ],
      emergency: {
        text: "Call immediately if money is transferred!",
        note: "Time is critical - faster you act, better chance of recovery.",
      },
    },
    {
      id: 4,
      title: "Document Everything",
      icon: FileText,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      actions: [
        {
          type: "Screenshots to Take",
          steps: [
            "Screenshot of fraudulent message/email/website",
            "Transaction ID and amount details",
            "Bank statement showing unauthorized transaction",
            "Any suspicious links or phone numbers",
            "Chat logs with fraudster (if any)",
          ],
        },
        {
          type: "Information to Collect",
          steps: [
            "Date and time of fraud",
            "Amount lost",
            "Transaction ID (if UPI/online payment)",
            "Account numbers involved",
            "Contact details used by fraudster",
          ],
        },
      ],
      emergency: {
        text: "Save all evidence digitally",
        note: "This helps police and bank recover your money faster.",
      },
    },
  ];

  const markStepComplete = (stepId: number) => {
    setCompletedSteps(new Set([...completedSteps, stepId]));
  };

  const toggleStep = (stepId: number) => {
    setCurrentStep(currentStep === stepId ? null : stepId);
  };

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId)) return "completed";
    if (currentStep === stepId) return "active";
    return "pending";
  };

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
              Step-by-step help after fraud detection
            </p>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              ⚠️ Act Immediately - Time is Critical
            </Badge>
          </div>

          {/* Emergency Banner */}
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

          {/* Step-by-Step Guide */}
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const status = getStepStatus(step.id);
              const isCompleted = completedSteps.has(step.id);
              const isActive = currentStep === step.id;

              return (
                <Card
                  key={step.id}
                  className={`transition-all cursor-pointer ${
                    isActive
                      ? "border-2 border-primary shadow-lg"
                      : "border-primary/20 hover:border-primary/40"
                  } ${isCompleted ? "bg-green-500/5" : ""}`}
                  onClick={() => toggleStep(step.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg ${step.bgColor} ${
                            isCompleted ? "bg-green-500/20" : ""
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className={`h-6 w-6 ${isCompleted ? "text-green-500" : step.color}`} />
                          ) : (
                            <Icon className={`h-6 w-6 ${step.color}`} />
                          )}
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {step.title}
                            {isCompleted && (
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                ✓ Completed
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Step {step.id} of {steps.length}
                          </CardDescription>
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-5 w-5 transition-transform ${
                          isActive ? "rotate-90" : ""
                        } text-muted-foreground`}
                      />
                    </div>
                  </CardHeader>

                  {isActive && (
                    <CardContent className="space-y-6">
                      {/* Actions */}
                      {step.actions.map((action, idx) => (
                        <div key={idx} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">
                              {action.bank || action.type}
                            </h4>
                            {action.link && (
                              <a
                                href={action.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:text-accent text-sm"
                              >
                                Visit <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          {action.steps && (
                            <ol className="space-y-2 pl-6 list-decimal">
                              {action.steps.map((stepText, stepIdx) => (
                                <li key={stepIdx} className="text-muted-foreground">
                                  {stepText}
                                </li>
                              ))}
                            </ol>
                          )}
                          {action.helplines && (
                            <div className="space-y-2">
                              {action.helplines.map((helpline, hIdx) => (
                                <div
                                  key={hIdx}
                                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium">{helpline.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Available: {helpline.available}
                                    </p>
                                  </div>
                                  <a
                                    href={`tel:${helpline.number.replace(/-/g, "").replace(/ /g, "")}`}
                                    className="flex items-center gap-2 text-primary font-bold hover:text-accent"
                                  >
                                    <Phone className="h-4 w-4" />
                                    {helpline.number}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                          {idx < step.actions.length - 1 && <Separator />}
                        </div>
                      ))}

                      {/* Emergency Info */}
                      {step.emergency && (
                        <Card className={`border-2 ${step.color === "text-primary" ? "border-primary bg-primary/5" : step.color === "text-blue-500" ? "border-blue-500 bg-blue-500/5" : step.color === "text-green-500" ? "border-green-500 bg-green-500/5" : "border-yellow-500 bg-yellow-500/5"}`}>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-2 mb-2">
                              <AlertTriangle className={`h-5 w-5 ${step.color} mt-0.5`} />
                              <p className="font-semibold">{step.emergency.text}</p>
                            </div>
                            {step.emergency.numbers && (
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-7">
                                {step.emergency.numbers.map((num, nIdx) => (
                                  <li key={nIdx}>{num}</li>
                                ))}
                              </ul>
                            )}
                            {step.emergency.links && (
                              <div className="ml-7 space-y-2">
                                {step.emergency.links.map((link, lIdx) => (
                                  <a
                                    key={lIdx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-primary hover:text-accent text-sm font-medium"
                                  >
                                    {link.text} <ExternalLink className="h-3 w-3" />
                                  </a>
                                ))}
                              </div>
                            )}
                            {step.emergency.note && (
                              <p className="text-sm text-muted-foreground mt-2 ml-7 italic">
                                {step.emergency.note}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Complete Button */}
                      {!isCompleted && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            markStepComplete(step.id);
                          }}
                          variant="hero"
                          className="w-full"
                        >
                          ✓ Mark This Step as Complete
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

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

