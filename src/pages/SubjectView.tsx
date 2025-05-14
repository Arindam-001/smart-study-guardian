
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppContext } from '@/lib/context';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import NotesTab from '@/components/subjects/NotesTab';
import ResourcesTab from '@/components/subjects/ResourcesTab';
import AssignmentsTab from '@/components/subjects/AssignmentsTab';
import SubjectNotFound from '@/components/subjects/SubjectNotFound';
import SubjectTabNavigation from '@/components/subjects/SubjectTabNavigation';
import { useSubjectTabs } from '@/hooks/useSubjectTabs';
import { useWindowMessaging } from '@/hooks/useWindowMessaging';

const SubjectView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, subjects, warnings } = useAppContext();
  
  // Get search parameters
  const searchParams = new URLSearchParams(location.search);
  const modeParam = searchParams.get('mode');

  // Use our custom hooks
  const {
    subjectId,
    activeTab,
    showTakeAssignment,
    setShowTakeAssignment,
    selectedAssignmentId,
    setSelectedAssignmentId,
    handleTabChange,
    updateUrlParams,
    handleAssignmentComplete
  } = useSubjectTabs();
  
  // Set up window messaging for cross-tab communication
  useWindowMessaging({ modeParam });
  
  // Early return conditions
  if (!user || !subjectId) {
    navigate('/');
    return null;
  }
  
  const subject = subjects.find(s => s.id === subjectId);
  
  if (!subject) {
    return <SubjectNotFound semesterId={subjectId} />;
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
          <SubjectTabNavigation hasWarnings={hasWarnings} />
          
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
              onCompleteTakeAssignment={handleAssignmentComplete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SubjectView;
