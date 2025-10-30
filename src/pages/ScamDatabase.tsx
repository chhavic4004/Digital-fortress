import { Database, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import FloatingChatbot from "@/components/FloatingChatbot";

const ScamDatabase = () => {
  const scams = [
    { id: 1, type: "UPI Fraud", date: "2025-01-15", risk: "high", reports: 342 },
    { id: 2, type: "OTP Scam", date: "2025-01-14", risk: "high", reports: 287 },
    { id: 3, type: "Job Scam", date: "2025-01-13", risk: "medium", reports: 156 },
    { id: 4, type: "Investment", date: "2025-01-12", risk: "high", reports: 423 },
    { id: 5, type: "Lottery", date: "2025-01-11", risk: "medium", reports: 198 },
    { id: 6, type: "Bank Call", date: "2025-01-10", risk: "high", reports: 512 },
    { id: 7, type: "Phishing", date: "2025-01-09", risk: "high", reports: 378 },
    { id: 8, type: "Delivery", date: "2025-01-08", risk: "low", reports: 89 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Database className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Scam <span className="text-primary">Database</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time tracking of reported scams across India
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search scams..."
                    className="pl-10"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-primary/20 hover:bg-primary/10 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-cyber border-primary/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">2,385</p>
                  <p className="text-muted-foreground mt-2">Total Scams Reported</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-cyber border-primary/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent">1,942</p>
                  <p className="text-muted-foreground mt-2">High Risk Cases</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-cyber border-primary/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-500">156</p>
                  <p className="text-muted-foreground mt-2">This Week</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Table */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-primary/20">
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary/20 hover:bg-secondary/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Scam Type</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead className="text-right">Reports</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scams.map((scam) => (
                      <TableRow
                        key={scam.id}
                        className="border-primary/20 hover:bg-secondary/50"
                      >
                        <TableCell className="font-medium">#{scam.id}</TableCell>
                        <TableCell>{scam.type}</TableCell>
                        <TableCell>{scam.date}</TableCell>
                        <TableCell>
                          <Badge className={`${getRiskColor(scam.risk)} text-white`}>
                            {scam.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {scam.reports}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScamDatabase;
