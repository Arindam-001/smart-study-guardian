
import React from 'react';
import { AssignmentSubmission } from '@/lib/interfaces/assignment';
import { User, Question } from '@/lib/interfaces/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlagiarismWarning from '@/components/assignment/PlagiarismWarning';

interface SubmissionDetailsProps {
  submission: AssignmentSubmission;
  users: User[];
  questions: Question[];
}

const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({ 
  submission, 
  users, 
  questions 
}) => {
  const student = users.find(u => u.id === submission.studentId);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Student:</label>
          <div className="font-medium">
            {student?.name || submission.studentId}
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Submitted:</label>
          <div>
            {submission.submittedAt.toLocaleString()}
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Score:</label>
          <div>
            {submission.score} / {questions.length}
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
                {questions.map((question, index) => {
                  const answer = submission.answers[question.id] || "";
                  
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
            plagiarismScore={submission.plagiarismScore || 0}
            plagiarismDetails={submission.plagiarismDetails}
          />
          
          {submission.fileUrl && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Uploaded File</h4>
              <a 
                href={submission.fileUrl} 
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
  );
};

export default SubmissionDetails;
