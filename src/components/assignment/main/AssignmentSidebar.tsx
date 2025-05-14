
import React from 'react';
import ProctoringMonitor from '../proctoring/ProctoringMonitor';
import ViolationWarning from '../warnings/ViolationWarning';

interface AssignmentSidebarProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  movementCount: number;
  hasWarning: boolean;
  tabSwitchCount: number;
  deviceDetected: boolean;
}

const AssignmentSidebar = ({
  videoRef,
  movementCount,
  hasWarning,
  tabSwitchCount,
  deviceDetected
}: AssignmentSidebarProps) => {
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

export default AssignmentSidebar;
