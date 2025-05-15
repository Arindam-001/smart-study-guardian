
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject } from '@/lib/interfaces/types';
import { useAppContext } from '@/lib/context';
import SubjectAssignmentsCard from './SubjectAssignmentsCard';
import EmptySubjectsState from './EmptySubjectsState';
import useAssignments from '@/hooks/useAssignments';

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
  
  // Updated navigation function to go directly to the assignment view
  const navigateToAssignment = useCallback((subjectId: string, semesterId: number, assignmentId: string) => {
    // Navigate directly to subject page with only the assignmentId parameter
    navigate(`/semester/${semesterId}/subject/${subjectId}?assignmentId=${assignmentId}`, { 
      state: { 
        takeAssignment: true // Add this flag to indicate we want to take the assignment
      } 
    });
  }, [navigate]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Your Assignments</h3>
      
      {currentSemesterSubjects.length > 0 ? (
        <div className="space-y-6">
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
