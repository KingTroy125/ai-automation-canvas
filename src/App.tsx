import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ChatAssistant from "./pages/ChatAssistant";
import CodeGeneration from "./pages/CodeGeneration";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import AIAgents from "./pages/AIAgents";
import WorkflowAutomation from "./pages/WorkflowAutomation";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TestPage from './Test';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* AI Tool Routes */}
          <Route path="/dashboard/chat" element={<ChatAssistant />} />
          <Route path="/dashboard/code-generation" element={<CodeGeneration />} />
          <Route path="/dashboard/documents" element={<DocumentAnalysis />} />
          <Route path="/dashboard/agents" element={<AIAgents />} />
          <Route path="/dashboard/workflows" element={<WorkflowAutomation />} />
          
          {/* Account Routes */}
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          
          {/* Redirect /dashboard/* routes to the main dashboard for any undefined routes */}
          <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
