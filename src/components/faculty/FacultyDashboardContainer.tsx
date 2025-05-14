
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SubjectSelector from '@/components/faculty/SubjectSelector';
import FacultyDashboardTabs from '@/components/faculty/FacultyDashboardTabs';
import { Subject, User } from '@/lib/interfaces/types';

interface FacultyDashboardContainerProps {
  subjects: Subject[];
  taughtSubjects: Subject[];
  selectedSubject: string | null;
  onSubjectChange: (subjectId: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  students: User[];
  notes: any[];
  onResourceAdded: () => void;
  onNoteAdded: () => void;
  onAssignmentAdded: () => void;
  updateAttendance: (studentId: string, subjectId: string, date: string, present: boolean) => void;
}

const FacultyDashboardContainer: React.FC<FacultyDashboardContainerProps> = ({
  subjects,
  taughtSubjects,
  selectedSubject,
  onSubjectChange,
  activeTab,
  onTabChange,
  students,
  notes,
  onResourceAdded,
  onNoteAdded,
  onAssignmentAdded,
  updateAttendance
}) => {
  const currentSubject = subjects.find(s => s.id === selectedSubject);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Subject: {
            selectedSubject 
              ? subjects.find(s => s.id === selectedSubject)?.name 
              : 'Select a Subject'
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SubjectSelector
          subjects={taughtSubjects}
          selectedSubject={selectedSubject}
          onSubjectChange={onSubjectChange}
        />

        {taughtSubjects.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-edu-dark">No subjects assigned</h3>
            <p className="text-muted-foreground mt-2">You don't have any subjects assigned to you yet.</p>
          </div>
        )}

        {selectedSubject && (
          <FacultyDashboardTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
            selectedSubject={selectedSubject}
            students={students}
            notes={notes}
            onResourceAdded={onResourceAdded}
            onNoteAdded={onNoteAdded}
            onAssignmentAdded={onAssignmentAdded}
            updateAttendance={updateAttendance}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FacultyDashboardContainer;
