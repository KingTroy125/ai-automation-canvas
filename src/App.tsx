import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import { ProtectedRoute } from "./components/protected-route";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-old" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup-old" element={<Signup />} />
            <Route path="/test" element={<TestPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
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
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
