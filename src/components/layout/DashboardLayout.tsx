
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Bell, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, UserRole } from '@/lib/interfaces/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const getRoleBasedRoutes = (role: UserRole) => {
  switch (role) {
    case 'student':
      return [
        { label: 'Dashboard', path: '/student-dashboard' },
        { label: 'Subjects', path: '/semester/1' }, // Default to semester 1
        { label: 'Notifications', path: '/notifications' },
      ];
    case 'teacher':
      return [
        { label: 'Dashboard', path: '/faculty-dashboard' },
        { label: 'Students', path: '/students' },
        { label: 'Assignments', path: '/assignments' },
        { label: 'Notifications', path: '/notifications' },
      ];
    case 'admin':
      return [
        { label: 'Dashboard', path: '/admin-dashboard' },
        { label: 'Faculty', path: '/faculty' },
        { label: 'Students', path: '/students' },
        { label: 'Subjects', path: '/subjects' },
        { label: 'Notifications', path: '/notifications' },
      ];
    default:
      return [];
  }
};

const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAppContext();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account',
    });
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to continue</h1>
            <Button onClick={() => navigate('/')}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  const routes = getRoleBasedRoutes(user.role);

  // Function to get correct dashboard path based on user role
  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'student':
        return '/student-dashboard';
      case 'teacher':
        return '/faculty-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  };

  // Get the path that the user should be redirected to based on their role
  const dashboardPath = getDashboardPath(user.role);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to={dashboardPath} className="text-xl font-bold text-edu-primary">
                EduPortal
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  {routes.map((route) => (
                    <NavigationMenuItem key={route.path}>
                      <Link to={route.path}>
                        <NavigationMenuLink
                          className={cn(
                            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2",
                            location.pathname.startsWith(route.path) ? "bg-accent text-accent-foreground" : ""
                          )}
                        >
                          {route.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-4">
              {(user.role === 'teacher' || user.role === 'admin') && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className="capitalize">{user.role}</span>
                    {user.enrolledCourse && (
                      <span className="ml-1">• {user.enrolledCourse}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-3">
              {routes.map((route) => (
                <Link 
                  key={route.path} 
                  to={route.path} 
                  className={cn(
                    "block px-4 py-2 rounded-md text-sm font-medium",
                    location.pathname.startsWith(route.path) 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EduPortal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
