import { KeyRound, CreditCard, Cookie, GlobeLock } from "lucide-react";

type Props = { items: string[] };

const iconFor = (label: string) => {
  const l = (label || "").toLowerCase();
  if (l.includes("password")) return <KeyRound className="h-5 w-5" />;
  if (l.includes("bank") || l.includes("payment")) return <CreditCard className="h-5 w-5" />;
  if (l.includes("cookie")) return <Cookie className="h-5 w-5" />;
  return <GlobeLock className="h-5 w-5" />; // browsing/history
};

export default function DataExposureList({ items }: Props) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
          {iconFor(it)}
          <span className="text-sm">{it}</span>
        </div>
      ))}
    </div>
  );
}
