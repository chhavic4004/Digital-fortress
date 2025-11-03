import { useState, useEffect } from "react";
import { ShieldAlert, GlobeLock, RefreshCw, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";
import { DeceptionCard } from "@/components/DeceptionCard";
import { DeceptionTimeline } from "@/components/DeceptionTimeline";

interface DeceptionEvent {
  id: string;
  title: string;
  summary: string;
  type: string;
  threat_source: string;
  protected_items: string[];
  severity: "Low" | "Medium" | "High" | "Critical";
  timestamp: string;
  timeline?: {
    detection?: {
      timestamp?: string;
      method?: string;
    };
    deception_deployed?: {
      timestamp?: string;
      action?: string;
    };
    attacker_interaction?: {
      timestamp?: string;
      details?: string;
    };
    user_protected?: {
      timestamp?: string;
      result?: string;
    };
  };
}

const AwarenessFeed = () => {
  const [events, setEvents] = useState<DeceptionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<DeceptionEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fullEventDetails, setFullEventDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchEvents();
    // Poll for new events every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/deceptions/public?limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching deception events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`${API_BASE_URL}/deceptions/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFullEventDetails(data.data);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCardClick = async (event: DeceptionEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    await fetchEventDetails(event.id);
  };

  const getSeverityStats = () => {
    const stats = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };
    
    events.forEach(event => {
      stats[event.severity] = (stats[event.severity] || 0) + 1;
    });
    
    return stats;
  };

  const stats = getSeverityStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingChatbot />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <ShieldAlert className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white">{events.length}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Awareness <span className="text-primary">Feed</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time protection events and threat intelligence
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={fetchEvents}
                variant="outline"
                size="sm"
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge variant="outline" className="gap-2">
                <GlobeLock className="h-3 w-3" />
                All data is sanitized and anonymized
              </Badge>
            </div>
          </div>

          {/* Statistics */}
          {events.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-500">{stats.Critical}</p>
                    <p className="text-sm text-muted-foreground mt-1">Critical</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/10 border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{stats.High}</p>
                    <p className="text-sm text-muted-foreground mt-1">High</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-500">{stats.Medium}</p>
                    <p className="text-sm text-muted-foreground mt-1">Medium</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">{stats.Low}</p>
                    <p className="text-sm text-muted-foreground mt-1">Low</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Banner */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">What is the Awareness Feed?</h3>
                  <p className="text-sm text-muted-foreground">
                    This feed shows anonymized, real-time protection events detected by Digital Fortress. 
                    All sensitive data (IPs, URLs, personal info) is removed to protect privacy while 
                    educating users about current threats. These events help you understand what attacks 
                    look like and how they're being stopped.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Feed */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-6 text-center py-12">
                <GlobeLock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No protection events yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <DeceptionCard
                  key={event.id}
                  {...event}
                  onClick={() => handleCardClick(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              Detailed timeline and protection information
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {loadingDetails ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : fullEventDetails ? (
              <div className="space-y-6">
                {/* Summary */}
                <Card className="bg-card/50 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Event Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{fullEventDetails.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline">Type: {fullEventDetails.type}</Badge>
                      <Badge variant="outline">
                        Severity: {fullEventDetails.severity}
                      </Badge>
                      <Badge variant="outline">
                        Source: {fullEventDetails.metadata?.source || "Unknown"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                {fullEventDetails.timeline && (
                  <DeceptionTimeline timeline={fullEventDetails.timeline} />
                )}

                {/* Protected Items */}
                {fullEventDetails.protected_items && fullEventDetails.protected_items.length > 0 && (
                  <Card className="bg-green-500/5 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-500">
                        Protected Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {fullEventDetails.protected_items.map((item: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-green-500/10">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* How It Works */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">How This Protection Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        <strong className="text-foreground">1. Detection:</strong>{" "}
                        Our system detected a suspicious {fullEventDetails.type.toLowerCase()} attempt 
                        using advanced threat detection algorithms.
                      </p>
                      <p>
                        <strong className="text-foreground">2. Deception:</strong>{" "}
                        Instead of allowing the attack to reach you, our system deployed protective 
                        measures to redirect or block the threat.
                      </p>
                      <p>
                        <strong className="text-foreground">3. Protection:</strong>{" "}
                        Your sensitive information ({fullEventDetails.protected_items?.join(", ") || "data"}) 
                        was kept safe from potential exposure.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Recommendations */}
                <Card className="border-yellow-500/50 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-500">
                      Safety Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Always verify URLs before entering sensitive information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Use strong, unique passwords for all accounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Enable two-factor authentication (2FA) when available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500">•</span>
                        <span>Keep Digital Fortress extension enabled for real-time protection</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Unable to load event details.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AwarenessFeed;

