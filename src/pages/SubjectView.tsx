
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
  
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab') || 'notes';
  const assignmentIdParam = searchParams.get('assignmentId');
  
  const { user, subjects, warnings } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [showTakeAssignment, setShowTakeAssignment] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignmentIdParam);

  // Update URL when tab changes
  const updateUrlParams = useCallback((tab: string, assignmentId?: string | null) => {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (assignmentId) {
      params.set('assignmentId', assignmentId);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [navigate, location.pathname]);

  // Sync URL params with state
  useEffect(() => {
    const validTabs = ['notes', 'resources', 'assignments'];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (assignmentIdParam) {
      setSelectedAssignmentId(assignmentIdParam);
      if (tabParam === 'assignments') {
        setShowTakeAssignment(true);
      }
    }
  }, [tabParam, assignmentIdParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'assignments' && selectedAssignmentId) {
      updateUrlParams(value, selectedAssignmentId);
    } else {
      updateUrlParams(value);
    }
  };

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
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
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
