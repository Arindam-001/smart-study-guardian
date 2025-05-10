
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AssignmentSubmission } from './interfaces/assignment';
import { 
  User, UserRole, ResourceLevel, Subject, Note, Resource, 
  Assignment, Question, Warning, StudentPerformance 
} from './interfaces/types';
import { AppContextType } from './interfaces/context';

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
    currentSemester: 0,
    accessibleSemesters: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    currentSemester: 0,
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
    ],
    resources: [
      {
        id: 'r1',
        title: 'Introduction to Python - Beginners',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example1',
        level: 'beginner',
        topic: 'programming basics',
        createdAt: new Date(),
        subjectId: '1'
      },
      {
        id: 'r2',
        title: 'Object-Oriented Programming Concepts - Intermediate',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example2',
        level: 'intermediate',
        topic: 'oop',
        createdAt: new Date(),
        subjectId: '1'
      },
      {
        id: 'r3',
        title: 'Advanced Data Structures - Expert Level',
        type: 'document',
        url: 'https://example.com/advanced-data-structures',
        level: 'advanced',
        topic: 'data structures',
        createdAt: new Date(),
        subjectId: '1'
      }
    ]
  },
  {
    id: '2',
    name: 'Calculus',
    semesterId: 1,
    teacherId: '2',
    notes: [],
    resources: [
      {
        id: 'r4',
        title: 'Introduction to Calculus',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example4',
        level: 'beginner',
        topic: 'limits',
        createdAt: new Date(),
        subjectId: '2'
      },
      {
        id: 'r5',
        title: 'Intermediate Calculus - Derivatives',
        type: 'link',
        url: 'https://example.com/derivatives',
        level: 'intermediate',
        topic: 'derivatives',
        createdAt: new Date(),
        subjectId: '2'
      }
    ]
  },
  {
    id: '3',
    name: 'Physics I',
    semesterId: 1,
    teacherId: '2',
    notes: [],
    resources: []
  },
  {
    id: '4',
    name: 'Data Structures',
    semesterId: 2,
    teacherId: '2',
    notes: [],
    resources: []
  }
];

// Context
interface AppContextType {
  user: User | null;
  users: User[]; // Added users property to the interface
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, password: string, id: string, role: UserRole, currentSemester?: number) => Promise<boolean>;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'notes'>) => void;
  addNote: (subjectId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addResource: (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  createAssignment: (subjectId: string, title: string) => Assignment;
  submitAssignment: (assignmentId: string, studentId: string, answers: Record<string, string>, fileUrl?: string) => StudentPerformance;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Most engineering courses have 8 semesters

  const login = async (email: string, password: string) => {
    // In a real app, you would call an API here
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const registerUser = async (name: string, email: string, password: string, id: string, role: UserRole, currentSemester: number = 1) => {
    // Check if email or ID already exists
    if (users.some(u => u.email === email || u.id === id)) {
      return false;
    }
    
    const newUser: User = {
      id,
      name,
      email,
      role,
      currentSemester: role === 'student' ? currentSemester : 0,
      accessibleSemesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
    };
    
    setUsers(prev => [...prev, newUser]);
    return true;
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

  const addResource = (subjectId: string, resource: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      ...resource,
      id: `resource-${Date.now()}`,
      createdAt: new Date(),
    };

    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          resources: [...(subject.resources || []), newResource]
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

  const submitAssignment = (assignmentId: string, studentId: string, answers: Record<string, string>, fileUrl?: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) throw new Error("Assignment not found");
    
    let score = 0;
    const topicPerformance: Record<string, { correct: number, total: number }> = {};
    
    // Calculate score and track performance by topic
    assignment.questions.forEach(question => {
      const studentAnswer = answers[question.id] || '';
      const isCorrect = question.correctAnswer === studentAnswer;
      const topic = question.topic || 'general';
      
      if (isCorrect) score++;
      
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      
      topicPerformance[topic].total++;
      if (isCorrect) topicPerformance[topic].correct++;
    });
    
    // Update assignment scores
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          studentScores: {
            ...(a.studentScores || {}),
            [studentId]: score
          }
        };
      }
      return a;
    }));
    
    // Create submission record
    const submission: AssignmentSubmission = {
      id: `submission-${Date.now()}`,
      assignmentId,
      studentId,
      answers,
      submittedAt: new Date(),
      score,
      fileUrl
    };
    
    setSubmissions(prev => [...prev, submission]);
    
    // Generate recommendations based on score
    const totalQuestions = assignment.questions.length;
    const percentageScore = (score / totalQuestions) * 100;
    
    // Determine overall student level
    let recommendedLevel: ResourceLevel = 'beginner';
    if (percentageScore >= 75) {
      recommendedLevel = 'advanced';
    } else if (percentageScore >= 50) {
      recommendedLevel = 'intermediate';
    }
    
    // Find weak topics (below 50% correct)
    const weakTopics = Object.entries(topicPerformance)
      .filter(([_, data]) => (data.correct / data.total) < 0.5)
      .map(([topic, _]) => topic);
    
    // Find resources for recommendation
    const relatedSubject = subjects.find(s => s.id === assignment.subjectId);
    const recommendedResources = (relatedSubject?.resources || [])
      .filter(resource => {
        // For low scores, recommend beginner resources regardless of topic
        if (percentageScore < 40) return resource.level === 'beginner';
        
        // For weak topics, recommend resources at appropriate level
        if (weakTopics.includes(resource.topic)) return resource.level === recommendedLevel;
        
        // Otherwise include general resources at the student's level
        return resource.level === recommendedLevel && resource.topic === 'general';
      });
    
    // Create and save performance data
    const performance: StudentPerformance = {
      studentId,
      assignmentId,
      score,
      topics: topicPerformance,
      recommendedResources
    };
    
    setStudentPerformance(prev => {
      const existingIndex = prev.findIndex(p => 
        p.studentId === studentId && p.assignmentId === assignmentId
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = performance;
        return updated;
      } else {
        return [...prev, performance];
      }
    });
    
    return performance;
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

  const updateAttendance = (studentId: string, subjectId: string, date: string, present: boolean) => {
    setUser(prev => {
      if (prev && prev.id === studentId) {
        const attendance = prev.attendance || {};
        const subjectAttendance = attendance[subjectId] || [];
        const dateIndex = parseInt(date.split('-')[2]) - 1; // Convert date to index
        
        // Ensure array is long enough
        while (subjectAttendance.length <= dateIndex) {
          subjectAttendance.push(false);
        }
        
        subjectAttendance[dateIndex] = present;
        
        return {
          ...prev,
          attendance: {
            ...attendance,
            [subjectId]: subjectAttendance
          }
        };
      }
      return prev;
    });
  };
  
  const getStudentPerformance = (studentId: string) => {
    return studentPerformance.filter(p => p.studentId === studentId);
  };

  const getSubmissionsByAssignment = (assignmentId: string) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };

  const getSubmissionsByStudent = (studentId: string) => {
    return submissions.filter(submission => submission.studentId === studentId);
  };

  const value = {
    user,
    users, // Added users to the context value
    isAuthenticated: !!user,
    login,
    logout,
    registerUser,
    subjects,
    addSubject,
    addNote,
    addResource,
    createAssignment,
    submitAssignment,
    addWarning,
    warnings,
    grantSemesterAccess,
    semesters,
    updateAttendance,
    getStudentPerformance,
    studentPerformance,
    assignments,
    submissions,
    getSubmissionsByAssignment,
    getSubmissionsByStudent
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

// Re-export the types from interfaces for components to use
export type { Question, Note, User, Assignment, StudentPerformance, Resource };
