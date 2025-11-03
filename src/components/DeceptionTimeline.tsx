import { CheckCircle2, AlertTriangle, Shield, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  icon: React.ReactNode;
  status: "completed" | "pending";
}

interface DeceptionTimelineProps {
  timeline: {
    detection?: {
      timestamp?: string;
      method?: string;
    };
    deception_deployed?: {
      timestamp?: string;
      action?: string;
    };
    attacker_interaction?: {
      timestamp?: string;
      details?: string;
    };
    user_protected?: {
      timestamp?: string;
      result?: string;
    };
  };
}

export const DeceptionTimeline = ({ timeline }: DeceptionTimelineProps) => {
  const steps: TimelineStep[] = [
    {
      id: "detection",
      title: "Detection",
      description: timeline.detection?.method 
        ? `Detected via ${timeline.detection.method}`
        : "Threat detected by security system",
      timestamp: timeline.detection?.timestamp,
      icon: <AlertTriangle className="h-5 w-5" />,
      status: "completed",
    },
    {
      id: "deception",
      title: "Deception Deployed",
      description: timeline.deception_deployed?.action 
        ? timeline.deception_deployed.action
        : "Security measures activated to protect user",
      timestamp: timeline.deception_deployed?.timestamp,
      icon: <Shield className="h-5 w-5" />,
      status: timeline.deception_deployed ? "completed" : "pending",
    },
    {
      id: "attacker",
      title: "Attacker Interaction",
      description: timeline.attacker_interaction?.details 
        ? timeline.attacker_interaction.details
        : "Attacker attempted to access sensitive data",
      timestamp: timeline.attacker_interaction?.timestamp,
      icon: <EyeOff className="h-5 w-5" />,
      status: timeline.attacker_interaction ? "completed" : "pending",
    },
    {
      id: "protected",
      title: "User Protected",
      description: timeline.user_protected?.result 
        ? timeline.user_protected.result
        : "User data and accounts successfully protected",
      timestamp: timeline.user_protected?.timestamp,
      icon: <CheckCircle2 className="h-5 w-5" />,
      status: timeline.user_protected ? "completed" : "pending",
    },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Protection Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20" />

          {/* Timeline steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Step icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step.status === "completed"
                      ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/50"
                      : "bg-muted border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{step.title}</h4>
                        {step.status === "completed" && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(step.timestamp), "PPp")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

