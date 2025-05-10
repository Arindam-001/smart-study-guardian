
import { AssignmentSubmission } from './assignment';
import { Note, Question, Resource, StudentPerformance, Subject, User, Warning } from './types';

export interface AppContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, password: string, id: string, role: string, currentSemester?: number) => Promise<boolean>;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'notes'>) => void;
  addNote: (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addResource: (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  createAssignment: (subjectId: string, title: string) => any;
  submitAssignment: (assignmentId: string, studentId: string, answers: Record<string, string>, fileUrl?: string) => StudentPerformance;
  addWarning: (studentId: string, assignmentId: string, reason: string) => void;
  warnings: Warning[];
  grantSemesterAccess: (studentId: string, semesterId: number) => void;
  semesters: number[];
  updateAttendance: (studentId: string, subjectId: string, date: string, present: boolean) => void;
  getStudentPerformance: (studentId: string) => StudentPerformance[];
  studentPerformance: StudentPerformance[];
  assignments: any[];
  submissions: AssignmentSubmission[];
  getSubmissionsByAssignment: (assignmentId: string) => AssignmentSubmission[];
  getSubmissionsByStudent: (studentId: string) => AssignmentSubmission[];
}
