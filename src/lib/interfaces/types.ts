
export type UserRole = 'student' | 'teacher' | 'admin';
export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  currentSemester: number;
  accessibleSemesters: number[];
  attendance?: Record<string, boolean[]>; // subjectId -> array of attendance (true/false)
}

export interface Subject {
  id: string;
  name: string;
  semesterId: number;
  description?: string;
  teacherId?: string;
  notes: Note[];
  resources?: Resource[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'video' | 'document' | 'link';
  level: ResourceLevel;
  topic: string;
  createdAt: Date;
  subjectId?: string; // Added subjectId property
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  type: 'text' | 'multiple-choice';
  topic?: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  questions: Question[];
  dueDate: Date;
  createdAt: Date;
  duration?: number;
  studentScores?: Record<string, number>;
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
  topics: Record<string, { correct: number; total: number }>;
  recommendedResources: Resource[];
}
