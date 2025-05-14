
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Subject, Note, Resource, Assignment, Warning, StudentPerformance } from '@/lib/interfaces/types';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import { AppContextType } from './app-context-types';
import { useAuthFunctions } from './auth-context';
import { useSubjectFunctions } from './subject-context';
import { useAssignmentFunctions } from './assignment-context';
import { useStudentFunctions } from './student-context';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/local-storage';

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
  const [user, setUser] = useState<User | null>(() => {
    return getItem<User | null>(STORAGE_KEYS.AUTH_USER, null);
  });
  const [usersList, setUsers] = useState<User[]>(() => {
    return getItem<User[]>(STORAGE_KEYS.USERS, []);
  });
  const [subjectsList, setSubjects] = useState<Subject[]>([]);
  const [warningsList, setWarnings] = useState<Warning[]>([]);
  const [studentPerformanceList, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [assignmentsList, setAssignments] = useState<Assignment[]>([]);
  const [submissionsList, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

  // Import functionality from separate modules
  const { login, logout, registerUser } = useAuthFunctions(usersList, setUser, setUsers);
  
  const { 
    addSubject, updateSubjects, addNote, deleteNote, 
    addResource, deleteResource, assignTeacher, unassignTeacher 
  } = useSubjectFunctions(setSubjects);
  
  const { 
    createAssignment, submitAssignment,
    getSubmissionsByAssignment, getSubmissionsByStudent 
  } = useAssignmentFunctions(setAssignments, assignmentsList, submissionsList);
  
  const { 
    addWarning, grantSemesterAccess,
    updateAttendance, getStudentPerformance 
  } = useStudentFunctions(setUsers, setWarnings, studentPerformanceList);

  // Clear all user data function
  const clearAllUserData = (): boolean => {
    setUser(null);
    setUsers([]);
    setSubjects([]);
    setWarnings([]);
    setStudentPerformance([]);
    setAssignments([]);
    setSubmissions([]);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    
    return true;
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
