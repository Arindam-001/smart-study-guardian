
import { useState } from 'react';
import { useCamera } from './useCamera';
import { useFaceDetection } from './useFaceDetection';
import { useMovementDetection } from './useMovementDetection';
import { useProctoringEvents } from './useProctoringEvents';
import { useWarningManager } from './useWarningManager';

export const useProctoring = (assignmentId: string) => {
  const [isActive] = useState(true);
  
  const { hasWarning, tabSwitchCount, deviceDetected, setDeviceDetected, assignmentLocked, createWarning } = 
    useWarningManager({ 
      assignmentId, 
      onLockAssignment: () => {} // This will be handled by the TakeAssignment component
    });

  const { videoRef, streamRef } = useCamera({
    onCameraError: () => createWarning("Camera access denied"),
    isActive
  });

  useFaceDetection({
    onMultipleFacesDetected: () => {
      setDeviceDetected(true);
      createWarning("Multiple faces detected");
    },
    onNoFaceDetected: () => createWarning("No face detected - student may have left seat"),
    isActive
  });

  const { movementCount } = useMovementDetection({
    onExcessiveMovement: () => createWarning("Excessive movement detected"),
    onOtherPersonDetected: () => {
      setDeviceDetected(true);
      createWarning("Multiple faces or another device detected");
    },
    isActive
  });

  useProctoringEvents({
    onTabSwitching: () => createWarning("Tab switching detected"),
    onCopyAttempt: () => createWarning("Copy attempt detected"),
    onPasteAttempt: () => createWarning("Paste attempt detected"),
    onRightClick: () => createWarning("Right-click detected"),
    isActive
  });

  return {
    videoRef,
    streamRef,
    hasWarning,
    movementCount,
    deviceDetected,
    tabSwitchCount,
    assignmentLocked,
    createWarning
  };
};
