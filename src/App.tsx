import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WiDefend from "./pages/WiDefend";
import FraudDetector from "./pages/FraudDetector";
import Community from "./pages/Community";
import ScamDatabase from "./pages/ScamDatabase";
import Awareness from "./pages/Awareness";
import BrowserExtension from "./pages/BrowserExtension";
import AIEngine from "./pages/AIEngine";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wi-defend" element={<WiDefend />} />
          <Route path="/fraud-detector" element={<FraudDetector />} />
          <Route path="/community" element={<Community />} />
          <Route path="/scam-database" element={<ScamDatabase />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/browser-extension" element={<BrowserExtension />} />
          <Route path="/ai-engine" element={<AIEngine />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
