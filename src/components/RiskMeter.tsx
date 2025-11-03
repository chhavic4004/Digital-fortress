import { Badge } from "@/components/ui/badge";

type Props = {
  score: number;
  level: string;
};

function badgeStyle(level: string) {
  const l = (level || "").toLowerCase();
  if (l === "high") return "bg-red-500/10 text-red-400 border border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.35)]";
  if (l === "medium") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/40 shadow-[0_0_24px_rgba(234,179,8,0.35)]";
  return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.35)]";
}

export default function RiskMeter({ score, level }: Props) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (s / 100) * circumference;
  const stroke = (level || '').toLowerCase() === 'high' ? '#ef4444' : (level || '').toLowerCase() === 'medium' ? '#eab308' : '#10b981';

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow">
        <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="36"
          stroke={stroke}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
        <text x="50" y="54" textAnchor="middle" className="fill-white text-xl" style={{ fontSize: 18 }}>{s}</text>
      </svg>
      <div>
        <div className="text-sm text-muted-foreground">Overall risk score (0–100)</div>
        <div className="mt-2 inline-block">
          <Badge className={badgeStyle(level)}>{String(level || 'Low').toUpperCase()}</Badge>
        </div>
      </div>
    </div>
  );
}
