import { ReactNode } from "react";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type ApiBadgeProps = {
  name: string;
  text: string;
  icon?: ReactNode;
};

function severityFromText(text: string) {
  const t = (text || "").toLowerCase();
  if (t.includes("malicious") || t.includes("phishing") || t.includes("unsafe") || t.includes("detections")) return "danger";
  if (t.includes("suspicious") || t.includes("medium") || t.includes("unknown") || t.includes("recent")) return "warning";
  if (t.includes("safe") || t.includes("established")) return "safe";
  return "warning";
}

export default function ApiBadge({ name, text, icon }: ApiBadgeProps) {
  const sev = severityFromText(text);
  const color =
    sev === "danger" ? "border-red-500/40 bg-red-500/5 text-red-400" :
    sev === "safe" ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400" :
    "border-yellow-500/40 bg-yellow-500/5 text-yellow-400";
  const glow =
    sev === "danger" ? "shadow-[0_0_20px_rgba(239,68,68,0.35)]" :
    sev === "safe" ? "shadow-[0_0_20px_rgba(16,185,129,0.35)]" :
    "shadow-[0_0_20px_rgba(234,179,8,0.35)]";
  const Icon = sev === "danger" ? ShieldAlert : sev === "safe" ? ShieldCheck : Shield;

  return (
    <div className={cn("rounded-md border px-3 py-2 flex items-center gap-2 text-sm backdrop-blur transition", color, glow)}>
      {icon ? icon : <Icon className="h-4 w-4" />}
      <span className="font-medium">{name}</span>
      <span className="opacity-80">→ {text || "n/a"}</span>
    </div>
  );
}
