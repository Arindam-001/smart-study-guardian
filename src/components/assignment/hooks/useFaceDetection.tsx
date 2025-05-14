
import { useRef, useEffect } from 'react';

type FaceDetectionProps = {
  onMultipleFacesDetected: () => void;
  onNoFaceDetected: () => void;
  isActive: boolean;
};

export const useFaceDetection = ({
  onMultipleFacesDetected,
  onNoFaceDetected,
  isActive
}: FaceDetectionProps) => {
  // Face detection simulation variables
  const facesDetectedRef = useRef<number>(1);
  const detectionIntervalRef = useRef<any>(null);

  // Advanced face detection simulation
  const simulateFaceDetection = () => {
    // Randomly simulate multiple faces detected
    if (Math.random() > 0.9) {
      facesDetectedRef.current = 2; 
      onMultipleFacesDetected();
    }
    
    // Randomly simulate no faces detected (left seat)
    if (Math.random() > 0.95) {
      facesDetectedRef.current = 0;
      onNoFaceDetected();
    }
    
    // Most of the time, return to normal state
    if (Math.random() > 0.7) {
      facesDetectedRef.current = 1;
    }
  };

  useEffect(() => {
    if (isActive) {
      // Start face detection simulation
      detectionIntervalRef.current = setInterval(() => {
        simulateFaceDetection();
      }, 5000);
      
      return () => {
        clearInterval(detectionIntervalRef.current);
      };
    }
  }, [isActive, onMultipleFacesDetected, onNoFaceDetected]);

  return {
    facesDetectedRef
  };
};
