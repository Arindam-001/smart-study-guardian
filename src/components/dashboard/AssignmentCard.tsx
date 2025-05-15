
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/lib/interfaces/types';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/lib/context';

interface AssignmentCardProps {
  assignment: Assignment;
  subjectId: string;
  semesterId: number;
  navigateToAssignment: (subjectId: string, semesterId: number, assignmentId: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  subjectId,
  semesterId,
  navigateToAssignment
}) => {
  const { toast } = useToast();
  const { user, submissions } = useAppContext();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Format the due date nicely
  const formattedDueDate = format(assignment.dueDate, "PPP 'at' p");
  
  // Check if the current user has already submitted this assignment
  useEffect(() => {
    if (user && submissions) {
      const submitted = submissions.some(
        sub => sub.assignmentId === assignment.id && sub.studentId === user.id
      );
      setHasSubmitted(submitted);
    }
  }, [user, submissions, assignment.id]);
  
  const handleOpenAssignment = () => {
    if (hasSubmitted) {
      toast({
        title: "Already submitted",
        description: "You have already submitted this assignment."
      });
      return;
    }
    
    // Navigate to the assignment in the same tab
    navigateToAssignment(subjectId, semesterId, assignment.id);
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors">
      <div className="mb-2 md:mb-0">
        <div className="font-medium flex items-center">
          <FileText className="h-5 w-5 mr-2 text-edu-primary" />
          {assignment.title}
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Due: {formattedDueDate}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {assignment.questions.length} questions • {assignment.duration || 30} minutes
        </div>
      </div>
      <Button 
        className={hasSubmitted ? "bg-green-600" : "bg-edu-primary"}
        onClick={handleOpenAssignment}
        disabled={hasSubmitted}
      >
        {hasSubmitted ? (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Submitted
          </div>
        ) : (
          "Take Assignment"
        )}
      </Button>
    </div>
  );
};

export default AssignmentCard;
