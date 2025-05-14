
import { PlagiarismDetail } from './types';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  answers: Record<string, string>;
  submittedAt: Date;
  score: number;
  fileUrl?: string;
  plagiarismScore: number;
  plagiarismDetails: PlagiarismDetail[];
}
