
import { Assignment, Note, Resource } from '@/lib/interfaces/types';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';

// Assignment-related context functions
export const useAssignmentFunctions = (
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>,
  assignmentsList: Assignment[],
  submissionsList: AssignmentSubmission[]
) => {
  // Create assignment function
  const createAssignment = (
    subjectId: string, 
    title: string, 
    dueDate?: Date, 
    duration?: number, 
    selectedNotes?: Note[], 
    selectedResources?: Resource[]
  ): Assignment => {
    const newAssignment: Assignment = {
      id: `assignment_${Date.now()}`,
      subjectId,
      title,
      questions: [],
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
      createdAt: new Date(),
      duration,
      studentScores: {},
    };
    
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  // Delete assignment function
  const deleteAssignment = (assignmentId: string): boolean => {
    const assignmentIndex = assignmentsList.findIndex(a => a.id === assignmentId);
    if (assignmentIndex === -1) return false;
    
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    return true;
  };

  // Submit assignment function
  const submitAssignment = (
    assignmentId: string, 
    studentId: string, 
    answers: Record<string, string>, 
    fileUrl?: string
  ): any => {
    // Implementation logic would go here
    return null;
  };

  // Get submissions by assignment function
  const getSubmissionsByAssignment = (assignmentId: string): AssignmentSubmission[] => {
    return submissionsList.filter(s => s.assignmentId === assignmentId);
  };

  // Get submissions by student function
  const getSubmissionsByStudent = (studentId: string): AssignmentSubmission[] => {
    return submissionsList.filter(s => s.studentId === studentId);
  };

  return { 
    createAssignment, 
    deleteAssignment,
    submitAssignment, 
    getSubmissionsByAssignment, 
    getSubmissionsByStudent
  };
};
