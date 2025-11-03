import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiBadge from "./ApiBadge";
import { CheckCircle2, AlertTriangle, Shield } from "lucide-react";

type Result = {
  status: string;
  confidence?: number;
  fraud_score?: number;
  risk_level?: string;
  advice?: string;
  risk_explanation?: string;
  risks?: string[];
  risky_keywords?: string[];
  recommendations?: string[];
  external_sources?: Record<string, string>;
};

type Props = { result: Result };

function badgeStyle(level: string) {
  const l = (level || "").toLowerCase();
  if (l === "high" || l === "fraudulent") return "bg-red-500/10 text-red-400 border border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.35)]";
  if (l === "medium" || l === "suspicious") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/40 shadow-[0_0_24px_rgba(234,179,8,0.35)]";
  return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.35)]";
}

export default function ResultCard({ result }: Props) {
  const score = Math.round(result.fraud_score ?? result.confidence ?? 0);
  const riskLevel = result.risk_level || result.status || "Low";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  const sources = result.external_sources || {};
  const knownKeys = new Set(["google_safe_browsing", "virustotal", "phishtank", "whois"]);
  const extraEntries = Object.entries(sources).filter(([k]) => !knownKeys.has(k));

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scan Result</span>
            <Badge className={badgeStyle(riskLevel)}>{String(riskLevel).toUpperCase()}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow">
                <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  stroke={riskLevel.toString().toLowerCase().startsWith("high") ? "#ef4444" : riskLevel.toString().toLowerCase().startsWith("medium") ? "#eab308" : "#10b981"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                <text x="50" y="54" textAnchor="middle" className="fill-white text-xl" style={{ fontSize: 18 }}>{score}</text>
              </svg>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="text-base font-semibold">{`Result: ${String(riskLevel).toUpperCase()} (${score}/100)`}</div>
              <div className="text-sm text-muted-foreground">Overall fraud score (0–100)</div>
              {result.risk_explanation && (
                <div className="text-sm">{result.risk_explanation}</div>
              )}
              {result.advice && (
                <div className="text-sm opacity-80">{result.advice}</div>
              )}
              {Array.isArray(result.risky_keywords) && result.risky_keywords.length > 0 && (
                <div className="text-sm opacity-80">Keywords: "{result.risky_keywords.slice(0,5).join('", "')}"</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.google_safe_browsing && (
          <ApiBadge name="Google Safe Browsing" text={sources.google_safe_browsing} />
        )}
        {sources.virustotal && (
          <ApiBadge name="VirusTotal" text={String(sources.virustotal)} />
        )}
        {sources.phishtank && (
          <ApiBadge name="PhishTank" text={sources.phishtank} />
        )}
        {sources.whois && (
          <ApiBadge name="WHOIS / RDAP" text={sources.whois} />
        )}
        {extraEntries.map(([k, v]) => (
          <ApiBadge key={k} name={k.charAt(0).toUpperCase() + k.slice(1)} text={String(v)} />
        ))}
        {Object.keys(sources).length === 0 && (
          <ApiBadge name="Sources" text="No external signals" />
        )}
      </div>

      {/* Textual Source Summary */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Source Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            {sources.google_safe_browsing && (
              <li>🛡️ Google Safe Browsing → {sources.google_safe_browsing}</li>
            )}
            {sources.phishtank && (
              <li>🐟 PhishTank → {sources.phishtank}</li>
            )}
            {sources.virustotal && (
              <li>🧬 VirusTotal → {String(sources.virustotal)}</li>
            )}
            {sources.whois && (
              <li>🕓 WHOIS → {sources.whois}</li>
            )}
            {extraEntries.map(([k, v]) => (
              <li key={k}>🧠 {k} → {String(v)}</li>
            ))}
            {Object.keys(sources).length === 0 && (
              <li>— No URLs detected or no external signals available.</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400"><AlertTriangle className="h-5 w-5" /> Risk Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(result.risks || []).map((r, i) => (
                <li key={i} className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-400" /> <span>{r}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(result.recommendations || []).map((r, i) => (
                <li key={i} className="flex items-start gap-2"><Shield className="h-4 w-4 mt-0.5 text-primary" /> <span>{r}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
