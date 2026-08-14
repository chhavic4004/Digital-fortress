import { intakeCopy } from "./emergencyCopy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmergencyDomainChips from "./EmergencyDomainChips";
import type { EmergencyDomain } from "./types";

type Props = {
  selectedDomain: EmergencyDomain | null;
  onSelectDomain: (domain: EmergencyDomain) => void;
  freeform: string;
  setFreeform: (value: string) => void;
  onStart: () => void;
};

const EmergencyIntake = ({ selectedDomain, onSelectDomain, freeform, setFreeform, onStart }: Props) => {
  return (
    <Card className="border-primary/20 bg-card/70 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">{intakeCopy.badge}</Badge>
        </div>
        <CardTitle className="text-2xl">{intakeCopy.title}</CardTitle>
        <CardDescription>{intakeCopy.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <EmergencyDomainChips value={selectedDomain} onChange={onSelectDomain} />
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            value={freeform}
            onChange={(e) => setFreeform(e.target.value)}
            placeholder={intakeCopy.freeformPlaceholder}
          />
          <Button onClick={onStart} disabled={!selectedDomain && !freeform.trim()} variant="hero">
            {intakeCopy.continueLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyIntake;
