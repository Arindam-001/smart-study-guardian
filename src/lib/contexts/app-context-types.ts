
import { User, UserRole, Subject, Note, Resource, Assignment, Warning, StudentPerformance } from '@/lib/interfaces/types';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';

// Define the shape of the application context
export interface AppContextType {
  // User state and authentication
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Added setUser function
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  registerUser: (userData: Omit<User, "id"> | { name: string; email: string; password: string; id: string; role: string; currentSemester?: number; phone?: string; enrolledCourse?: string; }) => Promise<boolean>;

  // Subject management
  subjects: Subject[];
  addSubject: (name: string, semesterId: number, description?: string) => Subject;
  updateSubjects: (newSubjects: Subject[]) => void;
  addNote: (subjectId: string, title: string, content: string) => string;
  deleteNote: (subjectId: string, noteId: string) => boolean;
  addResource: (subjectId: string, title: string, url: string, type: string) => string;
  deleteResource: (subjectId: string, resourceId: string) => boolean;
  assignTeacher: (subjectId: string, teacherId: string) => boolean;
  unassignTeacher: (subjectId: string) => boolean;

  // Assignment management
  createAssignment: (subjectId: string, title: string, dueDate?: Date, duration?: number, selectedNotes?: Note[], selectedResources?: Resource[]) => Assignment;
  deleteAssignment: (assignmentId: string) => boolean;
  submitAssignment: (assignmentId: string, studentId: string, answers: Record<string, string>, fileUrl?: string) => any;
  assignments: Assignment[];
  getSubmissionsByAssignment: (assignmentId: string) => AssignmentSubmission[];
  getSubmissionsByStudent: (studentId: string) => AssignmentSubmission[];
  
  // Warning and notification
  addWarning: (studentId: string, assignmentId: string, reason: string) => Warning;
  warnings: Warning[];
  
  // Student management
  grantSemesterAccess: (studentId: string, semesterId: number) => boolean;
  updateAttendance: (studentId: string, subjectId: string, present: boolean, date?: Date) => boolean;
  getStudentPerformance: (studentId: string) => StudentPerformance | undefined;
  
  // Data management
  semesters: number[];
  studentPerformance: StudentPerformance[];
  submissions: AssignmentSubmission[];
  clearAllUserData: () => boolean;
}
