
import { useCamera } from './useCamera';
import { useFaceDetection } from './useFaceDetection';
import { useMovementDetection } from './useMovementDetection';
import { useProctoringEvents } from './useProctoringEvents';
import { useProctoringState } from './useProctoringState';

export const useProctoring = (assignmentId: string) => {
  // Use the proctoring state hook to manage the state
  const {
    isActive,
    hasWarning,
    tabSwitchCount,
    deviceDetected,
    setDeviceDetected,
    assignmentLocked,
    createWarning
  } = useProctoringState(assignmentId);

  // Use the camera hook
  const { videoRef, streamRef } = useCamera({
    onCameraError: () => createWarning("Camera access denied"),
    isActive
  });

  // Use the face detection hook
  useFaceDetection({
    onMultipleFacesDetected: () => {
      setDeviceDetected(true);
      createWarning("Multiple faces detected");
    },
    onNoFaceDetected: () => createWarning("No face detected - student may have left seat"),
    isActive
  });

  // Use the movement detection hook
  const { movementCount } = useMovementDetection({
    onExcessiveMovement: () => createWarning("Excessive movement detected"),
    onOtherPersonDetected: () => {
      setDeviceDetected(true);
      createWarning("Multiple faces or another device detected");
    },
    isActive
  });

  // Use the proctoring events hook
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
