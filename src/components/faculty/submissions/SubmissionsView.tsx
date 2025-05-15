
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import SubmissionTable from '@/components/faculty/submissions/SubmissionTable';
import EmptySubmissions from '@/components/faculty/submissions/EmptySubmissions';
import SubmissionDetails from '@/components/faculty/submissions/SubmissionDetails';

interface SubmissionsViewProps {
  assignmentId: string;
}

const SubmissionsView: React.FC<SubmissionsViewProps> = ({ assignmentId }) => {
  const { getSubmissionsByAssignment, users, assignments } = useAppContext();
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const submissions: AssignmentSubmission[] = getSubmissionsByAssignment(assignmentId);
  const assignment = assignments.find(a => a.id === assignmentId);
  
  const viewSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {submissions.length > 0 ? (
              <SubmissionTable 
                submissions={submissions} 
                users={users}
                onViewSubmission={viewSubmission}
              />
            ) : (
              <EmptySubmissions />
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {submissions.filter(s => s.status === 'pending').length > 0 ? (
              <SubmissionTable 
                submissions={submissions.filter(s => s.status === 'pending')}
                users={users}
                onViewSubmission={viewSubmission}
              />
            ) : (
              <EmptySubmissions />
            )}
          </TabsContent>
          
          <TabsContent value="graded">
            {submissions.filter(s => s.status === 'graded').length > 0 ? (
              <SubmissionTable 
                submissions={submissions.filter(s => s.status === 'graded')}
                users={users}
                onViewSubmission={viewSubmission}
              />
            ) : (
              <EmptySubmissions />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Submission Viewing Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Submission Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && assignment && (
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
    </Card>
  );
};

export default SubmissionsView;
