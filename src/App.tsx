
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "@/lib/context";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SemesterView from "./pages/SemesterView";
import SubjectView from "./pages/SubjectView";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Role-protected route wrapper component
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, user } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAppContext();
  
  // Redirect based on user role
  const getDashboardRedirect = () => {
    if (!user) return <Navigate to="/" />;
    
    switch (user.role) {
      case 'student':
        return <Navigate to="/student-dashboard" />;
      case 'teacher':
        return <Navigate to="/faculty-dashboard" />;
      case 'admin':
        return <Navigate to="/admin-dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute>{getDashboardRedirect()}</ProtectedRoute>} 
      />
      
      <Route 
        path="/student-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </RoleProtectedRoute>
        } 
      />
      
      <Route 
        path="/faculty-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['teacher']}>
            <FacultyDashboard />
          </RoleProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin-dashboard" 
        element={
          <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleProtectedRoute>
        } 
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
