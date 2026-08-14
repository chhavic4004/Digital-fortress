import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emergencyOptions } from "./emergencyFlows";
import type { EmergencyDomain } from "./types";

type Props = {
  value: EmergencyDomain | null;
  onChange: (domain: EmergencyDomain) => void;
};

const EmergencyDomainChips = ({ value, onChange }: Props) => {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {emergencyOptions.map((option) => {
        const Icon = option.icon;
        const active = value === option.domain;

        return (
          <Button
            key={option.domain}
            type="button"
            variant="outline"
            onClick={() => onChange(option.domain)}
            className={cn(
              "h-auto justify-start gap-3 p-4 text-left border-primary/20 bg-card/70 hover:bg-primary/10",
              active && "border-primary ring-2 ring-primary/30"
            )}
          >
            <Icon className="h-5 w-5 text-primary shrink-0" />
            <div className="space-y-1">
              <div className="font-semibold">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default EmergencyDomainChips;
