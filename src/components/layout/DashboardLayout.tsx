
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { User, Book, BookOpen, AlertTriangle, Bell, Calendar, List, History } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from "@/lib/utils";

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

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'student':
        return '/student-dashboard';
      case 'teacher':
        return '/faculty-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  };

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
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white hover:bg-edu-secondary hover:text-white">Navigation</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              to={getDashboardLink()}
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-edu-primary to-edu-secondary p-6 no-underline outline-none focus:shadow-md"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium text-white">
                                {user.name}
                              </div>
                              <p className="text-sm leading-tight text-white/90">
                                Logged in as {userRoleLabel}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        
                        <li>
                          <Link to={getDashboardLink()} className={cn(
                            navigationMenuTriggerStyle(),
                            "w-full flex items-center gap-2"
                          )}>
                            <List className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </li>
                        
                        {user.role === 'student' && (
                          <>
                            <li>
                              <Link to="/student-dashboard?tab=history" className={cn(
                                navigationMenuTriggerStyle(),
                                "w-full flex items-center gap-2"
                              )}>
                                <History className="h-4 w-4" />
                                <span>Learning History</span>
                              </Link>
                            </li>
                            <li>
                              <Link to="/student-dashboard?tab=attendance" className={cn(
                                navigationMenuTriggerStyle(),
                                "w-full flex items-center gap-2"
                              )}>
                                <Calendar className="h-4 w-4" />
                                <span>Attendance</span>
                              </Link>
                            </li>
                          </>
                        )}
                        
                        {user.role === 'teacher' && (
                          <>
                            <li>
                              <Link to="/faculty-dashboard?tab=resources" className={cn(
                                navigationMenuTriggerStyle(),
                                "w-full flex items-center gap-2"
                              )}>
                                <Book className="h-4 w-4" />
                                <span>Manage Resources</span>
                              </Link>
                            </li>
                            <li>
                              <Link to="/faculty-dashboard?tab=attendance" className={cn(
                                navigationMenuTriggerStyle(),
                                "w-full flex items-center gap-2"
                              )}>
                                <Calendar className="h-4 w-4" />
                                <span>Manage Attendance</span>
                              </Link>
                            </li>
                          </>
                        )}
                        
                        <li>
                          <Link to="/notifications" className={cn(
                            navigationMenuTriggerStyle(),
                            "w-full flex items-center gap-2"
                          )}>
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
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
