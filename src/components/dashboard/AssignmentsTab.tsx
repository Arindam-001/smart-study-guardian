
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';
import SubjectAssignmentsCard from './SubjectAssignmentsCard';
import EmptySubjectsState from './EmptySubjectsState';

interface AssignmentsTabProps {
  currentSemesterSubjects: Subject[];
  currentSemester: number;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ 
  currentSemesterSubjects,
  currentSemester
}) => {
  const { assignments } = useAppContext();
  const navigate = useNavigate();
  
  // Safe navigation to subject page with assignment tab pre-selected
  const navigateToAssignment = useCallback((subjectId: string, semesterId: number, assignmentId: string) => {
    navigate(`/semester/${semesterId}/subject/${subjectId}?tab=assignments&assignmentId=${assignmentId}`, { replace: true });
  }, [navigate]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Your Assignments</h3>
      
      {currentSemesterSubjects.length > 0 ? (
        <div className="space-y-4">
          {currentSemesterSubjects.map(subject => {
            // Get assignments for this subject
            const subjectAssignments = assignments.filter(a => a.subjectId === subject.id);
            
            return (
              <SubjectAssignmentsCard
                key={subject.id}
                subject={subject}
                subjectAssignments={subjectAssignments}
                currentSemester={currentSemester}
                navigateToAssignment={navigateToAssignment}
              />
            );
          })}
        </div>
      ) : (
        <EmptySubjectsState />
      )}
    </div>
  );
};

export default AssignmentsTab;
