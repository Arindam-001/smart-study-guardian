
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { User, Lock, BookOpen, AlertTriangle, Bell } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout, warnings } = useAppContext();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const userRoleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'teacher' ? 'Teacher' : 'Student';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-edu-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen size={24} />
            <h1 className="text-xl font-bold">Student Portal</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="p-2 text-white hover:bg-edu-secondary"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell size={20} />
                  {warnings.length > 0 && (
                    <span className="absolute top-0 right-0 bg-edu-danger text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {warnings.length}
                    </span>
                  )}
                </Button>
              </div>
              
              <div className="hidden md:block text-sm text-right">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs opacity-75">{userRoleLabel}</div>
              </div>
              
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-edu-secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Page title */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-edu-primary">{title}</h1>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2025 Student Portal - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
