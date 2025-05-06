
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ReportProvider } from "./contexts/ReportContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/layout/Layout";

import Index from "./pages/Index";
import MyReports from "./pages/MyReports";
import PublicData from "./pages/PublicData";
import About from "./pages/About";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ReportProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/my-reports" element={<Layout><MyReports /></Layout>} />
                <Route path="/public-data" element={<Layout><PublicData /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/gamification" element={<Layout><Gamification /></Layout>} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </ReportProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
