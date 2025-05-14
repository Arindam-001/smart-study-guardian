
import { User } from './types';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  submittedAt: Date;
  answers: Record<string, string>;
  score?: number;
  fileUrl?: string;
  status: 'pending' | 'graded' | 'late';
  feedback?: string;
  user?: User;  // Optional reference to the student
}
