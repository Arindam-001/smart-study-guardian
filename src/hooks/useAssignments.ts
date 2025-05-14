
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';
import { Subject, Assignment } from '@/lib/interfaces/types';

export function useAssignments(currentSemesterSubjects: Subject[]) {
  const { assignments } = useAppContext();
  const navigate = useNavigate();
  
  // Get assignments for the current semester subjects
  const currentAssignments = assignments.filter(a => 
    currentSemesterSubjects.some(s => s.id === a.subjectId)
  );
  
  // Get assignments for a specific subject
  const getSubjectAssignments = useCallback((subjectId: string): Assignment[] => {
    return assignments.filter(a => a.subjectId === subjectId);
  }, [assignments]);
  
  // Navigate to assignment
  const navigateToAssignment = useCallback((subjectId: string, semesterId: number, assignmentId: string) => {
    navigate(`/semester/${semesterId}/subject/${subjectId}?tab=assignments&assignmentId=${assignmentId}`, { replace: true });
  }, [navigate]);
  
  return {
    currentAssignments,
    getSubjectAssignments,
    navigateToAssignment
  };
}

export default useAssignments;
