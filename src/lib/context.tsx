
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Subject, Note, Resource, Assignment, Warning, StudentPerformance } from '@/lib/interfaces/types';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';

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

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // State declarations
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsers] = useState<User[]>([]);
  const [subjectsList, setSubjects] = useState<Subject[]>([]);
  const [warningsList, setWarnings] = useState<Warning[]>([]);
  const [studentPerformanceList, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [assignmentsList, setAssignments] = useState<Assignment[]>([]);
  const [submissionsList, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

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
    const existingUser = usersList.find(u => u.email === email || u.id === id);
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

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = usersList.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setUser(null);
  };

  // Add subject function
  const addSubject = (subject: Omit<Subject, 'id' | 'notes'>): Subject => {
    const newSubject: Subject = {
      ...subject,
      id: `subject_${Date.now()}`,
      notes: [],
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  // Update subjects function
  const updateSubjects = (subjects: Subject[]): void => {
    setSubjects(subjects);
  };

  // Add note function
  const addNote = (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): void => {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, notes: [...subject.notes, newNote] }
          : subject
      )
    );
  };

  // Delete note function
  const deleteNote = (subjectId: string, noteId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, notes: subject.notes.filter(note => note.id !== noteId) }
          : subject
      )
    );
  };

  // Add resource function
  const addResource = (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>): Resource => {
    const newResource: Resource = {
      ...resource,
      id: `resource_${Date.now()}`,
      createdAt: new Date(),
      subjectId,
    };
    
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { 
              ...subject, 
              resources: subject.resources 
                ? [...subject.resources, newResource] 
                : [newResource] 
            }
          : subject
      )
    );
    
    return newResource;
  };

  // Delete resource function
  const deleteResource = (subjectId: string, resourceId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId && subject.resources
          ? { 
              ...subject, 
              resources: subject.resources.filter(resource => resource.id !== resourceId)
            }
          : subject
      )
    );
  };

  // Create assignment function
  const createAssignment = (
    subjectId: string, 
    title: string, 
    dueDate?: Date, 
    duration?: number, 
    selectedNotes?: Note[]
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

  // Add warning function
  const addWarning = (studentId: string, assignmentId: string, reason: string): void => {
    const newWarning: Warning = {
      id: `warning_${Date.now()}`,
      studentId,
      assignmentId,
      reason,
      timestamp: new Date(),
    };
    
    setWarnings(prev => [...prev, newWarning]);
  };

  // Grant semester access function
  const grantSemesterAccess = (studentId: string, semesterId: number): void => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === studentId
          ? { 
              ...u, 
              accessibleSemesters: 
                u.accessibleSemesters.includes(semesterId)
                  ? u.accessibleSemesters
                  : [...u.accessibleSemesters, semesterId] 
            }
          : u
      )
    );
  };

  // Update attendance function
  const updateAttendance = (studentId: string, subjectId: string, date: string, present: boolean): void => {
    setUsers(prevUsers => 
      prevUsers.map(u => {
        if (u.id !== studentId) return u;
        
        const attendance = u.attendance || {};
        const subjectAttendance = attendance[subjectId] || [];
        
        // Find the index of the date, or -1 if not found
        const dateIndex = subjectAttendance.length;
        
        const newSubjectAttendance = [...subjectAttendance];
        newSubjectAttendance[dateIndex] = present;
        
        return {
          ...u,
          attendance: {
            ...attendance,
            [subjectId]: newSubjectAttendance
          }
        };
      })
    );
  };

  // Get student performance function
  const getStudentPerformance = (studentId: string): StudentPerformance[] => {
    return studentPerformanceList.filter(p => p.studentId === studentId);
  };

  // Get submissions by assignment function
  const getSubmissionsByAssignment = (assignmentId: string): AssignmentSubmission[] => {
    return submissionsList.filter(s => s.assignmentId === assignmentId);
  };

  // Get submissions by student function
  const getSubmissionsByStudent = (studentId: string): AssignmentSubmission[] => {
    return submissionsList.filter(s => s.studentId === studentId);
  };

  // Clear all user data function
  const clearAllUserData = (): boolean => {
    setUser(null);
    setUsers([]);
    setSubjects([]);
    setWarnings([]);
    setStudentPerformance([]);
    setAssignments([]);
    setSubmissions([]);
    return true;
  };

  // Assign teacher function
  const assignTeacher = (subjectId: string, teacherId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, teacherId }
          : subject
      )
    );
  };

  // Unassign teacher function
  const unassignTeacher = (subjectId: string): void => {
    setSubjects(prevSubjects => 
      prevSubjects.map(subject => 
        subject.id === subjectId
          ? { ...subject, teacherId: undefined }
          : subject
      )
    );
  };

  // Context value
  const contextValue: AppContextType = {
    user,
    users: usersList,
    isAuthenticated: !!user,
    login,
    logout,
    registerUser,
    subjects: subjectsList,
    addSubject,
    updateSubjects,
    addNote,
    deleteNote,
    addResource,
    deleteResource,
    createAssignment,
    submitAssignment,
    addWarning,
    warnings: warningsList,
    grantSemesterAccess,
    semesters: semestersList,
    updateAttendance,
    getStudentPerformance,
    studentPerformance: studentPerformanceList,
    assignments: assignmentsList,
    submissions: submissionsList,
    getSubmissionsByAssignment,
    getSubmissionsByStudent,
    clearAllUserData,
    assignTeacher,
    unassignTeacher,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
