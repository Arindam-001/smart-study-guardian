import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AssignmentSubmission } from './interfaces/assignment';
import { 
  User, UserRole, ResourceLevel, Subject, Note, Resource, 
  Assignment, Question, Warning, StudentPerformance 
} from './interfaces/types';
import { AppContextType } from './interfaces/context';
import { getItem, setItem, STORAGE_KEYS, clearAllData } from './local-storage';
import { getCurrentUser, signIn as authSignIn, signOut as authSignOut } from './auth';
import { signUp as authSignUp } from './auth/user-management';
import { clearAllOTPData } from './auth/password-reset';
import { checkPlagiarism } from './utils';

// Add the missing PlagiarismDetail interface if it doesn't exist elsewhere
interface PlagiarismDetail {
  noteId: string;
  matchedText: string;
  similarity: number;
}

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]; // Most engineering courses have 8 semesters

  // Load initial data from localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      // Load user
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      
      // Load users - starting with empty state for real-world email handling
      setUsers(getItem<User[]>(STORAGE_KEYS.USERS, []));
      
      // Load subjects
      setSubjects(getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, []));
      
      // Load other data from localStorage
      setWarnings(getItem<Warning[]>(STORAGE_KEYS.WARNINGS, []));
      setAssignments(getItem<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []));
      setStudentPerformance(getItem<StudentPerformance[]>(STORAGE_KEYS.STUDENT_PERFORMANCE, []));
      setSubmissions(getItem<AssignmentSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []));
    };
    
    loadInitialData();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      setItem(STORAGE_KEYS.USERS, users);
    }
  }, [users]);
  
  useEffect(() => {
    if (subjects.length > 0) {
      setItem(STORAGE_KEYS.SUBJECTS, subjects);
    }
  }, [subjects]);
  
  useEffect(() => {
    setItem(STORAGE_KEYS.WARNINGS, warnings);
  }, [warnings]);
  
  useEffect(() => {
    setItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }, [assignments]);
  
  useEffect(() => {
    setItem(STORAGE_KEYS.STUDENT_PERFORMANCE, studentPerformance);
  }, [studentPerformance]);
  
  useEffect(() => {
    setItem(STORAGE_KEYS.SUBMISSIONS, submissions);
  }, [submissions]);

  const clearAllUserData = () => {
    // Clear all localStorage data
    clearAllData();
    
    // Clear OTP store
    clearAllOTPData();
    
    // Reset all state
    setUser(null);
    setUsers([]);
    setSubjects([]);
    setWarnings([]);
    setAssignments([]);
    setStudentPerformance([]);
    setSubmissions([]);
    
    return true;
  };

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await authSignIn(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
  };

  const registerUser = async (
    name: string, 
    email: string, 
    password: string, 
    id: string, 
    role: UserRole, 
    currentSemester: number = 1,
    phone?: string
  ) => {
    try {
      // Check if email or ID already exists
      if (users.some(u => u.email === email || u.id === id)) {
        return false;
      }
      
      const success = await authSignUp(name, email, password, id, role, currentSemester, phone);
      
      if (success) {
        const newUser: User = {
          id,
          name,
          email,
          role,
          phone,
          currentSemester: role === 'student' ? currentSemester : 0,
          accessibleSemesters: role === 'student' ? [currentSemester] : [1, 2, 3, 4, 5, 6, 7, 8],
        };
        
        setUsers(prev => [...prev, newUser]);
      }
      
      return success;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  };

  const addSubject = (subject: Omit<Subject, 'id' | 'notes'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString(),
      notes: [],
      resources: []
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubjects = (updatedSubjects: Subject[]) => {
    setSubjects(updatedSubjects);
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

    return newResource;
  };

  const createAssignment = (
    subjectId: string, 
    title: string,
    dueDate?: Date,
    duration?: number,
    selectedNotes?: Note[]
  ): Assignment => {
    // Generate questions from notes content
    const subject = subjects.find(s => s.id === subjectId);
    const questions: Question[] = [];
    
    if (subject) {
      // If notes are provided, use them to generate questions
      if (selectedNotes && selectedNotes.length > 0) {
        // Create questions based on note content
        selectedNotes.forEach(note => {
          // Simple approach: Extract sentences from the note content
          // In a real app, this would use AI to generate better questions
          const sentences = note.content
            .split('.')
            .filter(s => s.trim().length > 20)
            .slice(0, 4);
          
          // Create questions from these sentences
          sentences.forEach((sentence, i) => {
            questions.push({
              id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: `Explain what is meant by "${sentence.trim()}?"`,
              type: 'text',
              topic: note.title
            });
          });
          
          // Add some general questions about the note
          questions.push({
            id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: `Summarize the key points related to "${note.title}"`,
            type: 'text',
            topic: note.title
          });
        });
      } else {
        // Fallback: use all subject notes
        subject.notes.forEach(note => {
          // Create dummy questions based on note titles
          questions.push({
            id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: `Explain what is meant by "${note.title}"?`,
            type: 'text',
            topic: note.title
          });
        });
      }

      // Add additional questions if we have fewer than 20
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
          type: 'text',
          topic: 'general'
        });
      }
    }

    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      subjectId,
      title,
      questions: questions.slice(0, 20), // Limit to 20 questions
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default: 1 week from now
      createdAt: new Date(),
      duration: duration || 60 // Default: 60 minutes
    };

    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const submitAssignment = (assignmentId: string, studentId: string, answers: Record<string, string>, fileUrl?: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) throw new Error("Assignment not found");
    
    // Get the subject for this assignment to access notes
    const subject = subjects.find(s => s.id === assignment.subjectId);
    if (!subject) throw new Error("Subject not found");
    
    let score = 0;
    const topicPerformance: Record<string, { correct: number, total: number }> = {};
    
    // Check plagiarism for each answer
    let highestPlagiarismScore = 0;
    const plagiarismDetails: PlagiarismDetail[] = [];
    
    // Combine all answers for overall plagiarism check
    const combinedAnswers = Object.values(answers).join(' ');
    const plagiarismResult = checkPlagiarism(combinedAnswers, subject.notes);
    
    highestPlagiarismScore = plagiarismResult.score;
    plagiarismResult.details.forEach(detail => {
      if (!plagiarismDetails.some(d => d.noteId === detail.noteId)) {
        plagiarismDetails.push(detail);
      }
    });
    
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
    
    // Add warning for high plagiarism
    if (highestPlagiarismScore > 60) {
      addWarning(
        studentId, 
        assignmentId,
        `High plagiarism detected (${highestPlagiarismScore}%) in assignment submission`
      );
    }
    
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
      fileUrl,
      plagiarismScore: highestPlagiarismScore,
      plagiarismDetails: plagiarismDetails
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
    setUsers(prev => prev.map(u => {
      if (u.id === studentId && !u.accessibleSemesters.includes(semesterId)) {
        return {
          ...u,
          accessibleSemesters: [...u.accessibleSemesters, semesterId].sort((a, b) => a - b)
        };
      }
      return u;
    }));
  };

  const updateAttendance = (studentId: string, subjectId: string, date: string, present: boolean) => {
    setUsers(prev => prev.map(u => {
      if (u.id === studentId) {
        const attendance = u.attendance || {};
        const subjectAttendance = attendance[subjectId] || [];
        const dateIndex = parseInt(date.split('-')[2]) - 1; // Convert date to index
        
        // Ensure array is long enough
        const newSubjectAttendance = [...subjectAttendance];
        while (newSubjectAttendance.length <= dateIndex) {
          newSubjectAttendance.push(false);
        }
        
        newSubjectAttendance[dateIndex] = present;
        
        return {
          ...u,
          attendance: {
            ...attendance,
            [subjectId]: newSubjectAttendance
          }
        };
      }
      return u;
    }));
  };
  
  const assignTeacher = (subjectId: string, teacherId: string) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return { ...subject, teacherId };
      }
      return subject;
    }));
  };
  
  const unassignTeacher = (subjectId: string) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return { ...subject, teacherId: "" };
      }
      return subject;
    }));
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
    users, 
    isAuthenticated: !!user,
    login,
    logout,
    registerUser,
    subjects,
    addSubject,
    updateSubjects,
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
    getSubmissionsByStudent,
    clearAllUserData,
    assignTeacher,
    unassignTeacher
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
