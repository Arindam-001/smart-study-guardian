import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface UseSubjectTabsProps {
  onAssignmentComplete?: () => void;
}

export const useSubjectTabs = ({ onAssignmentComplete }: UseSubjectTabsProps = {}) => {
  const { semesterId, subjectId } = useParams<{ semesterId: string, subjectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab and assignmentId from URL params
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const assignmentIdParam = searchParams.get('assignmentId');
  const modeParam = searchParams.get('mode');
  
  // Initialize activeTab state with URL parameter or default to 'notes'
  const initialTab = tabParam && ['notes', 'resources', 'assignments'].includes(tabParam) ? tabParam : 'notes';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showTakeAssignment, setShowTakeAssignment] = useState(modeParam === 'take');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignmentIdParam);
  
  // Update URL without triggering a full page reload
  const updateUrlParams = useCallback((tab: string, assignmentId?: string | null) => {
    // Start with current params to preserve any other query params
    const params = new URLSearchParams(location.search);
    
    // Update the params we care about
    if (tab) {
      params.set('tab', tab);
    } else {
      params.delete('tab');
    }
    
    if (assignmentId) {
      params.set('assignmentId', assignmentId);
    } else if (params.has('assignmentId') && !assignmentId) {
      params.delete('assignmentId');
    }
    
    // Use replace to avoid adding browser history entries
    navigate(
      `${location.pathname}?${params.toString()}`,
      { 
        replace: true,
        state: { tabChange: true } // Mark this as an intentional tab change
      }
    );
  }, [navigate, location]);
  
  // Handle tab change without causing full page reload
  const handleTabChange = (value: string) => {
    console.log(`Tab change requested to: ${value}`);
    setActiveTab(value);
    
    // Update URL with appropriate parameters
    if (value === 'assignments' && selectedAssignmentId) {
      updateUrlParams(value, selectedAssignmentId);
    } else {
      updateUrlParams(value);
    }
  };
  
  // Keep tab state in sync with URL params
  useEffect(() => {
    const locationState = location.state as any;
    const isFromNavigation = locationState && locationState.tabChange;
    
    if (!isFromNavigation) {
      const validTabs = ['notes', 'resources', 'assignments'];
      const newTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'notes';
      
      if (activeTab !== newTab) {
        setActiveTab(newTab);
      }
    }
    
    // Handle assignment ID parameter and taking assignment directly
    if (assignmentIdParam) {
      setSelectedAssignmentId(assignmentIdParam);
      
      // Check if we should immediately show the take assignment view
      // This happens when navigated from the assignments dashboard or when mode=take
      const shouldTakeAssignment = 
        (locationState && locationState.takeAssignment) || 
        modeParam === 'take';
        
      if (shouldTakeAssignment) {
        setShowTakeAssignment(true);
      }
    }
  }, [tabParam, assignmentIdParam, modeParam, location.state, activeTab]);

  // When assignment is completed, close the page if opened in a new tab
  const handleAssignmentComplete = () => {
    if (modeParam === 'take') {
      // If opened in a new tab, close the window after submission
      window.close();
      // Fallback if window.close() doesn't work (many browsers block it)
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      // Regular flow for same-window operation
      setShowTakeAssignment(false);
      setSelectedAssignmentId(null);
      updateUrlParams('assignments');
    }
    
    if (onAssignmentComplete) {
      onAssignmentComplete();
    }
  };
  
  return {
    semesterId,
    subjectId,
    activeTab,
    setActiveTab,
    showTakeAssignment,
    setShowTakeAssignment,
    selectedAssignmentId,
    setSelectedAssignmentId,
    handleTabChange,
    updateUrlParams,
    handleAssignmentComplete
  };
};
