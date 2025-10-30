import { BookOpen, FileText, Trophy, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const Awareness = () => {
  const articles = [
    {
      title: "10 Red Flags of a Phishing Email",
      category: "Email Security",
      readTime: "5 min",
      difficulty: "Beginner",
    },
    {
      title: "Understanding Two-Factor Authentication",
      category: "Account Security",
      readTime: "7 min",
      difficulty: "Beginner",
    },
    {
      title: "How Hackers Exploit Public Wi-Fi",
      category: "Network Security",
      readTime: "6 min",
      difficulty: "Intermediate",
    },
    {
      title: "Cryptocurrency Scams: A Complete Guide",
      category: "Financial Security",
      readTime: "10 min",
      difficulty: "Advanced",
    },
  ];

  const quizzes = [
    {
      title: "Spot the Phishing Email",
      questions: 10,
      difficulty: "Easy",
      completions: 1234,
    },
    {
      title: "Password Security Master",
      questions: 15,
      difficulty: "Medium",
      completions: 856,
    },
    {
      title: "Advanced Cyber Threats",
      questions: 20,
      difficulty: "Hard",
      completions: 432,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <BookOpen className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Awareness <span className="text-primary">Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Learn, Practice, and Master Cybersecurity
            </p>
          </div>

          {/* Learning Articles */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Learning Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary transition-all hover:shadow-red-glow cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-secondary text-secondary-foreground">
                        {article.difficulty}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Read More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Interactive Quizzes */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Interactive Quizzes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <Card
                  key={index}
                  className="bg-gradient-cyber border-primary/30 hover:shadow-cyan-glow transition-all"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription>
                      {quiz.questions} questions • {quiz.difficulty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {quiz.completions.toLocaleString()} completions
                    </div>
                    <Button variant="hero" className="w-full">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Video Tutorials */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Play className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Video Tutorials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Introduction to Cybersecurity",
                "Protecting Your Personal Data",
                "Social Engineering Tactics",
                "Secure Online Shopping",
              ].map((title, index) => (
                <Card
                  key={index}
                  className="bg-card/50 backdrop-blur border-primary/20 hover:border-accent transition-all"
                >
                  <CardContent className="pt-6">
                    <div className="aspect-video bg-secondary rounded-lg mb-4 flex items-center justify-center">
                      <Play className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Duration: 12:34
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Awareness;
