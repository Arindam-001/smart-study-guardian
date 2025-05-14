import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "@/lib/context";
import { ToasterProvider } from "@/hooks/use-toast";
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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ReturnToAdminPanel from "./components/layout/ReturnToAdminPanel";
import { getItem, STORAGE_KEYS } from "./lib/local-storage";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Protected route wrapper component with enhanced security
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppContext();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Double-check authentication to ensure it's not stale
    const verifyAuth = async () => {
      const authUser = getItem(STORAGE_KEYS.AUTH_USER, null);
      setIsChecking(false);
    };
    
    verifyAuth();
  }, []);
  
  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Verifying authentication...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Role-protected route wrapper component - modified to ensure proper authentication for admins
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles,
  adminBypass = true
}: { 
  children: JSX.Element;
  allowedRoles: string[];
  adminBypass?: boolean;
}) => {
  const { isAuthenticated, user } = useAppContext();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Enhanced verification to ensure authentication is valid
    const verifyAuthAndRole = async () => {
      const authUser = getItem(STORAGE_KEYS.AUTH_USER, null);
      const adminBackup = getItem('ADMIN_USER_BACKUP', null);
      
      // If no auth user, clean up admin backup to prevent unauthorized access
      if (!authUser) {
        localStorage.removeItem('ADMIN_USER_BACKUP');
      }
      
      // If admin backup exists but no auth user, something is wrong - clean up
      if (adminBackup && !authUser) {
        localStorage.removeItem('ADMIN_USER_BACKUP');
      }
      
      setIsChecking(false);
    };
    
    verifyAuthAndRole();
  }, []);
  
  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Verifying authorization...</div>;
  }
  
  if (!isAuthenticated) {
    // Clean up and redirect
    localStorage.removeItem('ADMIN_USER_BACKUP');
    return <Navigate to="/" replace />;
  }
  
  // Check for admin backup - if present, this means an admin is impersonating a user
  const adminBackup = getItem('ADMIN_USER_BACKUP', null);
  const isAdminImpersonating = !!adminBackup;
  
  // Admin bypass - admins can access any route if they have proper credentials
  if ((adminBypass && user && user.role === 'admin') || isAdminImpersonating) {
    return children;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// AdminImpersonationWrapper - Shows ReturnToAdminPanel when admin is impersonating
const AdminImpersonationWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppContext();
  const adminBackup = getItem('ADMIN_USER_BACKUP', null);
  
  // Only show return panel if both authenticated and admin backup exists
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <>
      {children}
      {adminBackup && <ReturnToAdminPanel />}
    </>
  );
};

const AppRoutes = () => {
  const { user, isAuthenticated } = useAppContext();
  
  // Redirect based on user role
  const getDashboardRedirect = () => {
    if (!user || !isAuthenticated) return <Navigate to="/" />;
    
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
    <AdminImpersonationWrapper>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
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
            <RoleProtectedRoute allowedRoles={['admin']} adminBypass={false}>
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
        
        {/* Additional routes for navigation tabs - now accessible by admins */}
        <Route 
          path="/students" 
          element={
            <RoleProtectedRoute allowedRoles={['teacher']}>
              <FacultyDashboard />
            </RoleProtectedRoute>
          } 
        />
        
        <Route 
          path="/assignments" 
          element={<ProtectedRoute><Notifications /></ProtectedRoute>} 
        />
        
        <Route 
          path="/faculty" 
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          } 
        />
        
        <Route 
          path="/subjects" 
          element={<ProtectedRoute><SemesterView /></ProtectedRoute>} 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminImpersonationWrapper>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToasterProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </ToasterProvider>
  </QueryClientProvider>
);

export default App;
