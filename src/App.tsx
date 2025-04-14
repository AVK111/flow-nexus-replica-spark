
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Franchisees from "./pages/Franchisees";
import Territories from "./pages/Territories";
import Leads from "./pages/Leads";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Opportunities from "./pages/Opportunities";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FranchiseeRoute from "./components/auth/FranchiseeRoute";
import FranchisorRoute from "./components/auth/FranchisorRoute";
import FranchiseeDashboard from "./pages/FranchiseeDashboard";
import FranchisorDashboard from "./pages/FranchisorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Default route redirects based on user role */}
              <Route index element={<Dashboard />} />
              
              {/* Franchisor routes */}
              <Route path="franchisor/dashboard" element={<FranchisorRoute><FranchisorDashboard /></FranchisorRoute>} />
              <Route path="franchisees" element={<FranchisorRoute><Franchisees /></FranchisorRoute>} />
              <Route path="territories" element={<FranchisorRoute><Territories /></FranchisorRoute>} />
              <Route path="leads" element={<FranchisorRoute><Leads /></FranchisorRoute>} />
              
              {/* Franchisee routes */}
              <Route path="franchisee/dashboard" element={<FranchiseeRoute><FranchiseeDashboard /></FranchiseeRoute>} />
              <Route path="opportunities" element={<FranchiseeRoute><Opportunities /></FranchiseeRoute>} />
              
              {/* Common routes accessible to both roles */}
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
