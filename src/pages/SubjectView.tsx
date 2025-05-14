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
  
  // Initialize activeTab state with URL parameter or default to 'notes'
  const initialTab = tabParam && ['notes', 'resources', 'assignments'].includes(tabParam) ? tabParam : 'notes';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
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
    // Only process if not from internal navigation
    const isFromNavigation = location.state && (location.state as any).tabChange;
    
    if (!isFromNavigation) {
      const validTabs = ['notes', 'resources', 'assignments'];
      const newTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'notes';
      
      console.log(`URL param tab: ${tabParam}, Setting tab to: ${newTab}`);
      
      // Only update if different to avoid re-renders
      if (activeTab !== newTab) {
        setActiveTab(newTab);
      }
      
      // Handle assignment ID parameter
      if (assignmentIdParam) {
        setSelectedAssignmentId(assignmentIdParam);
        if (newTab === 'assignments') {
          setShowTakeAssignment(true);
        }
      }
    }
  }, [tabParam, assignmentIdParam, location.state]);
  
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
  
  console.log(`Rendering SubjectView with activeTab: ${activeTab}`);
  
  return (
    <DashboardLayout title={subject.name}>
      <div className="mb-6">
        <Tabs 
          value={activeTab} 
          defaultValue={activeTab} 
          onValueChange={handleTabChange}
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
