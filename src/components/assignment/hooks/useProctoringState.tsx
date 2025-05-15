
import { useState } from 'react';
import { useWarningManager } from './useWarningManager';

export const useProctoringState = (assignmentId: string) => {
  const [isActive] = useState(true);
  
  const { 
    hasWarning, 
    tabSwitchCount, 
    deviceDetected, 
    setDeviceDetected, 
    assignmentLocked, 
    createWarning 
  } = useWarningManager({ 
    assignmentId, 
    onLockAssignment: () => {} // This will be handled by the TakeAssignment component
  });

  return {
    isActive,
    hasWarning,
    tabSwitchCount,
    deviceDetected,
    setDeviceDetected,
    assignmentLocked,
    createWarning
  };
};
