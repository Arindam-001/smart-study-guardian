import { User, UserRole, Subject, Note, Resource, Assignment, Warning, StudentPerformance } from './types';
import { AssignmentSubmission } from './assignment';

export interface AppContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  registerUser: (name: string, email: string, password: string, id: string, role: UserRole, currentSemester?: number, phone?: string, enrolledCourse?: string) => Promise<boolean>;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'notes'>) => Subject;
  updateSubjects: (subjects: Subject[]) => void;
  addNote: (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (subjectId: string, noteId: string) => void;
  addResource: (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>) => Resource;
  deleteResource: (subjectId: string, resourceId: string) => void;
  createAssignment: (subjectId: string, title: string, dueDate?: Date, duration?: number, selectedNotes?: Note[]) => Assignment;
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

// Update the registerUser function in context.tsx to include enrolledCourse

const registerUser = async (
  name: string, 
  email: string, 
  password: string, 
  id: string, 
  role: UserRole, 
  currentSemester: number = 1,
  phone?: string,
  enrolledCourse?: string
): Promise<boolean> => {
  // Check if user with same email already exists
  const existingUser = users.find(u => u.email === email || u.id === id);
  if (existingUser) {
    return false;
  }

  // Create new user
  const newUser: User = {
    id,
    name,
    email,
    role,
    currentSemester,
    accessibleSemesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
    phone,
    enrolledCourse,
  };

  // Add user to list
  setUsers(prevUsers => [...prevUsers, newUser]);
  return true;
};
