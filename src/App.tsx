
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "@/lib/context";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SemesterView from "./pages/SemesterView";
import SubjectView from "./pages/SubjectView";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/semester/:semesterId" 
        element={<ProtectedRoute><SemesterView /></ProtectedRoute>} 
      />
      <Route 
        path="/semester/:semesterId/subject/:subjectId" 
        element={<ProtectedRoute><SubjectView /></ProtectedRoute>} 
      />
      <Route 
        path="/notifications" 
        element={<ProtectedRoute><Notifications /></ProtectedRoute>} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
