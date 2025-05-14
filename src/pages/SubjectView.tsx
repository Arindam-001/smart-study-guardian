
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, File, Shield, AlertTriangle, FileText } from 'lucide-react';
import NotesTab from '@/components/subjects/NotesTab';
import ResourcesTab from '@/components/subjects/ResourcesTab';
import AssignmentsTab from '@/components/subjects/AssignmentsTab';
import SubjectNotFound from '@/components/subjects/SubjectNotFound';

const SubjectView = () => {
  const { semesterId, subjectId } = useParams<{ semesterId: string, subjectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab and assignmentId from URL without recreating URLSearchParams on every render
  const tabParam = new URLSearchParams(location.search).get('tab');
  const assignmentIdParam = new URLSearchParams(location.search).get('assignmentId');
  
  const { user, subjects, warnings } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'notes');
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignmentIdParam);
  
  // Handle URL params with a memoized callback to prevent unnecessary re-renders
  const updateUrlParams = useCallback((tab: string, assignmentId?: string | null) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (assignmentId) {
      params.set('assignmentId', assignmentId);
    }
    // Use replace: true to avoid adding to history stack
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [navigate, location.pathname]);
  
  // Effect to handle URL params on initial load and URL changes
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    
    if (assignmentIdParam) {
      setSelectedAssignmentId(assignmentIdParam);
      if (tabParam === 'assignments') {
        setShowTakeAssignment(true);
      }
    }
  }, [tabParam, assignmentIdParam, activeTab]);
  
  // Handle tab change with the memoized URL updater
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateUrlParams(value, value === 'assignments' ? selectedAssignmentId : null);
  };

  if (!user || !subjectId) {
    navigate('/');
    return null;
  }

  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return <SubjectNotFound semesterId={semesterId} />;
  }

  // Check if there are warnings for this subject
  const hasWarnings = warnings.some(w => w.assignmentId.startsWith(subjectId));
  
  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2 relative">
              <File size={16} />
              <span>Assignments</span>
              {hasWarnings && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  <AlertTriangle size={10} />
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes">
            <NotesTab subject={subject} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesTab subject={subject} />
          </TabsContent>
          
          <TabsContent value="assignments">
            <AssignmentsTab 
              subject={subject}
              showTakeAssignment={showTakeAssignment}
              setShowTakeAssignment={setShowTakeAssignment}
              selectedAssignmentId={selectedAssignmentId}
              setSelectedAssignmentId={setSelectedAssignmentId}
              updateUrlParams={updateUrlParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SubjectView;
