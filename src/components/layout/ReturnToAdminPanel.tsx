
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { getItem, setItem, removeItem, STORAGE_KEYS } from '@/lib/local-storage';

const ReturnToAdminPanel = () => {
  const adminUser = getItem('ADMIN_USER_BACKUP', null);
  
  if (!adminUser) {
    return null;
  }
  
  const handleReturnToAdmin = () => {
    // Restore the admin user
    setItem(STORAGE_KEYS.AUTH_USER, adminUser);
    // Clear the backup
    removeItem('ADMIN_USER_BACKUP');
    // Navigate back to admin dashboard
    window.location.href = '/admin-dashboard';
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
