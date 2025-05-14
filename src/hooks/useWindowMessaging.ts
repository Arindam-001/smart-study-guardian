
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseWindowMessagingProps {
  modeParam: string | null;
}

export const useWindowMessaging = ({ modeParam }: UseWindowMessagingProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ASSIGNMENT_SUBMITTED') {
        // Force refresh the component when an assignment is submitted in another tab
        console.log('Received assignment submission message:', event.data);
        // Redirect to dashboard if assignment was completed
        if (modeParam === 'take') {
          navigate('/dashboard');
        } else {
          // Just refresh the current view
          window.location.reload();
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, modeParam]);
};
