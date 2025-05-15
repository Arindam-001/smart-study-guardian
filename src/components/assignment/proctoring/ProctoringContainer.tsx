
import React from 'react';
import ProctoringMonitor from './ProctoringMonitor';
import ViolationWarning from '../warnings/ViolationWarning';

interface ProctoringContainerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  movementCount: number;
  hasWarning: boolean;
  tabSwitchCount: number;
  deviceDetected: boolean;
}

const ProctoringContainer: React.FC<ProctoringContainerProps> = ({
  videoRef,
  movementCount,
  hasWarning,
  tabSwitchCount,
  deviceDetected
}) => {
  return (
    <div>
      <ProctoringMonitor 
        videoRef={videoRef}
        movementCount={movementCount}
        hasWarning={hasWarning}
        tabSwitchCount={tabSwitchCount}
        deviceDetected={deviceDetected}
      />
      
      <ViolationWarning count={tabSwitchCount} />
    </div>
  );
};

export default ProctoringContainer;
