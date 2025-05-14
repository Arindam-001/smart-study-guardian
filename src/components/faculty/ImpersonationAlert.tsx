
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck } from 'lucide-react';
import { User } from '@/lib/interfaces/types';

interface ImpersonationAlertProps {
  isImpersonating: boolean;
  actualUser: User | null;
  adminUser: User | null;
}

const ImpersonationAlert: React.FC<ImpersonationAlertProps> = ({ 
  isImpersonating, 
  actualUser, 
  adminUser 
}) => {
  if (!isImpersonating || !actualUser || !adminUser) {
    return null;
  }

  return (
    <Alert className="mb-6">
      <UserCheck className="h-4 w-4" />
      <AlertDescription>
        You are viewing the faculty dashboard as {actualUser.name}. This is in admin impersonation mode.
      </AlertDescription>
    </Alert>
  );
};

export default ImpersonationAlert;
