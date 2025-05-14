
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
  
  // Get tab and assignmentId from URL params
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const assignmentIdParam = searchParams.get('assignmentId');
  
  const { user, subjects, warnings } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'notes');
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignmentIdParam);

  // Update URL when tab changes without causing a full page refresh
  const updateUrlParams = useCallback((tab: string, assignmentId?: string | null) => {
    const params = new URLSearchParams();
    
    if (tab) params.set('tab', tab);
    if (assignmentId) params.set('assignmentId', assignmentId);
    
    // Use replace: true to avoid adding entries to the browser history
    navigate(`/semester/${semesterId}/subject/${subjectId}?${params.toString()}`, { 
      replace: true,
      state: { preserveTab: true } // Add state to indicate this is an internal navigation
    });
  }, [navigate, semesterId, subjectId]);

  // Handle tab change without causing a page refresh
  const handleTabChange = (value: string) => {
    // Only update if the value is actually different
    if (value !== activeTab) {
      setActiveTab(value);
      
      if (value === 'assignments' && selectedAssignmentId) {
        updateUrlParams(value, selectedAssignmentId);
      } else {
        updateUrlParams(value);
      }
    }
  };

  // Sync URL params with state when URL changes
  useEffect(() => {
    const validTabs = ['notes', 'resources', 'assignments'];
    const newTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'notes';
    
    // Only update state if it's different to avoid re-renders
    if (activeTab !== newTab) {
      setActiveTab(newTab);
    }

    // Handle assignment ID parameter
    if (assignmentIdParam) {
      setSelectedAssignmentId(assignmentIdParam);
      if (tabParam === 'assignments') {
        setShowTakeAssignment(true);
      }
    }
  }, [tabParam, assignmentIdParam]);

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

  // Ensure activeTab is always a valid value
  const currentTab = ['notes', 'resources', 'assignments'].includes(activeTab) ? activeTab : 'notes';

  console.log('Rendering SubjectView with tab:', currentTab);

  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <Tabs 
          defaultValue={currentTab} 
          onValueChange={handleTabChange}
          value={currentTab}
        >
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
