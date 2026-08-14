import { responseCopy } from "./emergencyCopy";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EmergencyStep } from "./types";

type Props = {
  steps: EmergencyStep[];
  activeStep: number | null;
  completedSteps: Set<number>;
  onToggleStep: (stepIndex: number) => void;
  onCompleteStep: (stepIndex: number) => void;
};

const EmergencySteps = ({ steps, activeStep, completedSteps, onToggleStep, onCompleteStep }: Props) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = activeStep === stepNumber;
        const isCompleted = completedSteps.has(stepNumber);

        return (
          <Card
            key={step.title}
            className={`cursor-pointer border-primary/20 transition-all ${isActive ? "border-primary shadow-lg" : "hover:border-primary/40"} ${isCompleted ? "bg-green-500/5" : ""}`}
            onClick={() => onToggleStep(stepNumber)}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    {isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <span className="font-bold text-primary">{stepNumber}</span>}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {step.title}
                      {isCompleted && <Badge variant="outline" className="border-green-500 text-green-500">{responseCopy.stepCompletedLabel}</Badge>}
                    </CardTitle>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 text-muted-foreground transition-transform ${isActive ? "rotate-90" : ""}`} />
              </div>
            </CardHeader>
            {isActive && (
              <CardContent className="space-y-4">
                <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  {step.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ol>
                {!isCompleted && (
                  <Button variant="hero" className="w-full" onClick={(e) => { e.stopPropagation(); onCompleteStep(stepNumber); }}>
                    {responseCopy.markStepCompleteLabel}
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default EmergencySteps;
