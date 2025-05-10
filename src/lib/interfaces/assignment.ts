
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  answers: Record<string, string>;
  submittedAt: Date;
  score?: number;
  feedback?: string;
  fileUrl?: string;
}
