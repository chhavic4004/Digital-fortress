import { AlertTriangle, BadgeAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmergencySteps from "./EmergencySteps";
import EmergencyContacts from "./EmergencyContacts";
import type { EmergencyFlow } from "./types";
import { responseCopy } from "./emergencyCopy";

type Props = {
  flow: EmergencyFlow;
  activeStep: number | null;
  completedSteps: Set<number>;
  onToggleStep: (stepIndex: number) => void;
  onCompleteStep: (stepIndex: number) => void;
};

const EmergencyResponse = ({ flow, activeStep, completedSteps, onToggleStep, onCompleteStep }: Props) => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary bg-gradient-to-r from-primary/20 to-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{flow.subtitle}</Badge>
          </div>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="h-5 w-5 text-primary" />
            {flow.title}
          </CardTitle>
          <CardDescription>{flow.prompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-primary/30 bg-background/60 p-4">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <BadgeAlert className="h-4 w-4" />
              {responseCopy.actNowLabel}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{flow.immediateAction}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {flow.badges.map((badge) => (
              <Badge key={badge} variant="outline" className="border-primary/30">{badge}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <EmergencySteps
        steps={flow.steps}
        activeStep={activeStep}
        completedSteps={completedSteps}
        onToggleStep={onToggleStep}
        onCompleteStep={onCompleteStep}
      />

      <EmergencyContacts contacts={flow.contacts} />
    </div>
  );
};

export default EmergencyResponse;
