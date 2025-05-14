
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import SubmissionTable from './submissions/SubmissionTable';
import SubmissionDetails from './submissions/SubmissionDetails';
import EmptySubmissions from './submissions/EmptySubmissions';

interface SubmissionsViewProps {
  assignmentId: string;
}

const SubmissionsView: React.FC<SubmissionsViewProps> = ({ assignmentId }) => {
  const { getSubmissionsByAssignment, users, assignments } = useAppContext();
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const submissions = getSubmissionsByAssignment(assignmentId);
  const assignment = assignments.find(a => a.id === assignmentId);
  
  if (!assignment) {
    return (
      <div className="text-center py-8">
        <p>Assignment not found</p>
      </div>
    );
  }
  
  const viewSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Submissions for {assignment.title}
      </h2>
      
      {submissions.length === 0 ? (
        <EmptySubmissions />
      ) : (
        <SubmissionTable 
          submissions={submissions.map(s => ({
            ...s,
            questionCount: assignment.questions.length
          }))} 
          users={users} 
          onViewSubmission={viewSubmission}
        />
      )}
      
      {/* Submission Viewing Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Submission Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <SubmissionDetails 
              submission={selectedSubmission}
              users={users}
              questions={assignment.questions}
            />
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionsView;
