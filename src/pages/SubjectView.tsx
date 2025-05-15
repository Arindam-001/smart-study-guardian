import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import AssignmentsTab from '@/components/subjects/AssignmentsTab';
import SubjectNotFound from '@/components/subjects/SubjectNotFound';

const SubjectView = () => {
  const { semesterId, subjectId } = useParams<{ semesterId: string, subjectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get assignmentId from URL params
  const searchParams = new URLSearchParams(location.search);
  const assignmentIdParam = searchParams.get('assignmentId');
  const modeParam = searchParams.get('mode');
  
  const { user, subjects, warnings } = useAppContext();
  
  const [showTakeAssignment, setShowTakeAssignment] = useState(modeParam === 'take');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignmentIdParam);
  
  // Listen for messages from popup windows
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
  
  // Update URL without triggering a full page reload
  const updateUrlParams = useCallback((tab: string, assignmentId?: string | null) => {
    // Start with current params to preserve any other query params
    const params = new URLSearchParams(location.search);
    
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
  
  // Keep state in sync with URL params
  useEffect(() => {
    const locationState = location.state as any;
    
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
  }, [assignmentIdParam, modeParam, location.state]);

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
  };
  
  // Early return conditions
  if (!user || !subjectId) {
    navigate('/');
    return null;
  }
  
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return <SubjectNotFound semesterId={semesterId} />;
  }
  
  const hasWarnings = warnings.some(w => w.assignmentId && w.assignmentId.startsWith(subjectId));
  
  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <AssignmentsTab 
          subject={subject}
          showTakeAssignment={showTakeAssignment}
          setShowTakeAssignment={setShowTakeAssignment}
          selectedAssignmentId={selectedAssignmentId}
          setSelectedAssignmentId={setSelectedAssignmentId}
          updateUrlParams={updateUrlParams}
          onCompleteTakeAssignment={handleAssignmentComplete}
        />
      </div>
    </DashboardLayout>
  );
};

export default SubjectView;
