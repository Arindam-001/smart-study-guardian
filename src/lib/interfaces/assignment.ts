
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  answers: Record<string, string>;
  submittedAt: Date;
  score?: number;
  feedback?: string;
  fileUrl?: string;
  plagiarismScore?: number;
  plagiarismDetails?: PlagiarismDetail[];
}

export interface PlagiarismDetail {
  noteId: string;
  noteName: string;
  matchedText: string;
  similarity: number; // Percentage of similarity
}
