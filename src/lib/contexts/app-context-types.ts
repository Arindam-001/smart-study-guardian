
import { User, Subject, Note, Resource, Assignment, Warning, StudentPerformance } from '../interfaces/types';
import { AssignmentSubmission } from '../interfaces/assignment';

export interface AppContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  registerUser: (userData: Omit<User, 'id'>) => User;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;
  updateSubjects: (subjects: Subject[]) => void;
  addNote: (subjectId: string, note: Omit<Note, 'id' | 'createdAt'>) => Note;
  deleteNote: (subjectId: string, noteId: string) => void;
  addResource: (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>) => Resource;
  deleteResource: (subjectId: string, resourceId: string) => void;
  createAssignment: (subjectId: string, title: string, dueDate?: Date, duration?: number, selectedNotes?: Note[], selectedResources?: Resource[]) => Assignment;
  deleteAssignment: (assignmentId: string) => boolean;
  submitAssignment: (assignmentId: string, studentId: string, answers: Record<string, string>, fileUrl?: string) => any;
  addWarning: (studentId: string, assignmentId: string, reason: string) => void;
  warnings: Warning[];
  grantSemesterAccess: (studentId: string, semesterId: number) => void;
  semesters: number[];
  updateAttendance: (studentId: string, subjectId: string, date: string, present: boolean) => void;
  getStudentPerformance: (studentId: string) => StudentPerformance[];
  studentPerformance: StudentPerformance[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  getSubmissionsByAssignment: (assignmentId: string) => AssignmentSubmission[];
  getSubmissionsByStudent: (studentId: string) => AssignmentSubmission[];
  clearAllUserData: () => boolean;
  assignTeacher: (subjectId: string, teacherId: string) => void;
  unassignTeacher: (subjectId: string) => void;
}
