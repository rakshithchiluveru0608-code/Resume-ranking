import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResultsProvider } from "@/lib/resultsContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import ResumeDetail from "./pages/ResumeDetail";
import SkillGap from "./pages/SkillGap";
import BiasAudit from "./pages/BiasAudit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ResultsProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:id" element={<ResumeDetail />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/bias-audit" element={<BiasAudit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ResultsProvider>
  </QueryClientProvider>
);

export default App;
