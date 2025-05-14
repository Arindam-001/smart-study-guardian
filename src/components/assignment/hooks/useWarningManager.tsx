
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/lib/context';

type WarningManagerProps = {
  assignmentId: string;
  onLockAssignment: () => void;
};

export const useWarningManager = ({ assignmentId, onLockAssignment }: WarningManagerProps) => {
  const [hasWarning, setHasWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [deviceDetected, setDeviceDetected] = useState(false);
  const [assignmentLocked, setAssignmentLocked] = useState(false);
  const { user, addWarning } = useAppContext();
  const { toast } = useToast();

  const createWarning = (reason: string) => {
    if (!user) return;
    
    setHasWarning(true);
    
    // Only show toast for faculty/admin
    if (user.role !== 'student') {
      toast({
        title: "Warning!",
        description: reason,
        variant: "destructive"
      });
    }
    
    // Add warning to the system
    addWarning(user.id, assignmentId, reason);

    // Check if assignment should be locked (after 3 tab switches or copy attempts)
    if (reason.includes("Tab switching") || reason.includes("Copy attempt") || reason.includes("Paste attempt")) {
      if (tabSwitchCount >= 2) { // Lock on 3rd attempt (0-indexed count, so 2 = 3rd)
        setAssignmentLocked(true);
        onLockAssignment();
        toast({
          title: "Assignment Locked",
          description: "Due to multiple violations, your assignment has been locked and auto-submitted.",
          variant: "destructive"
        });
      } else {
        setTabSwitchCount(prev => prev + 1);
        // For students, show a warning toast
        if (user.role === 'student') {
          toast({
            title: "Warning!",
            description: `${reason}. After 3 violations, your assignment will be auto-submitted.`,
            variant: "destructive"
          });
        }
      }
    }
  };

  return {
    hasWarning,
    tabSwitchCount,
    deviceDetected,
    setDeviceDetected,
    assignmentLocked,
    createWarning
  };
};
