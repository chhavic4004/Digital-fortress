import { Users, ThumbsUp, MessageCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const Community = () => {
  const stories = [
    {
      id: 1,
      author: "Priya S.",
      date: "2 days ago",
      scamType: "UPI Scam",
      title: "Fake payment confirmation message",
      content: "I received a message claiming to be from my bank about a failed UPI transaction. They asked me to verify my details on a link. Thanks to Digital Fortress, I recognized it as a scam!",
      likes: 24,
      comments: 8,
      severity: "high",
    },
    {
      id: 2,
      author: "Rajesh K.",
      date: "5 days ago",
      scamType: "Job Scam",
      title: "Fake work-from-home offer",
      content: "Received an email offering a high-paying WFH job with minimal qualifications. They asked for an upfront registration fee. Red flags everywhere!",
      likes: 31,
      comments: 12,
      severity: "medium",
    },
    {
      id: 3,
      author: "Anita M.",
      date: "1 week ago",
      scamType: "OTP Fraud",
      title: "Caller pretending to be bank executive",
      content: "Someone called claiming to be from my bank's fraud department and asked for my OTP to 'block suspicious transactions'. I hung up and called the bank directly.",
      likes: 45,
      comments: 15,
      severity: "high",
    },
    {
      id: 4,
      author: "Vikram P.",
      date: "1 week ago",
      scamType: "Investment Scam",
      title: "Crypto investment scheme",
      content: "A 'financial advisor' messaged me on WhatsApp about a guaranteed returns crypto scheme. The website looked professional but was registered just 2 weeks ago.",
      likes: 28,
      comments: 9,
      severity: "medium",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-primary";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Users className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Community <span className="text-primary">Storyboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real Stories, Real Protection
            </p>
            <Button variant="hero" size="lg">
              Share Your Story
            </Button>
          </div>

          {/* Stories */}
          <div className="space-y-6">
            {stories.map((story) => (
              <Card
                key={story.id}
                className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{story.author}</span>
                        <span className="text-sm text-muted-foreground">
                          • {story.date}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2">{story.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{story.scamType}</Badge>
                        <Badge className={`${getSeverityColor(story.severity)} text-white`}>
                          {story.severity} risk
                        </Badge>
                      </div>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {story.content}
                  </CardDescription>

                  <div className="flex items-center gap-6 pt-2 border-t border-primary/20">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{story.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{story.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
