import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Clock, EyeOff, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DeceptionCardProps {
  id: string;
  title: string;
  summary: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  protected_items: string[];
  timestamp: string;
  onClick?: () => void;
}

export const DeceptionCard = ({
  id,
  title,
  summary,
  type,
  severity,
  protected_items,
  timestamp,
  onClick,
}: DeceptionCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 text-white border-red-500";
      case "High":
        return "bg-primary text-white border-primary";
      case "Medium":
        return "bg-yellow-500 text-white border-yellow-500";
      case "Low":
        return "bg-green-500 text-white border-green-500";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getSeverityGlow = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "shadow-red-500/50";
      case "High":
        return "shadow-primary/50";
      case "Medium":
        return "shadow-yellow-500/50";
      case "Low":
        return "shadow-green-500/50";
      default:
        return "";
    }
  };

  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <Card
      className={`bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-4 hover:shadow-lg hover:shadow-primary/20 ${getSeverityGlow(severity)}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${
              severity === "Critical" ? "bg-red-500/20" :
              severity === "High" ? "bg-primary/20" :
              severity === "Medium" ? "bg-yellow-500/20" :
              "bg-green-500/20"
            }`}>
              <ShieldAlert className={`h-5 w-5 ${
                severity === "Critical" ? "text-red-500" :
                severity === "High" ? "text-primary" :
                severity === "Medium" ? "text-yellow-500" :
                "text-green-500"
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 line-clamp-2">{title}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Badge className={getSeverityColor(severity)}>
                  {severity}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {summary}
        </p>
        
        {protected_items && protected_items.length > 0 && (
          <div className="flex items-start gap-2 mb-4">
            <EyeOff className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Protected:</span>
              {protected_items.map((item, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full group hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

