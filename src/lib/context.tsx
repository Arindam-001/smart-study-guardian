
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentSemester: number;
  accessibleSemesters: number[];
}

export interface Subject {
  id: string;
  name: string;
  semesterId: number;
  teacherId: string;
  notes: Note[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  questions: Question[];
  dueDate: Date;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  type: 'multiple-choice' | 'text';
}

export interface Warning {
  id: string;
  studentId: string;
  assignmentId: string;
  reason: string;
  timestamp: Date;
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Student User',
    email: 'student@example.com',
    role: 'student',
    currentSemester: 1,
    accessibleSemesters: [1]
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@example.com',
    role: 'teacher',
    currentSemester: 0, // Not applicable
    accessibleSemesters: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    currentSemester: 0, // Not applicable
    accessibleSemesters: [1, 2, 3, 4, 5, 6, 7, 8]
  }
];

const MOCK_SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    semesterId: 1,
    teacherId: '2',
    notes: [
      {
        id: '1',
        title: 'Basics of Programming',
        content: 'Programming is the process of creating a set of instructions that tell a computer how to perform a task...',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '2',
    name: 'Calculus',
    semesterId: 1,
    teacherId: '2',
    notes: []
  },
  {
    id: '3',
    name: 'Physics I',
    semesterId: 1,
    teacherId: '2',
    notes: []
  },
  {
    id: '4',
    name: 'Data Structures',
    semesterId: 2,
    teacherId: '2',
    notes: []
  }
];

// Context
interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'notes'>) => void;
  addNote: (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createAssignment: (subjectId: string, title: string) => Assignment;
  addWarning: (studentId: string, assignmentId: string, reason: string) => void;
  warnings: Warning[];
  grantSemesterAccess: (studentId: string, semesterId: number) => void;
  semesters: number[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Most engineering courses have 8 semesters

  const login = async (email: string, password: string) => {
    // In a real app, you would call an API here
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addSubject = (subject: Omit<Subject, 'id' | 'notes'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
      notes: []
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const addNote = (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          notes: [
            ...subject.notes,
            {
              ...note,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        };
      }
      return subject;
    }));
  };

  const createAssignment = (subjectId: string, title: string): Assignment => {
    // Generate questions from notes content - in real app would use AI or more sophisticated logic
    const subject = subjects.find(s => s.id === subjectId);
    const questions: Question[] = [];
    
    if (subject) {
      // Create simple questions based on note content
      subject.notes.forEach(note => {
        // Create dummy questions based on note titles
        questions.push({
          id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: `Explain what is meant by "${note.title}"?`,
          type: 'text'
        });
      });

      // Add 20 questions if we have fewer
      const dummyQuestions = [
        "What are the key concepts of this subject?",
        "Explain the difference between X and Y in the context of this subject.",
        "How would you apply the principles learned in this subject to solve a real-world problem?",
        "What are the historical developments of this field?",
        "Compare and contrast two major theories in this field."
      ];

      while (questions.length < 20) {
        questions.push({
          id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: dummyQuestions[questions.length % dummyQuestions.length],
          type: 'text'
        });
      }
    }

    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      subjectId,
      title,
      questions: questions.slice(0, 20), // Limit to 20 questions
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      createdAt: new Date()
    };

    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const addWarning = (studentId: string, assignmentId: string, reason: string) => {
    const newWarning: Warning = {
      id: `w-${Date.now()}`,
      studentId,
      assignmentId,
      reason,
      timestamp: new Date()
    };
    setWarnings(prev => [...prev, newWarning]);
  };

  const grantSemesterAccess = (studentId: string, semesterId: number) => {
    if (user?.role === 'admin' && user?.id !== studentId) {
      setUser(prev => {
        if (prev && prev.id === studentId && !prev.accessibleSemesters.includes(semesterId)) {
          return {
            ...prev,
            accessibleSemesters: [...prev.accessibleSemesters, semesterId].sort((a, b) => a - b)
          };
        }
        return prev;
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    subjects,
    addSubject,
    addNote,
    createAssignment,
    addWarning,
    warnings,
    grantSemesterAccess,
    semesters
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
