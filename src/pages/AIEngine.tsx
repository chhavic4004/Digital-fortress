import { Brain, Zap, TrendingUp, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const AIEngine = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <Brain className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Self-Learning <span className="text-primary">AI Engine</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Evolving Intelligence for Emerging Threats
            </p>
          </div>

          {/* Main Description */}
          <Card className="bg-gradient-cyber border-primary/30">
            <CardContent className="pt-8 pb-8">
              <p className="text-lg leading-relaxed">
                Digital Fortress's AI engine continuously learns and adapts to new cybersecurity
                threats. By analyzing patterns from millions of reported scams and cyber attacks,
                our system becomes smarter every day, providing you with cutting-edge protection.
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center">
              How the <span className="text-primary">AI Learns</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur border-primary/20">
                <CardHeader>
                  <Database className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Data Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Aggregates threat data from user reports, cybercrime databases, and global
                    security feeds to build comprehensive threat profiles.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-primary/20">
                <CardHeader>
                  <Brain className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>Pattern Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Uses machine learning algorithms to identify new scam patterns, phishing
                    techniques, and fraudulent behaviors as they emerge.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-primary/20">
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Continuous Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Retrains neural networks daily with new threat intelligence, ensuring our
                    detection models stay ahead of evolving scam tactics.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-primary/20">
                <CardHeader>
                  <Zap className="h-10 w-10 text-accent mb-2" />
                  <CardTitle>Real-time Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Deploys updated threat models instantly across all users, providing immediate
                    protection against newly discovered attack vectors.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Statistics */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center">
              AI Performance <span className="text-primary">Metrics</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-cyber border-primary/30 text-center">
                <CardContent className="pt-8 pb-8">
                  <p className="text-5xl font-bold text-primary mb-2">98.7%</p>
                  <p className="text-muted-foreground">Threat Detection Accuracy</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-cyber border-primary/30 text-center">
                <CardContent className="pt-8 pb-8">
                  <p className="text-5xl font-bold text-accent mb-2">2.4M+</p>
                  <p className="text-muted-foreground">Scams Analyzed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-cyber border-primary/30 text-center">
                <CardContent className="pt-8 pb-8">
                  <p className="text-5xl font-bold text-primary mb-2">24/7</p>
                  <p className="text-muted-foreground">Continuous Learning</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Details */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-bold mb-2">Neural Network Models</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep learning architecture with multiple layers for complex pattern recognition
                    and classification of cyber threats.
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-bold mb-2">Natural Language Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced NLP algorithms analyze message content, identifying suspicious
                    language patterns and social engineering tactics.
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-bold mb-2">Anomaly Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Statistical models identify unusual behaviors and emerging threat patterns that
                    deviate from normal cybersecurity baselines.
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-bold mb-2">Federated Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Privacy-preserving machine learning that improves the model without
                    compromising user data security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIEngine;
