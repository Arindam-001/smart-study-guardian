
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/local-storage';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';

const ReturnToAdminPanel = () => {
  const adminUser = getItem('ADMIN_USER_BACKUP', null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useAppContext();
  
  // Don't show the panel if not authenticated or no admin backup
  if (!adminUser || !isAuthenticated) {
    return null;
  }
  
  const handleReturnToAdmin = () => {
    // Restore the admin user
    setItem(STORAGE_KEYS.AUTH_USER, adminUser);
    // Update the context
    setUser(adminUser);
    // Clear the backup
    removeItem('ADMIN_USER_BACKUP');
    
    toast({
      title: "Admin mode restored",
      description: "You have returned to your admin account",
    });
    
    // Navigate back to admin dashboard
    navigate('/admin-dashboard');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={handleReturnToAdmin}
        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        <ShieldAlert size={16} />
        <span>Return to Admin Panel</span>
      </Button>
    </div>
  );
};

export default ReturnToAdminPanel;
