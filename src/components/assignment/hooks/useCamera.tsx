
import { useRef, useEffect } from 'react';

type CameraProps = {
  onCameraError: () => void;
  isActive: boolean;
};

export const useCamera = ({ onCameraError, isActive }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onCameraError();
      }
    };
    
    startVideo();
    
    return () => {
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, onCameraError]);

  return {
    videoRef,
    streamRef
  };
};
