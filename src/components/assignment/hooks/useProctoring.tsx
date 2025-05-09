
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';

export const useProctoring = (assignmentId: string) => {
  const [hasWarning, setHasWarning] = useState(false);
  const [movementCount, setMovementCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { user, addWarning } = useAppContext();
  const { toast } = useToast();

  const createWarning = (reason: string) => {
    if (!user) return;
    
    setHasWarning(true);
    toast({
      title: "Warning!",
      description: reason,
      variant: "destructive"
    });
    
    addWarning(user.id, assignmentId, reason);
  };

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        createWarning("Camera access denied");
      }
    };
    
    startVideo();
    
    // Simulate movement detection
    const movementInterval = setInterval(() => {
      const shouldDetectMovement = Math.random() > 0.8;
      if (shouldDetectMovement) {
        const movement = Math.floor(Math.random() * 10);
        setMovementCount(prev => prev + movement);
        if (movement > 5) {
          createWarning("Excessive movement detected");
        }
      }
    }, 5000);

    // Monitor tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        createWarning("Tab switching detected");
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prevent copy and paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      createWarning("Copy attempt detected");
      return false;
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      createWarning("Paste attempt detected");
      return false;
    };
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      clearInterval(movementInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [assignmentId]);

  return {
    videoRef,
    streamRef,
    hasWarning,
    movementCount,
    createWarning
  };
};
