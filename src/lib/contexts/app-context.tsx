
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const [subjectsList, setSubjects] = useState<Subject[]>(() => {
    return getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
  });
  const [warningsList, setWarnings] = useState<Warning[]>(() => {
    return getItem<Warning[]>(STORAGE_KEYS.WARNINGS, []);
  });
  const [studentPerformanceList, setStudentPerformance] = useState<StudentPerformance[]>(() => {
    return getItem<StudentPerformance[]>(STORAGE_KEYS.PERFORMANCE, []);
  });
  const [assignmentsList, setAssignments] = useState<Assignment[]>(() => {
    return getItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []);
  });
  const [submissionsList, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    return getItem<AssignmentSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
  });
  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

  // Effect to persist data in localStorage whenever it changes
  useEffect(() => {
    if (usersList.length > 0) setItem(STORAGE_KEYS.USERS, usersList);
  }, [usersList]);

  useEffect(() => {
    if (subjectsList.length > 0) setItem(STORAGE_KEYS.SUBJECTS, subjectsList);
  }, [subjectsList]);

  useEffect(() => {
    if (warningsList.length > 0) setItem(STORAGE_KEYS.WARNINGS, warningsList);
  }, [warningsList]);

  useEffect(() => {
    if (assignmentsList.length > 0) setItem(STORAGE_KEYS.ASSIGNMENTS, assignmentsList);
  }, [assignmentsList]);

  useEffect(() => {
    if (submissionsList.length > 0) setItem(STORAGE_KEYS.SUBMISSIONS, submissionsList);
  }, [submissionsList]);

  useEffect(() => {
    if (studentPerformanceList.length > 0) setItem(STORAGE_KEYS.PERFORMANCE, studentPerformanceList);
  }, [studentPerformanceList]);

  // Import functionality from separate modules
  const { login, logout, registerUser } = useAuthFunctions(usersList, setUser, setUsers);
  
  const { 
    addSubject, updateSubjects, addNote, deleteNote, 
    addResource, deleteResource, assignTeacher, unassignTeacher 
  } = useSubjectFunctions(setSubjects);
  
  const { 
    createAssignment, deleteAssignment, submitAssignment,
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
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.WARNINGS);
    localStorage.removeItem(STORAGE_KEYS.PERFORMANCE);
    
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
    deleteAssignment,
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
