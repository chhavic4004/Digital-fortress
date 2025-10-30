import { Link } from "react-router-dom";
import { Shield, Wifi, MessageSquare, Users, Database, BookOpen, Chrome, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Wifi,
      title: "Wi-Defend",
      description: "Scan and protect against unsafe public Wi-Fi networks",
      link: "/wi-defend",
    },
    {
      icon: Shield,
      title: "Fraud Detector",
      description: "Analyze messages and calls for potential scams",
      link: "/fraud-detector",
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot",
      description: "Get instant cybersecurity advice and guidance",
      link: "#chatbot",
    },
    {
      icon: Users,
      title: "Community",
      description: "Share and learn from real scam experiences",
      link: "/community",
    },
    {
      icon: Database,
      title: "Scam Database",
      description: "Browse reported scams and stay informed",
      link: "/scam-database",
    },
    {
      icon: BookOpen,
      title: "Awareness Hub",
      description: "Learn cybersecurity through articles and quizzes",
      link: "/awareness",
    },
    {
      icon: Chrome,
      title: "Browser Extension",
      description: "Real-time protection while browsing",
      link: "/browser-extension",
    },
    {
      icon: Brain,
      title: "AI Engine",
      description: "Self-learning system that evolves with threats",
      link: "/ai-engine",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 px-4 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
                Digital Fortress
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Securing the Digital World with AI
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered cybersecurity platform protecting you from scams, phishing, and digital threats
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/wi-defend">
                <Button variant="hero" size="lg">
                  Start Scan
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete <span className="text-primary">Security Suite</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              All-in-one platform for digital protection and awareness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all hover:shadow-red-glow group cursor-pointer">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2 group-hover:text-accent transition-colors" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-red-black">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stay Protected. Stay Informed.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of users securing their digital lives with AI-powered protection
          </p>
          <Link to="/wi-defend">
            <Button variant="hero" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
