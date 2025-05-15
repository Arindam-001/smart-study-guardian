
import React from 'react';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import SubmissionTable from '@/components/faculty/submissions/SubmissionTable';
import EmptySubmissions from '@/components/faculty/submissions/EmptySubmissions';

interface SubmissionsViewProps {
  assignmentId: string;
}

const SubmissionsView: React.FC<SubmissionsViewProps> = ({ assignmentId }) => {
  const { getSubmissionsByAssignment } = useAppContext();
  
  const submissions: AssignmentSubmission[] = getSubmissionsByAssignment(assignmentId);
  
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
              <SubmissionTable submissions={submissions} />
            ) : (
              <EmptySubmissions />
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {submissions.filter(s => s.status === 'pending').length > 0 ? (
              <SubmissionTable 
                submissions={submissions.filter(s => s.status === 'pending')} 
              />
            ) : (
              <EmptySubmissions />
            )}
          </TabsContent>
          
          <TabsContent value="graded">
            {submissions.filter(s => s.status === 'graded').length > 0 ? (
              <SubmissionTable 
                submissions={submissions.filter(s => s.status === 'graded')} 
              />
            ) : (
              <EmptySubmissions />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubmissionsView;
