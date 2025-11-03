import { useState } from "react";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Lock, Clock, ShieldCheck, Hourglass, Key, Database, Unlock } from "lucide-react";

const TimeLock = () => {
  const [secret, setSecret] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [encrypting, setEncrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [encrypted, setEncrypted] = useState<{ message: string; date: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  const handleEncrypt = () => {
    if (!secret.trim() || !unlockDate) return;
    setEncrypting(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setEncrypting(false);
          const fakeHash = btoa(secret + unlockDate).split('').reverse().join('').substring(0, 32);
          setEncrypted({ message: fakeHash, date: unlockDate });
          return 100;
        }
        return p + 10;
      });
    }, 200);
  };

  // Calculate time remaining
  useState(() => {
    if (!encrypted?.date) return;
    const timer = setInterval(() => {
      const target = new Date(encrypted.date).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeRemaining("Unlocked!");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days}d ${hours}h ${mins}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  const steps = [
    { num: "1", icon: <Key className="h-6 w-6" />, text: "User enters secret & date" },
    { num: "2", icon: <Lock className="h-6 w-6" />, text: "Message encrypts instantly on device" },
    { num: "3", icon: <Clock className="h-6 w-6" />, text: "Encryption key locked with future date" },
    { num: "4", icon: <Database className="h-6 w-6" />, text: "Server stores only encrypted garbage" },
    { num: "5", icon: <Unlock className="h-6 w-6" />, text: "Message unlocks when the date arrives" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(239,68,68,0.12),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.12),transparent_45%)]" />
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Hourglass className="h-12 w-12 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Time<span className="text-primary">Lock</span> Encryption
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Secure secrets that unlock only when the time is right.
            </p>
          </div>

          {/* Encryption Simulator */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Encryption Simulator
              </CardTitle>
              <CardDescription>Encrypt your message with a time-based lock (demo mode)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="secret">Enter your secret message</Label>
                  <Input
                    id="secret"
                    placeholder="Type your confidential message here..."
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    disabled={encrypting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Select unlock date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    disabled={encrypting}
                    className="cursor-pointer"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <Button
                  onClick={handleEncrypt}
                  variant="hero"
                  size="lg"
                  className="w-full shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  disabled={!secret.trim() || !unlockDate || encrypting}
                >
                  {encrypting ? "Encrypting..." : "Encrypt Message"}
                </Button>
              </div>

              {encrypting && (
                <div className="space-y-2">
                  <p className="text-sm text-primary animate-pulse">Encrypting... Securing your message with quantum lock…</p>
                  <Progress value={progress} className="h-3" />
                </div>
              )}

              {encrypted && !encrypting && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                      Encryption Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Encrypted Message:</Label>
                      <div className="font-mono text-sm bg-secondary/50 p-3 rounded border border-primary/20 break-all">
                        {encrypted.message}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Unlock Date:</Label>
                      <div className="text-sm">{new Date(encrypted.date).toLocaleString()}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Time Remaining:</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={timeRemaining === "Unlocked!" ? 100 : 50} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-primary">{timeRemaining}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg border border-primary/10 bg-secondary/20 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/30">
                      {step.icon}
                    </div>
                    <div className="text-xs font-bold text-primary">STEP {step.num}</div>
                    <p className="text-sm text-muted-foreground leading-tight">{step.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimeLock;

