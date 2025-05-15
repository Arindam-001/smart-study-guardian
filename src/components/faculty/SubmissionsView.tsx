
import React, { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import PlagiarismWarning from '@/components/assignment/PlagiarismWarning';
import { FileText, AlertTriangle } from 'lucide-react';

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
  
  // Sort submissions by plagiarism score (highest first)
  const sortedSubmissions = [...submissions].sort((a, b) => 
    (b.plagiarismScore || 0) - (a.plagiarismScore || 0)
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Submissions for {assignment.title}
      </h2>
      
      {submissions.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No submissions yet</p>
        </div>
      ) : (
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
                    {submission.score} / {assignment.questions.length}
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
                      onClick={() => viewSubmission(submission)}
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Student:</label>
                  <div className="font-medium">
                    {users.find(u => u.id === selectedSubmission.studentId)?.name || selectedSubmission.studentId}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Submitted:</label>
                  <div>
                    {selectedSubmission.submittedAt.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Score:</label>
                  <div>
                    {selectedSubmission.score} / {assignment.questions.length}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Tabs defaultValue="answers">
                    <TabsList>
                      <TabsTrigger value="answers">Answers</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="answers" className="border rounded-md p-4 mt-4">
                      <div className="space-y-6">
                        {assignment.questions.map((question, index) => {
                          const answer = selectedSubmission.answers[question.id] || "";
                          
                          return (
                            <div key={question.id} className="space-y-2">
                              <div className="font-medium">
                                Q{index + 1}: {question.text}
                              </div>
                              <div className="border p-3 rounded bg-gray-50">
                                {answer || <span className="text-muted-foreground italic">No answer provided</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Plagiarism Detection</h4>
                  <PlagiarismWarning 
                    plagiarismScore={selectedSubmission.plagiarismScore || 0}
                    plagiarismDetails={selectedSubmission.plagiarismDetails}
                  />
                  
                  {selectedSubmission.fileUrl && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded File</h4>
                      <a 
                        href={selectedSubmission.fileUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border p-3 rounded bg-gray-50 hover:bg-gray-100"
                      >
                        View Uploaded File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
