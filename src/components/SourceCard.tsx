import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, ShieldAlert, Lock, Globe, ShieldCheck, HelpCircle } from "lucide-react";

type Props = {
  title: string;
  value: string | number | boolean | object | null | undefined;
  hint?: string;
  kind?: "dns" | "tls" | "captive" | "abuse" | "ip" | "generic";
};

function iconFor(kind?: Props["kind"]) {
  switch (kind) {
    case "dns":
      return <Globe className="h-5 w-5" />;
    case "tls":
      return <Lock className="h-5 w-5" />;
    case "captive":
      return <Wifi className="h-5 w-5" />;
    case "abuse":
      return <ShieldAlert className="h-5 w-5" />;
    case "ip":
      return <ShieldCheck className="h-5 w-5" />;
    default:
      return <HelpCircle className="h-5 w-5" />;
  }
}

function colorFor(val: any, kind?: Props["kind"]) {
  const t = (typeof val === "string" ? val : String(val)).toLowerCase();
  if (t.includes("invalid") || t.includes("false") || t.includes("error") || t.includes("detected")) return "text-red-400";
  if (t.includes("unknown") || t.includes("timeout") || t.includes("unavailable")) return "text-yellow-400";
  return "text-emerald-400";
}

export default function SourceCard({ title, value, hint, kind = "generic" }: Props) {
  const text = typeof value === "object" ? JSON.stringify(value) : String(value ?? "Unavailable");
  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          {iconFor(kind)}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-sm ${colorFor(text, kind)}`}>{text}</div>
        {hint && <div className="text-xs text-muted-foreground mt-2">{hint}</div>}
      </CardContent>
    </Card>
  );
}
