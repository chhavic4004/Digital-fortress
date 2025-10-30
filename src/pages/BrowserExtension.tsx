import { Chrome, Shield, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const BrowserExtension = () => {
  const features = [
    "Real-time phishing link detection",
    "Automatic malicious site blocking",
    "Safe browsing indicators",
    "Instant threat notifications",
    "Privacy protection alerts",
    "Secure connection verification",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Chrome className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Browser <span className="text-primary">Extension</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time Protection While You Browse
            </p>
          </div>

          {/* Extension Preview */}
          <Card className="bg-gradient-cyber border-primary/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="aspect-video bg-secondary rounded-lg border-2 border-primary/30 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Shield className="h-24 w-24 text-primary mx-auto animate-float" />
                  <div className="bg-background/90 backdrop-blur px-6 py-3 rounded-lg border-2 border-primary shadow-red-glow">
                    <p className="text-lg font-bold">⚠️ Suspicious Site Detected</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This website may be unsafe. Proceed with caution.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center">
              Extension <span className="text-primary">Features</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur border-primary/20"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary mt-0.5" />
                      <p className="text-lg">{feature}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Install Extension",
                    desc: "Add Digital Fortress to your browser with one click",
                  },
                  {
                    step: 2,
                    title: "Automatic Protection",
                    desc: "The extension analyzes every link and website you visit",
                  },
                  {
                    step: 3,
                    title: "Real-time Alerts",
                    desc: "Get instant warnings about suspicious or dangerous sites",
                  },
                  {
                    step: 4,
                    title: "Browse Safely",
                    desc: "Continue browsing with confidence and peace of mind",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Download CTA */}
          <Card className="bg-gradient-red-black border-primary/30">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Browse Safely?</h2>
              <p className="text-muted-foreground text-lg">
                Install the extension and protect yourself from online threats
              </p>
              <Button variant="hero" size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Add to Chrome
              </Button>
              <p className="text-sm text-muted-foreground">
                Coming soon for Firefox and Edge
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrowserExtension;
