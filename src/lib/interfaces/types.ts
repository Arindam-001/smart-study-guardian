
export type UserRole = 'student' | 'teacher' | 'admin';
export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentSemester: number;
  accessibleSemesters: number[];
  attendance?: Record<string, boolean[]>;
  phone?: string;  // Added phone field
}

export interface Subject {
  id: string;
  name: string;
  semesterId: number;
  teacherId: string;
  notes: Note[];
  resources?: Resource[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'link' | 'document';
  url: string;
  level: ResourceLevel;
  topic: string;
  createdAt: Date;
  subjectId: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  questions: Question[];
  dueDate: Date;
  createdAt: Date;
  studentScores?: Record<string, number>;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  type: 'multiple-choice' | 'text';
  topic?: string;
}

export interface Warning {
  id: string;
  studentId: string;
  assignmentId: string;
  reason: string;
  timestamp: Date;
}

export interface StudentPerformance {
  studentId: string;
  assignmentId: string;
  score: number;
  topics: {
    [topic: string]: {
      correct: number;
      total: number;
    }
  };
  recommendedResources: Resource[];
}
