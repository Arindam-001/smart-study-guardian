
import { useEffect } from 'react';

type ProctoringEventsProps = {
  onTabSwitching: () => void;
  onCopyAttempt: () => void;
  onPasteAttempt: () => void;
  onRightClick: () => void;
  isActive: boolean;
};

export const useProctoringEvents = ({
  onTabSwitching,
  onCopyAttempt,
  onPasteAttempt,
  onRightClick,
  isActive
}: ProctoringEventsProps) => {
  
  useEffect(() => {
    if (!isActive) return;

    // Monitor tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onTabSwitching();
      }
    };
    
    // Prevent copy and paste
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onCopyAttempt();
      return false;
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onPasteAttempt();
      return false;
    };
    
    // Detect right-click (context menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onRightClick();
      return false;
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isActive, onTabSwitching, onCopyAttempt, onPasteAttempt, onRightClick]);
};
