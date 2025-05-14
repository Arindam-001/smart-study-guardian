
import React from 'react';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import { User } from '@/lib/interfaces/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';

interface SubmissionTableProps {
  submissions: AssignmentSubmission[];
  users: User[];
  onViewSubmission: (submission: AssignmentSubmission) => void;
}

const SubmissionTable: React.FC<SubmissionTableProps> = ({ 
  submissions, 
  users, 
  onViewSubmission 
}) => {
  // Sort submissions by plagiarism score (highest first)
  const sortedSubmissions = [...submissions].sort((a, b) => 
    (b.plagiarismScore || 0) - (a.plagiarismScore || 0)
  );
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Plagiarism</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedSubmissions.map(submission => {
          const student = users.find(u => u.id === submission.studentId);
          const hasPlagiarism = (submission.plagiarismScore || 0) > 40;
          
          return (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">
                {student?.name || submission.studentId}
              </TableCell>
              <TableCell>
                {submission.submittedAt.toLocaleString()}
              </TableCell>
              <TableCell>
                {submission.score} / {submission.questionCount || 0}
              </TableCell>
              <TableCell>
                {hasPlagiarism ? (
                  <div className="flex items-center text-red-600 font-medium">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {submission.plagiarismScore}%
                  </div>
                ) : (
                  <span>{submission.plagiarismScore || 0}%</span>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onViewSubmission(submission)}
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SubmissionTable;
