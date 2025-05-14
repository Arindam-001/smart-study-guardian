
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManageResourcesTab from '@/components/faculty/ManageResourcesTab';
import ManageNotesTab from '@/components/faculty/ManageNotesTab';
import ManageAttendanceTab from '@/components/faculty/ManageAttendanceTab';
import ViewStudentsTab from '@/components/faculty/ViewStudentsTab';
import { User, Note, Assignment } from '@/lib/interfaces/types';
import StudentAttendanceView from '@/components/faculty/StudentAttendanceView';
import QuickAssignmentGenerator from '@/components/faculty/QuickAssignmentGenerator';
import ManageAssignmentsTab from '@/components/faculty/ManageAssignmentsTab';

interface FacultyDashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedSubject: string | null;
  students: User[];
  notes: Note[];
  onResourceAdded: () => void;
  onNoteAdded: () => void;
  onAssignmentAdded: () => void;
  updateAttendance: (studentId: string, subjectId: string, date: string, present: boolean) => void;
}

const FacultyDashboardTabs: React.FC<FacultyDashboardTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  selectedSubject, 
  students, 
  notes, 
  onResourceAdded, 
  onNoteAdded, 
  onAssignmentAdded,
  updateAttendance 
}) => {
  if (!selectedSubject) {
    return null;
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="resources">Manage Resources</TabsTrigger>
        <TabsTrigger value="notes">Manage Notes</TabsTrigger>
        <TabsTrigger value="assignments">Manage Assignments</TabsTrigger>
        <TabsTrigger value="attendance">Manage Attendance</TabsTrigger>
        <TabsTrigger value="view-attendance">View Attendance</TabsTrigger>
        <TabsTrigger value="students">View Students</TabsTrigger>
      </TabsList>

      <TabsContent value="resources">
        <ManageResourcesTab 
          selectedSubject={selectedSubject} 
          onResourceAdded={onResourceAdded}
        />
      </TabsContent>

      <TabsContent value="notes">
        <ManageNotesTab 
          notes={notes} 
          selectedSubject={selectedSubject}
          onNoteAdded={onNoteAdded}
        />
      </TabsContent>
      
      <TabsContent value="assignments">
        <div className="mb-6">
          <QuickAssignmentGenerator 
            subjectId={selectedSubject}
            onAssignmentCreated={onAssignmentAdded}
          />
        </div>
        <ManageAssignmentsTab 
          subjectId={selectedSubject}
          onAssignmentAdded={onAssignmentAdded}
        />
      </TabsContent>

      <TabsContent value="attendance">
        <ManageAttendanceTab 
          students={students} 
          updateAttendance={updateAttendance} 
          selectedSubject={selectedSubject}
        />
      </TabsContent>

      <TabsContent value="view-attendance">
        <StudentAttendanceView subjectId={selectedSubject} />
      </TabsContent>

      <TabsContent value="students">
        <ViewStudentsTab students={students} />
      </TabsContent>
    </Tabs>
  );
};

export default FacultyDashboardTabs;
