
import { useState, useEffect } from 'react';

type MovementDetectionProps = {
  onExcessiveMovement: () => void;
  onOtherPersonDetected: () => void;
  isActive: boolean;
};

export const useMovementDetection = ({
  onExcessiveMovement,
  onOtherPersonDetected,
  isActive
}: MovementDetectionProps) => {
  const [movementCount, setMovementCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Advanced movement detection (simulated)
    const movementInterval = setInterval(() => {
      // Simulate face detection and tracking
      const shouldDetectMovement = Math.random() > 0.8;
      if (shouldDetectMovement) {
        const movement = Math.floor(Math.random() * 10);
        setMovementCount(prev => {
          const newValue = prev + movement;
          if (newValue > 50 && movement > 5) {
            onExcessiveMovement();
            
            // Simulate detecting another person or device
            if (Math.random() > 0.7) {
              onOtherPersonDetected();
            }
          }
          return newValue;
        });
      }
    }, 3000);

    return () => {
      clearInterval(movementInterval);
    };
  }, [isActive, onExcessiveMovement, onOtherPersonDetected]);

  return {
    movementCount
  };
};
